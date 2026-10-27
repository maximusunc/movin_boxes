def solve(prices):
    hold, sold, rest = float("-inf"), float("-inf"), 0
    for p in prices:
        hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)
    return max(0, sold, rest)
