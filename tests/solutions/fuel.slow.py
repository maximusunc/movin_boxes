def solve(fuel, cost):
    n = len(fuel)
    for start in range(n):
        tank = 0
        ok = True
        for k in range(n):
            i = (start + k) % n
            tank += fuel[i] - cost[i]
            if tank < 0:
                ok = False
                break
        if ok:
            return start
    return -1
