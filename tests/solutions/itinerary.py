from collections import defaultdict


def solve(tickets):
    graph = defaultdict(list)
    for a, b in tickets:
        graph[a].append(b)
    for hub in graph:
        graph[hub].sort(reverse=True)
    stack = [0]
    route = []
    while stack:
        x = stack[-1]
        if graph[x]:
            stack.append(graph[x].pop())
        else:
            route.append(stack.pop())
    return route[::-1]
