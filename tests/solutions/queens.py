def solve(n):
    cols, d1, d2 = set(), set(), set()

    def place(r):
        if r == n:
            return 1
        total = 0
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2:
                continue
            cols.add(c)
            d1.add(r - c)
            d2.add(r + c)
            total += place(r + 1)
            cols.discard(c)
            d1.discard(r - c)
            d2.discard(r + c)
        return total

    return place(0)
