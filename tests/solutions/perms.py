def solve(crates):
    crates = list(crates)
    res = []
    path = []
    used = [False] * len(crates)

    def backtrack():
        if len(path) == len(crates):
            res.append(path[:])
            return
        for i, c in enumerate(crates):
            if not used[i]:
                used[i] = True
                path.append(c)
                backtrack()
                path.pop()
                used[i] = False

    backtrack()
    return res
