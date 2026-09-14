/**
 * LeetCode 热题 100 —— 回溯
 *
 * 78. 子集 (Subsets)
 * 难度: 中等 | 标签: 位运算、数组、回溯
 * 链接: https://leetcode.cn/problems/subsets/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
 *
 * 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
 *
 * 示例 1：
 *
 *   输入：nums = [1,2,3]
 *   输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 *
 * 示例 2：
 *
 *   输入：nums = [0]
 *   输出：[[],[0]]
 *
 * 提示：
 *   - `1 <= nums.length <= 10`
 *   - `-10 <= nums[i] <= 10`
 *   - `nums` 中的所有元素 互不相同
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 回溯（沿用 046 的框架，但【收集点变了】）
 *
 * ★ 和全排列的关键区别 ★
 *
 *   全排列: 【每个叶子】才是一个答案（必须凑齐 n 个数）
 *   子集  : 【每个节点】都是一个答案（包括根、包括中间节点）
 *
 *   所以这题的做法是 —— 【一进函数就收集】，而不是等到某个
 *   终止条件才收集。这题甚至【没有显式的终止条件】，
 *   for 循环自然跑完就是终点。
 *
 * 决策树（nums = [1,2,3]，每个节点都是一个子集）:
 *
 *                        []                 ← 收集
 *             ┌──────────┼──────────┐
 *            [1]        [2]        [3]      ← 都收集
 *          ┌──┴──┐      │
 *        [1,2] [1,3]   [2,3]                 ← 都收集
 *          │
 *       [1,2,3]                              ← 收集
 *
 *   共 2^3 = 8 个节点，正好是全部子集。
 *
 * ★ start 参数是干什么的 ★
 *   它保证"只往后选，不往前选" —— 这样 [1,2] 和 [2,1] 只会被
 *   生成一次，不会当成两个不同的子集。
 *   （全排列不需要它，因为全排列里 [1,2] 和 [2,1] 本来就是两个
 *     不同的答案，顺序有区别。）
 *
 * 易错点:
 *   1. res.push 要放在【函数开头】（每个节点都收集），
 *      不能挪到 for 后面，也别加 if 判断
 *   2. res.push(path.slice()) —— 要拷贝，跟 046 是同一个坑
 *   3. 递归传的是 【backtrack(i + 1)】，不是 backtrack(start + 1)！
 *      写成 start + 1 的话，循环起点不跟着 i 走，同一个数会被
 *      选两次，生成出 [1,3,3] 这种非法子集
 *
 * 复杂度: 时间 O(n * 2^n)（2^n 个子集，每个要 O(n) 拷贝），
 *         空间 O(n) 递归栈（不含结果本身）
 *
 * ── 另一条路: 位运算（见 subsetsBitmask） ──
 *   n 个元素，每个元素"选或不选"—— 这正好是个 n 位二进制数！
 *   于是 0 ~ 2^n - 1 的每个整数都唯一对应一个子集:
 *   第 i 位是 1 就表示"取 nums[i]"。
 *
 * ── 还有一条路: 逐个扩展（迭代法） ──
 *   let res = [[]];
 *   for (const num of nums) {
 *     res = res.concat(res.map(s => [...s, num]));
 *   }
 *   每来一个新数，就把"现有的所有子集"各复制一份、各自加上它。
 *   最短也最直观。
 */

/**
 * subsets
 * 回溯
 * 输入: nums = [1,2,3]
 * @param {number[]} nums
 * @return {number[][]}
 */
const subsets = function (nums) {
  const res = [];
  const path = []; // 当前这个子集

  const backtrack = (start) => {
    // ★ 一进来就收集 —— 每个节点都是一个子集，包括空集和中间节点
    res.push(path.slice()); // 照样要拷贝

    // 从 start 开始往后选，保证不重复、不回头
    for (let i = start; i < nums.length; i++) {
      // 做选择
      path.push(nums[i]);

      // ★ 传 i + 1（不是 start + 1）：下一个位置从 i 的后面接着选
      backtrack(i + 1);

      // 撤销选择
      path.pop();
    }
    // for 跑完自然结束 —— 这题不需要额外的终止条件
  };

  backtrack(0);
  return res;
};

/**
 * subsetsBitmask
 * 位运算: 0 ~ 2^n - 1 的每个整数对应一个子集
 * @param {number[]} nums
 * @return {number[][]}
 */
const subsetsBitmask = function (nums) {
  const n = nums.length;
  const res = [];

  // mask 的二进制表示就是"选哪些位置"：第 i 位是 1 → 取 nums[i]
  for (let mask = 0; mask < (1 << n); mask++) {
    const sub = [];

    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) sub.push(nums[i]);
    }

    res.push(sub);
  }

  return res;
};

/**
 * subsetsIterative
 * 逐个扩展: 每来一个新数，就把现有子集各复制一份并加上它
 * @param {number[]} nums
 * @return {number[][]}
 */
const subsetsIterative = function (nums) {
  let res = [[]];

  for (const num of nums) {
    // 现有的每一份都复制一遍、各自加上 num，再拼回来
    res = res.concat(res.map((s) => [...s, num]));
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(subsets([1, 2, 3]));       // 期望: 8 个子集(顺序不限)
// console.log(subsets([0]));             // 期望: [[], [0]]
// console.log(subsetsBitmask([1, 2, 3])); // 期望: 8 个子集
// console.log(subsetsIterative([1, 2, 3])); // 期望: 8 个子集
//
// 顺序不限,所以验证【性质】:
//   ① 个数 === 2^n  ② 互不重复  ③ 每个子集里的元素都来自 nums
// 顺便看看把 backtrack(i + 1) 写成 backtrack(start + 1) 会错成什么样:
// const buggy = (nums) => {
//   const res = [], path = [];
//   const bt = (start) => {
//     res.push(path.slice());
//     for (let i = start; i < nums.length; i++) {
//       path.push(nums[i]);
//       bt(start + 1);              // ← 错! 应该是 i + 1
//       path.pop();
//     }
//   };
//   bt(0);
//   return res;
// };
// console.log(buggy([1, 2, 3])); // 会出现 [1,3,3] 这种非法子集
