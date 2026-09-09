/**
 * LeetCode 热题 100 —— 哈希
 *
 * 128. 最长连续序列 (Longest Consecutive Sequence)
 * 难度: 中等 | 标签: 并查集、数组、哈希表
 * 链接: https://leetcode.cn/problems/longest-consecutive-sequence/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 *
 * 请你设计并实现时间复杂度为 `O(n)` 的算法解决此问题。
 *
 * 示例 1：
 *
 *   输入：nums = [100,4,200,1,3,2]
 *   输出：4
 *   解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
 *
 * 示例 2：
 *
 *   输入：nums = [0,3,7,2,5,8,4,6,0,1]
 *   输出：9
 *
 * 示例 3：
 *
 *   输入：nums = [1,0,1,2]
 *   输出：3
 *
 * 提示：
 *   - `0 <= nums.length <= 10^5`
 *   - `-10^9 <= nums[i] <= 10^9`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 哈希集合 + 只从序列起点计数
 *
 * 1. 将所有数字放入 Set：去重，且查询 O(1)
 * 2. 遍历每个数 num，若 num-1 也在 Set 中，说明 num 不是某个连续序列的起点，跳过
 * 3. 只有当 num-1 不存在时，num 才是序列开头，此时向后数 num+1、num+2…直到断开
 * 4. 每个连续序列只会被完整数一次，总时间复杂度 O(n)
 *
 * 易错点: 必须先判断 num-1 是否存在再向后数；
 *         否则对每个数都向后数会退化成 O(n²)
 */

/**
 * longestConsecutive
 * @param {number[]} nums
 * @return {number}
 */
const longestConsecutive = function (nums) {
  const set = new Set(nums); // 去重 + O(1) 查询
  let maxLen = 0;

  for (const num of set) {
    // num-1 存在 => num 不是连续序列的起点，跳过
    if (set.has(num - 1)) continue;

    // num 是起点，向后数连续序列
    let len = 1;
    let cur = num;
    while (set.has(cur + 1)) {
      cur += 1;
      len += 1;
    }
    maxLen = Math.max(maxLen, len);
  }

  return maxLen;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 期望: 4
