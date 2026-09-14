/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 118. 杨辉三角 (Pascal's Triangle)
 * 难度: 简单 | 标签: 数组、动态规划
 * 链接: https://leetcode.cn/problems/pascals-triangle/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个非负整数 `numRows`，生成「杨辉三角」的前 `numRows` 行。
 *
 * 在「杨辉三角」中，每个数是它左上方和右上方的数的和。
 *
 * [图片]
 *
 * 示例 1:
 *
 *   输入: numRows = 5
 *   输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
 *
 * 示例 2:
 *
 *   输入: numRows = 1
 *   输出: [[1]]
 *
 * 提示:
 *   - `1 <= numRows <= 30`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 动态规划 —— 每个数是"左上方 + 右上方"
 *
 * ★ 套用 DP 的四步模板 ★
 *
 *   1. 状态: dp[i][j] = 第 i 行第 j 列的那个数
 *   2. 转移: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
 *            也就是"左上方 + 右上方"（题目原话）
 *   3. 初始: 每一行的【第一个】和【最后一个】都是 1
 *   4. 返回: 整个三角形
 *
 *      1
 *      1 1
 *      1 2 1          2 = 1 + 1   （左上 + 右上）
 *      1 3 3 1        3 = 1 + 2   （左上 + 右上）
 *      1 4 6 4 1      6 = 3 + 3   （左上 + 右上）
 *
 * 实现上有个小细节: 每行的首尾已经单独填好 1 了，所以内层循环
 * 只需要处理【中间】那些位置（j 从 1 到 i-1）。
 *
 * 易错点:
 *   1. ★ 内层循环是 j 从 1 到【i-1】，不是 i ★
 *      因为 row[i] 已经单独填成 1 了。
 *      写成 j <= i 会去访问 res[i-1][i]，拿到 undefined
 *   2. ★ 每行首尾必须显式填 1 ★
 *      忘了的话，中间那些数的计算就缺了边界
 *   3. 转移用的两个数是 【res[i-1][j-1]】和【res[i-1][j]】——
 *      别写反成 [j] 和 [j+1]，那是把"左上 + 右上"的方向搞混了
 *
 * 复杂度: 时间 O(numRows²)（一共约 numRows²/2 个格子，每个算一次），
 *         空间 O(1)（不计返回的三角本身）
 *
 * ── 另一条路: 只用一个数组滚动（见 generateRolling） ──
 *   第 i 行可以由第 i-1 行【原地】推出来，不需要存整个三角。
 *   关键技巧: 【从后往前】更新 —— 这样用到的"上一行"的值还没被覆盖。
 *   （顺带又是一次"必须拷贝"的提醒，和 046/078 那个坑同源）
 *
 * ── 还能换个数学视角: 组合数 ──
 *   杨辉三角第 i 行第 j 列 = C(i, j)（二项式系数）。
 *   而 C(i, j) = C(i, j-1) × (i - j + 1) / j，
 *   于是每行【只靠自己就能从左往右推出来】，完全不用看上一行:
 *
 *     row[0] = 1;
 *     for (let j = 1; j <= i; j++) row[j] = row[j-1] * (i - j + 1) / j;
 *
 *   这是"杨辉三角"的另一重身份，有兴趣可以试试。
 */

/**
 * generate
 * 标准 DP: 每一行由上一行推出来
 * 输入: numRows = 5
 * @param {number} numRows
 * @return {number[][]}
 */
const generate = function (numRows) {
  const res = [];

  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1);

    // ★ 首尾都是 1，先填好
    row[0] = 1;
    row[i] = 1;

    // 中间那些 = 左上 + 右上
    for (let j = 1; j < i; j++) {
      //                              ↑ 是 < i，不是 <= i
      row[j] = res[i - 1][j - 1] + res[i - 1][j];
    }

    res.push(row);
  }

  return res;
};

/**
 * generateRolling
 * 单数组滚动: 第 i 行在第 i-1 行上原地推出来
 * @param {number} numRows
 * @return {number[][]}
 */
const generateRolling = function (numRows) {
  const res = [];
  const row = []; // 全程复用这一个数组

  for (let i = 0; i < numRows; i++) {
    row.push(1); // 每行末尾先补个 1

    // ★ 从后往前更新 —— 这样 row[j-1] 还是"上一行"的值，没被覆盖
    for (let j = i - 1; j > 0; j--) {
      row[j] = row[j - 1] + row[j];
    }

    res.push(row.slice()); // ★ 必须拷贝，否则存进去的全是同一个数组的引用
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(generate(5)); // 期望: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
// console.log(generate(1)); // 期望: [[1]]
// console.log(generateRolling(5)); // 期望: 同上
//
// 杨辉三角有几条很漂亮的性质, 拿来验证最合适:
//   ① 行数 === numRows, 第 i 行长度 === i+1
//   ② 每行首尾都是 1
//   ③ 每个数 = 左上 + 右上（题目的定义）
//   ④ 每行之和 === 2^i
//   ⑤ 每行左右对称: row[j] === row[i-j]
//   ⑥ 第 i 行第 j 列 === 组合数 C(i, j)
//
// const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
//
// const check = (t, numRows) => {
//   const lenOk = t.length === numRows && t.every((r, i) => r.length === i + 1);
//   const edgeOk = t.every((r, i) => r[0] === 1 && r[i] === 1);
//   const cornerOk = t.every((r, i) => i < 2 || r.every((v, j) =>
//     j === 0 || j === i || v === t[i-1][j-1] + t[i-1][j]));
//   const sumOk = t.every((r, i) => r.reduce((a, b) => a + b, 0) === Math.pow(2, i));
//   const symOk = t.every((r, i) => r.every((v, j) => v === r[i - j]));
//   const combOk = t.every((r, i) => r.every((v, j) => v === C(i, j)));
//   return { lenOk, edgeOk, cornerOk, sumOk, symOk, combOk };
// };
