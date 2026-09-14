/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 416. 分割等和子集 (Partition Equal Subset Sum)
 * 难度: 中等 | 标签: 数组、动态规划、背包问题、0-1 背包
 * 链接: https://leetcode.cn/problems/partition-equal-subset-sum/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个 只包含正整数 的 非空 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
 *
 * 示例 1：
 *
 *   输入：nums = [1,5,11,5]
 *   输出：true
 *   解释：数组可以分割成 [1, 5, 5] 和 [11] 。
 *
 * 示例 2：
 *
 *   输入：nums = [1,2,3,5]
 *   输出：false
 *   解释：数组不能分割成两个元素和相等的子集。
 *
 * 提示：
 *   - `1 <= nums.length <= 200`
 *   - `1 <= nums[i] <= 100`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 0-1 背包 —— 这题是背包问题的"入门原型"
 *
 * ★ 第一步永远是"翻译题意"★
 *
 *   题目说"分成两个和相等的子集"。设总和 sum，那两边各自都是 sum/2。
 *   换句话说 —— 只要能挑出一堆数字、它们的和刚好是 sum/2，
 *   剩下的数字自然就凑成另外一半。所以题目等价于:
 *
 *     能不能从数组里挑出若干个数字，让它们的和 【恰好等于 sum/2】？
 *
 *   于是: 每个数字 = 一件物品，数值 = 物品重量，背包容量 = sum/2。
 *         每件物品【最多用一次】，问能不能【恰好装满】。
 *   —— 这就叫 0-1 背包（0/1 表示"不选/选"，不能选半个、也不能重复选）。
 *
 * ★ 动态规划的思考模板（四步）★
 *
 *   1. 定义状态:  dp[i][j] = 只看前 i 个数字（nums[0..i-1]），能否凑出和 j
 *                答案是个 boolean，不是数字，这题是"可行性 DP"
 *   2. 转移方程:  面对第 i 个数字 x，就两个选择 ——
 *                  不选它: dp[i-1][j]              ← 看前 i-1 个能不能凑出 j
 *                  选它:   dp[i-1][j - x]          ← 看前 i-1 个能不能凑出 j-x
 *                  所以 dp[i][j] = dp[i-1][j] || dp[i-1][j-x]
 *                  ★ 两个分支都从 i-1 来 —— 这就是"每个数字只能用一次"的体现 ★
 *   3. 初始条件:  dp[i][0] = true（和 0 永远能凑出: 一个都不选）
 *                 其余全 false
 *   4. 返回什么:  dp[n][target]
 *
 * ★ 从二维压到一维 ★
 *
 *   观察转移式: dp[i][*] 只依赖 dp[i-1][*]（上一行），再往前的行根本不看。
 *   所以没必要留整个表格，一行数组滚着用就行:
 *
 *     dp[j] = dp[j] || dp[j - x]        （x 是当前正在处理的数字）
 *             ↑不选       ↑选
 *
 *   ★ 但是！这里有个致命细节: 遍历 j 必须【从大到小】★
 *
 * ★ 为什么必须倒着遍历 j —— 这题最大的坑 ★
 *
 *   拿 nums = [1, 2, 5] 试，sum = 8，target = 4。
 *   正确答案是 false（子集只有 1,2,5,3,6,7,8，没有 4）。
 *
 *   ── 正序遍历（j 从小到大），错的写法 ──
 *     初始 dp = [T, F, F, F, F]
 *
 *     x = 1:  j=1  dp[1] = dp[1] || dp[0] = T      ← dp[0] 是旧值，没问题
 *             j=2  dp[2] = dp[2] || dp[1] = T      ← ★ dp[1] 是【刚更新过】的！
 *                                                   相当于同一个 1 用了两次 → 1+1=2
 *             j=3  dp[3] = dp[3] || dp[2] = T      ← 又是同样的毛病, 1+1+1=3
 *             j=4  dp[4] = dp[4] || dp[3] = T      ← 1+1+1+1 = 4
 *     结果 dp[4] = true → 错误地返回 true ✗
 *
 *   ── 倒序遍历（j 从大到小），对的写法 ──
 *     x = 1:  j=4  dp[4] = F || dp[3]=F = F
 *             j=3  dp[3] = F || dp[2]=F = F
 *             j=2  dp[2] = F || dp[1]=F = F
 *             j=1  dp[1] = F || dp[0]=T = T        → dp = [T,T,F,F,F]
 *     x = 2:  j=4  dp[4] = F || dp[2]=F = F        ← ★ dp[2] 还是【旧的】F
 *             j=3  dp[3] = F || dp[1]=T = T        （1+2=3 用【两个不同】数字，合法）
 *             j=2  dp[2] = F || dp[0]=T = T        （数字 2 自己，合法）
 *             → dp = [T,T,T,T,F]
 *     x = 5:  j 从 4 到 5 → 直接不执行（容量 4 装不下 5）
 *     dp[4] = F → 正确返回 false ✓
 *
 *   ★ 一句话记住 ★
 *     倒序: dp[j-x] 读到的还是上一轮的旧值 → 每个数字最多用一次 = 0-1 背包
 *     正序: dp[j-x] 读到的是本轮刚更新的值 → 数字可以被重复用 = 完全背包
 *   （对照 322.零钱兑换: 那题硬币可以无限次用，所以它【正序】遍历，
 *     求的是"最少几个硬币"。两题放在一起记，区别就在这个循环方向。）
 *
 * ★ 提前剪枝（不写也对，写了更快）★
 *   1. sum 是奇数 → 直接 false（两半必须相等，总和必然是偶数）
 *   2. 某个数字 > target → 直接 false
 *      （它放不进任何一边，因为两边容量都只有 target）
 *
 * 易错点:
 *   1. ★ 内层 j 必须倒序 ★（见上，最重要）
 *   2. dp[0] = true 不能省 —— "一个都不选凑出和 0"是合法方案
 *   3. 别忘了先判 sum % 2，奇数和直接出局
 *   4. 凡是"每个元素只能用一次"的题，都要警惕倒序还是正序（这里是倒序）
 *
 * 复杂度:
 *   target = sum / 2 ≤ 200 * 100 / 2 = 10000
 *   一维 DP  —— 时间 O(n * target)，空间 O(target)        ← 本文件的主解法
 *   二维 DP  —— 时间 O(n * target)，空间 O(n * target)    （用来理解状态）
 */

/**
 * canPartition
 * 一维 DP: 0-1 背包可行性 —— 本文件的主解法
 * @param {number[]} nums
 * @return {boolean}
 */
const canPartition = function (nums) {
  let sum = 0;
  let max = 0;
  for (const x of nums) {
    sum += x;
    if (x > max) max = x;
  }

  // 剪枝 1: 总和是奇数，两半不可能相等
  if (sum % 2 !== 0) return false;

  const target = sum / 2; // 只要凑出这一半，剩下那半自然成立

  // 剪枝 2: 有数字比 target 还大，它塞不进任何一边
  if (max > target) return false;

  // dp[j] = 能否用【目前已处理过的数字】凑出和 j
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // 一个都不选 → 和为 0，这是种子值，不能省

  for (const x of nums) {
    // ★ 倒序！保证 dp[j - x] 读到的还是【上一轮】的旧值，
    //   也就是"还没有考虑过当前这个 x"的状态 → 每个数字只用一次
    for (let j = target; j >= x; j--) {
      dp[j] = dp[j] || dp[j - x]; // 不选 x || 选 x
    }
  }

  return dp[target];
};

/**
 * canPartition2D
 * 二维 DP: 状态写全，最适合理解"从哪来、到哪去"
 * （n=200、target=10000 时要开 200 万个格子，只是教学用，别背这个写法）
 * @param {number[]} nums
 * @return {boolean}
 */
const canPartition2D = function (nums) {
  let sum = 0;
  for (const x of nums) sum += x;
  if (sum % 2 !== 0) return false;

  const target = sum / 2;
  const n = nums.length;

  // dp[i][j] = 只看前 i 个数字（nums[0..i-1]），能否凑出和 j
  const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));
  for (let i = 0; i <= n; i++) dp[i][0] = true; // 和 0 永远凑得出

  for (let i = 1; i <= n; i++) {
    const x = nums[i - 1];
    for (let j = 1; j <= target; j++) {
      if (j < x) {
        // 容量不够，装不下 x，只能不选
        dp[i][j] = dp[i - 1][j];
      } else {
        // 不选 x || 选 x（选了就从 i-1 行、容量 j-x 处转移过来）
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - x];
      }
    }
  }

  return dp[n][target];
};

/**
 * canPartitionMemo
 * 记忆化搜索: 换个方向想 —— 从"还剩多少要凑"的角度递归
 * 思路和 dp 一模一样，但写起来更接近人脑的第一反应
 * @param {number[]} nums
 * @return {boolean}
 */
const canPartitionMemo = function (nums) {
  let sum = 0;
  for (const x of nums) sum += x;
  if (sum % 2 !== 0) return false;

  const target = sum / 2;
  const n = nums.length;
  const memo = new Map(); // key: i*(target+1)+rest → 结果

  // dfs(i, rest) = 只用 nums[i..] 这些数字，能不能凑出 rest
  const dfs = (i, rest) => {
    if (rest === 0) return true; // 凑齐了
    if (i === n || rest < 0) return false; // 没数字了 / 超了（都是正数，超了就回不来）

    const key = i * (target + 1) + rest;
    if (memo.has(key)) return memo.get(key);

    // 选 nums[i]，或者不选
    const ok = dfs(i + 1, rest - nums[i]) || dfs(i + 1, rest);
    memo.set(key, ok);
    return ok;
  };

  return dfs(0, target);
};

/**
 * canPartitionBrute
 * 参照实现: 枚举所有子集（每个数字选/不选），O(2^n)
 * 不用记忆化，就是纯暴力，只用来给上面的 dp 对答案（n 大了会爆炸）
 * @param {number[]} nums
 * @return {boolean}
 */
const canPartitionBrute = function (nums) {
  let sum = 0;
  for (const x of nums) sum += x;
  if (sum % 2 !== 0) return false;

  const target = sum / 2;

  const go = (i, s) => {
    if (s === target) return true;
    if (i === nums.length || s > target) return false; // 全是正数，s 只会变大
    return go(i + 1, s + nums[i]) || go(i + 1, s); // 选 / 不选
  };

  return go(0, 0);
};

// ─── 测试 ───────────────────────────────────────────
// console.log(canPartition([1, 5, 11, 5])); // 期望: true   [1,5,5] 和 [11]
// console.log(canPartition([1, 2, 3, 5])); // 期望: false  总和 11 是奇数，直接出局
// console.log(canPartition([1, 2, 5])); // 期望: false  ★ 正序遍历会错答 true 的那个例子
// console.log(canPartition([1, 1])); // 期望: true
// console.log(canPartition([2, 2, 3, 5])); // 期望: false  总和 12，凑不出 6
// console.log(canPartition([3, 3, 3, 3])); // 期望: true   3+3 = 3+3
// console.log(canPartition([100, 100])); // 期望: true   target = 100
// console.log(canPartition([1, 100, 3])); // 期望: false 总和 104 是偶数，但 100 > target(52)，被剪枝 2 拦下
//
// 四个实现互相印证:
// const check = (nums) => [
//   canPartition(nums),
//   canPartition2D(nums),
//   canPartitionMemo(nums),
//   canPartitionBrute(nums)
// ];
// console.log(check([1, 5, 11, 5]));  // [true, true, true, true]
// console.log(check([1, 2, 5]));      // [false, false, false, false]
//
// 压力测试（只有 dp 能扛住，brute 别碰）:
// const big = new Array(200).fill(100); // sum = 20000, target = 10000 = 100*100
// console.log(canPartition(big));       // 期望: true
