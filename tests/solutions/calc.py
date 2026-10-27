def solve(expr):
    stack = []
    num = 0
    op = "+"
    for ch in list(expr) + ["+"]:
        if ch.isdigit():
            num = num * 10 + int(ch)
            continue
        if ch == " ":
            continue
        if op == "+":
            stack.append(num)
        elif op == "-":
            stack.append(-num)
        elif op == "*":
            stack.append(stack.pop() * num)
        else:
            stack.append(int(stack.pop() / num))
        op = ch
        num = 0
    return sum(stack)
