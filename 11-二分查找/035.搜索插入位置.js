/**
 * LeetCode 热题 100 —— 二分查找
 *
 * 35. 搜索插入位置 (Search Insert Position)
 * 难度: 简单 | 标签: 数组、二分查找
 * 链接: https://leetcode.cn/problems/search-insert-position/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 *
 * 请必须使用时间复杂度为 `O(log n)` 的算法。
 *
 * 示例 1:
 *
 *   输入: nums = [1,3,5,6], target = 5
 *   输出: 2
 *
 * 示例 2:
 *
 *   输入: nums = [1,3,5,6], target = 2
 *   输出: 1
 *
 * 示例 3:
 *
 *   输入: nums = [1,3,5,6], target = 7
 *   输出: 4
 *
 * 提示:
 *   - `1 <= nums.length <= 10^4`
 *   - `-10^4 <= nums[i] <= 10^4`
 *   - `nums` 为 无重复元素 的 升序 排列数组
 *   - `-10^4 <= target <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 二分查找 —— 本质是求【第一个 ≥ target 的下标】
 *
 * ★ 关键转念: 把两种情况统一成一句话 ★
 *
 *   题目说"找到就返回下标，找不到就返回该插入的位置"。
 *   这两件事看着是两套逻辑，其实是【同一件事】:
 *
 *       答案 = 第一个 ≥ target 的下标   （术语叫 lower_bound）
 *
 *     - target 存在   → 那个位置就是 target 自己（数组无重复）
 *     - target 不存在 → 那个位置正好就是它该插进去的地方
 *
 *   想通这一点，就不用分两种分支写了。
 *
 * ── 写法一: 左闭右闭 [lo, hi]，命中就直接返回 ──
 *   常规二分，找到了立刻 return mid。
 *   找不到时循环会在 lo > hi 时结束，【此时 lo 就是答案】。
 *
 *   为什么? 循环结束时 hi + 1 === lo，并且:
 *     - [0, hi]   里的数全都 < target（否则 hi 不会一路退到这儿）
 *     - [lo, n-1] 里的数全都 > target
 *   所以 lo 恰好是"第一个大于 target 的位置"，也就是插入点。
 *
 * ── 写法二: 左闭右开 [lo, hi)，标准 lower_bound 模板 ★推荐★ ──
 *
 *   let lo = 0, hi = n;
 *   while (lo < hi) {
 *     const mid = Math.floor((lo + hi) / 2);
 *     if (nums[mid] < target) lo = mid + 1;   // mid 太小 → 答案在右边
 *     else                    hi = mid;       // mid 可能就是答案 → 留着
 *   }
 *   return lo;   // lo === hi，就是第一个 ≥ target 的位置
 *
 *   这个模板【极其通用】，能变形解决一大类"找边界"的题
 *   （34 查找第一个和最后一个位置、704 二分查找、162 找峰值……），
 *   建议背成肌肉记忆。
 *
 * 易错点:
 *   1. ★ 模板二里是 hi = mid，【不是 hi = mid - 1】★
 *      mid 自己可能就是答案，不能把它排除掉。
 *      写成 mid - 1 会漏掉正确答案。
 *   2. ★ mid 必须【向下取整】—— 用 Math.floor((lo + hi) / 2) ★
 *      手滑写成向上取整的话，配合 hi = mid 会在 lo、hi 相邻时
 *      陷入【死循环】（mid 算出来就是 hi，hi = mid 又不变，来回转）
 *   3. 两个版本的 hi 初值不一样: 左闭右闭是 n - 1，左闭右开是 n
 *   4. 别用 nums.indexOf(target) 糊弄 —— 那是 O(n)，
 *      题目明确要求 O(log n)
 *
 * 复杂度: 时间 O(log n)，空间 O(1)
 */

/**
 * searchInsert
 * 写法一: 左闭右闭，命中直接返回
 * 输入: nums = [1,3,5,6], target = 5
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const searchInsert = function (nums, target) {
  let lo = 0;
  let hi = nums.length - 1; // 左闭右闭，所以是 n - 1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); // 向下取整

    if (nums[mid] === target) return mid; // 找到就直接返回
    if (nums[mid] < target) lo = mid + 1; // 答案在右半边
    else hi = mid - 1; // 答案在左半边
  }

  // 走到这里说明没找到，此时 lo 就是"第一个大于 target 的位置"
  return lo;
};

/**
 * searchInsertLowerBound
 * 写法二: 左闭右开的标准 lower_bound 模板（推荐记住这个）
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const searchInsertLowerBound = function (nums, target) {
  let lo = 0;
  let hi = nums.length; // 左闭右开 [lo, hi)，所以是 n

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2); // 必须向下取整

    if (nums[mid] < target) {
      lo = mid + 1; // mid 一定不是答案，排除掉
    } else {
      hi = mid; // mid 可能是答案，只能把范围收到 mid
    }
  }

  // lo === hi，就是第一个 ≥ target 的位置
  return lo;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(searchInsert([1, 3, 5, 6], 5)); // 期望: 2
// console.log(searchInsert([1, 3, 5, 6], 2)); // 期望: 1
// console.log(searchInsert([1, 3, 5, 6], 7)); // 期望: 4
// console.log(searchInsert([1, 3, 5, 6], 0)); // 期望: 0  ← 比所有元素都小
// console.log(searchInsert([1], 0)); // 期望: 0
// console.log(searchInsertLowerBound([1, 3, 5, 6], 5)); // 期望: 2
//
// 顺便看看把 mid 写成【向上取整】会怎样(会死循环):
// const deadLoop = (nums, target) => {
//   let lo = 0, hi = nums.length;
//   while (lo < hi) {
//     const mid = Math.ceil((lo + hi) / 2);   // ← 向上取整
//     if (nums[mid] < target) lo = mid + 1;
//     else hi = mid;                     // mid 算出 hi,hi = mid 又不变 → 转圈
//   }
//   return lo;
// };
// deadLoop([1, 3], 5);  // 小心！这行会卡死浏览器标签页
