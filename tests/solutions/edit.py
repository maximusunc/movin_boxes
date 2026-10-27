def solve(printed, wanted):
    m, n = len(printed), len(wanted)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        cur = [i] + [0] * n
        a = printed[i - 1]
        for j in range(1, n + 1):
            if a == wanted[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j - 1], prev[j], cur[j - 1])
        prev = cur
    return prev[n]
