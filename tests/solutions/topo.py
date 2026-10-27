from collections import deque


def solve(n, deps):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in deps:
        graph[a].append(b)
        indeg[b] += 1
    queue = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while queue:
        x = queue.popleft()
        order.append(x)
        for y in graph[x]:
            indeg[y] -= 1
            if indeg[y] == 0:
                queue.append(y)
    return order if len(order) == n else []
