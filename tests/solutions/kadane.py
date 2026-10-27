def solve(profits):
    best = None
    cur = 0
    for x in profits:
        cur = x if cur <= 0 else cur + x
        if best is None or cur > best:
            best = cur
    return best
