def solve(first, second):
    if len(first) != len(second):
        return False
    to_second, to_first = {}, {}
    for a, b in zip(first, second):
        if to_second.setdefault(a, b) != b or to_first.setdefault(b, a) != a:
            return False
    return True
