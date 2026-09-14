/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 139. 单词拆分 (Word Break)
 * 难度: 中等 | 标签: 字典树、记忆化、数组、哈希表、字符串、动态规划、Brute-Force Search
 * 链接: https://leetcode.cn/problems/word-break/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 `s` 则返回 `true`。
 *
 * 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
 *
 * 示例 1：
 *
 *   输入: s = "leetcode", wordDict = ["leet", "code"]
 *   输出: true
 *   解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
 *
 * 示例 2：
 *
 *   输入: s = "applepenapple", wordDict = ["apple", "pen"]
 *   输出: true
 *   解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
 *   注意，你可以重复使用字典中的单词。
 *
 * 示例 3：
 *
 *   输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
 *   输出: false
 *
 * 提示：
 *   - `1 <= s.length <= 300`
 *   - `1 <= wordDict.length <= 1000`
 *   - `1 <= wordDict[i].length <= 20`
 *   - `s` 和 `wordDict[i]` 仅由小写英文字母组成
 *   - `wordDict` 中的所有字符串 互不相同
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 动态规划 —— 能不能"切"出一串单词
 *
 * ★ 套用 DP 的四步模板 ★
 *
 *   1. 状态: dp[i] = s 的【前 i 个字符】(即 s[0..i-1]) 能不能被拼出来
 *   2. 转移: 枚举"【最后一个单词】"从哪里开始 ——
 *            若存在切分点 j (0 <= j < i) 同时满足:
 *              ① dp[j] 为 true         （前半截能拼出来）
 *              ② s[j..i-1] 在字典里     （后半截正好是个单词）
 *            则 dp[i] = true
 *   3. 初始: dp[0] = true —— 空串"一个单词都不用拼"就能拼出来
 *   4. 返回: dp[n]
 *
 * 拿 "leetcode" + ["leet", "code"] 走一遍:
 *
 *   dp[0]    = true                    （空串）
 *   dp[1..3] = false                   "l"/"le"/"lee" 都切不出单词
 *   dp[4]    = true                    dp[0]=true 且 "leet" 在字典里  ★
 *   dp[5..7] = false                   "c"/"co"/"cod" 都不是单词
 *   dp[8]    = true                    dp[4]=true 且 "code" 在字典里  ★
 *   → true ✓
 *
 * ★ dp[0] = true 是本题的种子值 ★
 *
 *   它表示"空串可以被拼出来（一个单词都不用）"。
 *   和 070 爬楼梯里 dp[0] = 1、078 子集里"空集也是一个子集"
 *   是同一类"空情形"的种子值 —— 少了它，第一条转移就无从谈起。
 *
 * ★ 为什么内层枚举的是【切分点 j】，而不是【字典里的单词】★
 *
 *   两种写法都对:
 *     枚举 j:      对每个切分点，看 s[j..i-1] 在不在字典里
 *     枚举单词 w:  看 s[i-w.length..i-1] 是否等于 w
 *   枚举 j 更直接（"切一刀试试"），也不依赖"单词长度有上限"这个条件。
 *   本文件用的是枚举 j。
 *
 * 易错点:
 *   1. ★ dp[0] = true ★（见上），写成 false 整个转移就废了
 *   2. ★ dp 数组长度是 n + 1，不是 n ★
 *      因为 dp[i] 表示"前 i 个字符"，i 要能取到 n
 *   3. ★ slice 是 s.slice(j, i)，左闭右开 ★
 *      别写成 s.slice(j, i + 1) 或 s.slice(j - 1, i)
 *   4. 一旦找到 true 就可以 break 剪枝，后面的切分点不用看了
 *   5. 别写不加记忆化的纯递归 —— 会超时
 *
 * 复杂度: 时间 O(n² × L)（n² 个 (j, i) 组合，每次 slice 是 O(L)，
 *         L 为单词长度上限 20），空间 O(n)
 *         n <= 300 时 n² × L ≈ 180 万，很快
 *
 * ── 另一条路: 记忆化递归（见 wordBreakMemo） ──
 *   同一个思路，但从【自顶向下】写: "从 start 开始，剩下的能拼出来吗？"
 *   加记忆化避免重复计算。和自底向上的 DP 完全等价，
 *   只是递推方向相反。
 */

/**
 * wordBreak
 * 自底向上 DP
 * 输入: s = "leetcode", wordDict = ["leet","code"]
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
const wordBreak = function (s, wordDict) {
  const n = s.length;
  const dict = new Set(wordDict); // 用 Set 让查找变成 O(1)
  const dp = new Array(n + 1).fill(false);

  dp[0] = true; // ★ 种子值: 空串可以被拼出来

  for (let i = 1; i <= n; i++) {
    // 枚举最后一个单词的起点 j
    for (let j = 0; j < i; j++) {
      // 前半截能拼出来，且后半截正好是个单词
      if (dp[j] && dict.has(s.slice(j, i))) {
        dp[i] = true;
        break; // 找到一个切法就够了
      }
    }
  }

  return dp[n];
};

/**
 * wordBreakMemo
 * 自顶向下 + 记忆化: "从 start 开始，剩下的能拼出来吗？"
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
const wordBreakMemo = function (s, wordDict) {
  const n = s.length;
  const dict = new Set(wordDict);
  const memo = new Map(); // start → 从 start 开始能不能拼出来

  const canBreak = (start) => {
    if (start === n) return true; // 走到末尾了 = 拼成功
    if (memo.has(start)) return memo.get(start); // ★ 查表，避免重复算

    for (let end = start + 1; end <= n; end++) {
      if (dict.has(s.slice(start, end)) && canBreak(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  };

  return canBreak(0);
};

// ─── 测试 ───────────────────────────────────────────
// console.log(wordBreak('leetcode', ['leet', 'code'])); // 期望: true   ← 示例 1
// console.log(wordBreak('applepenapple', ['apple', 'pen'])); // 期望: true ← 示例 2,单词可重复使用
// console.log(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])); // 期望: false ← 示例 3
// console.log(wordBreak('a', ['a']));          // 期望: true
// console.log(wordBreak('a', ['b']));          // 期望: false
// console.log(wordBreak('ab', ['a']));         // 期望: false
// console.log(wordBreak('aaaa', ['a', 'aa'])); // 期望: true
// console.log(wordBreak('goalspecial', ['go', 'goal', 'special'])); // 期望: true
// console.log(wordBreakMemo('leetcode', ['leet', 'code'])); // 期望: true
//
// 参照实现(不加记忆化的纯递归, 就是"枚举所有切分方式"的字面定义,
// 只适合短的 s):
// const refBrute = (s, wordDict) => {
//   const dict = new Set(wordDict);
//   const go = (start) => {
//     if (start === s.length) return true;
//     for (let end = start + 1; end <= s.length; end++) {
//       if (dict.has(s.slice(start, end)) && go(end)) return true;
//     }
//     return false;
//   };
//   return go(0);
// };
//
// 几条容易验证的性质:
//   ① s 本身就在字典里 → 一定 true
//   ② s 里出现了"字典中所有单词都没用到的字符" → 一定 false
//   ③ 字典里单词的最短长度为 Lmin 时, s.length 必须 >= Lmin 才可能 true
