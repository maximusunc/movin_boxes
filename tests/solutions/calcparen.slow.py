def solve(expr):
    s = expr

    def ev(l, r):
        # Evaluate s[l:r] by re-scanning it for the operator to split on.
        while l < r and s[l] == " ":
            l += 1
        while r > l and s[r - 1] == " ":
            r -= 1
        depth = 0
        plus = mul = -1
        for i in range(l, r):
            c = s[i]
            if c == "(":
                depth += 1
            elif c == ")":
                depth -= 1
            elif depth == 0:
                if c in "+-":
                    j = i - 1
                    while j >= l and s[j] == " ":
                        j -= 1
                    if j >= l and (s[j].isdigit() or s[j] == ")"):
                        plus = i
                elif c in "*/":
                    mul = i
        if plus >= 0:
            a, b = ev(l, plus), ev(plus + 1, r)
            return a + b if s[plus] == "+" else a - b
        if mul >= 0:
            a, b = ev(l, mul), ev(mul + 1, r)
            return a * b if s[mul] == "*" else int(a / b)
        if s[l] == "-":
            return -ev(l + 1, r)
        if s[l] == "(":
            return ev(l + 1, r - 1)
        return int(s[l:r])

    return ev(0, len(s))
