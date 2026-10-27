def solve(root):
    best = 0

    def height(node):
        nonlocal best
        if node is None:
            return 0
        a = height(node.left)
        b = height(node.right)
        best = max(best, a + b)
        return 1 + max(a, b)

    height(root)
    return best
