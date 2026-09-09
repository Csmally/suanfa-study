/**
 * LeetCode 热题 100 —— 滑动窗口
 *
 * 438. 找到字符串中所有字母异位词 (Find All Anagrams in a String)
 * 难度: 中等 | 标签: 哈希表、字符串、滑动窗口
 * 链接: https://leetcode.cn/problems/find-all-anagrams-in-a-string/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
 *
 * 示例 1:
 *
 *   输入: s = "cbaebabacd", p = "abc"
 *   输出: [0,6]
 *   解释:
 *   起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
 *   起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 *
 *  示例 2:
 *
 *   输入: s = "abab", p = "ab"
 *   输出: [0,1,2]
 *   解释:
 *   起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
 *   起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
 *   起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
 *
 * 提示:
 *   - `1 <= s.length, p.length <= 3 * 10^4`
 *   - `s` 和 `p` 仅包含小写字母
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 滑动窗口（固定窗口长度 = p.length）+ 字符计数（Map 版）
 *
 * 1. need(Map) 记录 p 中每个字符的需求数量，键就是字符本身
 *    （不用 charCodeAt 减 97 映射下标），needKinds = need.size
 * 2. 右指针 right 向右扩展窗口，窗口内字符计数存入 win(Map)；
 *    窗口长度超过 p.length 时，左指针 left 收缩，移出最左字符
 * 3. match 表示"数量恰好等于需求"的字符种类数，只在计数变化时增减：
 *    - 新增字符后 win[ch] === need[ch]      → match++（从不达标变为达标）
 *    - 新增字符后 win[ch] === need[ch] + 1  → match--（从达标变为超量）
 *    - 移出字符时做相反的调整
 *    注意只在 need.has(ch)（ch 属于 p）时才统计，窗口中的无关字符直接忽略
 * 4. 窗口长度 === p.length 且 match === needKinds 时，
 *    说明窗口中每种字符数量都恰好等于 p → 是一个异位词，记录 left
 *
 * 关键点: 不需要每个窗口都重新完整比较一次计数（那样是 O(26n) 次比较），
 *        用 match 计数器增量维护，每次移动只做 O(1) 的调整；
 *        Map 写法比 26 长度数组更通用（不限于小写字母），代价是稍慢一点
 *
 * 复杂度: 时间 O(n)，空间 O(1)（Map 的键最多 26 个 = 小写字母种类数）
 */

/**
 * findAnagrams
 * 输入: s = "cbbebabacd", p = "abc"
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
const findAnagrams = function (s, p) {
  const res = []; // 所有异位词子串的起始索引
  const need = new Map(); // p 中每个字符的需求数量，键 = 字符本身
  const win = new Map(); // 当前窗口内每个字符的数量（只统计 p 中出现的字符）

  for (const ch of p) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }
  const needKinds = need.size; // p 中不同字符的种类数

  let left = 0;
  let match = 0; // 窗口内"数量恰好等于需求"的字符种类数

  debugger

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right]; // 右指针新入窗的字符

    // 1. 右指针扩窗：新字符入窗，增量更新 match
    if (need.has(rightChar)) {
      win.set(rightChar, (win.get(rightChar) || 0) + 1);
      if (win.get(rightChar) === need.get(rightChar)) match++; // 数量恰好达标，多一种字符匹配
      else if (win.get(rightChar) === need.get(rightChar) + 1) match--; // 数量超了，之前达标的这种字符不再匹配
    }

    // 2. 窗口长度超过 p.length → 收缩左边界
    if (right - left + 1 > p.length) {
      const leftChar = s[left]; // 左指针即将移出窗口的字符
      if (need.has(leftChar)) {
        if (win.get(leftChar) === need.get(leftChar)) match--; // 移出前恰好达标，移出后不再达标
        else if (win.get(leftChar) === need.get(leftChar) + 1) match++; // 移出前超 1，移出后恰好达标
        win.set(leftChar, win.get(leftChar) - 1);
      }
      left++;
    }

    // 3. 窗口大小正好等于 p 且所有需求字符都达标 → 找到一个异位词
    if (right - left + 1 === p.length && match === needKinds) {
      res.push(left);
    }
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(findAnagrams('cbaebabacd', 'abc')); // 期望: [0, 6]
// console.log(findAnagrams('abab', 'ab')); // 期望: [0, 1, 2]
