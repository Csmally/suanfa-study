/**
 * LeetCode 热题 100 —— 子串
 *
 * 76. 最小覆盖子串 (Minimum Window Substring)
 * 难度: 困难 | 标签: 哈希表、字符串、滑动窗口
 * 链接: https://leetcode.cn/problems/minimum-window-substring/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定两个字符串 `s` 和 `t`，长度分别是 `m` 和 `n`，返回 s 中的 最短窗口 子串，使得该子串包含 `t` 中的每一个字符（包括重复字符）。如果没有这样的子串，返回空字符串 `""`。
 *
 * 测试用例保证答案唯一。
 *
 * 示例 1：
 *
 *   输入：s = "ADOBECODEBANC", t = "ABC"
 *   输出："BANC"
 *   解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
 *
 * 示例 2：
 *
 *   输入：s = "a", t = "a"
 *   输出："a"
 *   解释：整个字符串 s 是最小覆盖子串。
 *
 * 示例 3:
 *
 *   输入: s = "a", t = "aa"
 *   输出: ""
 *   解释: t 中两个字符 'a' 均应包含在 s 的子串中，
 *   因此没有符合条件的子字符串，返回空字符串。
 *
 * 提示：
 *   - `m == s.length`
 *   - `n == t.length`
 *   - `1 <= m, n <= 10^5`
 *   - `s` 和 `t` 由英文字母组成
 *
 * 进阶：你能设计一个在 `O(m + n)` 时间内解决此问题的算法吗？
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 滑动窗口（变长窗口，滑动窗口类题目的"母题"）
 *
 * 整体框架分两步交替进行:
 *   第 1 步 右指针 right 不断右移，把字符装入窗口，
 *          直到窗口覆盖 t 的所有字符（可行解）
 *   第 2 步 左指针 left 右移收缩窗口，边缩边记录最短长度，
 *          缩到窗口不再覆盖 t 为止（在可行解里找最优解）
 * 然后回到第 1 步继续右扩。两个指针都只前进不后退，各走一遍 → O(m + n)
 *
 * 覆盖的判断: 用 Map 计数 + match 计数器（和 438 异位词同一套路）
 *   - need 记 t 中每个字符的需求数量，needKinds = t 中不同字符的种类数
 *   - 入窗字符数量恰好达到需求时 match++（超量不影响 match）
 *   - 移出字符导致数量低于需求时 match--
 *   - match === needKinds 表示窗口当前完整覆盖 t
 *
 * 关键点: 收缩循环里必须"先记录当前窗口长度，再移出字符"，
 *        否则会漏掉最后一个仍覆盖 t 的窗口（答案可能就丢在这里）；
 *        minLen 只在找到更短的覆盖窗口时才更新
 *
 * 复杂度: 时间 O(m + n)（每个字符最多入窗一次、出窗一次），
 *         空间 O(n)（need 的键数 = t 中不同字符数）
 */

/**
 * minWindow
 * 输入: s = "ADOBECODEBANC", t = "ABC"
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
const minWindow = function (s, t) {
  const need = new Map(); // t 中每个字符的需求数量
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }
  const needKinds = need.size; // t 中不同字符的种类数

  const win = new Map(); // 窗口内字符计数（只统计 t 中出现的字符）
  let left = 0;
  let match = 0; // 窗口内"数量恰好达标"的字符种类数
  let minStart = 0; // 最短覆盖子串的起始下标
  let minLen = Infinity; // 最短覆盖子串的长度（Infinity 表示还没找到）

  debugger

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right];

    // 1. 右指针扩窗：新字符入窗，恰好达标时 match++
    if (need.has(rightChar)) {
      win.set(rightChar, (win.get(rightChar) || 0) + 1);
      if (win.get(rightChar) === need.get(rightChar)) match++;
    }

    // 2. 窗口已覆盖 t → 收缩左边界，在收缩过程中找最短覆盖
    while (match === needKinds) {
      const windowLen = right - left + 1;
      if (windowLen < minLen) {
        minLen = windowLen;
        minStart = left;
      }

      const leftChar = s[left];
      if (need.has(leftChar)) {
        if (win.get(leftChar) === need.get(leftChar)) match--; // 移出后这种字符不再达标
        win.set(leftChar, win.get(leftChar) - 1);
      }
      left++;
    }
  }

  // 没找到任何覆盖 t 的窗口时返回空字符串
  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);
};

// ─── 测试 ───────────────────────────────────────────
// console.log(minWindow('ADOBECODEBANC', 'ABC')); // 期望: 'BANC'
