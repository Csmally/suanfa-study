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
 * longestValidParentheses
 * @param {string} s
 * @return {number}
 */
const longestValidParentheses = function (s) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(longestValidParentheses('(()')); // 期望: 2
// console.log(longestValidParentheses(')()())')); // 期望: 4
