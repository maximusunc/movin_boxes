def solve(bins, target):
    lo, hi = 0, len(bins) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        v = bins[mid]
        if v == target:
            return mid
        if v < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
