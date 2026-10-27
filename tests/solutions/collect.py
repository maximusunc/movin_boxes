from collections import deque


def solve(grid):
    rows, cols = len(grid), len(grid[0])
    packages = {}
    start = None
    for r in range(rows):
        for c in range(cols):
            v = grid[r][c]
            if v == 2:
                packages[(r, c)] = len(packages)
            elif v == 3:
                start = (r, c)
    full = (1 << len(packages)) - 1
    mask = 1 << packages[start] if start in packages else 0
    if mask == full:
        return 0
    visited = {(start[0], start[1], mask)}
    queue = deque([(start[0], start[1], mask, 0)])
    while queue:
        r, c, mask, d = queue.popleft()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                nm = mask | (1 << packages[(nr, nc)]) if (nr, nc) in packages else mask
                if nm == full:
                    return d + 1
                if (nr, nc, nm) not in visited:
                    visited.add((nr, nc, nm))
                    queue.append((nr, nc, nm, d + 1))
    return -1
