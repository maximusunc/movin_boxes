def solve(n):
    res = []

    def backtrack(s, opened, closed):
        if len(s) == 2 * n:
            res.append(s)
            return
        if opened < n:
            backtrack(s + "(", opened + 1, closed)
        if closed < opened:
            backtrack(s + ")", opened, closed + 1)

    backtrack("", 0, 0)
    return res
