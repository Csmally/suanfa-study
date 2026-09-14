/**
 * LeetCode 热题 100 —— 贪心算法
 *
 * 121. 买卖股票的最佳时机 (Best Time to Buy and Sell Stock)
 * 难度: 简单 | 标签: 数组、动态规划
 * 链接: https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。
 *
 * 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
 *
 * 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0` 。
 *
 * 示例 1：
 *
 *   输入：[7,1,5,3,6,4]
 *   输出：5
 *   解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
 *   注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
 *
 * 示例 2：
 *
 *   输入：prices = [7,6,4,3,1]
 *   输出：0
 *   解释：在这种情况下, 没有交易完成, 所以最大利润为 0。
 *
 * 提示：
 *   - `1 <= prices.length <= 10^5`
 *   - `0 <= prices[i] <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 贪心 —— 只维护"到目前为止的最低价"
 *
 * ★ 关键转念: 换个角度看"最大利润"★
 *
 *   不要去想"选哪天买、哪天卖"，而是想:
 *
 *     对【每一天 i】，如果今天卖出，最多能赚多少？
 *
 *   答案很直接: 用【今天之前的最低价】买入，今天卖出 —
 *     今天卖能赚 = prices[i] - (prices[0..i-1] 里的最小值)
 *
 *   于是全局答案 = 所有"今天卖能赚"里的最大值。
 *   一边遍历、一边维护"历史最低价"就够了 —— O(n)。
 *
 * ★ 为什么这样"贪"是对的？★
 *
 *   题目约束是"买入必须在卖出之前"。而 minPrice 永远来自
 *   当前天的【历史】，不可能用到未来的价格 —— 约束天然被满足。
 *   所以每天的局部最优拼起来就是全局最优，不需要反悔。
 *
 *   （反着想一下: 如果题目允许"先卖后买"，或者能提前看到未来
 *     的价格，这个贪心就不成立了。约束恰好保证了贪心的正确性。）
 *
 * 拿 [7, 1, 5, 3, 6, 4] 走一遍:
 *
 *   价格   minPrice   今天卖能赚   最高利润
 *   ───────────────────────────────────────────
 *   7      7          -           0
 *   1      1          -           0         ← 跌了，更新最佳买点
 *   5      1          4           4
 *   3      1          2           4
 *   6      1          5           5    ★
 *   4      1          3           5
 *
 * 易错点:
 *   1. ★ best 的初值必须是 0，不能是 -Infinity ★
 *      题目说"不能获取任何利润就返回 0"。价格一路下跌时，
 *      正确答案是 0。写成 -Infinity 的话，那种情况下 else 分支
 *      一次都不会执行，函数会直接返回 -Infinity
 *   2. minPrice 初值给 Infinity（或者 prices[0]）
 *   3. 别写 O(n²) 的暴力（枚举所有买卖对）——
 *      n = 10^5 时是 10^10 次比较，必超时
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 *
 * ── 另一条路: 状态机 DP（见 maxProfitDP），而且这条能推广 ──
 *   把同一件事用 DP 的语言重写一遍。单看这题它没必要，
 *   但好处是【能直接推广到后面所有的股票题】——
 *   122（可买卖多次）、123/188（最多 k 次）、309（含冷冻期）、
 *   714（含手续费）全都是这套模板的变体。
 */

/**
 * maxProfit
 * 贪心: 一边遍历，一边维护历史最低价
 * 输入: prices = [7,1,5,3,6,4]
 * @param {number[]} prices
 * @return {number}
 */
const maxProfit = function (prices) {
  let minPrice = prices[0];
  let maxCount = 0;
  for (let i = 0; i < prices.length; i++) {
    let count = prices[i] - minPrice;
    minPrice = Math.min(minPrice, prices[i]);
    maxCount = Math.max(maxCount, count);
  }
  return maxCount;
};

/**
 * maxProfitDP
 * 状态机 DP 写法（能推广到 122/123/188/309/714）
 * @param {number[]} prices
 * @return {number}
 */
const maxProfitDP = function (prices) {
  // dp0 = 手上【没有】股票时的最大收益
  // dp1 = 手上【持有】股票时的最大收益（是负数，代表买入花了多少钱）
  let dp0 = 0;
  let dp1 = -prices[0];

  for (let i = 1; i < prices.length; i++) {
    // 今天的状态只能从"昨天的状态"转移过来
    dp0 = Math.max(dp0, dp1 + prices[i]); // 保持空仓 / 今天把股票卖了
    dp1 = Math.max(dp1, -prices[i]); // 保持持有 / 今天才买入
  }

  return dp0; // 最后一定是不持股的状态收益更高
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 期望: 5
// console.log(maxProfit([7, 6, 4, 3, 1]));    // 期望: 0  ← 一路下跌，不交易
// console.log(maxProfit([1]));                // 期望: 0  ← 只有一天
// console.log(maxProfit([1, 2]));             // 期望: 1
// console.log(maxProfit([2, 1]));             // 期望: 0
// console.log(maxProfit([3, 3, 3]));          // 期望: 0  ← 全相等
// console.log(maxProfit([2, 4, 1]));          // 期望: 2  ← 卖了之后才跌，不能用后面的低价
// console.log(maxProfitDP([7, 1, 5, 3, 6, 4])); // 期望: 5
//
// 暴力参照(枚举所有买卖对, O(n^2)):
// const brute = (prices) => {
//   let best = 0;
//   for (let i = 0; i < prices.length; i++)
//     for (let j = i + 1; j < prices.length; j++)
//       best = Math.max(best, prices[j] - prices[i]);
//   return best;
// };
//
// 顺便看看 best 初值写成 -Infinity 会怎样:
// [7,6,4,3,1] 会返回 -Infinity（正确答案是 0）—— 题目要求"不能获利就返回 0"
// 注意不是返回 -1 —— 因为价格一路下跌时 else 分支根本没执行过,
// best 从头到尾没被赋值, 保持初始值
