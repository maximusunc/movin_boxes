def solve(crates):
    a = [1] + list(crates) + [1]
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for l in range(n - length):
            r = l + length
            best = 0
            for k in range(l + 1, r):
                best = max(best, dp[l][k] + dp[k][r] + a[l] * a[k] * a[r])
            dp[l][r] = best
    return dp[0][n - 1]
