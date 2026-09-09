/**
 * LeetCode 热题 100 —— 子串
 *
 * 560. 和为 K 的子数组 (Subarray Sum Equals K)
 * 难度: 中等 | 标签: 数组、哈希表、前缀和
 * 链接: https://leetcode.cn/problems/subarray-sum-equals-k/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 该数组中和为 `k` 的子数组的个数 。
 *
 * 子数组是数组中元素的连续非空序列。
 *
 * 示例 1：
 *
 *   输入：nums = [1,1,1], k = 2
 *   输出：2
 *
 * 示例 2：
 *
 *   输入：nums = [1,2,3], k = 3
 *   输出：2
 *
 * 提示：
 *   - `1 <= nums.length <= 2 * 10^4`
 *   - `-1000 <= nums[i] <= 1000`
 *   - `-10^7 <= k <= 10^7`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 前缀和 + 哈希表
 *
 * 1. 定义前缀和 prefixSum：从 nums[0] 累加到当前位置的总和
 * 2. 子数组 nums[i..j] 的和 = 前缀和(j) - 前缀和(i-1)
 *    要找和为 k 的子数组，即要求：前缀和(i-1) = 前缀和(j) - k
 * 3. 遍历数组，用 Map 记录"每个前缀和值出现过多少次"：
 *    每算出一个新前缀和 prefixSum，去 Map 里查 prefixSum - k 出现了几次，
 *    出现几次就说明有几个以当前位置结尾、和为 k 的子数组
 * 4. 注意 Map 要先放入 {0: 1}，代表"空前缀"和为 0 出现过一次，
 *    这样从数组开头开始的子数组（如 [1,1]）也能被统计到
 *
 * 关键点: 本题不能用滑动窗口——数组里有负数，前缀和不单调，
 *        窗口扩大和不一定变大，无法通过收缩左指针来逼近 k，
 *        所以用"前缀和 + 哈希查历史"而不是双指针
 *
 * 复杂度: 时间 O(n)（每个元素只看一次），空间 O(n)（前缀和最多 n 种）
 */

/** 60+x-50=15
 * subarraySum  20   10  15  10  60 65
 * 输入: nums = [20, -10, 5, -5, 50, 5] k = 50
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const subarraySum = function (nums, k) {
  const prefixCount = new Map(); // 前缀和 -> 该前缀和出现过的次数
  prefixCount.set(0, 1); // 空前缀和 0 出现 1 次，用于统计从下标 0 开始的子数组

  let prefixSum = 0; // 当前前缀和
  let count = 0; // 和为 k 的子数组个数

  debugger

  for (const num of nums) {
    prefixSum += num;

    // 若之前存在前缀和 = prefixSum - k，则从那之后到当前位置的子数组和就是 k
    count += prefixCount.get(prefixSum - k) || 0;

    // 把当前前缀和记录进 Map（放在查询之后，保证子数组非空）
    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
  }

  return count;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(subarraySum([1, 1, 1], 2)); // 期望: 2
// console.log(subarraySum([1, 2, 3], 3)); // 期望: 2
