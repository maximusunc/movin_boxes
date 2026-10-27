def solve(n, belts):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b in belts:
        ra, rb = find(a), find(b)
        if ra == rb:
            return (a, b)
        parent[ra] = rb
    return None
