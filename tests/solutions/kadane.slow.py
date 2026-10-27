def solve(profits):
    n = len(profits)
    best = None
    for i in range(n):
        total = 0
        for j in range(i, n):
            total += profits[j]
            if best is None or total > best:
                best = total
    return best
