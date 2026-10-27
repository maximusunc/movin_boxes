def solve(n, belts):
    graph = [[] for _ in range(n)]
    for i, (a, b) in enumerate(belts):
        graph[a].append((b, i))
        graph[b].append((a, i))
    disc = [-1] * n
    low = [0] * n
    bridges = []
    timer = [0]

    def dfs(x, parent_edge):
        disc[x] = low[x] = timer[0]
        timer[0] += 1
        for y, i in graph[x]:
            if i == parent_edge:
                continue
            if disc[y] == -1:
                dfs(y, i)
                low[x] = min(low[x], low[y])
                if low[y] > disc[x]:
                    bridges.append((x, y))
            else:
                low[x] = min(low[x], disc[y])

    for s in range(n):
        if disc[s] == -1:
            dfs(s, -1)
    return bridges
