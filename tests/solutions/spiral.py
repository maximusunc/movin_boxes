def solve(grid):
    rows, cols = len(grid), len(grid[0])
    top, bottom, left, right = 0, rows - 1, 0, cols - 1
    out = []
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            out.append(grid[top][c])
        for r in range(top + 1, bottom + 1):
            out.append(grid[r][right])
        if top < bottom:
            for c in range(right - 1, left - 1, -1):
                out.append(grid[bottom][c])
        if left < right:
            for r in range(bottom - 1, top, -1):
                out.append(grid[r][left])
        top, bottom, left, right = top + 1, bottom - 1, left + 1, right - 1
    return out
