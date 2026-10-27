def solve(root):
    def height(node):
        if node is None:
            return 0
        return 1 + max(height(node.left), height(node.right))

    if root is None:
        return 0
    through = height(root.left) + height(root.right)
    return max(through, solve(root.left), solve(root.right))
