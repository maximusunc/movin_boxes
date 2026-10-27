def solve(grid, codes):
    rows, cols = len(grid), len(grid[0])

    def on_floor(word):
        visited = set()

        def dfs(r, c, i):
            if i == len(word):
                return True
            if r < 0 or c < 0 or r >= rows or c >= cols or (r, c) in visited or grid[r][c] != word[i]:
                return False
            visited.add((r, c))
            found = dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
            visited.discard((r, c))
            return found

        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))

    return [w for w in set(codes) if on_floor(w)]
