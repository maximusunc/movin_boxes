def solve(seals):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in seals:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack
