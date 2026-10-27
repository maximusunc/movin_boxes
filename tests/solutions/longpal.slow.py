def solve(label):
    best = ""
    n = len(label)
    for i in range(n):
        for j in range(i, n):
            sub = label[i:j + 1]
            if sub == sub[::-1] and len(sub) > len(best):
                best = sub
    return best
