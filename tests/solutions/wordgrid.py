def solve(grid, codes):
    trie = {}
    for code in codes:
        node = trie
        for ch in code:
            node = node.setdefault(ch, {})
        node["$"] = code
    rows, cols = len(grid), len(grid[0])
    found = set()
    visited = set()

    def dfs(r, c, node):
        nxt = node.get(grid[r][c])
        if nxt is None:
            return
        if "$" in nxt:
            found.add(nxt["$"])
        visited.add((r, c))
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                dfs(nr, nc, nxt)
        visited.discard((r, c))

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)
    return list(found)
