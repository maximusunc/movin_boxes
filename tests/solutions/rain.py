def solve(heights):
    left, right = 0, len(heights) - 1
    left_max = right_max = water = 0
    while left < right:
        lh, rh = heights[left], heights[right]
        if lh < rh:
            left_max = max(left_max, lh)
            water += left_max - lh
            left += 1
        else:
            right_max = max(right_max, rh)
            water += right_max - rh
            right -= 1
    return water
