def solve(grid, box_rows, box_cols):
    n = len(grid)

    def ok(r, c, d):
        for k in range(n):
            if grid[r][k] == d or grid[k][c] == d:
                return False
        r0, c0 = r - r % box_rows, c - c % box_cols
        for i in range(box_rows):
            for j in range(box_cols):
                if grid[r0 + i][c0 + j] == d:
                    return False
        return True

    def fill():
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    for d in range(1, n + 1):
                        if ok(r, c, d):
                            grid[r][c] = d
                            if fill():
                                return True
                            grid[r][c] = 0
                    return False
        return True

    fill()
    return [[grid[r][c] for c in range(n)] for r in range(n)]
