import heapq


def solve(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    dist = {start: 0}
    prev = {start: None}
    heap = [(0, start)]
    while heap:
        d, cell = heapq.heappop(heap)
        if d > dist[cell]:
            continue
        if cell == target:
            path = []
            while cell is not None:
                path.append(cell)
                cell = prev[cell]
            return path[::-1]
        r, c = cell
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                cost = grid[nr][nc]
                if cost < 0:
                    continue
                nd = d + cost
                if nd < dist.get((nr, nc), float("inf")):
                    dist[(nr, nc)] = nd
                    prev[(nr, nc)] = cell
                    heapq.heappush(heap, (nd, (nr, nc)))
    return []
