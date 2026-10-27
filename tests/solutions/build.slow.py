def solve(preorder, inorder):
    def build(pre, ino):
        if not pre:
            return None
        v = pre[0]
        m = ino.index(v)
        node = TreeNode(v)
        node.left = build(pre[1:m + 1], ino[:m])
        node.right = build(pre[m + 1:], ino[m + 1:])
        return node

    return build(preorder, inorder)
