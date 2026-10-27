def solve(orders, minutes):
    k = 1
    while sum((p + k - 1) // k for p in orders) > minutes:
        k += 1
    return k
