from collections import deque


def solve(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    dry = 0
    for r in range(rows):
        for c in range(cols):
            v = grid[r][c]
            if v == 2:
                queue.append((r, c, 0))
            elif v == 1:
                dry += 1
    visited = set((r, c) for r, c, _ in queue)
    minutes = 0
    while queue:
        r, c, t = queue.popleft()
        minutes = max(minutes, t)
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and grid[nr][nc] == 1:
                visited.add((nr, nc))
                dry -= 1
                queue.append((nr, nc, t + 1))
    return minutes if dry == 0 else -1
