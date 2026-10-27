from collections import deque


def solve(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    prev = {start: None}
    queue = deque([start])
    while queue:
        cell = queue.popleft()
        if cell == target:
            path = []
            while cell is not None:
                path.append(cell)
                cell = prev[cell]
            return path[::-1]
        r, c = cell
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in prev and grid[nr][nc] != 1:
                prev[(nr, nc)] = cell
                queue.append((nr, nc))
    return []
