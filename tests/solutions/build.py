def solve(preorder, inorder):
    preorder = list(preorder)
    index = {v: i for i, v in enumerate(inorder)}
    pos = [0]

    def build(lo, hi):
        if lo > hi:
            return None
        v = preorder[pos[0]]
        pos[0] += 1
        m = index[v]
        node = TreeNode(v)
        node.left = build(lo, m - 1)
        node.right = build(m + 1, hi)
        return node

    return build(0, len(preorder) - 1)
