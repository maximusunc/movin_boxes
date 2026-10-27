def solve(sizes, order):
    INF = float("inf")
    dp = [0] + [INF] * order  # dp[a] = fewest boxes holding exactly a items
    for a in range(1, order + 1):
        for s in sizes:
            if s <= a and dp[a - s] + 1 < dp[a]:
                dp[a] = dp[a - s] + 1
    return dp[order] if dp[order] != INF else -1
