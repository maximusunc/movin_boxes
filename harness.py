import sys
import json
import traceback
import browser
window = browser.window if hasattr(browser, "window") else browser.self

TRACK_NAMES = ("visited", "seen", "done", "settled")
QUEUE_NAMES = ("queue", "q", "frontier", "dq", "heap", "pq", "pqueue", "stack")
DIST_NAMES = ("dist", "distance", "cost", "costs", "best", "dp", "ways", "memo")


class StepLimit(Exception):
    pass


class _State:
    input = "array"
    wet = False
    trace = True
    events = []
    reads = 0
    max_reads = 8000
    rows = 0
    cols = 0
    watch = ()
    last_v = None
    last_q = None
    last_d = None
    last_w = None
    warned_neg = False


S = _State()
_MISSING = object()


def _is_int(x):
    return isinstance(x, int) and not isinstance(x, bool)


def _num(x):
    if isinstance(x, bool):
        return None
    if isinstance(x, (int, float)):
        if x != x or x in (float("inf"), float("-inf")):
            return None
        return x
    return None


def _cell(x):
    if isinstance(x, (tuple, list)):
        if len(x) >= 2 and _is_int(x[0]) and _is_int(x[1]):
            return [x[0], x[1]]
        if len(x) >= 1 and isinstance(x[0], (tuple, list)):
            return _cell(x[0])
    return None


def _hcell(x):
    if isinstance(x, (tuple, list)):
        if len(x) >= 2 and isinstance(x[1], (tuple, list)):
            return _cell(x[1])
        if len(x) >= 3 and _is_int(x[1]) and _is_int(x[2]):
            return [x[1], x[2]]
    return _cell(x)


def _instrumented(x):
    return isinstance(x, (Arr, Row, Grid))


def _dists(obj):
    out = []
    try:
        if isinstance(obj, dict):
            for key, val in obj.items():
                cl = _cell(key) if isinstance(key, (tuple, list)) else None
                n = _num(val)
                if cl is not None and n is not None and n < 1e8:
                    out.append([cl[0], cl[1], n])
        elif isinstance(obj, list) and len(obj) == S.rows and S.rows > 0:
            for r, row in enumerate(obj):
                if not isinstance(row, list):
                    return []
                for c, val in enumerate(row):
                    n = _num(val)
                    if n is not None and 0 <= n < 1e8:
                        out.append([r, c, n])
    except Exception:
        return []
    return out


def _cells(obj, as_grid_ok, cellfn=None):
    cellfn = cellfn or _cell
    out = []
    if obj is None or _instrumented(obj):
        return out
    try:
        if as_grid_ok and isinstance(obj, list) and len(obj) == S.rows and len(obj) > 0 \
                and all(isinstance(row, list) and len(row) == S.cols for row in obj) \
                and all(not isinstance(v, (tuple, list)) for v in obj[0]):
            for r, row in enumerate(obj):
                for c, v in enumerate(row):
                    if isinstance(v, bool):
                        hit = v
                    elif isinstance(v, (int, float)):
                        hit = v >= 0 and v != float("inf")
                    else:
                        hit = v is not None
                    if hit:
                        out.append([r, c])
            return out
        items = obj.keys() if isinstance(obj, dict) else obj
        for x in items:
            cl = cellfn(x)
            if cl is not None:
                out.append(cl)
    except Exception:
        return []
    return out


def _summ(val, depth=0):
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        if val != val:
            return None
        if val in (float("inf"), float("-inf")):
            return "inf" if val > 0 else "-inf"
        return val
    if isinstance(val, str):
        return val[:24]
    if isinstance(val, Node):
        return {"n": val._id}
    if _instrumented(val) or depth > 2:
        return None
    try:
        if isinstance(val, dict):
            items = []
            for i, (k, v) in enumerate(val.items()):
                if i >= 30:
                    break
                items.append([_summ(k, depth + 1), _summ(v, depth + 1)])
            return {"__d": items}
        if isinstance(val, (set, frozenset)):
            items = [_summ(x, depth + 1) for x in list(val)[:40]]
            try:
                items.sort()
            except Exception:
                pass
            return {"__s": items}
        if isinstance(val, (list, tuple)) or type(val).__name__ == "deque":
            return [_summ(x, depth + 1) for x in list(val)[:40]]
    except Exception:
        return None
    return None


def _get(loc, n):
    try:
        if isinstance(loc, dict):
            return loc[n] if n in loc else _MISSING
        val = loc[n]
        if val is None:
            return _MISSING
        return val
    except Exception:
        try:
            return getattr(loc, n)
        except Exception:
            return _MISSING


def _user_frames():
    try:
        f = sys._getframe(2)
    except Exception:
        return []
    out = []
    depth = 0
    while f is not None and depth < 60:
        try:
            if f.f_code.co_filename == "<user>":
                out.append(f.f_locals)
        except Exception:
            pass
        f = f.f_back
        depth += 1
    return out


def _snapshot_watch(frames):
    found = {}
    for loc in frames:
        if loc is None:
            continue
        for n in S.watch:
            if n in found:
                continue
            val = _get(loc, n)
            if val is _MISSING or callable(val) and not isinstance(val, (list, dict, set)):
                continue
            s = _summ(val)
            if s is not None:
                found[n] = s
    return found


def _snapshot_grid(frames):
    v = None
    q = None
    d = None
    for loc in frames:
        if loc is None:
            continue
        if v is None:
            for n in TRACK_NAMES:
                val = _get(loc, n)
                if val is not _MISSING:
                    v = _cells(val, True)
                    break
        if q is None:
            for n in QUEUE_NAMES:
                val = _get(loc, n)
                if val is not _MISSING and not callable(val):
                    q = _cells(val, False, _hcell if S.wet else None)
                    break
        if d is None:
            for n in DIST_NAMES:
                val = _get(loc, n)
                if val is not _MISSING and isinstance(val, (dict, list)):
                    d = _dists(val)
                    break
    return v, q, d


def _tick():
    S.reads += 1
    if S.reads > S.max_reads:
        raise StepLimit()


def _record(ev):
    frames = _user_frames()
    if S.input == "grid":
        v, q, d = _snapshot_grid(frames)
        if v is not None:
            vs = json.dumps(v)
            if vs != S.last_v:
                ev["v"] = v
                S.last_v = vs
        if q is not None:
            qs = json.dumps(q)
            if qs != S.last_q:
                ev["q"] = q
                S.last_q = qs
        if d is not None:
            ds = json.dumps(d)
            if ds != S.last_d:
                ev["d"] = d
                S.last_d = ds
    if S.watch:
        w = _snapshot_watch(frames)
        ws = json.dumps(w)
        if w and ws != S.last_w:
            ev["w"] = w
            S.last_w = ws
    S.events.append(ev)


def _warn(msg):
    if not S.warned_neg:
        S.warned_neg = True
        S.events.append({"k": "warn", "msg": msg})


class Arr:
    def __init__(self, data, tag):
        self._d = list(data)
        self._t = tag

    def __len__(self):
        return len(self._d)

    def __getitem__(self, i):
        if isinstance(i, slice):
            return [self[k] for k in range(*i.indices(len(self._d)))]
        if not _is_int(i):
            raise TypeError("list indices must be integers, not " + type(i).__name__)
        n = len(self._d)
        if i < -n or i >= n:
            raise IndexError("index " + str(i) + " is out of range (0.." + str(n - 1) + ")")
        if i < 0:
            _warn("Negative index " + str(i) + " wrapped around to the other end of the list. Check your bounds.")
            i += n
        _tick()
        if S.trace:
            _record({"k": "read", "a": self._t, "i": i})
        return self._d[i]

    def __setitem__(self, i, v):
        raise TypeError("This input is read-only. Make your own copy if you need to change it.")

    def __iter__(self):
        for k in range(len(self._d)):
            yield self[k]

    def __reversed__(self):
        for k in range(len(self._d) - 1, -1, -1):
            yield self[k]

    def __contains__(self, x):
        return any(v == x for v in self)

    def index(self, x):
        for k, v in enumerate(self):
            if v == x:
                return k
        raise ValueError(repr(x) + " is not in list")

    def count(self, x):
        return sum(1 for v in self if v == x)

    def copy(self):
        return list(self)

    def __add__(self, other):
        return list(self) + list(other)

    def __eq__(self, other):
        return list(self) == list(other)

    def __repr__(self):
        return repr(self._d)


class Row:
    def __init__(self, data, r):
        self._d = data
        self._r = r

    def _idx(self, c):
        if not _is_int(c):
            raise TypeError("grid row indices must be integers, not " + type(c).__name__)
        n = len(self._d)
        if c < -n or c >= n:
            raise IndexError("column " + str(c) + " is off the warehouse floor (0.." + str(n - 1) + ")")
        if c < 0:
            _warn("Negative column index " + str(c) + " wrapped around to the other side of the grid. Check your bounds.")
            c += n
        return c

    def __getitem__(self, c):
        if isinstance(c, slice):
            return [self[i] for i in range(*c.indices(len(self._d)))]
        c = self._idx(c)
        _tick()
        if S.trace:
            _record({"k": "read", "r": self._r, "c": c})
        return self._d[c]

    def __setitem__(self, c, val):
        c = self._idx(c)
        self._d[c] = val
        _tick()
        if S.trace:
            _record({"k": "write", "r": self._r, "c": c})

    def __len__(self):
        return len(self._d)

    def __iter__(self):
        for i in range(len(self._d)):
            yield self[i]

    def __contains__(self, x):
        return any(v == x for v in self)

    def __repr__(self):
        return repr(self._d)


class Grid:
    def __init__(self, data):
        self._rows = [Row(row, r) for r, row in enumerate(data)]

    def __getitem__(self, r):
        if isinstance(r, slice):
            return self._rows[r]
        if not _is_int(r):
            raise TypeError("grid indices must be integers, not " + type(r).__name__)
        n = len(self._rows)
        if r < -n or r >= n:
            raise IndexError("row " + str(r) + " is off the warehouse floor (0.." + str(n - 1) + ")")
        if r < 0:
            _warn("Negative row index " + str(r) + " wrapped around to the other side of the grid. Check your bounds.")
        return self._rows[r]

    def __len__(self):
        return len(self._rows)

    def __iter__(self):
        return iter(self._rows)

    def __repr__(self):
        return "\n".join(repr(r) for r in self._rows)


class Node:
    """A node in the sorting tree. Read node.val, node.left and node.right."""

    def __init__(self, val, nid):
        self._v = val
        self._l = None
        self._r = None
        self._id = nid

    def _touch(self, f):
        _tick()
        if S.trace:
            _record({"k": "node", "n": self._id, "f": f})

    @property
    def val(self):
        self._touch("v")
        return self._v

    @property
    def left(self):
        self._touch("l")
        return self._l

    @property
    def right(self):
        self._touch("r")
        return self._r

    def __repr__(self):
        return "Node(" + repr(self._v) + ")"


def _build_tree(vals):
    if not vals or vals[0] is None:
        return None
    nodes = [Node(v, i) if v is not None else None for i, v in enumerate(vals)]
    kids = [n for n in nodes]
    root = nodes[0]
    queue = [root]
    i = 1
    while queue and i < len(nodes):
        cur = queue.pop(0)
        if i < len(nodes):
            cur._l = nodes[i]
            if nodes[i] is not None:
                queue.append(nodes[i])
            i += 1
        if i < len(nodes):
            cur._r = nodes[i]
            if nodes[i] is not None:
                queue.append(nodes[i])
            i += 1
    return root


def _jsonify(x, depth=0):
    if x is None or isinstance(x, (bool, str)):
        return x
    if isinstance(x, (int, float)):
        if x != x:
            return "nan"
        if x in (float("inf"), float("-inf")):
            return "inf" if x > 0 else "-inf"
        return x
    if isinstance(x, Node):
        return {"node": x._id}
    if depth > 4:
        return "..."
    if isinstance(x, dict):
        return {"__d": [[_jsonify(k, depth + 1), _jsonify(v, depth + 1)] for k, v in list(x.items())[:200]]}
    if isinstance(x, (set, frozenset)):
        return {"__s": [_jsonify(v, depth + 1) for v in list(x)[:200]]}
    if isinstance(x, (list, tuple, Arr)) or type(x).__name__ == "deque":
        return [_jsonify(v, depth + 1) for v in list(x)[:500]]
    return {"__t": type(x).__name__, "repr": repr(x)[:80]}


class _Out:
    def __init__(self):
        self.buf = []
        self.size = 0

    def write(self, s):
        s = str(s)
        if self.size < 20000:
            self.buf.append(s)
            self.size += len(s)

    def flush(self):
        pass


def _user_tb():
    lines = traceback.format_exc().splitlines()
    keep = []
    skip = False
    for ln in lines:
        s = ln.strip()
        if s.startswith("File ") and "<user>" not in s:
            skip = True
            continue
        if s.startswith("File "):
            skip = False
            keep.append(ln)
            continue
        if skip and ln.startswith("    "):
            continue
        skip = False
        keep.append(ln)
    return "\n".join(keep)


def _args_for(p, case):
    inp = p.get("input", "array")
    if inp == "grid":
        data = case["grid"]
        S.rows = len(data)
        S.cols = len(data[0]) if data else 0
        g = Grid([list(r) for r in data])
        if "start" in case:
            return [g, tuple(case["start"]), tuple(case["target"])]
        return [g]
    if inp == "tree":
        return [_build_tree(case["tree"])]
    args = []
    arrs = case.get("arr", [0])
    for i, a in enumerate(case["args"]):
        if i in arrs:
            if a and isinstance(a[0], list):
                a = [tuple(x) for x in a]
            args.append(Arr(a, i))
        else:
            args.append(a)
    return args


def run(code, payload):
    p = json.loads(payload)
    S.input = p.get("input", "array")
    S.wet = bool(p.get("wet"))
    S.watch = tuple(p.get("watch", ()))
    out = _Out()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = out
    sys.stderr = out
    result = {"results": []}
    try:
        ns = {"__name__": "__main__"}
        try:
            exec(compile(code, "<user>", "exec"), ns)
        except Exception:
            result["compileError"] = _user_tb()
            return json.dumps(result)
        fn = ns.get("solve")
        if fn is None or not callable(fn):
            result["compileError"] = "Define a function named solve(" + p.get("sig", "...") + ")."
            return json.dumps(result)
        for ci, case in enumerate(p["cases"]):
            S.trace = bool(p.get("trace")) and ci == 0
            S.max_reads = 8000 if S.trace else int(p.get("budget", 60000))
            S.events = []
            S.reads = 0
            S.last_v = S.last_q = S.last_d = S.last_w = None
            S.warned_neg = False
            r = {"ok": False}
            mark = len(out.buf)
            try:
                args = _args_for(p, case)
                ret = fn(*args)
                r["ok"] = True
                r["ret"] = _jsonify(ret)
            except StepLimit:
                r["error"] = "Stopped after " + str(S.max_reads) + " reads. That’s far more work than this input needs; check for a loop that never ends or a much slower approach."
                r["limit"] = True
            except RecursionError:
                r["error"] = _user_tb()
            except Exception:
                r["error"] = _user_tb()
            r["reads"] = S.reads
            if S.trace:
                r["events"] = S.events
            r["stdout"] = "".join(out.buf[mark:])[:4000]
            result["results"].append(r)
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    return json.dumps(result)


window.pyRun = run
window.pyReady = True
