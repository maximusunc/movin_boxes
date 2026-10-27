def solve(root, p, q):
    node = root
    while node:
        v = node.val
        if p < v and q < v:
            node = node.left
        elif p > v and q > v:
            node = node.right
        else:
            return v
    return None
