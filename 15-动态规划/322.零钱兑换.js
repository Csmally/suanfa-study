/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 322. 零钱兑换 (Coin Change)
 * 难度: 中等 | 标签: 广度优先搜索、数组、动态规划、背包问题、完全背包
 * 链接: https://leetcode.cn/problems/coin-change/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。
 *
 * 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。
 *
 * 你可以认为每种硬币的数量是无限的。
 *
 * 示例 1：
 *
 *   输入：coins = [1, 2, 5], amount = 11
 *   输出：3
 *   解释：11 = 5 + 5 + 1
 *
 * 示例 2：
 *
 *   输入：coins = [2], amount = 3
 *   输出：-1
 *
 * 示例 3：
 *
 *   输入：coins = [1], amount = 0
 *   输出：0
 *
 * 提示：
 *   - `1 <= coins.length <= 12`
 *   - `1 <= coins[i] <= 2^31 - 1`
 *   - `0 <= amount <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 动态规划 —— 完全背包（和 279 是同一道题）
 *
 * ★ 一句话: 这就是 279 完全平方数，只是把"平方数"换成了"硬币面额" ★
 *
 *     279: "物品"是 1、4、9、16……         求凑出 n 最少几件
 *     322: "物品"是 coins[0]、coins[1]……   求凑出 amount 最少几件
 *
 *   转移方程、初始条件、循环结构【一模一样】。
 *   279 做过的话，这题基本是白送。
 *
 * ★ 套用 DP 的四步模板 ★
 *
 *   1. 状态: dp[i] = 凑出金额 i 需要的最少硬币数
 *   2. 转移: 枚举"【最后一枚】用的是哪张面额" ——
 *              dp[i] = min( dp[i - coin] + 1 )    对每个满足 coin <= i 的 coin
 *   3. 初始: dp[0] = 0，其余全部 Infinity
 *   4. 返回: dp[amount]，但【如果还是 Infinity 要返回 -1】
 *
 * 拿 coins = [1,2,5], amount = 11 走一遍（只列关键几个）:
 *   dp[0]  = 0
 *   dp[5]  = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1        （5）
 *   dp[10] = min(dp[9]+1, dp[8]+1, dp[5]+1) = 2        （5+5）
 *   dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1) = 3       （5+5+1）
 *   → 3 ✓
 *
 * ★ 和 279 唯一的区别: 这里可能【凑不出来】★
 *
 *   279 里 1 一定是平方数，所以任何 n 都能用 n 个 1 凑出来，永远有解。
 *   但这题如果 coins 里没有 1（比如 coins = [2]），就可能凑不出
 *   奇数金额。这时 dp[amount] 会一直是 Infinity ——
 *   所以最后要多一步: Infinity → -1。
 *
 *   ★ 这也是"初始值要用 Infinity 而不是 -1"的另一个理由 ★
 *     用 Infinity: 最后判一下就行，干净。
 *     用 -1: dp[i - coin] + 1 会算出 0，
 *            你要么得额外判断 dp[i-coin] 是不是 -1，要么直接把
 *            无解状态当成了"0 枚硬币"，全乱。
 *
 * 易错点:
 *   1. ★ 最后一定要判 Infinity 并返回 -1 ★（279 不需要，这题必须）
 *   2. ★ 内层要判断 coin <= i ★
 *      coins[i] 最大可以到 2^31 - 1，远大于 amount。
 *      不判断的话 dp[i - coin] 下标为负，拿到 undefined
 *   3. dp[0] = 0、其余 Infinity —— 和 279 一样，别写成 fill(0)
 *   4. amount = 0 时天然返回 0（循环不跑，dp[0] 就是 0），不用特判
 *
 * 复杂度: 时间 O(amount × coins.length)，空间 O(amount)
 *
 * ── 另一条路: 标准完全背包模板（见 coinChangeKnapsack） ──
 *   外层遍历硬币、内层金额【正序】。和 279 里的写法一一对应。
 *
 * ── 还有一条路: BFS ──
 *   把 0..amount 看成图的节点，i 能一步走到 i + coin，
 *   求 0 到 amount 的最短路，层数就是硬币数。
 *   和 DP 本质相同，只是换个框架。
 */

/**
 * coinChange
 * 直接按 dp 定义推
 * 输入: coins = [1,2,5], amount = 11
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
const coinChange = function (coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin > i) continue; // ★ 面额比金额还大，跳过（否则下标为负）

      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  // ★ 还是 Infinity 说明凑不出来
  return dp[amount] === Infinity ? -1 : dp[amount];
};

/**
 * coinChangeKnapsack
 * 标准完全背包模板: 外层"物品"(硬币)，内层"容量"(金额)【正序】
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
const coinChangeKnapsack = function (coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  // 外层: 遍历每一种硬币
  for (const coin of coins) {
    // 内层: 金额【正序】→ 允许同一枚硬币被重复使用（完全背包的特征）
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};

// ─── 测试 ───────────────────────────────────────────
// console.log(coinChange([1, 2, 5], 11)); // 期望: 3     ← 示例 1
// console.log(coinChange([2], 3));        // 期望: -1    ← 示例 2，凑不出来
// console.log(coinChange([1], 0));        // 期望: 0     ← 示例 3，金额为 0
// console.log(coinChange([1], 5));        // 期望: 5
// console.log(coinChange([5], 5));        // 期望: 1
// console.log(coinChange([5], 3));        // 期望: -1    ← 面额比金额大
// console.log(coinChange([2, 4], 7));     // 期望: -1    ← 全是偶数，凑不出奇数
// console.log(coinChange([186, 419, 83, 408], 6249)); // 经典用例, 期望: 20
// console.log(coinChangeKnapsack([1, 2, 5], 11)); // 期望: 3
//
// 参照实现(从 0 到 amount 做 BFS 求最短路, 思路不同):
// const refBFS = (coins, amount) => {
//   const visited = new Array(amount + 1).fill(false);
//   visited[0] = true;
//   let level = [0], steps = 0;
//   while (level.length > 0) {
//     steps++;
//     const next = [];
//     for (const cur of level) {
//       for (const coin of coins) {
//         const sum = cur + coin;
//         if (sum === amount) return steps;
//         if (sum < amount && !visited[sum]) { visited[sum] = true; next.push(sum); }
//       }
//     }
//     level = next;
//   }
//   return amount === 0 ? 0 : -1;
// };
//
// 两条漂亮的上下界(有解时一定成立):
//   上界: 最少枚数 <= floor(amount / 最小面额)   —— 全用最小面额
//   下界: 最少枚数 >= ceil(amount / 最大面额)    —— 全都用最大面额也不够
// 这两条能抓到"答案偏大/偏小"这类错误。
