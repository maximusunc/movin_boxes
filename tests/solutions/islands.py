def solve(grid):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0
    for r in range(rows):
        for c in range(cols):
            if (r, c) in visited or grid[r][c] != 1:
                continue
            count += 1
            stack = [(r, c)]
            visited.add((r, c))
            while stack:
                a, b = stack.pop()
                for x, y in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                    if 0 <= x < rows and 0 <= y < cols and (x, y) not in visited and grid[x][y] == 1:
                        visited.add((x, y))
                        stack.append((x, y))
    return count
