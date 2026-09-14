/**
 * LeetCode 热题 100 —— 多维动态规划
 *
 * 1143. 最长公共子序列 (Longest Common Subsequence)
 * 难度: 中等 | 标签: 字符串、动态规划、最长公共子序列
 * 链接: https://leetcode.cn/problems/longest-common-subsequence/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 `0` 。
 *
 * 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 *   - 例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列。
 *
 * 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
 *
 * 示例 1：
 *
 *   输入：text1 = "abcde", text2 = "ace"
 *   输出：3
 *   解释：最长公共子序列是 "ace" ，它的长度为 3 。
 *
 * 示例 2：
 *
 *   输入：text1 = "abc", text2 = "abc"
 *   输出：3
 *   解释：最长公共子序列是 "abc" ，它的长度为 3 。
 *
 * 示例 3：
 *
 *   输入：text1 = "abc", text2 = "def"
 *   输出：0
 *   解释：两个字符串没有公共子序列，返回 0 。
 *
 * 提示：
 *   - `1 <= text1.length, text2.length <= 1000`
 *   - `text1` 和 `text2` 仅由小写英文字符组成。
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 双串 DP —— 状态是"两个串各取一个前缀"
 *
 * ★ 先分清"子序列"和"子串" ★
 *   子串:   必须连续。"abcde" 的子串有 "abc"、"bcd"，但没有 "ace"
 *   子序列: 可以不连续，只要相对顺序不变。"ace" 是 "abcde" 的子序列
 *   —— 这题是【子序列】。所以思路和 005 最长回文子串（那个是子串，用区间 DP）
 *      完全不同，别混。子序列不需要"区间"这个概念，只需要"前缀"。
 *
 * ★ 状态定义 ★
 *
 *   dp[i][j] = text1 的【前 i 个字符】和 text2 的【前 j 个字符】的最长公共子序列长度
 *
 *   ★ 注意 i、j 是"长度"而不是"下标" ★ 这是这题最容易搞混的地方。
 *     比较字符时要用 text1[i - 1] 和 text2[j - 1]，那个 -1 千万不能漏。
 *     （i 表示"前 i 个"，那第 i 个字符就是下标 i-1。）
 *
 * ★ 表为什么是 (m+1) × (n+1) ★
 *
 *   多出来的第 0 行、第 0 列表示【空串】。空串和任何字符串的 LCS 都是 0。
 *   有了这一圈哨兵，边界情况就不用写特判了 —— 这和第 005 题（用 n×n 的
 *   区间端点做下标）是两种完全不同的下标风格，注意区分:
 *     005 的下标是【区间的两个端点】(i <= j 才有效)
 *     1143 的下标是【前缀的长度】(0 到 m / 0 到 n 全都有效)
 *
 * ★ 转移方程 ★
 *
 *   盯着两个串各自的最后一个字符 text1[i-1] 和 text2[j-1]:
 *
 *   1) 两者相等 → 这个字符一定可以放进 LCS 的末尾，于是:
 *          dp[i][j] = dp[i-1][j-1] + 1
 *      ★ 这里不用取 max ★ 因为 dp[i-1][j-1] + 1 必然 >= dp[i-1][j] 和 dp[i][j-1]。
 *        证明: dp[i-1][j] <= dp[i-1][j-1] + 1
 *              （text2 那边只多了一个字符，LCS 最多也就长 1）
 *              同理 dp[i][j-1] <= dp[i-1][j-1] + 1。
 *
 *   2) 两者不相等 → 这两个字符【至少有一个不在】LCS 里，那就各扔掉一个试试:
 *          dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 *                     ↑扔掉 text1 的最后一个      ↑扔掉 text2 的最后一个
 *      ★ 是"或"不是"且" ★ 不需要两个都扔，挑效果好的那个扔就行。
 *
 * ★ 初始条件 ★  第 0 行和第 0 列全是 0（对应空串）
 * ★ 返回什么 ★  dp[m][n]
 *
 * 拿示例 1  [text1 = "abcde", text2 = "ace"] 把整张表填出来:
 *
 *          ""    a    c    e        ← text2 的前 j 个
 *    ""     0    0    0    0
 *    a      0    1    1    1
 *    b      0    1    1    1
 *    c      0    1    2    2        ← 'c'='c' → dp[1][1]+1 = 2
 *    d      0    1    2    2
 *    e      0    1    2    3        ← 'e'='e' → dp[3][1]+1 = 3
 *    ↑
 *  text1 的前 i 个
 *
 *   → dp[5][3] = 3 ✓  对应子序列 "ace"
 *
 *   横着看每一行: dp 值是单调不减的（前缀越长，LCS 只会更长或不变），
 *   所以右下角一定是全表最大值 —— 这点和第 005 题不一样（那题要一路记 best）。
 *
 * ───────────────────────────────────────────
 * 空间压缩: 二维 → 一维
 * ───────────────────────────────────────────
 *
 *   dp[i][*] 只依赖 dp[i-1][*]（上一行），所以能压成一行。
 *   ★ 但这题有个坑 ★
 *     相等的情况要用 dp[i-1][j-1]（左上角），而在一维数组里，
 *     这个位置就是【上一轮的 dp[j-1]】—— 它已经被本轮更新成新值了！
 *     所以必须用一个临时变量把"左上角的旧值"提前存下来（代码里的 prev）。
 *
 *     这是 LCS 一维压缩最经典的一个坑，比 064 最小路径和难一档 ——
 *     064 只用到"上面 + 左边"，都在数组里能直接读；这题要读的是"斜上方"。
 *
 * ───────────────────────────────────────────
 * 附赠: 把具体的 LCS 字符串还原出来
 * ───────────────────────────────────────────
 *
 *   题目只要长度，但面试常接着问"那把最长公共子序列打印出来"。
 *   做法: 填完表后从右下角【往回走】——
 *     - 如果 text1[i-1] === text2[j-1]: 这个字符属于答案，收下，往左上走
 *     - 否则哪边大往哪边走（对应转移方程里丢掉的那个字符）
 *   收集时是倒着收的，最后记得 reverse()。
 *   见下方的 lcsString()。
 *
 * 易错点:
 *   1. ★ dp[i][j] 的 i、j 是"长度"，比较时要用 text1[i-1]、text2[j-1] ★
 *   2. ★ 表要开 (m+1) × (n+1)，第 0 行/列是给空串的哨兵 ★
 *   3. ★ 子序列可以不连续 ★ 别当成子串去做
 *   4. 相等时直接 dp[i-1][j-1] + 1，不用再和 dp[i-1][j]、dp[i][j-1] 比（有证明）
 *   5. 一维压缩时左上角必须用临时变量存，否则读到的是本轮已经更新过的新值
 *
 * 复杂度:
 *   二维 DP  —— 时间 O(m*n)，空间 O(m*n)   ← 本文件主解法
 *   一维 DP  —— 时间 O(m*n)，空间 O(n)
 */

/**
 * longestCommonSubsequence
 * 二维 DP: dp[i][j] = text1 前 i 个字符 与 text2 前 j 个字符 的 LCS 长度
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
const longestCommonSubsequence = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;

  // ★ 开 (m+1) × (n+1)，第 0 行/第 0 列全是 0，专门代表"空串"
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // ★ 注意 -1: dp 的下标是"前缀长度"，第 i 个字符的下标是 i-1
      if (text1[i - 1] === text2[j - 1]) {
        // 最后一个字符能配上，直接接到左上角的答案后面（不用取 max，见上方证明）
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // 配不上 → 这个字符至少有一个不在 LCS 里，两边各扔一个试试，取更优的
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
};

/**
 * longestCommonSubsequence1D
 * 一维 DP: 滚动数组，空间 O(n)
 * ★ 关键是那个 prev 变量 —— 它负责保管"左上角"的值 ★
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
const longestCommonSubsequence1D = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;

  // dp[j] 表示"当前这一行第 j 列"的值，初始对应第 0 行（全 0，空串）
  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    // prev 保存"上一行的 dp[j-1]"，也就是左上角。每轮开头对应 dp[i-1][0] = 0
    let prev = 0;

    for (let j = 1; j <= n; j++) {
      // ★ 先把这一格【更新前的旧值】(= dp[i-1][j]) 存起来，
      //   因为它就是下一列 j+1 需要的"左上角"
      const oldAbove = dp[j];

      if (text1[i - 1] === text2[j - 1]) {
        dp[j] = prev + 1; // prev 就是 dp[i-1][j-1]
      } else {
        dp[j] = Math.max(dp[j], dp[j - 1]); // dp[j]还是旧值(上面)，dp[j-1]已是新值(左边)
      }

      prev = oldAbove; // 交给下一列当左上角用
    }
  }

  return dp[n];
};

/**
 * longestCommonSubsequenceMemo
 * 记忆化搜索: 从"两个指针"的角度想，是同一个递推式的正面写法
 *   dfs(i, j) = text1[i..] 和 text2[j..] 的 LCS
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
const longestCommonSubsequenceMemo = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const memo = new Map();

  const dfs = (i, j) => {
    if (i === m || j === n) return 0; // 有一个串走到头了，没得配了

    const key = i * (n + 1) + j;
    if (memo.has(key)) return memo.get(key);

    let res;
    if (text1[i] === text2[j]) {
      res = 1 + dfs(i + 1, j + 1); // 这对字符能用，收下
    } else {
      res = Math.max(dfs(i + 1, j), dfs(i, j + 1)); // 扔掉其中一个
    }

    memo.set(key, res);
    return res;
  };

  return dfs(0, 0);
};

/**
 * lcsString
 * 附赠: 还原出具体的 LCS 字符串（不只是长度）
 * 填完表后从右下角往回走，把属于答案的字符收集起来
 * @param {string} text1
 * @param {string} text2
 * @return {string}
 */
const lcsString = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;

  // 先照常填表（这里内联一份，免得依赖上面函数的内部结构）
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        text1[i - 1] === text2[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // 从右下角往回走
  const chars = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      chars.push(text1[i - 1]); // 这个字符属于答案
      i--; // 往左上角走
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--; // 上面那格不更差 → 扔掉 text1[i-1]
    } else {
      j--; // 左边那格更好 → 扔掉 text2[j-1]
    }
  }

  // ★ 是倒着收集的，要翻回来 ★
  return chars.reverse().join('');
};

/**
 * lcsBrute
 * 参照实现: 枚举 text1 的所有子序列（2^m 个），挑出也是 text2 子序列的最长那个
 * 指数级，只用来对小串对答案
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
const lcsBrute = function (text1, text2) {
  // 判断 sub 是不是 t 的子序列（双指针扫一遍即可）
  const isSubsequence = (sub, t) => {
    let k = 0;
    for (const ch of t) {
      if (k < sub.length && ch === sub[k]) k++;
    }
    return k === sub.length;
  };

  const m = text1.length;
  const total = 2 ** m;
  let best = 0;

  for (let mask = 0; mask < total; mask++) {
    // 用二进制位表示"选/不选第 i 个字符"，拼出这个子序列
    const bits = mask.toString(2).padStart(m, '0');
    let sub = '';
    for (let i = 0; i < m; i++) {
      if (bits[i] === '1') sub += text1[i];
    }

    if (sub.length > best && isSubsequence(sub, text2)) best = sub.length;
  }

  return best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(longestCommonSubsequence('abcde', 'ace')); // 期望: 3   示例 1
// console.log(longestCommonSubsequence('abc', 'abc')); // 期望: 3   示例 2
// console.log(longestCommonSubsequence('abc', 'def')); // 期望: 0   示例 3
// console.log(longestCommonSubsequence('a', 'a')); // 期望: 1
// console.log(longestCommonSubsequence('a', 'b')); // 期望: 0
// console.log(longestCommonSubsequence('bl', 'yby')); // 期望: 1
// console.log(longestCommonSubsequence('abcba', 'abcbcba')); // 期望: 5
// console.log(longestCommonSubsequence('bsbininm', 'jmjkbkjkv')); // 期望: 1
//
// 四种写法互相印证:
// const check = (a, b) => [
//   longestCommonSubsequence(a, b),
//   longestCommonSubsequence1D(a, b),
//   longestCommonSubsequenceMemo(a, b)
// ];
// console.log(check('abcde', 'ace'));  // [3, 3, 3]
// console.log(check('abc', 'def'));    // [0, 0, 0]
//
// ★ 还原具体子序列 ★
// console.log(lcsString('abcde', 'ace')); // 'ace'
// console.log(lcsString('abc', 'abc')); // 'abc'
// console.log(lcsString('abc', 'def')); // ''
//
// 暴力版只适合很短的串（2^m 爆炸）:
// console.log(lcsBrute('abcba', 'abcbcba')); // 5
