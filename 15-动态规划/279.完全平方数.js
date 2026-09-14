/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 279. 完全平方数 (Perfect Squares)
 * 难度: 中等 | 标签: 广度优先搜索、数学、动态规划、背包问题、完全背包
 * 链接: https://leetcode.cn/problems/perfect-squares/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数 `n` ，返回 和为 `n` 的完全平方数的最少数量 。
 *
 * 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，`1`、`4`、`9` 和 `16` 都是完全平方数，而 `3` 和 `11` 不是。
 *
 * 示例 1：
 *
 *   输入：n = 12
 *   输出：3
 *   解释：12 = 4 + 4 + 4
 *
 * 示例 2：
 *
 *   输入：n = 13
 *   输出：2
 *   解释：13 = 4 + 9
 *
 * 提示：
 *   - `1 <= n <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 动态规划 —— 本质是【完全背包】问题
 *
 * ★ 套用 DP 的四步模板 ★
 *
 *   1. 状态: dp[i] = 凑出 i 需要的最少完全平方数个数
 *   2. 转移: 想一想"【最后一个】用掉的平方数是谁"，枚举它 ——
 *              dp[i] = min( dp[i - k*k] + 1 )    对每个满足 k*k <= i 的 k
 *            也就是"先把 i 减掉一个平方数，剩下的最优解 + 这 1 个"
 *   3. 初始: dp[0] = 0（凑出 0 需要 0 个）
 *            其余全部设成 Infinity，方便取 min
 *   4. 返回: dp[n]
 *
 * 拿 n = 12 走一遍:
 *   dp[0]  = 0
 *   dp[1]  = dp[0] + 1 = 1                           （1）
 *   dp[2]  = dp[1] + 1 = 2                           （1+1）
 *   dp[3]  = dp[2] + 1 = 3                           （1+1+1）
 *   dp[4]  = min(dp[3]+1, dp[0]+1) = 1               （4）★ 直接用 4 更划算
 *   dp[5]  = min(dp[4]+1, dp[1]+1) = 2               （4+1）
 *   …
 *   dp[12] = min(dp[11]+1, dp[8]+1, dp[3]+1) = 3     （4+4+4）
 *   → 3 ✓
 *
 * ★ 它和 198 打家劫舍的关键区别 ★
 *
 *   198: dp[i] 只依赖【前两个】状态 → 两个滚动变量就够了，O(1) 空间
 *   279: dp[i] 依赖【一大串】更小的状态（i-1, i-4, i-9, i-16 …）
 *        → 必须老老实实开数组，O(n) 空间
 *
 *   判断能不能用滚动变量，就看【转移方程里引用了前面多少个状态】。
 *
 * ★ 为什么它是【完全背包】问题 ★
 *
 *   换个说法: 有若干种"物品" —— 1、4、9、16、25……
 *     · 每种物品的重量 = 它的值
 *     · 每种物品可以用【无限次】
 *     · 背包容量 = n
 *     · 问: 装满背包最少需要几件物品？
 *
 *   "每种物品无限次可用" —— 这正是【完全背包】的定义。
 *
 * 易错点:
 *   1. ★ dp[0] = 0，其余初始化成 Infinity ★
 *      初始化成 0 的话，min 会把所有答案压成 0；
 *      求 min 的问题，未知状态就该是"正无穷"
 *   2. ★ 内层枚举的是【平方数】k*k，不是所有整数 k ★
 *   3. k 从 1 开始（k = 0 的话 k*k = 0，dp[i-0]+1 永远等于 dp[i]+1，白算）
 *
 * 复杂度: 时间 O(n × √n)，空间 O(n)
 *
 * ── 另一条路: 标准【完全背包模板】（见 numSquaresKnapsack） ──
 *   把循环顺序换成"外层物品、内层容量【正序】"——
 *   这是完全背包的通用写法，能直接套到 322 零钱兑换等题上。
 *
 * ── 还有两条路 ──
 *   BFS: 把 0..n 看成图的节点，i 能一步走到 i + k*k，求 0 到 n 的最短路。
 *        本质和 DP 一样（都是求"最少几步"），只是换个框架写。
 *   数学: 拉格朗日四平方和定理 —— 答案【只可能是 1、2、3、4】！
 *        可以用几个整除性质 O(√n) 直接判出 1/2/4 的情况，
 *        剩下的就是 3。面试里能提一句是加分项，但不用真写。
 */

/**
 * numSquares
 * 直接按 dp 定义推
 * 输入: n = 12
 * @param {number} n
 * @return {number}
 */
const numSquares = function (n) {
  const dp = new Array(n + 1).fill(Infinity); // ★ 求 min → 未知状态设正无穷
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    // 枚举"最后一个用掉的平方数"
    for (let k = 1; k * k <= i; k++) {
      dp[i] = Math.min(dp[i], dp[i - k * k] + 1);
    }
  }

  return dp[n];
};

/**
 * numSquaresKnapsack
 * 标准完全背包模板: 外层"物品"(平方数)，内层"容量"【正序】
 * @param {number} n
 * @return {number}
 */
const numSquaresKnapsack = function (n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  // 外层: 遍历每一种"物品"（每个完全平方数）
  for (let k = 1; k * k <= n; k++) {
    const sq = k * k;

    // 内层: 容量【正序】→ 允许同一件物品被重复使用（完全背包的特征）
    for (let i = sq; i <= n; i++) {
      dp[i] = Math.min(dp[i], dp[i - sq] + 1);
    }
  }

  return dp[n];
};

// ─── 测试 ───────────────────────────────────────────
// console.log(numSquares(12)); // 期望: 3     ← 12 = 4+4+4
// console.log(numSquares(13)); // 期望: 2     ← 13 = 4+9
// console.log(numSquares(1));  // 期望: 1
// console.log(numSquares(4));  // 期望: 1     ← 本身就是完全平方数
// console.log(numSquares(9));  // 期望: 1
// console.log(numSquares(3));  // 期望: 3     ← 1+1+1
// console.log(numSquares(7));  // 期望: 4     ← 4+1+1+1  ← 唯一必须用 4 个的情形之一
// console.log(numSquares(10000)); // n 的上限
// console.log(numSquaresKnapsack(12)); // 期望: 3
//
// 参照实现(从 0 到 n 做 BFS 求最短路, 思路不同):
// const refBFS = (n) => {
//   const squares = [];
//   for (let k = 1; k * k <= n; k++) squares.push(k * k);
//   const visited = new Array(n + 1).fill(false);
//   visited[0] = true;
//   let level = [0], steps = 0;
//   while (level.length > 0) {
//     steps++;
//     const next = [];
//     for (const cur of level) {
//       for (const sq of squares) {
//         const sum = cur + sq;
//         if (sum === n) return steps;
//         if (sum < n && !visited[sum]) { visited[sum] = true; next.push(sum); }
//       }
//     }
//     level = next;
//   }
//   return 0;
// };
//
// 两个漂亮的性质可以拿来兜底验证:
//   ① n 是完全平方数时, 答案一定是 1
//   ② 【拉格朗日四平方和定理】: 答案恒 ≤ 4 —— 绝不会出现 5
