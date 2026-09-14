/**
 * LeetCode 热题 100 —— 栈
 *
 * 84. 柱状图中最大的矩形 (Largest Rectangle in Histogram)
 * 难度: 困难 | 标签: 栈、数组、单调栈、区间最值查询
 * 链接: https://leetcode.cn/problems/largest-rectangle-in-histogram/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。
 *
 * 求在该柱状图中，能够勾勒出来的矩形的最大面积。
 *
 * 示例 1:
 *
 * [图片]
 *
 *   输入：heights = [2,1,5,6,2,3]
 *   输出：10
 *   解释：最大的矩形为图中红色区域，面积为 10
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入： heights = [2,4]
 *   输出： 4
 *
 * 提示：
 *   - `1 <= heights.length <=10^5`
 *   - `0 <= heights[i] <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 单调栈 —— 求每根柱子"左右第一个更矮的"在哪
 *
 * ★ 关键转念 ①: 最优矩形的高，一定等于某根柱子的高 ★
 *
 *   假设最优矩形的高不等于任何柱子的高，那它的上边沿一定卡在
 *   两根柱子之间 —— 那把矩形往上抬一点点，宽度不变、高度变大，
 *   面积只会更大，矛盾。
 *
 *   所以答案一定能写成【某根柱子的高度 × 某个宽度】。
 *   于是问题变成:
 *
 *     对每根柱子 i，以 heights[i] 为高，最宽能有多宽？
 *
 * ★ 关键转念 ②: 那个宽度由"左右两边第一根更矮的柱子"决定 ★
 *
 *   设左边第一根比 heights[i] 矮的下标是 left，
 *      右边第一根比 heights[i] 矮的下标是 right，
 *   那么以 heights[i] 为高的矩形最多只能撑到 (left, right) 这个开区间里:
 *
 *     宽度 = right - left - 1
 *     面积 = heights[i] * (right - left - 1)
 *
 *   因为再往外扩一点点，就会被那根更矮的柱子"卡住"（高不上去）。
 *
 * ★ 关键转念 ③: "左右第一个更矮的"正是单调栈的拿手好戏 ★
 *
 *   维护一个【从栈底到栈顶高度递增】的栈。遍历到 i 时:
 *     只要【栈顶比 heights[i] 高】，说明栈顶那根柱子的"右边第一根
 *     更矮的"就是 i —— 它等到了，可以【结算】了。
 *     弹出 j，此时【弹完后】的新栈顶就是 j 的"左边第一根更矮的"。
 *
 *   （和 739 每日温度是同一个套路: 让栈顶"等"，等到比自己矮的
 *     那天出现就结算。区别只是结算时算的东西不一样。）
 *
 * ★ 双哨兵技巧（本题最漂亮的地方）★
 *
 *   在数组【首尾各加一个高度 0】:
 *     - 末尾的 0: 保证遍历到最后，栈里所有柱子都会被弹出来结算
 *                 （否则还得在循环外补一段"清空栈"的代码）
 *     - 开头的 0: 保证栈【永远不会空】，左边界不用特判
 *                 （弹完 j 之后栈里一定有东西当左边界）
 *   两个哨兵一共省掉了三四处分情况讨论。
 *
 * 拿 [2,1,5,6,2,3] 走一遍（h = [0,2,1,5,6,2,3,0]）:
 *
 *   i   h[i]   栈(下标)       动作
 *   ─────────────────────────────────────────────────────
 *   1    2     [0,1]        不弹，push
 *   2    1     [0,2]        h[1]=2>1 → 弹 1，宽=2-0-1=1，面积 2
 *   3    5     [0,2,3]      不弹，push
 *   4    6     [0,2,3,4]    不弹，push
 *   5    2     [0,2,5]      h[4]=6>2 → 弹 4，宽=5-3-1=1，面积 6
 *                           h[3]=5>2 → 弹 3，宽=5-2-1=2，面积 10 ★
 *   6    3     [0,2,5,6]    不弹，push
 *   7    0     [0,7]        h[6]=3>0 → 弹 6，宽=7-5-1=1，面积 3
 *                           h[5]=2>0 → 弹 5，宽=7-2-1=4，面积 8
 *                           h[2]=1>0 → 弹 2，宽=7-0-1=6，面积 6
 *   答案 10 ✓
 *
 * 易错点:
 *   1. ★ 宽度是 i - 左边界 - 1，而左边界是【弹完之后】的新栈顶 ★
 *      顺序搞错（先算宽度再弹）就全错了
 *   2. ★ 首尾两个哨兵必须高度是 0 ★
 *      heights[i] >= 0，所以 0 一定能兜住，保证栈不空、最后能清空
 *   3. 别用"对每根柱子向两边暴力扩展" —— 那是 O(n²)，
 *      n = 10^5 时不可行
 *
 * 为什么是 O(n): 每个下标进栈一次、出栈一次，内层 while 总共弹 n 次。
 *
 * 复杂度: 时间 O(n)，空间 O(n)
 *
 * ── 另一条路: 先算出左右边界数组，再算面积（见 largestRectangleAreaBounds） ──
 *   把"求左右第一个更矮"这件事拆成两趟扫描，显式存进 left[]、right[]
 *   两个数组，最后再统一算面积。代码更长，但"左右边界"这个核心
 *   概念是摆在明面上的，比一次性写法好懂很多。
 */

/**
 * largestRectangleArea
 * 单调栈 + 双哨兵（一次遍历）
 * 输入: heights = [2,1,5,6,2,3]
 * @param {number[]} heights
 * @return {number}
 */
const largestRectangleArea = function (heights) {
  // 首尾各加一个高度 0 的哨兵
  const h = [0, ...heights, 0];
  const stack = [0]; // 存下标，对应高度从栈底到栈顶【递增】
  let best = 0;

  for (let i = 1; i < h.length; i++) {
    // 栈顶比当前高 → 栈顶的"右边第一个更矮的"就是 i，结算它
    while (h[stack[stack.length - 1]] > h[i]) {
      const j = stack.pop(); // 要结算的柱子
      const height = h[j];
      // ★ 弹完之后，新栈顶就是 j 的"左边第一个更矮的"
      const width = i - stack[stack.length - 1] - 1;
      best = Math.max(best, height * width);
    }

    stack.push(i); // 当前柱子也进栈等着
  }

  return best;
};

/**
 * largestRectangleAreaBounds
 * 拆开写: 先求左右边界数组，再统一算面积
 * @param {number[]} heights
 * @return {number}
 */
const largestRectangleAreaBounds = function (heights) {
  const n = heights.length;

  // ── 第一趟: 每根柱子【左边】第一个比它矮的下标（没有就是 -1） ──
  const left = new Array(n);
  const stack = [];

  for (let i = 0; i < n; i++) {
    // 比自己高或等高的都弹掉，剩下的栈顶就是"左边第一个更矮的"
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
      stack.pop();
    }
    left[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
    stack.push(i);
  }

  // ── 第二趟: 每根柱子【右边】第一个比它矮的下标（没有就是 n） ──
  const right = new Array(n);
  stack.length = 0; // 复用同一个栈

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
      stack.pop();
    }
    right[i] = stack.length === 0 ? n : stack[stack.length - 1];
    stack.push(i);
  }

  // ── 第三趟: 每根柱子当高，算面积取最大 ──
  let best = 0;
  for (let i = 0; i < n; i++) {
    const width = right[i] - left[i] - 1;
    best = Math.max(best, heights[i] * width);
  }

  return best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 期望: 10
// console.log(largestRectangleArea([2, 4]));      // 期望: 4   ← 示例 2
// console.log(largestRectangleArea([1]));         // 期望: 1
// console.log(largestRectangleArea([0]));         // 期望: 0   ← 高度可以为 0
// console.log(largestRectangleArea([2, 2]));      // 期望: 4   ← 相等高度，宽度 2
// console.log(largestRectangleArea([1, 1, 1]));   // 期望: 3
// console.log(largestRectangleArea([5, 4, 3, 2, 1])); // 期望: 9 ← 递减
// console.log(largestRectangleArea([1, 2, 3, 4, 5])); // 期望: 9 ← 递增
// console.log(largestRectangleAreaBounds([2, 1, 5, 6, 2, 3])); // 期望: 10
//
// 暴力参照(对每根柱子向两边扩展, O(n^2)):
// const brute = (heights) => {
//   let best = 0;
//   for (let i = 0; i < heights.length; i++) {
//     let l = i, r = i;
//     while (l > 0 && heights[l - 1] >= heights[i]) l--;
//     while (r < heights.length - 1 && heights[r + 1] >= heights[i]) r++;
//     best = Math.max(best, heights[i] * (r - l + 1));
//   }
//   return best;
// };
