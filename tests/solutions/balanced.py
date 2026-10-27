def solve(root):
    # Height of the subtree, or -1 if it's unbalanced anywhere below.
    def height(node):
        if node is None:
            return 0
        a = height(node.left)
        if a < 0:
            return -1
        b = height(node.right)
        if b < 0 or abs(a - b) > 1:
            return -1
        return 1 + max(a, b)

    return height(root) >= 0
