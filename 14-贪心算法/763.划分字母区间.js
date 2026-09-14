/**
 * LeetCode 热题 100 —— 贪心算法
 *
 * 763. 划分字母区间 (Partition Labels)
 * 难度: 中等 | 标签: 贪心、哈希表、双指针、字符串
 * 链接: https://leetcode.cn/problems/partition-labels/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个字符串 `s` 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 `"ababcc"` 能够被分为 `["abab", "cc"]`，但类似 `["aba", "bcc"]` 或 `["ab", "ab", "cc"]` 的划分是非法的。
 *
 * 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 `s` 。
 *
 * 返回一个表示每个字符串片段的长度的列表。
 *
 * 示例 1：
 *
 *   输入：s = "ababcbacadefegdehijhklij"
 *   输出：[9,7,8]
 *   解释：
 *   划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
 *   每个字母最多出现在一个片段中。
 *   像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
 *
 * 示例 2：
 *
 *   输入：s = "eccbbbbdec"
 *   输出：[10]
 *
 * 提示：
 *   - `1 <= s.length <= 500`
 *   - `s` 仅由小写英文字母组成
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 贪心 —— 片段右边界由"片段内字母的最后出现位置"决定
 *
 * ★ 关键转念: "同一字母最多出现在一个片段中"
 *              ⟺ 片段必须包住每个字母的【最后一次出现】★
 *
 *   想通这一句，解法就浮出来了 —— 两趟扫描:
 *
 *   第一趟: 记下每个字母【最后出现】的下标，存进 last[c]
 *
 *   第二趟: 一边扫一边维护当前片段的右边界 end:
 *     每遇到一个字母 c，就  end = max(end, last[c])
 *        （这个字母的最后一次出现，必须被包进当前片段）
 *     当 i === end 时 —— 说明当前片段里【所有字母的最后出现
 *     位置都已经包含进来了】，片段自洽了，可以切:
 *       记下长度 end - start + 1
 *       start = i + 1，开始下一个片段
 *
 * ★ 这个贪心为什么是对的？★
 *   只要片段里还有一个字母在后面出现，就必须把它包进来；包进来
 *   之后可能又引入新字母，又得继续扩…… 直到"边界 = 片段内所有
 *   字母最后出现位置的最大值"。
 *   此时切下去【不会影响后面的任何片段】，而且这是【最早能切的
 *   位置】—— 切得越早、片段越多。所以这个贪心就是最优。
 *
 * ★ 它和 045 跳跃游戏 II 是【完全同构】的 ★
 *
 *     045: end = 当前层的右边界，farthest = 扫描中能撑到的最远
 *     763: end = 当前片段的右边界，last[c]  = 扫描中能撑到的最远
 *
 *   都是"一边扫、一边撑大右边界，撑到头了就结算一段"。
 *   763 可以说是【跳跃游戏 II 的字符串版】。
 *
 * 易错点:
 *   1. ★ 必须【先扫完第一趟】拿到 last[]，再扫第二趟 ★
 *      一边扫一边找"最后出现位置"是做不到的 —— 你不知道后面还有没有
 *   2. 切分后 end 不用手动重置 —— 下一轮 end = max(end, last[c])，
 *      而 last[c] ≥ i > 旧的 end，会自动涨上去
 *      （手动重置成 i + 1 也对，两种写法都行）
 *   3. 最后一段一定会在 i = n-1 处被切出来，不用额外补一句:
 *      因为 last[s[n-1]] === n-1，此时 end 必然是 n-1 === i
 *
 * 复杂度: 时间 O(n)，空间 O(1)（字母表大小固定）
 *
 * ── 另一条路: 转成"区间合并"（见 partitionLabelsMerge） ──
 *   把每个字母看成一个区间 [第一次出现, 最后一次出现]。
 *   题目要求等价于: 把这些区间合并，合并后每个区间的长度就是答案。
 *   是同一件事的另一种表述，但"合并区间"是个更通用的套路，
 *   换个视角有助于理解。
 */

/**
 * partitionLabels
 * 两趟扫描 + 贪心扩边界
 * 输入: s = "ababcbacadefegdehijhklij"
 * @param {string} s
 * @return {number[]}
 */
const partitionLabels = function (s) {
  // ── 第一趟: 每个字母最后出现的下标 ──
  const last = new Map();
  for (let i = 0; i < s.length; i++) {
    last.set(s[i], i);
  }

  // ── 第二趟: 边扫边撑右边界 ──
  const res = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i])); // 这个字母的最后出现必须在片段内

    if (i === end) {
      // 片段自洽了，切
      res.push(end - start + 1);
      start = i + 1; // 下一段的起点
    }
  }

  return res;
};

/**
 * partitionLabelsMerge
 * 换个视角: 转成"区间合并"
 * @param {string} s
 * @return {number[]}
 */
const partitionLabelsMerge = function (s) {
  // 每个字母的 [第一次出现, 最后一次出现]
  const range = new Map();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!range.has(c)) range.set(c, [i, i]);
    else range.get(c)[1] = i;
  }

  // 按起点排序，然后合并有重叠的区间
  const intervals = [...range.values()].sort((a, b) => a[0] - b[0]);

  const res = [];
  let [curStart, curEnd] = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const [l, r] = intervals[i];

    if (l <= curEnd) {
      curEnd = Math.max(curEnd, r); // 有重叠 → 合并
    } else {
      res.push(curEnd - curStart + 1); // 断开 → 结算一段
      curStart = l;
      curEnd = r;
    }
  }

  res.push(curEnd - curStart + 1); // 最后一段
  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(partitionLabels('ababcbacadefegdehijhklij')); // 期望: [9, 7, 8]
// console.log(partitionLabels('eccbbbbdec')); // 期望: [10]   ← 示例 2
// console.log(partitionLabels('a'));          // 期望: [1]
// console.log(partitionLabels('abac'));       // 期望: [3, 1] ← a 又出现在末尾
// console.log(partitionLabels('abc'));        // 期望: [1, 1, 1]
// console.log(partitionLabels('aaaa'));       // 期望: [4]
// console.log(partitionLabelsMerge('ababcbacadefegdehijhklij')); // 期望: [9, 7, 8]
//
// 验证【性质】而不是只比一组数字(题目没给其他用例的答案时更该这样):
//   ① 各段长度之和 === s.length
//   ② 按长度把 s 切开再拼回去 === s
//   ③ 每个字母只出现在一个片段里   ← 题目的核心约束
//
// const check = (s, fn) => {
//   const lens = fn(s);
//   const parts = [];
//   let p = 0;
//   for (const len of lens) { parts.push(s.slice(p, p + len)); p += len; }
//   const seen = new Map();               // 字母 -> 它所在的片段号
//   let onlyOnce = true;
//   parts.forEach((seg, idx) => {
//     for (const c of seg) {
//       if (seen.has(c) && seen.get(c) !== idx) onlyOnce = false;
//       seen.set(c, idx);
//     }
//   });
//   return {
//     长度和正确: p === s.length,
//     拼接还原: parts.join('') === s,
//     字母不跨段: onlyOnce,
//   };
// };
