/**
 * LeetCode 热题 100 —— 贪心算法
 *
 * 45. 跳跃游戏 II (Jump Game II)
 * 难度: 中等 | 标签: 贪心、数组、动态规划
 * 链接: https://leetcode.cn/problems/jump-game-ii/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个长度为 `n` 的 0 索引整数数组 `nums`。初始位置在下标 0。
 *
 * 每个元素 `nums[i]` 表示从索引 `i` 向后跳转的最大长度。换句话说，如果你在索引 `i` 处，你可以跳转到任意 `(i + j)` 处：
 *   - `0 <= j <= nums[i]` 且
 *   - `i + j < n`
 *
 * 返回到达 `n - 1` 的最小跳跃次数。测试用例保证可以到达 `n - 1`。
 *
 * 示例 1:
 *
 *   输入: nums = [2,3,1,1,4]
 *   输出: 2
 *   解释: 跳到最后一个位置的最小跳跃数是 2。
 *   从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
 *
 * 示例 2:
 *
 *   输入: nums = [2,3,0,1,4]
 *   输出: 2
 *
 * 提示:
 *   - `1 <= nums.length <= 10^4`
 *   - `0 <= nums[i] <= 1000`
 *   - 题目保证可以到达 `n - 1`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 贪心 —— 把数组"分层"，终点在第几层就是跳几步
 *
 * ★ 关键转念: 在 055 的 reach 之上再加一层"层边界"★
 *
 *   055 只问"能不能到"，维护一个 reach 就够了。
 *   这题问"最少几步"，那就得知道【每一步能把覆盖范围推进到哪一层】。
 *
 *   把整个过程想成一层一层往外扩:
 *     第 0 层: 只有起点 {0}
 *     第 1 层: 从起点跳一步能到的所有位置
 *     第 2 层: 从第 1 层任意位置跳一步能到的所有位置
 *     ……
 *   终点落在第几层，答案就是几步。
 *   （这其实就是从起点做 BFS，只不过每一层都是连续的一段区间，
 *     所以不需要队列，两个变量就能表示。）
 *
 *   维护两个变量:
 *     end      = 【当前层】的右边界（这一层最远能到哪）
 *     farthest = 【下一层】的右边界（扫当前层时见过的最大 i + nums[i]）
 *
 *   遍历 i:
 *     farthest = max(farthest, i + nums[i])   ← 用当前层的位置去撑大下一层
 *     一旦 i === end，说明当前层扫完了 —— 必须迈出一步才能进下一层:
 *       steps++
 *       end = farthest
 *
 * 拿 [2,3,1,1,4] 走一遍:
 *
 *   i   nums[i]   farthest   end    steps    说明
 *   ─────────────────────────────────────────────────────────────
 *   0   2         2          0      0
 *                         → i === end，迈一步: steps=1, end=2
 *   1   3         4          2      1        （1+3=4，下一层能够到终点）
 *   2   1         4          2      1
 *                         → i === end，迈一步: steps=2, end=4 ≥ 4，收工
 *   → 2 步 ✓
 *
 * 易错点:
 *   1. ★ 循环上界是 i < n - 1，【不是】i < n ★
 *      走到最后一位就不需要再跳了。写成 i < n 的话，
 *      n = 1 的输入会返回 1（正确答案是 0）
 *   2. ★ steps++ 发生在【i === end】那一刻 ★
 *      也就是"当前层走完、必须迈步"的时候，不是在更新 farthest 的时候
 *   3. 题目保证一定能到达，所以不用处理"到不了"的分支
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 *
 * ── 另一条路: 动态规划（见 jumpDP） ──
 *   dp[i] = 到达位置 i 的最少步数，从每个 i 向后松弛它能跳到的所有位置。
 *   思路最直白，但复杂度 O(n × max(nums))，比贪心慢一个量级。
 */

/**
 * jump
 * 贪心分层
 * 输入: nums = [2,3,1,1,4]
 * @param {number[]} nums
 * @return {number}
 */
const jump = function (nums) {
  const n = nums.length;
  let end = 0; // 当前这一层的右边界
  let farthest = 0; // 下一层的右边界
  let steps = 0;

  for (let i = 0; i < n - 1; i++) {
    // ★ 是 n-1
    farthest = Math.max(farthest, i + nums[i]);

    if (i === end) {
      // 当前层扫完了 → 必须迈出一步
      steps++;
      end = farthest; // 进入下一层
      if (end >= n - 1) break; // 已经够到终点
    }
  }

  return steps;
};

/**
 * jumpDP
 * 动态规划: dp[i] = 到达 i 的最少步数
 * @param {number[]} nums
 * @return {number}
 */
const jumpDP = function (nums) {
  const n = nums.length;
  const dp = new Array(n).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    for (let step = 1; step <= nums[i] && i + step < n; step++) {
      const j = i + step;
      dp[j] = Math.min(dp[j], dp[i] + 1);
    }
  }

  return dp[n - 1];
};

// ─── 测试 ───────────────────────────────────────────
// console.log(jump([2, 3, 1, 1, 4])); // 期望: 2
// console.log(jump([2, 3, 0, 1, 4])); // 期望: 2   ← 示例 2
// console.log(jump([0]));             // 期望: 0   ← 起步就是终点
// console.log(jump([1, 1]));          // 期望: 1
// console.log(jump([5, 0, 0, 0, 0, 0])); // 期望: 1
// console.log(jump([1, 1, 1, 1]));    // 期望: 3   ← 每次只能挪一格
// console.log(jump([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])); // 期望: 1
// console.log(jumpDP([2, 3, 1, 1, 4])); // 期望: 2
//
// 参照实现(从起点做 BFS 求最短距离 —— "最少步数"的字面定义,
// 和贪心是同一个"分层"思想, 但实现完全不同, 可以互相印证):
// const refBFS = (nums) => {
//   const n = nums.length;
//   const dist = new Array(n).fill(-1);
//   dist[0] = 0;
//   const queue = [0];
//   let head = 0;
//   while (head < queue.length) {
//     const i = queue[head++];
//     for (let j = i + 1; j <= i + nums[i] && j < n; j++) {
//       if (dist[j] === -1) {          // 第一次到达就是最短
//         dist[j] = dist[i] + 1;
//         queue.push(j);
//       }
//     }
//   }
//   return dist[n - 1];                // 题目保证能到达
// };
//
// 顺便看看循环上界写成 i < n 会怎样:
// n = 1 时（[0] 或 [1]）会返回 1，正确答案是 0 —— 已经在终点了，一步都不用跳
