/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 32. 最长有效括号 (Longest Valid Parentheses)
 * 难度: 困难 | 标签: 栈、字符串、动态规划、括号序列
 * 链接: https://leetcode.cn/problems/longest-valid-parentheses/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个只包含 `'('` 和 `')'` 的字符串，找出最长有效（格式正确且连续）括号 子串 的长度。
 *
 * 左右括号匹配，即每个左括号都有对应的右括号将其闭合的字符串是格式正确的，比如 `"(()())"`。
 *
 * 示例 1：
 *
 *   输入：s = "(()"
 *   输出：2
 *   解释：最长有效括号子串是 "()"
 *
 * 示例 2：
 *
 *   输入：s = ")()())"
 *   输出：4
 *   解释：最长有效括号子串是 "()()"
 *
 * 示例 3：
 *
 *   输入：s = ""
 *   输出：0
 *
 * 提示：
 *   - `0 <= s.length <= 3 * 10^4`
 *   - `s[i]` 为 `'('` 或 `')'`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 三种解法，建议按 DP → 栈 → 双向扫描 的顺序看
 *
 * ★ 难点在哪 ★
 *   括号匹配本身不难（一个计数器就够），难在题目要的是【子串】——
 *   必须连续，不能跳着挑。比如 ")()())" 里的 "()()" 是答案，
 *   但你不能把两头的括号删掉去凑更长的。
 *
 * ───────────────────────────────────────────
 * 解法一: 动态规划（本文件主解法）
 * ───────────────────────────────────────────
 *
 * ★ 状态定义（还是"以 i 结尾"这个老套路，和 152、300 一个模子）★
 *
 *   dp[i] = 以 s[i] 结尾 的最长有效括号子串长度
 *
 *   为什么限定"以 s[i] 结尾"？因为只有这样才能写出转移 ——
 *   和"以 i 结尾的最大乘积"是同一个思路: 把大问题切成"最后一步"。
 *
 * ★ 转移方程: 只看 s[i] 是什么 ★
 *
 *   1) s[i] === '('  →  dp[i] = 0
 *      任何有效括号子串都不可能以左括号结尾，直接出局。
 *
 *   2) s[i] === ')'  →  再看 s[i-1]，分两种情况:
 *
 *      ── 情况 A: s[i-1] === '(' （形如 "...()"）──
 *         这一对括号自己抱团，长度 2，再【接上这对括号左边的有效段】:
 *             dp[i] = dp[i-2] + 2
 *
 *         例: "()()" 在 i=3 时 —— s[2]='('，dp[1]=2（前面的 "()"）
 *             dp[3] = dp[1] + 2 = 4  ✓
 *
 *      ── 情况 B: s[i-1] === ')' （形如 "...))"）★ 难就难在这 ★
 *         前一个位置自己就是某段有效子串的结尾，先把它长度记作 L = dp[i-1]。
 *         这段有效子串占据的下标区间是 【i-L ... i-1】。
 *         那么紧挨在它左边的那一个字符就是:
 *             pairAt = i - L - 1
 *         如果 s[pairAt] === '('，它正好能和 s[i] 配成一对，
 *         于是把 "左边那段" + "新配的一对" + "再往左可能还有的一段" 全部接起来:
 *
 *             dp[i] = L + 2 + dp[pairAt - 1]
 *                            ↑ 配对那对括号的左边如果也是有效段，别忘了接上
 *
 *         例: "()(())"，看 i=5:
 *
 *           下标:  0  1  2  3  4  5
 *           字符:  (  )  (  (  )  )
 *                  └──┘     └──┘  ↑ i=5, s[5]=')' 且 s[4]=')' → 情况 B
 *                  dp[1]=2  dp[4]=2
 *
 *           L      = dp[4] = 2        那段有效子串是下标 [3,4]
 *           pairAt = 5 - 2 - 1 = 2    s[2] = '('  ✓ 配对成功
 *           dp[5]  = 2 + 2 + dp[1] = 6      （dp[1]=2 是开头那个 "()"）
 *           → 6 ✓  "()(())" 整个都是有效的
 *
 * ★ 返回什么 ★
 *   答案是所有 dp[i] 里的最大值，【不是 dp[n-1]】——
 *   最长有效子串不一定在末尾结束。
 *
 * ───────────────────────────────────────────
 * 解法二: 栈 —— 存"还没被匹配掉的下标"
 * ───────────────────────────────────────────
 *
 *   把下标压栈，遇到 '(' 压进去，遇到 ')' 就弹出一个来配对。
 *   栈里剩下的、还没被配掉的下标，就是一道道【分割线】——
 *   两个分割线之间的距离，就是一段有效括号的长度。
 *
 *   ★ 技巧: 栈底先垫一个 -1 当"起算基准" ★
 *   这样第一段有效括号的长度就是 i - (-1) = i + 1，不用特判。
 *   同理，如果遇到 ')' 时栈弹空了，说明这个 ')' 是个"落单的右括号"，
 *   把它自己压进去当新的分割线。
 *
 *   拿 ")()())" 走一遍（栈从底到顶）:
 *     i=0 ')' → 弹出 -1 后栈空 → 压入 0       栈: [0]       （0 是分割线）
 *     i=1 '(' → 压入 1                        栈: [0,1]
 *     i=2 ')' → 弹出 1 → 非空 → best = 2-0 = 2  栈: [0]
 *     i=3 '(' → 压入 3                        栈: [0,3]
 *     i=4 ')' → 弹出 3 → 非空 → best = 4-0 = 4  栈: [0]
 *     i=5 ')' → 弹出 0 后栈空 → 压入 5         栈: [5]
 *     → 4 ✓
 *
 * ───────────────────────────────────────────
 * 解法三: 双向扫描 —— 空间 O(1)
 * ───────────────────────────────────────────
 *
 *   只记两个计数器 left / right，从左往右扫:
 *     left === right  → 当前这一段配平了，更新答案
 *     right >  left  → 右括号多了，前面这段彻底没救，两个计数器清零
 *
 *   ★ 但只扫一遍不够 ★ 看 "(()":
 *     从左扫: left 一路涨到 2，right 只到 1，永远不相等 → 得到 0 ✗
 *     真实答案却是 2（末尾那个 "()"）
 *   原因是这种串里【左括号多出来】了，从左往右永远等不到 left === right。
 *   所以还要【从右往左再扫一遍】，这一遍的作废条件是 left > right。
 *
 *     从右扫 "(()": i=2 ')' → right=1; i=1 '(' → left=1 → 相等 → best = 2 ✓
 *
 * 易错点:
 *   1. ★ 越界时 dp[] 取到的是 undefined，undefined + 2 = NaN ★
 *      JS 里 dp[-1] 不报错，只会安静地给你 undefined，然后整个结果变成 NaN。
 *      所以 dp[i-2]、dp[pairAt-1] 都必须先判断下标是否 >= 0，越界就当作 0。
 *   2. 情况 B 里与之配对的字符下标是 i - dp[i-1] - 1，那个 "-1" 特别容易漏
 *   3. 答案取所有 dp[i] 的最大值，不是 dp[n-1]
 *   4. 栈解法别忘了栈底垫 -1，以及弹空时要压入当前下标
 *   5. 双向扫描只扫一遍会漏掉 "(()" 这类左括号偏多的串
 *
 * 复杂度:
 *   动态规划 —— 时间 O(n)，空间 O(n)   ← 本文件主解法
 *   栈       —— 时间 O(n)，空间 O(n)
 *   双向扫描 —— 时间 O(n)，空间 O(1)
 */

/**
 * longestValidParentheses
 * 动态规划: dp[i] = 以 s[i] 结尾的最长有效括号子串长度
 * @param {string} s
 * @return {number}
 */
const longestValidParentheses = function (s) {
  const n = s.length;
  if (n < 2) return 0; // 长度 0/1 不可能有有效括号

  const dp = new Array(n).fill(0); // dp[i] 默认 0
  let best = 0;

  for (let i = 1; i < n; i++) {
    // 以左括号结尾 → 不可能是有效子串，dp[i] 保持 0，直接跳过
    if (s[i] === '(') continue;

    if (s[i - 1] === '(') {
      // ── 情况 A: "...()" ──
      // ★ 越界保护: i < 2 时 dp[i-2] 是 undefined，加出来会变 NaN
      const before = i >= 2 ? dp[i - 2] : 0;
      dp[i] = before + 2;
    } else {
      // ── 情况 B: "...))" ──
      const L = dp[i - 1]; // 以 i-1 结尾的那段有效子串长度
      const pairAt = i - L - 1; // 紧挨在那段左边、准备和 s[i] 配对的字符

      if (pairAt >= 0 && s[pairAt] === '(') {
        // ★ 同样要防越界：pairAt - 1 < 0 时给 0
        const before = pairAt >= 1 ? dp[pairAt - 1] : 0;
        dp[i] = L + 2 + before;
      }
      // 配对失败 → s[i] 落单，dp[i] 保持 0
    }

    if (dp[i] > best) best = dp[i];
  }

  return best;
};

/**
 * longestValidParenthesesStack
 * 栈解法: 栈里存"还没被匹配掉的左括号下标"，栈底那个是"分割线"
 * @param {string} s
 * @return {number}
 */
const longestValidParenthesesStack = function (s) {
  const stack = [-1]; // ★ 垫一个 -1 当起算基准，省掉第一段的特判
  let best = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop(); // 弹出一个左括号和它配对（或弹出分割线）
      if (stack.length === 0) {
        // 没东西可配了 → 这个右括号是"落单的"，让它当新的分割线
        stack.push(i);
      } else {
        // 当前下标 到 栈顶分割线 之间就是一段有效括号
        best = Math.max(best, i - stack[stack.length - 1]);
      }
    }
  }

  return best;
};

/**
 * longestValidParenthesesScan
 * 双向扫描: 只要两个计数器，空间 O(1) —— 最省内存的写法
 * @param {string} s
 * @return {number}
 */
const longestValidParenthesesScan = function (s) {
  const n = s.length;
  let best = 0;
  let left = 0;
  let right = 0;

  // 第一遍: 从左往右。右括号多了 → 前面这段作废
  for (let i = 0; i < n; i++) {
    if (s[i] === '(') left++;
    else right++;

    if (left === right) best = Math.max(best, left + right);
    else if (right > left) {
      left = 0;
      right = 0;
    }
  }

  // 第二遍: 从右往左。左括号多了 → 前面这段作废
  // ★ 这一遍不能省，专门用来捞 "(()" 这种左括号偏多的串
  left = 0;
  right = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === '(') left++;
    else right++;

    if (left === right) best = Math.max(best, left + right);
    else if (left > right) {
      left = 0;
      right = 0;
    }
  }

  return best;
};

/**
 * longestValidParenthesesBrute
 * 参照实现: 枚举每个起点，边扫边用计数器判合法性，O(n²)
 * 只用来给上面的解法对答案
 * @param {string} s
 * @return {number}
 */
const longestValidParenthesesBrute = function (s) {
  let best = 0;

  for (let i = 0; i < s.length; i++) {
    let balance = 0; // '(' 记 +1, ')' 记 -1
    for (let j = i; j < s.length; j++) {
      balance += s[j] === '(' ? 1 : -1;
      if (balance < 0) break; // 前缀就崩了，这个起点往后都没戏
      if (balance === 0) best = Math.max(best, j - i + 1); // 恰好配平 → 一段有效括号
    }
  }

  return best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(longestValidParentheses('(()')); // 期望: 2   示例 1
// console.log(longestValidParentheses(')()())')); // 期望: 4   示例 2
// console.log(longestValidParentheses('')); // 期望: 0   示例 3
// console.log(longestValidParentheses('(')); // 期望: 0   单个括号
// console.log(longestValidParentheses(')(')); // 期望: 0   反过来也不行
// console.log(longestValidParentheses('()(())')); // 期望: 6   ★ 情况 B 的典型例子
// console.log(longestValidParentheses('()(()')); // 期望: 2   ★ 双向扫描必须扫两遍的原因
// console.log(longestValidParentheses('(()())')); // 期望: 6   题面里的合法串
// console.log(longestValidParentheses('((()))()')); // 期望: 8   嵌套 + 拼接
// console.log(longestValidParentheses('(((((')); // 期望: 0   全是左括号
// console.log(longestValidParentheses(')()())(')); // 期望: 4  两头都多出括号
//
// 三种解法互相印证:
// const check = (s) => [
//   longestValidParentheses(s),
//   longestValidParenthesesStack(s),
//   longestValidParenthesesScan(s),
//   longestValidParenthesesBrute(s)
// ];
// console.log(check('(()'));      // [2, 2, 2, 2]
// console.log(check('()(())'));   // [6, 6, 6, 6]
// console.log(check(')()())'));   // [4, 4, 4, 4]
//
// 压力测试 (n = 30000, 题目上限):
// const big = '()'.repeat(15000);
// console.log(longestValidParentheses(big)); // 期望: 30000
