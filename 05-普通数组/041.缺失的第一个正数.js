/**
 * LeetCode 热题 100 —— 普通数组
 *
 * 41. 缺失的第一个正数 (First Missing Positive)
 * 难度: 困难 | 标签: 数组、哈希表
 * 链接: https://leetcode.cn/problems/first-missing-positive/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个未排序的整数数组 `nums` ，请你找出其中没有出现的最小的正整数。
 *
 * 请你实现时间复杂度为 `O(n)` 并且只使用常数级别额外空间的解决方案。
 *
 * 示例 1：
 *
 *   输入：nums = [1,2,0]
 *   输出：3
 *   解释：范围 [1,2] 中的数字都在数组中。
 *
 * 示例 2：
 *
 *   输入：nums = [3,4,-1,1]
 *   输出：2
 *   解释：1 在数组中，但 2 没有。
 *
 * 示例 3：
 *
 *   输入：nums = [7,8,9,11,12]
 *   输出：1
 *   解释：最小的正数 1 没有出现。
 *
 * 提示：
 *   - `1 <= nums.length <= 10^5`
 *   - `-2^31 <= nums[i] <= 2^31 - 1`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 原地哈希（拿数组本身当哈希表，O(1) 额外空间）
 *
 * 1. 先确定答案范围: 答案一定在 [1, n+1] 内（n = 数组长度）
 *    若 1~n 全部出现，答案是 n+1；否则缺失的那个必在 1~n 里
 *    → 所以只需要关心 [1, n] 范围内的数，其他数（<=0、>n）可以无视
 *
 * 2. 让每个数"回家": 数值 v（1 <= v <= n）应该住在下标 v-1
 *    遍历数组，凡是 [1, n] 范围内的数，就把它和"它的家"上的数交换，
 *    换过来的新数可能还不在家 → 用 while 继续换
 *    while 条件里加 nums[nums[i]-1] !== nums[i] 防重复数字死循环
 *
 * 3. 扫描数组: 第一个 nums[i] !== i+1 的位置 → i+1 就是答案；
 *    全部就位 → 答案是 n+1
 *
 * 例: nums = [3,4,-1,1]
 *    i=0: 3 该去下标2 → 交换 → [-1,4,3,1]，此时 nums[0]=-1 不在范围，停
 *    i=1: 4 该去下标3 → 交换 → [-1,1,3,4]，nums[1]=1 该去下标0 → 再交换
 *         → [1,-1,3,4]，nums[1]=-1 停
 *    扫描: 下标1 上是 -1 ≠ 2 → 答案 2 ✓
 *
 * 关键点: 每个数最多被换到"正确位置"一次，正确位置上的数不会再次参与交换，
 *        所以 while 总交换次数 <= n，整体仍是 O(n)
 *
 * 复杂度: 时间 O(n)，空间 O(1)（原地修改）
 */

/**
 * firstMissingPositive
 * 输入: nums = [30,4,-1,1]
 * @param {number[]} nums
 * @return {number}
 */
const firstMissingPositive = function (nums) {
  const n = nums.length;

  debugger

  // 1. 把 [1, n] 范围内的每个数放到它该去的位置：数值 v → 下标 v-1
  for (let i = 0; i < n; i++) {
    // 当前数在范围内 && 它该去的位置上放的不是它自己 → 交换过去
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correctIndex = nums[i] - 1; // 它该去的下标
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    }
  }

  // 2. 扫描：第一个"没回家"的位置，i+1 就是缺失的最小正数
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }

  // 3. 1~n 全部就位 → 缺失的是 n+1
  return n + 1;
};

/**
 * func
 * 输入: nums = [3, 4, -1, 1]
 * @param {number[]} nums
 * @return {number}
 */
const func = (nums) => {
  const n = nums.length;
  const newArr = new Array(n).fill(null);
  debugger
  for (let i = 0; i < n; i ++) {
    const index = nums.find(item => item === i + 1);
    if (index) {
      newArr[i] = i + 1;
    }
  }
  console.log(newArr)
  for (let j = 0; j < n; j ++) {
    if (newArr[j] === null) {
      return j + 1;
    }
  }
  return n + 1;
}
// ─── 测试 ───────────────────────────────────────────
// console.log(firstMissingPositive([1, 2, 0])); // 期望: 3
// console.log(firstMissingPositive([3, 4, -1, 1])); // 期望: 2
