def solve(sizes, order):
    def fewest(amount):
        if amount == 0:
            return 0
        best = -1
        for s in sizes:
            if s <= amount:
                sub = fewest(amount - s)
                if sub >= 0 and (best < 0 or sub + 1 < best):
                    best = sub + 1
        return best

    return fewest(order)
