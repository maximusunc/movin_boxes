def solve(root, k):
    vals = []

    def walk(node):
        if node is None:
            return
        vals.append(node.val)
        walk(node.left)
        walk(node.right)

    walk(root)
    return sorted(vals)[k - 1]
