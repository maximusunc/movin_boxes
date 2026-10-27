def solve(root):
    def check(node, lo, hi):
        if node is None:
            return True
        v = node.val
        if not (lo < v < hi):
            return False
        return check(node.left, lo, v) and check(node.right, v, hi)

    return check(root, float("-inf"), float("inf"))
