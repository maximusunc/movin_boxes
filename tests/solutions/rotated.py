def solve(bins, target):
    lo, hi = 0, len(bins) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        m = bins[mid]
        if m == target:
            return mid
        first = bins[lo]
        if first <= m:  # the left half lo..mid is sorted
            if first <= target < m:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # the right half mid..hi is sorted
            if m < target <= bins[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
