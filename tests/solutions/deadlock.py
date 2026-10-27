def solve(n, waits):
    graph = [[] for _ in range(n)]
    for a, b in waits:
        graph[a].append(b)
    state = [0] * n  # 0 unvisited, 1 on the current path, 2 finished
    path = []

    def dfs(x):
        state[x] = 1
        path.append(x)
        for y in graph[x]:
            if state[y] == 1:
                return path[path.index(y):]
            if state[y] == 0:
                found = dfs(y)
                if found:
                    return found
        state[x] = 2
        path.pop()
        return None

    for s in range(n):
        if state[s] == 0:
            found = dfs(s)
            if found:
                return found
    return []
