def solve(weights):
    n = len(weights)
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if weights[j] < weights[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)
