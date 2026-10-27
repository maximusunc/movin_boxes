from collections import deque


def solve(n, belts):
    out = []
    for skip in range(len(belts)):
        graph = [[] for _ in range(n)]
        for i, (a, b) in enumerate(belts):
            if i != skip:
                graph[a].append(b)
                graph[b].append(a)
        seen = {0}
        queue = deque([0])
        while queue:
            x = queue.popleft()
            for y in graph[x]:
                if y not in seen:
                    seen.add(y)
                    queue.append(y)
        if len(seen) < n:
            out.append(belts[skip])
    return out
