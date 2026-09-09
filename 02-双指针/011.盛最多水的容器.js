/**
 * LeetCode 热题 100 —— 双指针
 *
 * 11. 盛最多水的容器 (Container With Most Water)
 * 难度: 中等 | 标签: 贪心、数组、双指针
 * 链接: https://leetcode.cn/problems/container-with-most-water/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。
 *
 * 找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。
 *
 * 返回容器可以储存的最大水量。
 *
 * 说明：你不能倾斜容器。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：[1,8,6,2,5,4,8,3,7]
 *   输出：49
 *   解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
 *
 * 示例 2：
 *
 *   输入：height = [1,1]
 *   输出：1
 *
 * 提示：
 *   - `n == height.length`
 *   - `2 <= n <= 10^5`
 *   - `0 <= height[i] <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 左右双指针 + 贪心
 *
 * 1. 水量 = min(height[left], height[right]) × (right - left)，由较矮的边和底宽决定
 * 2. 指针从两端开始，每次移动较矮的一边：
 *    - 移动高的那边：新高度仍 ≤ 短板，且底宽变小 → 面积不可能变大
 *    - 移动矮的那边：新边可能更高 → 面积才有机会变大
 * 3. 这一步舍弃是安全的：以当前短板为一条边的所有容器都不可能比当前更大
 *    （继续配谁底都只会更窄），两边相遇即结束
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 */

/**
 * maxArea
 * [1,1]
 * @param {number[]} height
 * @return {number}
 */
const maxArea = function (height) {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    // 当前容器的水量 = 较矮的边 × 底宽
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);

    // 移动较矮的一边：只有它变高，才可能让面积变大
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 期望: 49
