def solve(root):
    if root is None:
        return 0
    take = root.val
    if root.left:
        take += solve(root.left.left) + solve(root.left.right)
    if root.right:
        take += solve(root.right.left) + solve(root.right.right)
    skip = solve(root.left) + solve(root.right)
    return max(take, skip)
