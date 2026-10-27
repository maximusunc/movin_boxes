def solve(bins, target):
    for i in range(len(bins)):
        if bins[i] == target:
            return i
    return -1
