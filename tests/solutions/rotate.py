def solve(grid):
    n = len(grid)
    out = [[0] * n for _ in range(n)]
    for r in range(n):
        for c in range(n):
            out[c][n - 1 - r] = grid[r][c]
    return out
