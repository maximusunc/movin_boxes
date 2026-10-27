def solve(packed):
    stack = []
    cur = []
    num = 0
    for ch in packed:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((num, cur))
            num, cur = 0, []
        elif ch == "]":
            k, prev = stack.pop()
            prev.append("".join(cur) * k)
            cur = prev
        else:
            cur.append(ch)
    return "".join(cur)
