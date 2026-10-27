def solve(orders):
    g = 0
    for x in orders:
        a, b = g, x
        while b:
            a, b = b, a % b
        g = a
    return g
