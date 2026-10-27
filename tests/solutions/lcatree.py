def solve(root, p, q):
    def find(node):
        if node is None:
            return None
        v = node.val
        if v == p or v == q:
            return v
        a = find(node.left)
        b = find(node.right)
        if a is not None and b is not None:
            return v
        return a if a is not None else b

    return find(root)
