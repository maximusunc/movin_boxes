from collections import deque


def solve(grid):
    rows, cols = len(grid), len(grid[0])
    out = [[-1] * cols for _ in range(rows)]
    for sr in range(rows):
        for sc in range(cols):
            if grid[sr][sc] == 1:
                continue
            seen = {(sr, sc)}
            queue = deque([(sr, sc, 0)])
            while queue:
                r, c, d = queue.popleft()
                if grid[r][c] == 2:
                    out[sr][sc] = d
                    break
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen and grid[nr][nc] != 1:
                        seen.add((nr, nc))
                        queue.append((nr, nc, d + 1))
    return out
