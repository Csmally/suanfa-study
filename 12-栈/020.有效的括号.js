/**
 * LeetCode 热题 100 —— 栈
 *
 * 20. 有效的括号 (Valid Parentheses)
 * 难度: 简单 | 标签: 栈、字符串、括号序列
 * 链接: https://leetcode.cn/problems/valid-parentheses/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。
 *
 * 有效字符串需满足：
 *   - 左括号必须用相同类型的右括号闭合。
 *   - 左括号必须以正确的顺序闭合。
 *   - 每个右括号都有一个对应的相同类型的左括号。
 *
 * 示例 1：
 *
 * 输入：s = "()"
 *
 * 输出：true
 *
 * 示例 2：
 *
 * 输入：s = "()[]{}"
 *
 * 输出：true
 *
 * 示例 3：
 *
 * 输入：s = "(]"
 *
 * 输出：false
 *
 * 示例 4：
 *
 * 输入：s = "([])"
 *
 * 输出：true
 *
 * 示例 5：
 *
 * 输入：s = "([)]"
 *
 * 输出：false
 *
 * 提示：
 *   - `1 <= s.length <= 10^4`
 *   - `s` 仅由括号 `'()[]{}'` 组成
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 栈 —— 括号匹配天然就是"后进先出"
 *
 * ★ 关键转念: 这题为什么该用栈？★
 *
 *   题目说"左括号必须以正确的顺序闭合"，翻译成人话就是:
 *     【最近打开的那个括号，必须最先被关闭】
 *   这不就是"后进先出"（LIFO）吗？而 LIFO 正是栈的定义。
 *
 *   于是规则直接简化成两条:
 *     遇到【左括号】→ 压栈（记下"我还开着没关"）
 *     遇到【右括号】→ 必须和【栈顶】配对，配完弹栈
 *
 *   栈顶天然就是"最近打开、还没关闭的那个括号"，所以连
 *   `"([)]"` 这种交叉嵌套都不用特判:
 *     此时栈顶是 '['，来的是 ')'，配对失败 → 直接判无效 ✓
 *
 * 步骤:
 *   for 每个字符 c:
 *     c 是左括号  → stack.push(c)
 *     c 是右括号  →
 *       栈空                → false（没有可配对的左括号）
 *       栈顶 ≠ 对应的左括号 → false（类型不对）
 *       否则                → stack.pop()
 *   循环结束后: return stack.length === 0
 *
 * 易错点:
 *   1. ★ 最后一定要检查栈为空 ★
 *      字符串 "(((" 全程一个 false 都不会触发，但栈里剩着三个
 *      没闭合的左括号 —— 漏了这个检查就会把 "(((" 判成有效
 *   2. ★ 遇到右括号时，栈空要立刻返回 false ★
 *      不检查的话，对 ")" 这种输入会读到 undefined，容易误判
 *   3. 别想用"左右括号个数相等"来糊弄 ——
 *      "([)]" 的个数是相等的，但它无效；而且三种括号类型
 *      光靠计数根本区分不出来
 *
 * 复杂度: 时间 O(n)，空间 O(n)（最坏情况整个串全是左括号）
 *
 * ── 另一种写法: 压入"期待的那个右括号"（见 isValidPushExpected） ──
 *   遇到左括号时不压它自己，而是压【它对应的右括号】。
 *   这样后面遇到右括号时，只要比较 stack.pop() === c 就行 ——
 *   不用查表，而且栈空时 pop() 返回 undefined，
 *   顺带把"栈空"那个分支也省掉了。非常干净。
 */

/**
 * isValid
 * 输入: s = "()[]{}"
 * @param {string} s
 * @return {boolean}
 */
const isValid = function (s) {
  const stack = [];
  // 右括号 → 它对应的左括号
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c); // 左括号: 记下"我还开着"
    } else {
      // 右括号: 必须和栈顶配对
      if (stack.length === 0) return false; // 没有可配对的左括号
      if (stack[stack.length - 1] !== pairs[c]) return false; // 类型不对
      stack.pop(); // 配对成功，弹掉
    }
  }

  // ★ 所有左括号都必须已闭合
  return stack.length === 0;
};

/**
 * isValidPushExpected
 * 更简洁的写法: 左括号入栈时，压的是"它期待的那个右括号"
 * @param {string} s
 * @return {boolean}
 */
const isValidPushExpected = function (s) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };

  for (const c of s) {
    if (pairs[c] !== undefined) {
      stack.push(pairs[c]); // 压入"我期待的那个右括号"
    } else {
      // 弹出的必须正好是我；栈空时 pop() 返回 undefined，天然判 false
      if (stack.pop() !== c) return false;
    }
  }

  return stack.length === 0;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isValid('()'));       // 期望: true
// console.log(isValid('()[]{}'));   // 期望: true
// console.log(isValid('(]'));       // 期望: false
// console.log(isValid('([])'));     // 期望: true
// console.log(isValid('([)]'));     // 期望: false ← 交叉嵌套
// console.log(isValid('((('));      // 期望: false ← 漏最后那个检查就会错判成 true
// console.log(isValid(')'));        // 期望: false ← 一上来就是右括号，栈空
// console.log(isValid(''));         // 期望: true  ← 空串
// console.log(isValidPushExpected('([)]')); // 期望: false
//
// 参照实现: 反复把相邻的配对括号删掉，看看最后能不能删空
// const ref = (s) => {
//   let prev, cur = s;
//   do {
//     prev = cur;
//     cur = cur.replace('()', '').replace('[]', '').replace('{}', '');
//   } while (cur !== prev);
//   return cur === '';
// };
