from collections import deque


def solve(n, conflicts):
    graph = [[] for _ in range(n)]
    for a, b in conflicts:
        graph[a].append(b)
        graph[b].append(a)
    color = [-1] * n
    for s in range(n):
        if color[s] != -1:
            continue
        color[s] = 0
        queue = deque([s])
        while queue:
            x = queue.popleft()
            for y in graph[x]:
                if color[y] == -1:
                    color[y] = 1 - color[x]
                    queue.append(y)
                elif color[y] == color[x]:
                    return False
    return True
