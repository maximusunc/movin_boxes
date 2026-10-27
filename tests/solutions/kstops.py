def solve(n, routes, src, dst, k):
    dist = [float("inf")] * n
    dist[src] = 0
    for _ in range(k + 1):
        nxt = dist[:]
        for a, b, cost in routes:
            if dist[a] + cost < nxt[b]:
                nxt[b] = dist[a] + cost
        dist = nxt
    return dist[dst] if dist[dst] != float("inf") else -1
