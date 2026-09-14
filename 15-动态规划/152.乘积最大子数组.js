/**
 * LeetCode 热题 100 —— 动态规划
 *
 * 152. 乘积最大子数组 (Maximum Product Subarray)
 * 难度: 中等 | 标签: 数组、动态规划
 * 链接: https://leetcode.cn/problems/maximum-product-subarray/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
 *
 * 测试用例的答案是一个 32-位 整数。
 *
 * 请注意，一个只包含一个元素的数组的乘积是这个元素的值。
 *
 * 示例 1:
 *
 *   输入: nums = [2,3,-2,4]
 *   输出: 6
 *   解释: 子数组 [2,3] 有最大乘积 6。
 *
 * 示例 2:
 *
 *   输入: nums = [-2,0,-1]
 *   输出: 0
 *   解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
 *
 * 提示:
 *   - `1 <= nums.length <= 2 * 10^4`
 *   - `-10 <= nums[i] <= 10`
 *   - `nums` 的任何子数组的乘积都 保证 是一个 32-位 整数
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 动态规划 —— "最大子数组和"的加强版
 *
 * ★ 核心难点: 乘积不像和，负数会让【最大】瞬间变【最小】★
 *
 *   求和那题(53. 最大子数组和)只要维护一个"以 i 结尾的最大和"就够了,
 *   因为加上一个数不会把大的变小，单调性一直都在。
 *
 *   但乘积会翻盘! 一个很小的负数乘上当前这个负数，立刻变成很大的正数:
 *     例: [..., -50, ..., -4] 里  (-50) * (-4) = 200
 *
 *   所以必须【同时维护最大值和最小值】——
 *   那个"最小值"就是随时可能翻盘的潜力股，不能扔。
 *
 * ★ 动态规划的思考模板（四步）★
 *
 *   1. 定义状态:  dp[i] 到底表示什么？
 *   2. 转移方程:  dp[i] 能从哪些【更小的状态】推出来？
 *   3. 初始条件:  最小的那几个状态是多少？
 *   4. 返回什么:  答案是哪个 dp 值？
 *
 * 套到这题上:
 *
 *   1. 状态: maxDp[i] = 以 nums[i] 结尾 的子数组的【最大】乘积
 *            minDp[i] = 以 nums[i] 结尾 的子数组的【最小】乘积
 *            ("以 nums[i] 结尾"这个限定是 Kadane 类的核心, 不能省)
 *
 *   2. 转移: 以 nums[i] 结尾的子数组只有两种来源 ——
 *              a) 只有 nums[i] 自己（从 i 处重新开始）
 *              b) 前面接上 nums[i]，即 maxDp[i-1]*nums[i] 或 minDp[i-1]*nums[i]
 *            乘负数会翻转大小关系，所以两个都要拿来比:
 *              curMax = max(nums[i], maxDp[i-1]*nums[i], minDp[i-1]*nums[i])
 *              curMin = min(nums[i], maxDp[i-1]*nums[i], minDp[i-1]*nums[i])
 *            ★ 这两个式子的三个候选一模一样，只是最后取 max 还是 min ★
 *
 *   3. 初始: i = 0 时没有"前面"，就是 nums[0]:
 *              maxDp[0] = minDp[0] = nums[0]
 *
 *   4. 返回: 所有 maxDp[i] 中的最大值
 *            ★ 不是 maxDp[n-1]! 因为要的是"子数组"而不是"后缀",
 *              最大乘积不一定在末尾结束 ★
 *
 * 拿示例 1  [2, 3, -2, 4] 走一遍:
 *
 *   i  nums[i]   三个候选                      curMax  curMin  best
 *   ───────────────────────────────────────────────────────────────
 *   0     2      —（初始）                        2       2      2
 *   1     3      3, 3*2=6, 3*2=6                6       3      6
 *   2    -2      -2, -2*6=-12, -2*3=-6         -2     -12      6
 *   3     4      4, 4*(-2)=-8, 4*(-12)=-48      4     -48      6
 *   ───────────────────────────────────────────────────────────────
 *   → 6 ✓  对应子数组 [2,3]
 *
 *   注意 i=2 那一行: curMax 掉到了 -2，但 curMin 掉到 -12。
 *   这个 -12 就是"潜力股"—— 后面 i=3 并没有翻盘(×4 还是负)，
 *   但如果 i=3 是 -4，那么 -12 * -4 = 48 就会直接成为答案。
 *   只留 max 的写法在这里就废了。
 *
 * 再看示例 2  [-2, 0, -1]:
 *
 *   i  nums[i]   三个候选                      curMax  curMin  best
 *   ───────────────────────────────────────────────────────────────
 *   0    -2      —（初始）                       -2      -2     -2
 *   1     0      0, 0, 0                          0       0      0
 *   2    -1      -1, -1*0=0, -1*0=0              0      -1      0
 *   ───────────────────────────────────────────────────────────────
 *   → 0 ✓
 *
 *   ★ 0 的作用: 它把子数组"截断"了 —— 任何跨过 0 的乘积都是 0。
 *     这就是为什么 [-2,-1] 答案是 0 而不是 2: 它俩中间隔着 0，
 *     并不是一段连续的子数组。0 之后可以从头再来。
 *
 * ★ 为什么不能照搬"最大子数组和"的写法 ★
 *
 *   那题转移只有  dp[i] = max(nums[i], dp[i-1] + nums[i])
 *   这题如果只留 maxDp，看 [-2, 3, -4]:
 *       i=0: max = -2
 *       i=1: max = max(3, -2*3 = -6)      = 3
 *       i=2: max = max(-4, 3*-4 = -12)    = -4   → best = 3
 *   但正确答案是 24 = (-2) * 3 * (-4)。
 *   丢掉"最小值 -2"这条信息，就丢掉了后来翻盘的机会。
 *
 * ★ 为什么不用"前缀积 + 除法" / 滑动窗口 ★
 *   - 除法: 遇到 0 就没法除; 而且乘积不单调，窗口左右边界都不知道往哪挪
 *   - 前缀积: 得额外记录"每个负数出现前后的前缀积"，遇到 0 还要分段处理，
 *     比直接 DP 麻烦得多，还容易写错
 *
 * 易错点:
 *   1. ★ 必须同时维护 min ★（最重要，见上）
 *   2. 答案要取所有 curMax 的【最大值】，不能直接返回最后一步的 curMax
 *   3. ★ 更新 curMin 时不能用到【已经被更新过】的 curMax ★
 *      错的写法:
 *        curMax = Math.max(x, curMax*x, curMin*x)
 *        curMin = Math.min(x, curMax*x, curMin*x)   ← 这里的 curMax 已经是新的了!
 *      所以代码里先算完 nextMax / nextMin，再一起赋值。
 *   4. "nums[i] 自己单独成段"这个候选不能漏（对应"从这里重新开始"）
 *
 * 复杂度:
 *   数组 DP   —— 时间 O(n)，空间 O(n)
 *   滚动变量  —— 时间 O(n)，空间 O(1)   ← 本文件的主解法
 */

/**
 * maxProduct
 * 滚动变量: 只留上一轮的 max / min，空间 O(1)  —— 本文件的主解法
 * @param {number[]} nums
 * @return {number}
 */
const maxProduct = function (nums) {
  // prevMax = 以 nums[i-1] 结尾的最大乘积（上一轮的 curMax）
  // prevMin = 以 nums[i-1] 结尾的最小乘积（翻盘潜力股）
  let prevMax = nums[0];
  let prevMin = nums[0];
  let best = nums[0]; // 答案: 所有 curMax 里的最大值

  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    // 三个候选: 自己单独成段、接上一轮最大、接上一轮最小（负×负会翻大盘）
    const a = prevMax * x;
    const b = prevMin * x;

    const nextMax = Math.max(x, a, b);
    const nextMin = Math.min(x, a, b);

    // ★ 先算完 nextMax / nextMin 再一起赋值，
    //   避免"拿已经更新过的 curMax 去算 curMin"这个经典坑
    prevMax = nextMax;
    prevMin = nextMin;

    if (nextMax > best) best = nextMax;
  }

  return best;
};

/**
 * maxProductDP
 * 数组 DP: 把两个状态明明白白摆在数组上（最适合理解，不省空间）
 * @param {number[]} nums
 * @return {number}
 */
const maxProductDP = function (nums) {
  const n = nums.length;
  const maxDp = new Array(n); // maxDp[i] = 以 nums[i] 结尾的最大乘积
  const minDp = new Array(n); // minDp[i] = 以 nums[i] 结尾的最小乘积
  maxDp[0] = nums[0];
  minDp[0] = nums[0];
  let best = nums[0];

  for (let i = 1; i < n; i++) {
    const x = nums[i];
    // 这里取的是 maxDp[i-1] / minDp[i-1]（上一格），
    // 和写 maxDp[i] 不冲突，所以顺序天然安全
    maxDp[i] = Math.max(x, maxDp[i - 1] * x, minDp[i - 1] * x);
    minDp[i] = Math.min(x, maxDp[i - 1] * x, minDp[i - 1] * x);
    if (maxDp[i] > best) best = maxDp[i];
  }

  return best;
};

/**
 * maxProductBrute
 * 参照实现: 暴力枚举所有子数组，O(n²)
 * 思路最直白，只用来给上面的 dp 对答案（n 大了会超时）
 * @param {number[]} nums
 * @return {number}
 */
const maxProductBrute = function (nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let prod = 1;
    for (let j = i; j < nums.length; j++) {
      prod *= nums[j]; // 边乘边扩，省掉一层循环
      if (prod > best) best = prod;
    }
  }
  // 负数 × 0 会得到 -0，这里归一成 0，免得打印出 "暴力: -0" 看着奇怪
  // （主解法用 Math.max，本身不会产生 -0）
  return best === 0 ? 0 : best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxProduct([2, 3, -2, 4])); // 期望: 6   示例 1
// console.log(maxProduct([-2, 0, -1])); // 期望: 0   示例 2
// console.log(maxProduct([-2])); // 期望: -2  只有一个元素（负数也要返回它自己）
// console.log(maxProduct([-2, 3, -4])); // 期望: 24  ★ 只维护 max 的写法会错在这
// console.log(maxProduct([0, 2])); // 期望: 2   0 开头的边界
// console.log(maxProduct([2, -5, -2, -4, 3])); // 期望: 24
// console.log(maxProduct([-1, -2, -3, 0])); // 期望: 6   负数段被 0 截断
//
// 三个实现互相印证（都通过才算真的对）:
// const check = (nums) =>
//   [maxProduct(nums), maxProductDP(nums), maxProductBrute(nums)];
// console.log(check([2, 3, -2, 4]));   // [6, 6, 6]
// console.log(check([-2, 0, -1]));     // [0, 0, 0]
// console.log(check([-2, 3, -4]));     // [24, 24, 24]
