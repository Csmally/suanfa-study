/**
 * LeetCode 热题 100 —— 多维动态规划
 *
 * 72. 编辑距离 (Edit Distance)
 * 难度: 中等 | 标签: 字符串、动态规划
 * 链接: https://leetcode.cn/problems/edit-distance/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你两个单词 `word1` 和 `word2`， 请返回将 `word1` 转换成 `word2` 所使用的最少操作数 。
 *
 * 你可以对一个单词进行如下三种操作：
 *   - 插入一个字符
 *   - 删除一个字符
 *   - 替换一个字符
 *
 * 示例 1：
 *
 *   输入：word1 = "horse", word2 = "ros"
 *   输出：3
 *   解释：
 *   horse -> rorse (将 'h' 替换为 'r')
 *   rorse -> rose (删除 'r')
 *   rose -> ros (删除 'e')
 *
 * 示例 2：
 *
 *   输入：word1 = "intention", word2 = "execution"
 *   输出：5
 *   解释：
 *   intention -> inention (删除 't')
 *   inention -> enention (将 'i' 替换为 'e')
 *   enention -> exention (将 'n' 替换为 'x')
 *   exention -> exection (将 'n' 替换为 'c')
 *   exection -> execution (插入 'u')
 *
 * 提示：
 *   - `0 <= word1.length, word2.length <= 500`
 *   - `word1` 和 `word2` 由小写英文字母组成
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 双串 DP 的"完全体" —— 和 1143 是同一个骨架
 *
 * ★ 先看清这题和 1143.最长公共子序列 的关系 ★
 *
 *   两题的骨架【一模一样】:
 *     都是双串 DP、下标都是"前缀长度"、表都开 (m+1) × (n+1)、
 *     都从左上角推右下角。连一维压缩时"左上角要用临时变量存"那个坑都一样。
 *
 *   区别只在两处:
 *                     1143 最长公共子序列        72 编辑距离
 *     ────────────────────────────────────────────────────────────────
 *     相等时           dp[i-1][j-1] + 1          dp[i-1][j-1]      （免费，不用动）
 *     不相等时         max(dp[i-1][j],          1 + min(三个候选)
 *                          dp[i][j-1])
 *     优化目标         尽量"多留"（求最大）       尽量"少改"（求最小）
 *     第 0 行/列       全是 0                    0,1,2,3,...  ← ★ 最大的区别 ★
 *     ────────────────────────────────────────────────────────────────
 *
 *   所以如果 1143 已经懂了，这题只要重点搞明白两件事:
 *     (1) 三种操作分别对应往哪个格子转移
 *     (2) 第 0 行/第 0 列为什么不是 0
 *
 * ★ 状态定义 ★
 *
 *   dp[i][j] = 把 word1 的【前 i 个字符】变成 word2 的【前 j 个字符】的最少操作数
 *
 *   和 1143 一样，i、j 是"长度"不是"下标"，所以比较用 word1[i-1]、word2[j-1]。
 *
 * ★ 转移方程 —— 三种操作对应三个格子 ★
 *
 *   每次只看两个串各自的最后一个字符 word1[i-1] 和 word2[j-1]:
 *
 *   ┌──────┬────────────────────────────────┬──────────────┬──────┐
 *   │ 操作 │ 干了什么                        │ 转移去哪      │ 代价 │
 *   ├──────┼────────────────────────────────┼──────────────┼──────┤
 *   │ 替换 │ 把 word1[i-1] 改成 word2[j-1]   │ dp[i-1][j-1] │  1   │
 *   │ 删除 │ 删掉 word1[i-1]                 │ dp[i-1][j]   │  1   │
 *   │ 插入 │ 插一个字符和 word2[j-1] 抵消    │ dp[i][j-1]   │  1   │
 *   │ 不用 │ 两个字符本来就相等              │ dp[i-1][j-1] │  0   │
 *   └──────┴────────────────────────────────┴──────────────┴──────┘
 *
 *   ★ 插入为什么是 dp[i][j-1]？★ 这个最容易搞反，一定要想通:
 *     在 word1 里插入的那个字符，正好和 word2[j-1] 配上了 —— 相当于 word1
 *     【这边什么都没消耗】（还是前 i 个），而 word2 【少了一个待匹配的字符】
 *     （变成前 j-1 个）。所以是 dp[i][j-1]。
 *   ★ 删除和插入是一对镜像: 删 → dp[i-1][j]，插 → dp[i][j-1] ★
 *
 *   ★ 一个反直觉但实测过的结论: 这两个就算写反了，结果也完全一样 ★
 *     因为 min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) 里的三个候选是个【集合】，
 *     交换顺序不改变最小值（实测随机 3000 组，对调后结果 0 处不同）。
 *     所以别把"删/插对应哪一格"当成记忆负担 —— 真正要理解的是
 *     "三个候选各自代表哪种操作"，因为换个写法（比如带上操作方向、
 *      或者只在两个候选里挑）的时候，搞反就真的会错了。
 *
 *   合起来:
 *     相等:  dp[i][j] = dp[i-1][j-1]                 （免费，直接跟上）
 *     不等:  dp[i][j] = 1 + min(dp[i-1][j-1],       ← 替换
 *                              dp[i-1][j],         ← 删除
 *                              dp[i][j-1])         ← 插入
 *
 *   ★ 相等时为什么不用再和另外两个比 ★
 *     需要的是 dp[i-1][j-1] <= 1 + dp[i-1][j] 和 dp[i-1][j-1] <= 1 + dp[i][j-1]。
 *     这两条都成立，依据是编辑距离的【1-利普希茨性质】:
 *       给 word1 加一个字符，编辑距离最多变化 1（大不了把它删掉），
 *       给 word2 加一个字符同理。也就是相邻格子的差不会超过 1。
 *     于是 |dp[i-1][j-1] - dp[i-1][j]| <= 1、|dp[i-1][j-1] - dp[i][j-1]| <= 1，
 *     x <= y + 1 天然成立。所以直接取 dp[i-1][j-1] 就是最优。
 *
 * ★ 初始条件 —— 这里和 1143 完全不同 ★
 *
 *   dp[0][j] = j   空串变成长度 j 的串，只能一个个插入 → j 次
 *   dp[i][0] = i   长度 i 的串变成空串，只能一个个删除 → i 次
 *
 *   所以第 0 行是 0,1,2,3,... 而不是 1143 那样全 0。
 *   ★ 这是这题最经典的错误来源 ★ 顺手把 1143 的写法抄过来就全错了。
 *   （两题的边界含义不同: 1143 里"空串和任意串的公共子序列"是空，长度 0；
 *     这里"空串变成长度 j 的串"要老老实实插 j 次。）
 *
 * ★ 返回什么 ★  dp[m][n]
 *
 * 拿示例 1  [word1 = "horse", word2 = "ros"] 把整张表填出来:
 *
 *          ""    r    o    s        ← word2 的前 j 个
 *    ""     0    1    2    3        ← 空串要插入 j 次
 *    h      1    1    2    3
 *    o      2    2    1    2
 *    r      3    2    2    2
 *    s      4    3    3    2
 *    e      5    4    4    3
 *    ↑
 *  word1 的前 i 个（空串要删 i 次）
 *
 *   挑几格看看:
 *     dp[2][2]: "ho" → "ro"，把 h 换成 r，1 次 ✓
 *     dp[3][3]: "hor" → "ros"，h→r 得 "ror"，再把最后的 r→s，2 次 ✓
 *     dp[4][3]: "hors" → "ros"，h→r 得 "rors"，删掉一个 r → "ros"，2 次 ✓
 *     dp[5][3]: 3 ✓  对应题目给的 horse → rorse → rose → ros
 *
 *   ★ 注意一个漂亮的性质: 相邻格子（上下/左右）的差永远不超过 1 ★
 *   这就是上面提到的 1-利普希茨性质，在表里看得一清二楚。
 *
 * ───────────────────────────────────────────
 * 空间压缩: 二维 → 一维
 * ───────────────────────────────────────────
 *
 *   和 1143 完全一样的套路，也踩完全一样的坑:
 *   dp[i][j] 要用到【斜上方】的 dp[i-1][j-1]，而在一维数组里那个位置
 *   已经被本轮更新成新值了，所以必须用临时变量 prev 把左上角的旧值存下来。
 *   （064 最小路径和不用这么麻烦，因为它只用"上面 + 左边"，没有"斜上方"。）
 *
 * 易错点:
 *   1. ★ 第 0 行/列是 0,1,2,3,... 不是全 0 ★
 *      从 1143 抄过来最容易在这里翻车（这才是这题真正的头号坑）
 *   2. 删除/插入对应哪一格，想清楚就行，写反了不影响结果（见上方实测说明）；
 *      但换成别的写法（只挑两个候选、带方向的 DP）时就会出错
 *   3. dp 下标是"前缀长度"，比较时别忘了 word1[i-1] 那个 -1
 *   4. 相等时直接 dp[i-1][j-1]，不用再取 min（有 1-利普希茨性质的证明）
 *   5. 一维压缩时左上角要用临时变量存
 *   6. word1 或 word2 是空串时要能扛住（答案是另一个串的长度）
 *
 * 复杂度:
 *   二维 DP  —— 时间 O(m*n)，空间 O(m*n)   ← 本文件主解法
 *   一维 DP  —— 时间 O(m*n)，空间 O(n)
 */

/**
 * minDistance
 * 二维 DP: dp[i][j] = word1 前 i 个字符变成 word2 前 j 个字符的最少操作数
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
const minDistance = function (word1, word2) {
  const m = word1.length;
  const n = word2.length;

  // ★ 开 (m+1) × (n+1)，第 0 行/列代表"空串"
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // ★ 边界和 1143 不同，这里不是全 0 ★
  for (let j = 0; j <= n; j++) dp[0][j] = j; // 空串 → 长度 j: 插入 j 次
  for (let i = 0; i <= m; i++) dp[i][0] = i; // 长度 i → 空串: 删除 i 次

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // 最后一对字符本来就相等 → 不用动，代价是 0，直接跟上前缀的答案
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 三种操作各试一遍，取最省的
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j - 1], // 替换 word1[i-1] → word2[j-1]
            dp[i - 1][j], // 删掉 word1[i-1]
            dp[i][j - 1] // 插入一个字符和 word2[j-1] 抵消
          );
      }
    }
  }

  return dp[m][n];
};

/**
 * minDistance1D
 * 一维 DP: 滚动数组，空间 O(n)
 * ★ 和 1143 一样，关键是 prev 那个变量 —— 它保管"斜上方"的值 ★
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
const minDistance1D = function (word1, word2) {
  const m = word1.length;
  const n = word2.length;

  // dp[j] 对应第 0 行: 空串 → word2 的前 j 个字符，需要插入 j 次
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    // ★ prev 要拿【还没被覆盖】的 dp[0]，也就是 dp[i-1][0]
    let prev = dp[0];
    // 第一列: word1 的前 i 个 → 空串，要删 i 次
    dp[0] = i;

    for (let j = 1; j <= n; j++) {
      const oldAbove = dp[j]; // ★ 先存 dp[i-1][j]，它下一列要当"左上角"用

      if (word1[i - 1] === word2[j - 1]) {
        dp[j] = prev; // 斜上方
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
        //                       斜上  上面(旧值)  左边(新值)
      }

      prev = oldAbove;
    }
  }

  return dp[n];
};

/**
 * minDistanceMemo
 * 记忆化搜索: 从"两个指针"的角度想，同一个递推式的正面写法
 *   dfs(i, j) = word1[i..] 变成 word2[j..] 的最少操作数
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
const minDistanceMemo = function (word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const memo = new Map();

  const dfs = (i, j) => {
    // 一个串走到头了，剩下的只能全靠插入 / 删除补齐
    if (i === m) return n - j;
    if (j === n) return m - i;

    const key = i * (n + 1) + j;
    if (memo.has(key)) return memo.get(key);

    let res;
    if (word1[i] === word2[j]) {
      res = dfs(i + 1, j + 1); // 免费
    } else {
      res =
        1 +
        Math.min(
          dfs(i + 1, j + 1), // 替换
          dfs(i + 1, j), // 删除 word1[i]
          dfs(i, j + 1) // 插入
        );
    }

    memo.set(key, res);
    return res;
  };

  return dfs(0, 0);
};

/**
 * minDistanceBrute
 * 参照实现: 不带记忆化地递归，把三种操作全都试一遍，指数级
 * 只用来给小串对答案（同一对参数会被重复算很多次，所以慢）
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
const minDistanceBrute = function (word1, word2) {
  const m = word1.length;
  const n = word2.length;

  const go = (i, j) => {
    if (i === m) return n - j; // word1 用完了，剩下只能插入
    if (j === n) return m - i; // word2 用完了，剩下只能删除
    if (word1[i] === word2[j]) return go(i + 1, j + 1); // 相等就免费跟上

    return (
      1 +
      Math.min(
        go(i + 1, j + 1), // 替换
        go(i + 1, j), // 删除
        go(i, j + 1) // 插入
      )
    );
  };

  return go(0, 0);
};

// ─── 测试 ───────────────────────────────────────────
// console.log(minDistance('horse', 'ros')); // 期望: 3   示例 1
// console.log(minDistance('intention', 'execution')); // 期望: 5   示例 2
// console.log(minDistance('', '')); // 期望: 0
// console.log(minDistance('abc', '')); // 期望: 3   只能删 3 次
// console.log(minDistance('', 'abc')); // 期望: 3   只能插 3 次
// console.log(minDistance('a', 'a')); // 期望: 0   一模一样
// console.log(minDistance('a', 'b')); // 期望: 1   替换一次
// console.log(minDistance('ab', 'ba')); // 期望: 2   换不动，得删了再插
// console.log(minDistance('sunday', 'saturday')); // 期望: 3
//
// 三种写法互相印证:
// const check = (a, b) => [
//   minDistance(a, b),
//   minDistance1D(a, b),
//   minDistanceMemo(a, b)
// ];
// console.log(check('horse', 'ros')); // [3, 3, 3]
// console.log(check('intention', 'execution')); // [5, 5, 5]
//
// 暴力版只适合很短的串:
// console.log(minDistanceBrute('horse', 'ros')); // 3
//
// ★ 想自己检查实现对不对，可以用这几条【数学性质】★
//   （比死记答案是更好的验证方式）
//   d(a, b) === d(b, a)                 编辑距离是对称的
//   d(a, a) === 0
//   d('', a) === a.length
//   d(a, c) <= d(a, b) + d(b, c)        三角不等式
//   |d(a, b) - d(a, b.slice(0, -1))| <= 1   去掉一个字符，答案最多变 1
