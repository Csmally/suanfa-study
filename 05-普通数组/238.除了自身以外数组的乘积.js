/**
 * LeetCode 热题 100 —— 普通数组
 *
 * 238. 除了自身以外数组的乘积 (Product of Array Except Self)
 * 难度: 中等 | 标签: 数组、前缀和
 * 链接: https://leetcode.cn/problems/product-of-array-except-self/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums`，返回 数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除了 `nums[i]` 之外其余各元素的乘积 。
 *
 * 题目数据 保证 数组 `nums`之中任意元素的全部前缀元素和后缀的乘积都在 32 位 整数范围内。
 *
 * 请 不要使用除法，且在 `O(n)` 时间复杂度内完成此题。
 *
 * 示例 1:
 *
 *   输入: nums = [1,2,3,4]
 *   输出: [24,12,8,6]
 *
 * 示例 2:
 *
 *   输入: nums = [-1,1,0,-3,3]
 *   输出: [0,0,9,0,0]
 *
 * 提示：
 *   - `2 <= nums.length <= 10^5`
 *   - `-30 <= nums[i] <= 30`
 *   - 输入 保证 数组 `answer[i]` 在 32 位 整数范围内
 *
 * 进阶：你可以在 `O(1)` 的额外空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组 不被视为 额外空间。）
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 前缀积 × 后缀积（两遍扫描，O(1) 额外空间）
 *
 * answer[i] = 左边所有元素的乘积 × 右边所有元素的乘积
 *
 * 第一遍 从左到右: 把"前缀积"直接写进 answer
 *   answer[i] = nums[0] * ... * nums[i-1]（左边元素的乘积）
 *   递推: answer[i] = answer[i-1] * nums[i-1]，answer[0] = 1（左边没有元素）
 *
 * 第二遍 从右到左: 用滚动变量 suffixProduct 记"后缀积"并乘进去
 *   suffixProduct = nums[i+1] * ... * nums[n-1]（右边元素的乘积）
 *   answer[i] *= suffixProduct 后，suffixProduct *= nums[i] 供下一步使用
 *
 * 例: nums = [1,2,3,4]
 *   第一遍后 answer = [1, 1, 2, 6]  （左乘积: 1, [1], [1×2], [1×2×3]）
 *   第二遍   answer[3] = 6×1  = 6
 *            answer[2] = 2×4  = 8
 *            answer[1] = 1×12 = 12
 *            answer[0] = 1×24 = 24  → [24,12,8,6] ✓
 *
 * 关键点: 不能用除法——数组里可能有 0（示例 2），除以 0 没有意义；
 *        两遍扫描天然绕开除法，且 answer 数组本身不算额外空间，
 *        于是总额外空间 O(1)
 *
 * 复杂度: 时间 O(n)（两遍扫描），额外空间 O(1)（answer 不算）
 */

/**
 * productExceptSelf
 * 输入: nums = [1,2,3,4]
 * @param {number[]} nums
 * @return {number[]}
 */
const productExceptSelf = function (nums) {
  const n = nums.length;
  const answer = new Array(n);

  // 1. 从左到右: answer[i] = nums[0..i-1] 的乘积（前缀积）
  answer[0] = 1; // 左边没有元素，乘积为 1
  debugger
  for (let i = 1; i < n; i++) {
    answer[i] = answer[i - 1] * nums[i - 1];
  }


  // 2. 从右到左: suffixProduct 滚动记录 nums[i+1..n-1] 的乘积（后缀积）
  let suffixProduct = 1; // 最右边没有元素，乘积为 1
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffixProduct; // 左边 × 右边 = 除自身外所有元素的乘积
    suffixProduct *= nums[i]; // 把当前元素并入后缀积，供左边的位置使用
  }

  return answer;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(productExceptSelf([1, 2, 3, 4])); // 期望: [24, 12, 8, 6]
