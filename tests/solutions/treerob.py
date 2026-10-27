def solve(root):
    # (best with this gate checked, best without it)
    def go(node):
        if node is None:
            return (0, 0)
        a = go(node.left)
        b = go(node.right)
        return (node.val + a[1] + b[1], max(a) + max(b))

    return max(go(root))
