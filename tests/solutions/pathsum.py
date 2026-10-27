def solve(root):
    best = float("-inf")

    def gain(node):
        nonlocal best
        if node is None:
            return 0
        a = max(0, gain(node.left))
        b = max(0, gain(node.right))
        v = node.val
        best = max(best, v + a + b)
        return v + max(a, b)

    gain(root)
    return best
