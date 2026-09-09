/**
 * LeetCode 热题 100 —— 双指针
 *
 * 15. 三数之和 (3Sum)
 * 难度: 中等 | 标签: 数组、双指针、排序
 * 链接: https://leetcode.cn/problems/3sum/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。
 *
 * 注意：答案中不可以包含重复的三元组。
 *
 * 示例 1：
 *
 *   输入：nums = [-1,0,1,2,-1,-4]
 *   输出：[[-1,-1,2],[-1,0,1]]
 *   解释：
 *   nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
 *   nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
 *   nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
 *   不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
 *   注意，输出的顺序和三元组的顺序并不重要。
 *
 * 示例 2：
 *
 *   输入：nums = [0,1,1]
 *   输出：[]
 *   解释：唯一可能的三元组和不为 0 。
 *
 * 示例 3：
 *
 *   输入：nums = [0,0,0]
 *   输出：[[0,0,0]]
 *   解释：唯一可能的三元组和为 0 。
 *
 * 提示：
 *   - `3 <= nums.length <= 3000`
 *   - `-10^5 <= nums[i] <= 10^5`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 排序 + 固定一个数 + 双指针
 *
 * 1. 排序后固定第一个数 nums[i]，问题退化为在 [i+1, n-1] 内找两数之和等于 -nums[i]
 * 2. 双指针夹逼：sum < 0 → left++（找更大的数）；sum > 0 → right--（找更小的数）
 * 3. 去重（本题最大的坑）：
 *    - 外层循环：nums[i] === nums[i-1] 时跳过，避免相同开头的三元组重复
 *    - 找到答案后：跳过所有相同的 left 和 right
 * 4. 剪枝：nums[i] > 0 时直接 break（排序后后面全是正数，不可能凑出 0）
 *
 * 复杂度: 时间 O(n²)（排序 O(n log n) + 双层遍历），空间 O(1)
 */

/**
 * threeSum
 * @param {number[]} nums
 * @return {number[][]}
 */
const threeSum = function (nums) {
  // 1. 排序，让双指针的移动有方向
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;

  // 2. 固定第一个数 nums[i]，问题退化为"两数之和"
  for (let i = 0; i < n - 2; i++) {
    // 剪枝：最小的数都 > 0，后面不可能凑出 0
    if (nums[i] > 0) break;

    // 去重：跳过相同的第一个数
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left++; // 和太小，左指针右移找更大的数
      } else if (sum > 0) {
        right--; // 和太大，右指针左移找更小的数
      } else {
        res.push([nums[i], nums[left], nums[right]]);
        // 去重：跳过相同的 left / right
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      }
    }
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(threeSum([-1, 0, 1, 2, -1, -4])); // 期望: [[-1, -1, 2], [-1, 0, 1]](输出顺序不限)
