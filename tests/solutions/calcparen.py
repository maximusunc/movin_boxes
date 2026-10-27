def solve(expr):
    s = expr
    n = len(s)
    pos = [0]

    def peek():
        while pos[0] < n and s[pos[0]] == " ":
            pos[0] += 1
        return s[pos[0]] if pos[0] < n else ""

    def parse_expr():
        v = parse_term()
        while True:
            c = peek()
            if c == "+":
                pos[0] += 1
                v += parse_term()
            elif c == "-":
                pos[0] += 1
                v -= parse_term()
            else:
                return v

    def parse_term():
        v = parse_factor()
        while True:
            c = peek()
            if c == "*":
                pos[0] += 1
                v *= parse_factor()
            elif c == "/":
                pos[0] += 1
                v = int(v / parse_factor())
            else:
                return v

    def parse_factor():
        c = peek()
        if c == "-":
            pos[0] += 1
            return -parse_factor()
        if c == "(":
            pos[0] += 1
            v = parse_expr()
            peek()
            pos[0] += 1
            return v
        num = 0
        while pos[0] < n:
            d = s[pos[0]]
            if not d.isdigit():
                break
            num = num * 10 + int(d)
            pos[0] += 1
        return num

    return parse_expr()
