from collections import deque


def solve(grid, start, target, k):
    rows, cols = len(grid), len(grid[0])
    visited = {(start[0], start[1], 0)}
    queue = deque([(start[0], start[1], 0, 0)])
    while queue:
        r, c, used, d = queue.popleft()
        if (r, c) == tuple(target):
            return d
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                u = used + (1 if grid[nr][nc] == 1 else 0)
                if u <= k and (nr, nc, u) not in visited:
                    visited.add((nr, nc, u))
                    queue.append((nr, nc, u, d + 1))
    return -1
