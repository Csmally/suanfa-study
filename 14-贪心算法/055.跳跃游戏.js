/**
 * LeetCode 热题 100 —— 贪心算法
 *
 * 55. 跳跃游戏 (Jump Game)
 * 难度: 中等 | 标签: 贪心、数组、动态规划
 * 链接: https://leetcode.cn/problems/jump-game/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个非负整数数组 `nums` ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。
 *
 * 判断你是否能够到达最后一个下标，如果可以，返回 `true` ；否则，返回 `false` 。
 *
 * 示例 1：
 *
 *   输入：nums = [2,3,1,1,4]
 *   输出：true
 *   解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
 *
 * 示例 2：
 *
 *   输入：nums = [3,2,1,0,4]
 *   输出：false
 *   解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
 *
 * 提示：
 *   - `1 <= nums.length <= 10^4`
 *   - `0 <= nums[i] <= 10^5`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 贪心 —— 只关心"最远能覆盖到哪"
 *
 * ★ 关键转念: 不要想"每一步跳几格"，只想"最远能到哪"★
 *
 *   这题的陷阱是让人去枚举"跳跃方案"—— 那是指数级的。
 *   但其实我们【根本不需要知道具体怎么跳过去】，
 *   只需要知道一个数: 从起点出发，最远能覆盖到哪个下标。
 *
 *   为什么一个数就够了？因为 nums[i] 是【最大】跳跃长度，
 *   所以"能到达 i"就意味着"0 到 i 之间的每一个位置都必然能到"
 *   （少跳一点就行）。这就是【区间覆盖】的思路。
 *
 *   于是只需维护一个 reach = 当前能覆盖到的最远下标:
 *     从 0 开始遍历，对每个【可达的】位置 i:
 *       reach = max(reach, i + nums[i])
 *     一旦 reach 够到终点，立刻返回 true
 *     一旦发现某个 i > reach，说明中间断了，返回 false
 *
 * 拿 [2,3,1,1,4] 走一遍:
 *
 *   i   nums[i]   可达?   reach
 *   ──────────────────────────────────────
 *   0   2         ✓       2           （0+2）
 *   1   3         ✓       4  ★        （1+3，够到终点了）
 *   → true
 *
 * 拿 [3,2,1,0,4] 走一遍:
 *
 *   i   nums[i]   可达?   reach
 *   ──────────────────────────────────────
 *   0   3         ✓       3
 *   1   2         ✓       3           （1+2=3，没变）
 *   2   1         ✓       3
 *   3   0         ✓       3           （3+0=3，跳不动了）
 *   4   4         ✗       —           i=4 > reach=3，断了
 *   → false
 *
 * 易错点:
 *   1. ★ 先判"当前位置可达"，再更新 reach ★
 *      反过来写就会用一个"根本到不了的位置"去扩大 reach
 *   2. ★ reach = Math.max(reach, i + nums[i])，别写成 reach = i + nums[i] ★
 *      直接赋值的话 reach 可能【变小】（当 nums[i] 很小时）
 *   3. 循环正常跑完 → return true（n = 1 这类边界天然走这条）
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 *
 * ── 另一条路: 从后往前（见 canJumpBackward） ──
 *   换个方向想: 从右往左扫，维护"目前已知能到达终点的最左位置" last。
 *   如果 i + nums[i] >= last，说明 i 也能到终点，把 last 缩到 i。
 *   最后看 last 是不是 0。
 *   同样是 O(n)，但完全不需要"可达性"这个概念，更贴合
 *   "从终点倒推"的直觉。
 */

/**
 * canJump
 * 贪心: 维护"最远可达下标"
 * 输入: nums = [2,3,1,1,4]
 * @param {number[]} nums
 * @return {boolean}
 */
const canJump = function (nums) {
  let reach = 0; // 当前能覆盖到的最远下标

  for (let i = 0; i < nums.length; i++) {
    // ★ 先判可达性: i 已经超出覆盖范围，中间断了
    if (i > reach) return false;

    reach = Math.max(reach, i + nums[i]); // ★ 取 max，别直接赋值
    if (reach >= nums.length - 1) return true; // 够到终点了
  }

  return true;
};

/**
 * canJumpBackward
 * 从后往前: 维护"已知能到终点的最左位置"
 * @param {number[]} nums
 * @return {boolean}
 */
const canJumpBackward = function (nums) {
  let last = nums.length - 1; // 目前已知"能到达终点"的最左下标

  // 从倒数第二个开始往前扫
  for (let i = nums.length - 2; i >= 0; i--) {
    // i 能跳到 last（或更远），说明 i 也能到终点
    if (i + nums[i] >= last) last = i;
  }

  return last === 0; // 起点也能到终点
};

// ─── 测试 ───────────────────────────────────────────
// console.log(canJump([2, 3, 1, 1, 4])); // 期望: true
// console.log(canJump([3, 2, 1, 0, 4])); // 期望: false
// console.log(canJump([0]));             // 期望: true   ← 起步就是终点
// console.log(canJump([0, 1]));          // 期望: false  ← 一步都跳不动
// console.log(canJump([1]));             // 期望: true
// console.log(canJump([2, 0, 0]));       // 期望: true   ← 直接跳到最后
// console.log(canJump([1, 0, 1]));       // 期望: false  ← 卡在 0 上
// console.log(canJump([5, 0, 0, 0, 0, 0])); // 期望: true
// console.log(canJumpBackward([2, 3, 1, 1, 4])); // 期望: true
//
// 参照实现(从终点反向 BFS / 标记可达, 思路完全不同):
// const ref = (nums) => {
//   const n = nums.length;
//   const ok = new Array(n).fill(false);
//   ok[n - 1] = true;                         // 终点自己可达
//   for (let i = n - 2; i >= 0; i--) {
//     for (let step = 1; step <= nums[i] && i + step < n; step++) {
//       if (ok[i + step]) { ok[i] = true; break; }
//     }
//   }
//   return ok[0];
// };
