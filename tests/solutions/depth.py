def solve(root):
    if root is None:
        return 0
    return 1 + max(solve(root.left), solve(root.right))
