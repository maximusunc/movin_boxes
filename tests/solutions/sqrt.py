def solve(tiles):
    lo, hi = 0, tiles
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid * mid <= tiles:
            lo = mid
        else:
            hi = mid - 1
    return lo
