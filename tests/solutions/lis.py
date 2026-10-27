from bisect import bisect_left


def solve(weights):
    tails = []
    for w in weights:
        k = bisect_left(tails, w)
        if k == len(tails):
            tails.append(w)
        else:
            tails[k] = w
    return len(tails)
