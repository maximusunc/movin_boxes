def solve(ids):
    ans = 0
    for x in ids:
        ans ^= x
    return ans
