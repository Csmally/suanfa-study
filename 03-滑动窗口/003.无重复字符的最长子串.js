/**
 * LeetCode 热题 100 —— 滑动窗口
 *
 * 3. 无重复字符的最长子串 (Longest Substring Without Repeating Characters)
 * 难度: 中等 | 标签: 哈希表、字符串、滑动窗口
 * 链接: https://leetcode.cn/problems/longest-substring-without-repeating-characters/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个字符串 `s` ，请你找出其中不含有重复字符的 最长 子串 的长度。
 *
 * 示例 1:
 *
 *   输入: s = "abcabcbb"
 *   输出: 3
 *   解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。注意 "bca" 和 "cab" 也是正确答案。
 *
 * 示例 2:
 *
 *   输入: s = "bbbbb"
 *   输出: 1
 *   解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
 *
 * 示例 3:
 *
 *   输入: s = "pwwkew"
 *   输出: 3
 *   解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
 *   请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 *
 * 提示：
 *   - `0 <= s.length <= 10^5`
 *   - `s` 由英文字母、数字、符号和空格组成
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 滑动窗口（双指针维护一个无重复字符的区间）
 *
 * 1. 右指针 right 逐步向右扩展窗口，Set 记录当前窗口内的字符
 * 2. 若新字符 s[right] 已在窗口中（出现重复），收缩左指针 left：
 *    从 Set 中删掉 s[left] 并 left++，直到窗口内不再有该重复字符
 * 3. 每次窗口内都无重复，用 right - left + 1 更新最长长度
 * 4. 每个字符最多进 Set 一次、出 Set 一次，均摊 O(n)
 *
 * 关键点: 窗口 [left, right] 始终满足"无重复字符"这个不变量；
 *         left 只会前进不会后退（单调性），所以整体是线性的
 *
 * 复杂度: 时间 O(n)，空间 O(字符集大小)
 */

/**
 * lengthOfLongestSubstring
 * 输入: s = "abcbbcbb"
 * @param {string} s
 * @return {number}
 */
const lengthOfLongestSubstring = function (s) {
  const set = new Set(); // 当前窗口内的字符
  let left = 0;
  let maxLen = 0;

  debugger

  for (let right = 0; right < s.length; right++) {
    // 新字符与窗口内字符重复 → 收缩左边界，直到窗口内没有它
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }

    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(lengthOfLongestSubstring('abcabcbb')); // 期望: 3
