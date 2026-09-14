/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 300. 最长递增子序列 (Longest Increasing Subsequence)
 * 难度: 中等 | 标签: 数组、二分查找、动态规划、最长上升子序列
 * 链接: https://leetcode.cn/problems/longest-increasing-subsequence/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度。
 *
 * 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]` 是数组 `[0,3,1,6,2,2,7]` 的子序列。
 *
 * 示例 1：
 *
 *   输入：nums = [10,9,2,5,3,7,101,18]
 *   输出：4
 *   解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 *
 * 示例 2：
 *
 *   输入：nums = [0,1,0,3,2,3]
 *   输出：4
 *
 * 示例 3：
 *
 *   输入：nums = [7,7,7,7,7,7,7]
 *   输出：1
 *
 * 提示：
 *   - `1 <= nums.length <= 2500`
 *   - `-10^4 <= nums[i] <= 10^4`
 *
 * 进阶：
 *   - 你能将算法的时间复杂度降低到 `O(n log(n))` 吗?
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 序列型 DP（O(n²)）+ 贪心二分的 O(n log n) 进阶
 *
 * ★ 套用 DP 的四步模板 ★
 *
 *   1. 状态: dp[i] = 【以 nums[i] 结尾】的最长递增子序列长度
 *   2. 转移: 枚举"接在谁后面" ——
 *              dp[i] = max(dp[j]) + 1    对所有满足 j < i 且 nums[j] < nums[i] 的 j
 *            也就是"把 nums[i] 接在某个比我小的数后面"
 *   3. 初始: dp[i] = 1                    （至少包含它自己）
 *   4. 返回: max(dp)                      ★ 不是 dp[n-1] ★
 *
 * ★ 和前面几题的关键区别: 状态的定义方式变了 ★
 *
 *   070 / 198 / 279 / 322 / 139 的 dp[i] 都是"【前 i 个】……"（前缀型）
 *   这题的 dp[i] 必须是"【以 i 结尾】……"（序列型）
 *
 *   为什么？因为"递增"这个约束【要求你知道最后一个元素是谁】。
 *   如果定义成"前 i 个里的最长递增子序列"，你没法把它接上去 ——
 *   你不知道那个子序列的末尾值是多少，也就没法比较大小。
 *
 *   ★ 这是【序列型 DP】的标志: 状态里必须带上"结尾信息" ★
 *
 * 拿 [10,9,2,5,3,7,101,18] 走一遍:
 *
 *   i   nums[i]   能接在谁后面      dp[i]   对应的子序列
 *   ─────────────────────────────────────────────────────
 *   0   10        -                 1
 *   1   9         没有比 9 小的      1
 *   2   2         没有比 2 小的      1
 *   3   5         2 (dp=1)          2      [2,5]
 *   4   3         2 (dp=1)          2      [2,3]
 *   5   7         5 或 3 (dp=2)     3      [2,3,7]
 *   6   101       7 (dp=3)          4      [2,3,7,101]
 *   7   18        7 (dp=3)          4      [2,3,7,18]
 *   → max(dp) = 4 ✓
 *
 * 易错点:
 *   1. ★ 返回的是 max(dp)，不是 dp[n-1] ★
 *      "以最后一个元素结尾"不一定最优。
 *      反例 [1,2,3,0]: dp = [1,2,3,1]，dp[3]=1 但答案是 3
 *   2. ★ dp 全部初始化为 1 ★，不是 0 —— 每个元素自己就构成长度 1
 *   3. ★ 题目要的是【严格】递增，所以判断用 nums[j] < nums[i] ★
 *      非严格递增才用 <=
 *   4. 别把 dp[i] 定义成"前 i 个"（见上，那样转移根本写不出来）
 *
 * 复杂度: 时间 O(n²)，空间 O(n)
 *
 * ── 进阶: 贪心 + 二分，做到 O(n log n)（见 lengthOfLISBisect） ──
 *   维护一个数组 tails，定义:
 *     tails[k] = 【所有长度为 k+1 的递增子序列中，结尾最小的那个值】
 *
 *   为什么这么定义？因为【结尾越小，后面越容易接上】—— 这就是贪心。
 *
 *   对每个 num:
 *     用二分（就是 035 的 lower_bound 模板）找 tails 里第一个 >= num 的位置
 *     把它替换成 num；找不到就 append 到末尾
 *   最后 tails.length 就是答案。
 *
 *   ★ 注意: tails 本身【不是】一条真实的递增子序列！★
 *     它只是"每个长度对应的最小结尾"这份表格，里面的值可能来自
 *     数组的任意位置。（下面测试里有反例）
 *
 * 复杂度: 时间 O(n log n)，空间 O(n)
 */

/**
 * lengthOfLIS
 * 序列型 DP: O(n²)
 * 输入: nums = [10,9,2,5,3,7,101,18]
 * @param {number[]} nums
 * @return {number}
 */
const lengthOfLIS = function (nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1); // ★ 至少包含自己
  let best = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // nums[i] 能接在 nums[j] 后面（严格递增）
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]); // ★ 随时更新全局最大，不是最后取 dp[n-1]
  }

  return best;
};

/**
 * lengthOfLISBisect
 * 贪心 + 二分: O(n log n)，用到 035 的 lower_bound 模板
 * @param {number[]} nums
 * @return {number}
 */
const lengthOfLISBisect = function (nums) {
  // tails[k] = 长度为 k+1 的递增子序列中，最小的结尾值
  const tails = [];

  for (const num of nums) {
    // 二分找 tails 里【第一个 >= num】的位置（lower_bound）
    let lo = 0;
    let hi = tails.length;

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] < num) lo = mid + 1; // mid 太小，答案在右边
      else hi = mid; // mid 可能是答案，留着
    }

    // lo 就是那个位置：替换它，或者追加到末尾
    tails[lo] = num;
  }

  return tails.length;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 期望: 4   ← 示例 1
// console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 期望: 4              ← 示例 2
// console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 期望: 1           ← 示例 3, 全相等
// console.log(lengthOfLIS([1]));  // 期望: 1
// console.log(lengthOfLIS([1, 2, 3, 4])); // 期望: 4   ← 已经递增
// console.log(lengthOfLIS([4, 3, 2, 1])); // 期望: 1   ← 完全递减
// console.log(lengthOfLIS([1, 2, 3, 0])); // 期望: 3   ← 考验"返回 max(dp) 而不是 dp[n-1]"
// console.log(lengthOfLISBisect([10, 9, 2, 5, 3, 7, 101, 18])); // 期望: 4
//
// 参照实现(暴力枚举所有子序列, 2^n, 只适合小的 n):
// const refBrute = (nums) => {
//   const n = nums.length;
//   let best = 0;
//   const go = (i, last, len) => {
//     if (i === n) { best = Math.max(best, len); return; }
//     go(i + 1, last, len);                              // 不选 nums[i]
//     if (nums[i] > last) go(i + 1, nums[i], len + 1);   // 选 nums[i]
//   };
//   go(0, -Infinity, 0);
//   return best;
// };
//
// 顺带验证几条性质:
//   ① 答案恒 >= 1 且 <= n
//   ② nums 严格递增 → 答案 = n
//   ③ nums 全部相等 → 答案 = 1
//   ④ 两个实现结果恒一致
