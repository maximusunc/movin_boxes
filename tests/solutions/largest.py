from functools import cmp_to_key


def solve(parts):
    strs = [str(p) for p in parts]

    def order(a, b):
        if a + b > b + a:
            return -1
        if a + b < b + a:
            return 1
        return 0

    strs.sort(key=cmp_to_key(order))
    res = "".join(strs).lstrip("0")
    return res or "0"
