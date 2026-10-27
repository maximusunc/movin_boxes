def solve(hops):
    reach = 0
    for i in range(len(hops)):
        if i > reach:
            return False
        reach = max(reach, i + hops[i])
    return True
