/**
 * LeetCode 热题 100 —— 哈希
 *
 * 49. 字母异位词分组 (Group Anagrams)
 * 难度: 中等 | 标签: 数组、哈希表、字符串、排序
 * 链接: https://leetcode.cn/problems/group-anagrams/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
 *
 * 示例 1:
 *
 * 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 *
 * 输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
 *
 * 解释：
 *   - 在 strs 中没有字符串可以通过重新排列来形成 `"bat"`。
 *   - 字符串 `"nat"` 和 `"tan"` 是字母异位词，因为它们可以重新排列以形成彼此。
 *   - 字符串 `"ate"` ，`"eat"` 和 `"tea"` 是字母异位词，因为它们可以重新排列以形成彼此。
 *
 * 示例 2:
 *
 * 输入: strs = [""]
 *
 * 输出: [[""]]
 *
 * 示例 3:
 *
 * 输入: strs = ["a"]
 *
 * 输出: [["a"]]
 *
 * 提示：
 *   - `1 <= strs.length <= 10^4`
 *   - `0 <= strs[i].length <= 100`
 *   - `strs[i]` 仅包含小写字母
 */

/**
 * groupAnagrams
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupAnagrams = function (strs) {
  const groups = new Map();

  for (const s of strs) {
    // 统计 26 个字母的出现次数,作为该单词的"指纹"
    const count = new Array(26).fill(0);
    for (const ch of s) {
      count[ch.charCodeAt(0) - 97]++; // 'a' 的字符编码是 97
    }
    const key = count.join('#'); // 如 "eat" → "1#0#0#0#1#...#1"

    // 指纹相同的单词互为字母异位词,归入同一组
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(s);
  }

  return [...groups.values()];
};

// 排序解法(思路更直观,但每次排序有 O(k log k) 的开销):
// const groupAnagrams = function (strs) {
//   const groups = new Map();
//   for (const s of strs) {
//     const key = s.split('').sort().join('');
//     if (!groups.has(key)) groups.set(key, []);
//     groups.get(key).push(s);
//   }
//   return [...groups.values()];
// };

// ─── 测试 ───────────────────────────────────────────
console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])); // 期望: [['bat'], ['nat','tan'], ['ate','eat','tea']](输出顺序不限)
console.log(groupAnagrams([''])); // 期望: [['']]
console.log(groupAnagrams(['a'])); // 期望: [['a']]
