/**
 * LeetCode 热题 100 —— 二分查找
 *
 * 34. 在排序数组中查找元素的第一个和最后一个位置 (Find First and Last Position of Element in Sorted Array)
 * 难度: 中等 | 标签: 数组、二分查找
 * 链接: https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。
 *
 * 如果数组中不存在目标值 `target`，返回 `[-1, -1]`。
 *
 * 你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。
 *
 * 示例 1：
 *
 *   输入：nums = [5,7,7,8,8,10], target = 8
 *   输出：[3,4]
 *
 * 示例 2：
 *
 *   输入：nums = [5,7,7,8,8,10], target = 6
 *   输出：[-1,-1]
 *
 * 示例 3：
 *
 *   输入：nums = [], target = 0
 *   输出：[-1,-1]
 *
 * 提示：
 *   - `0 <= nums.length <= 10^5`
 *   - `-10^9 <= nums[i] <= 10^9`
 *   - `nums` 是一个非递减数组
 *   - `-10^9 <= target <= 10^9`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 两次二分 —— lowerBound + upperBound
 *
 * ★ 关键转念: "第一个"和"最后一个"其实是同一个模板的两个参数 ★
 *
 *   上一题 035 我们学了一个模板:
 *       找"第一个 ≥ target 的下标"      （术语: lower_bound）
 *
 *   这题要的两个位置，都能用它表达:
 *
 *       起始位置 = lower_bound(target)          第一个 ≥ target
 *       结束位置 = upper_bound(target) - 1      第一个 > target 的【前一个】
 *
 *   而 upper_bound 和 lower_bound 的实现【只差一个符号】:
 *
 *     lower_bound:  if (nums[mid] <  target) lo = mid + 1; else hi = mid;
 *     upper_bound:  if (nums[mid] <= target) lo = mid + 1; else hi = mid;
 *                                      ↑ 只多了一个等号
 *
 *   一个模板、改个不等号，就同时解决了左右两个边界。
 *   这就是为什么建议把 035 那个模板背下来 —— 它在这里直接回本了。
 *
 * 步骤:
 *   1. left = lowerBound(nums, target)
 *   2. 先判断 target 到底存不存在:
 *        left 越界  或  nums[left] !== target  →  返回 [-1, -1]
 *   3. right = upperBound(nums, target) - 1
 *   4. 返回 [left, right]
 *
 * 易错点:
 *   1. ★ 必须先验证 target 存在 ★
 *      不验证的话，target 不存在时 lowerBound 返回的是"它本该在的位置"，
 *      而不是答案，输出就成了一个无意义的区间
 *   2. ★ 右边界是 upperBound - 1 ★
 *      upperBound 指向"第一个大于 target 的位置"，它本身【不属于】
 *      目标区间，减 1 才是最后一个 target
 *   3. 别用"二分找到 target 后往左右两边线性扫"的做法 ——
 *      数组全是 target 时会退化成 O(n)，不满足题目要求的 O(log n)
 *   4. 空数组天然没问题: lowerBound 返回 0，而 0 === nums.length
 *      → 直接走 [-1, -1] 分支，不用特判
 *
 * 复杂度: 时间 O(log n)（两次二分），空间 O(1)
 *
 * ── 等价的另一种表达: 两次 lower_bound ──
 *   起始位置 = lower_bound(target)
 *   结束位置 = lower_bound(target + 1) - 1
 *   （"第一个 ≥ target+1 的位置"就等于"第一个 > target 的位置"）
 *   这样写也是对的，只是 target 取到上界时会有 +1 溢出的隐患 ——
 *   JS 的数字是双精度浮点，不用担心；C++ 里就得留神了。
 *   用 upperBound 的写法可以完全绕开这个问题。
 */

/**
 * searchRange
 * 输入: nums = [5,7,7,8,8,10], target = 8
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const searchRange = function (nums, target) {
  // 找"第一个 ≥ target 的下标"（035 那个模板）
  const lowerBound = (t) => {
    let lo = 0;
    let hi = nums.length; // 左闭右开 [lo, hi)

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] < t) lo = mid + 1; // mid 太小，答案在右边
      else hi = mid; // mid 可能是答案，留着
    }

    return lo;
  };

  // 找"第一个 > target 的下标"—— 跟上面只差一个等号
  const upperBound = (t) => {
    let lo = 0;
    let hi = nums.length;

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] <= t) lo = mid + 1; // ← 只多了这个等号
      else hi = mid;
    }

    return lo;
  };

  const left = lowerBound(target);

  // ★ 先确认 target 真的存在
  if (left === nums.length || nums[left] !== target) return [-1, -1];

  const right = upperBound(target) - 1; // 注意 -1
  return [left, right];
};

// ─── 测试 ───────────────────────────────────────────
// console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // 期望: [3, 4]
// console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // 期望: [-1, -1]
// console.log(searchRange([], 0)); // 期望: [-1, -1]
// console.log(searchRange([5, 7, 7, 8, 8, 10], 5)); // 期望: [0, 0]
// console.log(searchRange([5, 7, 7, 8, 8, 10], 10)); // 期望: [5, 5]
// console.log(searchRange([1], 1)); // 期望: [0, 0]
// console.log(searchRange([2, 2], 2)); // 期望: [0, 1]  ← 全是目标值
//
// 参照实现(朴素线性扫): nums.indexOf(target) / nums.lastIndexOf(target)
// console.log([5,7,7,8,8,10].lastIndexOf(8)); // 4
//
// 顺便看看"找到后往两边线性扫"在满屏 target 时会多慢:
// const linear = (nums, target) => {
//   const i = nums.indexOf(target);
//   if (i === -1) return [-1, -1];
//   let j = i;
//   while (j + 1 < nums.length && nums[j + 1] === target) j++;
//   return [i, j];              // ← 循环最坏要走 n 步, O(n), 不合格
// };
