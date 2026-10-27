MOD = 1_000_000_007


def solve(rows, cols):
    # C(rows + cols - 2, rows - 1) with modular inverses (MOD is prime).
    n, k = rows + cols - 2, rows - 1
    num = den = 1
    for i in range(k):
        num = num * ((n - i) % MOD) % MOD
        den = den * ((i + 1) % MOD) % MOD
    # Fermat: den ** (MOD - 2) is den's inverse; square-and-multiply by hand.
    inv, e, b = 1, MOD - 2, den
    while e:
        if e & 1:
            inv = inv * b % MOD
        b = b * b % MOD
        e >>= 1
    return num * inv % MOD
