def solve(orders, minutes):
    orders = list(orders)
    lo, hi = 1, max(orders)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum((p + mid - 1) // mid for p in orders) <= minutes:
            hi = mid
        else:
            lo = mid + 1
    return lo
