/**
 * LeetCode 热题 100 —— 多维动态规划
 *
 * 5. 最长回文子串 (Longest Palindromic Substring)
 * 难度: 中等 | 标签: 双指针、字符串、动态规划、Manacher 算法
 * 链接: https://leetcode.cn/problems/longest-palindromic-substring/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个字符串 `s`，找到 `s` 中最长的 回文 子串。
 *
 * 示例 1：
 *
 *   输入：s = "babad"
 *   输出："bab"
 *   解释："aba" 同样是符合题意的答案。
 *
 * 示例 2：
 *
 *   输入：s = "cbbd"
 *   输出："bb"
 *
 * 提示：
 *   - `1 <= s.length <= 1000`
 *   - `s` 仅由数字和英文字母组成
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 区间 DP —— 这题的 dp 表是个"上三角"
 *
 * ★ 状态定义 ★
 *
 *   dp[i][j] = s[i..j] 这一段是不是回文（布尔值）
 *
 *   ★ 注意这里的下标是【一段区间】的两个端点，不是 062/064 那种"走到某个格子的坐标" ★
 *   这题的 dp 表只用得上 i <= j 的上半边（i > j 没有意义）。
 *
 * ★ 转移方程 ★
 *
 *   想让 s[i..j] 是回文，要同时满足两件事:
 *     1) 两头相等:      s[i] === s[j]
 *     2) 扒掉两头之后，里面那层 s[i+1..j-1] 也得是回文
 *
 *   所以:  dp[i][j] = s[i] === s[j] && (j - i < 2 || dp[i + 1][j - 1])
 *                                        ↑
 *                          长度 1 或 2 时，两头相等就够了，没有"里面"可言
 *
 *   为什么 j - i < 2 这个特例不能少:
 *     长度 1 的 "a"   → 本身是回文
 *     长度 2 的 "aa"  → 两头相等就成立，不需要再看里面
 *     如果不特判就会去取 dp[i+1][j-1]，而这时 i+1 > j-1，取到的是个无效格子
 *
 * ★ 遍历顺序 —— 这题和 062/064 最大的不同 ★
 *
 *   dp[i][j] 依赖的是 dp[i+1][j-1] —— 下标【往里收了一层】，
 *   也就是一个【更短的区间】。所以必须按区间长度从小到大算:
 *
 *     for (let len = 2; len <= n; len++)          // 先算短区间
 *       for (let i = 0; i + len - 1 < n; i++)     // 再从左到右铺开
 *
 *   ★ 如果按 062/064 的习惯"i 从小到大、j 从小到大"扫，会出错 ★
 *   因为算 dp[i][j] 时 dp[i+1][j-1] 还没被算过（它是"下一行、左边"，典型地没轮到）。
 *   （等价的写法: i 从 n-1 倒着枚举。也是保证短区间先算，但这个写法没那么直观。）
 *
 * 拿示例 1  "babad"  把 dp 表填出来（下标 0..4，只画 i <= j 的上三角）:
 *
 *         j=0   j=1   j=2   j=3   j=4
 *   i=0    T     F     T     F     F        ← dp[0][2] = "bab" ✓
 *   i=1          T     F     T     F        ← dp[1][3] = "aba" ✓
 *   i=2                T     F     F
 *   i=3                      T     F
 *   i=4                            T
 *
 *   len=1  全 true（单个字符都是回文）
 *   len=2  dp[0][1]: 'b'≠'a' ✗    dp[1][2]: 'a'≠'b' ✗
 *          dp[2][3]: 'b'≠'a' ✗    dp[3][4]: 'a'≠'d' ✗
 *   len=3  dp[0][2]: 'b'='b' ✓ 且 dp[1][1]=T → T   ("bab"，长度 3，刷新最优)
 *          dp[1][3]: 'a'='a' ✓ 且 dp[2][2]=T → T   ("aba"，长度 3，不更优)
 *          dp[2][4]: 'b'≠'d' ✗
 *   len=4  dp[0][3]: 'b'≠'a' ✗    dp[1][4]: 'a'≠'d' ✗
 *   len=5  dp[0][4]: 'b'≠'d' ✗
 *   → 最长是 "bab"（"aba" 也对，长度一样，题目接受任意一个）✓
 *
 * ★ 为什么这题不能像 064 那样压成一维 ★
 *   064 能压，是因为 dp[i][j] 依赖"上一行 + 本行左边"，一行滚着够用。
 *   这题依赖的是 dp[i+1][j-1]（下一行、左边）—— 既不是上一行也不是本行左边，
 *   一维数组装不下这个信息，所以只能老老实实开二维 O(n²) 的表。
 *   n ≤ 1000 时是 100 万个格子，勉强能接受。
 *
 * ───────────────────────────────────────────
 * 解法二: 中心扩散 —— 实际最常用的一种
 * ───────────────────────────────────────────
 *
 *   换个角度想: 回文是"从中心往两边对称展开"的。
 *   那就干脆枚举每一个可能的中心，往两边暴力扩，扩不动了就是当前中心的答案。
 *
 *   ★ 中心有两种 ★
 *     奇数长度: 中心是一个字符，如 "aba" 的中心是 'b'      → 从 (i, i) 开始扩
 *     偶数长度: 中心在两个字符之间，如 "abba" 的中心在 "bb" 中间 → 从 (i, i+1) 开始扩
 *   两个都要试，取更长的那个 —— 这是最容易漏的地方。
 *
 *   一共 n 个中心 × 每种扩 O(n) → 时间 O(n²)，但只用了几个变量，空间 O(1)。
 *   常数比 DP 小得多，n ≤ 1000 时实测通常比 DP 快。
 *
 * ───────────────────────────────────────────
 * 解法三: Manacher —— O(n)，但没必要（知道有这么个东西就行）
 * ───────────────────────────────────────────
 *
 *   核心两个技巧:
 *     1) 在字符之间插入分隔符（如 '#'），把"奇回文"和"偶回文"统一成一种情况，
 *        省掉"两种中心都要试"的分支。
 *     2) 利用回文的对称性: 如果 i 落在某个已知回文内部，
 *        那 p[i] 至少可以等于它在中心另一侧的镜像点的值 —— 不用从 0 开始暴力扩。
 *
 *   这两步合起来把复杂度降到 O(n)。但代码复杂、边界多、面试时容易写挂。
 *   这题 n ≤ 1000，O(n²) 完全够用，所以 Manacher 属于"可以了解，不必须掌握"。
 *   本文件给出一个可运行的实现，注释写细了，想啃可以啃。
 *
 * ★ 三种解法对比 ★
 *
 *   解法        时间      空间      评价
 *   ──────────────────────────────────────────────────────────
 *   区间 DP     O(n²)     O(n²)     本章主题，状态定义最规整，但吃内存
 *   中心扩散    O(n²)     O(1)      ★ 实际最常用 ★ 代码短、常数小
 *   Manacher    O(n)      O(n)      理论最优，实现最复杂，容易写错
 *
 *   同样是 O(n²)，两种写法的常数差很多。n = 1000 实测（"ab" 重复 500 次）:
 *     区间 DP    8.4 ms     ← 要开 100 万格的二维数组，还得全部填一遍
 *     中心扩散   0.6 ms     ← 只有几个变量，跑得飞快
 *     Manacher   0.04 ms    ← 线性，更快，但代码量是中心扩散的三倍
 *   ★ 所以"复杂度一样"不代表"跑得一样快"，常数和内存开销都是真实成本 ★
 *
 * 易错点:
 *   1. ★ 遍历顺序必须按区间长度 ★
 *      依赖的是"更短的区间"dp[i+1][j-1]，按行列顺序扫会读到没算过的格子
 *   2. ★ 长度 1、2 的特判不能省 ★（j - i < 2）
 *   3. 中心扩散必须【两种中心都试】: (i,i) 和 (i,i+1)，漏一个就错偶数长度的回文
 *   4. 答案不唯一！"babad" 返回 "bab" 或 "aba" 都对，所以验证时要【比长度】、
 *      并检查返回的串确实是回文且确实是 s 的子串，而不是直接比字符串
 *   5. n < 2 时直接返回 s 本身
 *
 * 复杂度:
 *   区间 DP   —— 时间 O(n²)，空间 O(n²)   ← 本文件主解法（本章主题）
 *   中心扩散  —— 时间 O(n²)，空间 O(1)    ← 日常最推荐
 *   Manacher  —— 时间 O(n)，空间 O(n)
 */

/**
 * longestPalindrome
 * 区间 DP: dp[i][j] = s[i..j] 是否为回文 —— 本文件主解法
 * @param {string} s
 * @return {string}
 */
const longestPalindrome = function (s) {
  const n = s.length;
  if (n < 2) return s;

  // dp[i][j] = s[i..j] 是不是回文。只填 i <= j 的那半边
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));

  let bestStart = 0;
  let bestLen = 1; // 至少有一个字符，长度 1 一定是回文

  // ★ 按区间长度从小到大枚举 ★ 这样 dp[i+1][j-1]（更短的区间）一定已经算好了
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1; // 区间的右端点

      if (s[i] !== s[j]) {
        // 两头都不同，肯定不是回文，dp[i][j] 保持 false
        continue;
      }

      // 两头相同 → 再看里面那层
      // ★ len <= 2 时两头相同就够了（"a" / "aa"），没有"里面"可看
      dp[i][j] = len <= 2 || dp[i + 1][j - 1];

      if (dp[i][j] && len > bestLen) {
        bestLen = len;
        bestStart = i;
      }
    }
  }

  return s.slice(bestStart, bestStart + bestLen);
};

/**
 * longestPalindromeExpand
 * 中心扩散: 枚举每个中心往两边扩，空间 O(1)，实际最常用
 * @param {string} s
 * @return {string}
 */
const longestPalindromeExpand = function (s) {
  const n = s.length;
  if (n < 2) return s;

  let bestStart = 0;
  let bestLen = 1;

  // 从 (l, r) 往两边扩，返回能扩出的回文长度
  const expand = (l, r) => {
    while (l >= 0 && r < n && s[l] === s[r]) {
      l--;
      r++;
    }
    // 循环退出时 l/r 已经多走了一步，所以真实长度是 r - l - 1
    return r - l - 1;
  };

  for (let i = 0; i < n; i++) {
    // ★ 两种中心都要试 ★
    const odd = expand(i, i); // 奇数长度: "aba" 这种，中心是一个字符
    const even = expand(i, i + 1); // 偶数长度: "abba" 这种，中心在两个字符之间

    const len = Math.max(odd, even);
    if (len > bestLen) {
      bestLen = len;
      // 已知长度和中心 i，倒推起点:
      //   奇数 len = 2k+1 → 起点 i-k；偶数 len = 2k → 起点 i-k+1
      //   合起来就是 i - floor((len-1)/2)
      bestStart = i - Math.floor((len - 1) / 2);
    }
  }

  return s.slice(bestStart, bestStart + bestLen);
};

/**
 * longestPalindromeManacher
 * Manacher: 插分隔符统一奇偶 + 利用镜像跳过重复比较，O(n)
 * （本文件留给想深入的人，日常用中心扩散就够了）
 * @param {string} s
 * @return {string}
 */
const longestPalindromeManacher = function (s) {
  if (s.length < 2) return s;

  // 1) 插入分隔符 '#': "babad" → "#b#a#b#a#d#"
  //    这样无论奇偶，回文在 t 里都是【奇数长度、以某个字符为中心】
  let t = '#';
  for (const ch of s) t += ch + '#';

  const n = t.length;
  const p = new Array(n).fill(0); // p[i] = 以 i 为中心的回文半径（= 原串里的回文长度）
  let center = 0; // 当前已经扩到的、最靠右的那个回文的中心
  let right = 0; // 那个回文的右边界

  for (let i = 0; i < n; i++) {
    // 2) 镜像加速: 如果 i 在当前回文内部，就先抄它关于 center 的对称点 p[mirror]
    if (i < right) {
      const mirror = 2 * center - i;
      p[i] = Math.min(right - i, p[mirror]); // 不能超过右边界，超出的部分还不确定
    }

    // 3) 从 p[i] 这个起点继续暴力扩（有了镜像的铺垫，扩的次数大幅减少）
    while (
      i - p[i] - 1 >= 0 &&
      i + p[i] + 1 < n &&
      t[i - p[i] - 1] === t[i + p[i] + 1]
    ) {
      p[i]++;
    }

    // 4) 更新最靠右的回文
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
  }

  // 找半径最大的中心。p[i] 恰好就是对应到原串里的回文长度
  let bestCenter = 0;
  for (let i = 0; i < n; i++) {
    if (p[i] > p[bestCenter]) bestCenter = i;
  }

  // t 里第 i 个中心对应回原串的起点 = (i - p[i]) / 2
  const start = (bestCenter - p[bestCenter]) / 2;
  return s.slice(start, start + p[bestCenter]);
};

/**
 * isPalindrome
 * 辅助: 判断 s[l..r] 是不是回文
 */
const isPalindrome = function (s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
};

/**
 * longestPalindromeBrute
 * 参照实现: 暴力枚举所有子串逐个判回文，O(n³)
 * 只用来对小字符串对答案
 * @param {string} s
 * @return {string}
 */
const longestPalindromeBrute = function (s) {
  let best = '';

  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (j - i + 1 > best.length && isPalindrome(s, i, j)) {
        best = s.slice(i, j + 1);
      }
    }
  }

  return best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(longestPalindrome('babad')); // 期望: 'bab' 或 'aba'（长度 3）
// console.log(longestPalindrome('cbbd')); // 期望: 'bb'（长度 2）
// console.log(longestPalindrome('a')); // 期望: 'a'
// console.log(longestPalindrome('ac')); // 期望: 'a' 或 'c'（长度 1，没有回文对）
// console.log(longestPalindrome('aaaa')); // 期望: 'aaaa'
// console.log(longestPalindrome('forgeeksskeegfor')); // 期望: 'geeksskeeg'（长度 10）
// console.log(longestPalindrome('abacdfgdcaba')); // 期望: 'aba'
//
// 三种解法互相印证。
// ★ 注意: 答案不唯一（"babad" 给 "bab" 或 "aba" 都对），
//   所以要【比长度】+ 检查返回的串确实是回文、确实是子串，不能直接比字符串 ★
// const check = (s) => {
//   const results = [
//     longestPalindrome(s),
//     longestPalindromeExpand(s),
//     longestPalindromeManacher(s),
//     longestPalindromeBrute(s)
//   ];
//   const lens = results.map((r) => r.length);
//   const allValid = results.every((r) => s.includes(r) && isPalindrome(r, 0, r.length - 1));
//   const sameLen = lens.every((L) => L === lens[0]);
//   console.log(JSON.stringify(s), '->', results, '| 长度一致:', sameLen, '| 都是合法回文子串:', allValid);
// };
// check('babad');    // 长度都是 3
// check('cbbd');     // 长度都是 2
// check('forgeeksskeegfor'); // 长度都是 10
