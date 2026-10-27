def solve(grid):
    rows, cols = len(grid), len(grid[0])
    cells = [list(row) for row in grid]
    out = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            n = 0
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if (dr or dc) and 0 <= r + dr < rows and 0 <= c + dc < cols:
                        n += cells[r + dr][c + dc]
            if cells[r][c] == 1:
                out[r][c] = 1 if n in (2, 3) else 0
            else:
                out[r][c] = 1 if n == 3 else 0
    return out
