def solve(label, codes):
    known = set(codes)
    n = len(label)
    longest = max((len(c) for c in known), default=0)
    dp = [False] * (n + 1)
    dp[0] = True
    for j in range(1, n + 1):
        for i in range(max(0, j - longest), j):
            if dp[i] and label[i:j] in known:
                dp[j] = True
                break
    return dp[n]
