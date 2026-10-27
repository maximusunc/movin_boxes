def solve(values):
    def best(i):
        if i >= len(values):
            return 0
        return max(best(i + 1), values[i] + best(i + 2))

    return best(0)
