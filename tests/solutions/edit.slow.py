def solve(printed, wanted):
    def go(i, j):
        if i == len(printed):
            return len(wanted) - j
        if j == len(wanted):
            return len(printed) - i
        if printed[i] == wanted[j]:
            return go(i + 1, j + 1)
        return 1 + min(go(i + 1, j + 1), go(i + 1, j), go(i, j + 1))

    return go(0, 0)
