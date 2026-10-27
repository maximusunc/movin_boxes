def solve(hops):
    n = len(hops)
    ok = [False] * n
    ok[0] = True
    for j in range(1, n):
        for i in range(j):
            if ok[i] and i + hops[i] >= j:
                ok[j] = True
                break
    return ok[n - 1]
