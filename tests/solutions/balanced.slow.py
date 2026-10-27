def solve(root):
    def height(node):
        if node is None:
            return 0
        return 1 + max(height(node.left), height(node.right))

    if root is None:
        return True
    if abs(height(root.left) - height(root.right)) > 1:
        return False
    return solve(root.left) and solve(root.right)
