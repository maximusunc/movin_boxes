from collections import OrderedDict


def solve(capacity, ops):
    cache = OrderedDict()
    res = []
    for op in ops:
        if op[0] == "get":
            key = op[1]
            if key in cache:
                cache.move_to_end(key)
                res.append(cache[key])
            else:
                res.append(-1)
        else:
            _, key, value = op
            cache[key] = value
            cache.move_to_end(key)
            if len(cache) > capacity:
                cache.popitem(last=False)
    return res
