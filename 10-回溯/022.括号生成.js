/**
 * LeetCode 热题 100 —— 回溯
 *
 * 22. 括号生成 (Generate Parentheses)
 * 难度: 中等 | 标签: 字符串、动态规划、回溯、括号序列
 * 链接: https://leetcode.cn/problems/generate-parentheses/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
 *
 * 示例 1：
 *
 *   输入：n = 3
 *   输出：["((()))","(()())","(())()","()(())","()()()"]
 *
 * 示例 2：
 *
 *   输入：n = 1
 *   输出：["()"]
 *
 * 提示：
 *   - `1 <= n <= 8`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 回溯 + 剪枝（边生成边保证合法）
 *
 * ★ 关键转念: 不要"先生成再验证"，要"边生成边剪枝" ★
 *
 *   朴素做法是生成全部 2^(2n) 个括号串，再逐个验证合法性 ——
 *   n = 8 时是 6 万多个串，绝大多数在第一个字符就废了。
 *
 *   聪明的做法: 在决策树上，只要前缀已经不合法就【直接砍掉】
 *   整条分支。什么样的前缀一定不合法？只有两条规则:
 *
 *     ① 左括号还没用完（open < n）      → 可以放 '('
 *     ② 右括号比左括号少（close < open）→ 可以放 ')'
 *
 *   ★ 规则 ② 是这题的灵魂 ★
 *   它保证"任意前缀里，左括号数 ≥ 右括号数"—— 这正是括号序列
 *   合法的充要条件。所以一旦某条分支违反它，这条分支再往下
 *   也长不出合法串，直接剪掉，一个节点都不用展开。
 *
 * n = 2 的决策树（打叉的是被剪掉的分支）:
 *
 *                        ""
 *                 ┌───────┴───────┐
 *                "("               ✗   第 1 位不能是 ')'
 *           ┌─────┴─────┐
 *         "(("         "()"
 *           │            │
 *        "(()"        "()("
 *           │            │
 *       "(())"        "()()"            ← 叶子，两个都是答案
 *
 *   结果 ["(())", "()()"] —— 一个不多一个不少。
 *
 * ★ 和 046 / 078 的一个小差别 ★
 *   框架里的 "for 选择 in 选择列表" 不一定非得遍历数组。
 *   这里每一层的"选择列表"最多只有 2 项（放左括号 / 放右括号），
 *   所以 for 就退化成了两个 if。
 *
 * 易错点:
 *   1. ★ 右括号的条件是 close < open，【不是 close < n】★
 *      写成 close < n 会生成 "())(" 这种非法串 —— 右括号比左括号
 *      多的那一刻，前缀就已经废了
 *   2. 终止条件是 path.length === 2 * n（也就是 open、close 都到 n），
 *      不是只看某一个计数
 *   3. push 完记得 pop（老规矩）
 *
 * 复杂度: 时间 O(C_n * n)，其中 C_n 是卡特兰数 C(2n, n) / (n+1)
 *         （每个答案要 O(n) 的时间 join 出来）；
 *         空间 O(n) 递归栈，不含结果本身
 *         —— 答案总数正好是卡特兰数: n=3 是 5，n=8 是 1430
 *
 * ── 另一条路: 动态规划（见 generateParenthesisDP） ──
 *   完全不用回溯，直接按卡特兰递推式【构造】:
 *     一个合法的 n 对括号串，一定可以拆成
 *       "(" + 【某个 i 对括号的合法串】+ ")" + 【某个 n-1-i 对括号的合法串】
 *   让 i 从 0 枚举到 n-1，两段的所有组合拼起来就是全部答案。
 */

/**
 * generateParenthesis
 * 回溯 + 剪枝
 * 输入: n = 3
 * @param {number} n
 * @return {string[]}
 */
const generateParenthesis = function (n) {
  const res = [];
  const path = []; // 当前正在拼的这个括号串（用数组存，最后 join）

  const backtrack = (open, close) => {
    // 用满了 2n 个括号，凑齐一个合法串
    if (path.length === 2 * n) {
      res.push(path.join(''));
      return;
    }

    // 选择一: 放左括号（左括号还没用完）
    if (open < n) {
      path.push('(');
      backtrack(open + 1, close);
      path.pop();
    }

    // 选择二: 放右括号（右括号比左括号少，放下去前缀才仍然合法）
    if (close < open) {
      //     ↑ ★ 这里是 close < open，不是 close < n ★
      path.push(')');
      backtrack(open, close + 1);
      path.pop();
    }
  };

  backtrack(0, 0);
  return res;
};

/**
 * generateParenthesisDP
 * 动态规划: 按卡特兰递推式直接构造，不回溯
 * @param {number} n
 * @return {string[]}
 */
const generateParenthesisDP = function (n) {
  // dp[i] = 所有 i 对括号的合法串
  const dp = [['']];

  for (let i = 1; i <= n; i++) {
    const cur = [];

    // 拆成: "(" + 【j 对的内层】+ ")" + 【i-1-j 对的后缀】
    for (let j = 0; j < i; j++) {
      for (const inner of dp[j]) {
        for (const rest of dp[i - 1 - j]) {
          cur.push('(' + inner + ')' + rest);
        }
      }
    }

    dp.push(cur);
  }

  return dp[n];
};

// ─── 测试 ───────────────────────────────────────────
// console.log(generateParenthesis(3)); // 期望: 5 种合法括号组合(顺序不限)
// console.log(generateParenthesis(1)); // 期望: ["()"]
// console.log(generateParenthesis(2)); // 期望: 2 种
// console.log(generateParenthesisDP(3)); // 期望: 5 种
//
// 顺序不限,所以验证【性质】:
//   ① 个数 === 卡特兰数 C_n = C(2n,n)/(n+1)
//   ② 每个串长度都是 2n
//   ③ 每个串都合法(用栈扫一遍: 遇 '(' 进栈,遇 ')' 弹栈,中途不能空、末尾必须空)
//   ④ 互不重复
//
// 顺便看看把 close < open 写成 close < n 会错成什么样:
// const buggy = (n) => {
//   const res = [], path = [];
//   const bt = (open, close) => {
//     if (path.length === 2 * n) { res.push(path.join('')); return; }
//     if (open < n)  { path.push('('); bt(open + 1, close); path.pop(); }
//     if (close < n) { path.push(')'); bt(open, close + 1); path.pop(); }  // ← 错!
//   };
//   bt(0, 0);
//   return res;
// };
// console.log(buggy(2)); // 会出现 ")(" 这种非法串
