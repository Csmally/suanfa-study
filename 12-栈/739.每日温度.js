/**
 * LeetCode 热题 100 —— 栈
 *
 * 739. 每日温度 (Daily Temperatures)
 * 难度: 中等 | 标签: 栈、数组、单调栈
 * 链接: https://leetcode.cn/problems/daily-temperatures/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。
 *
 * 示例 1:
 *
 *   输入: temperatures = [73,74,75,71,69,72,76,73]
 *   输出: [1,1,4,2,1,1,0,0]
 *
 * 示例 2:
 *
 *   输入: temperatures = [30,40,50,60]
 *   输出: [1,1,1,0]
 *
 * 示例 3:
 *
 *   输入: temperatures = [30,60,90]
 *   输出: [1,1,0]
 *
 * 提示：
 *   - `1 <= temperatures.length <= 10^5`
 *   - `30 <= temperatures[i] <= 100`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 单调栈（热题 100 里第一次出现，很重要）
 *
 * ★ 关键转念 ★
 *
 *   暴力做法: 对每一天往后一个个找更高的 —— O(n²)。
 *             n = 10^5 时是 10^10 次操作，必超时。
 *
 *   痛点在哪儿？那些"其实早就知道答案"的天，还在被反复扫描。
 *   能不能让它们【一次扫描就全部结算掉】？
 *
 *   能。维护一个栈，栈里存的是【还没找到答案的那些天的下标】，
 *   而且它们的温度从栈底到栈顶【递减】。
 *
 *   为什么递减？因为每压入新的一天之前，都会把所有比它矮的弹掉 ——
 *   这正是"单调栈"这个名字的由来。
 *
 *   于是遍历到第 i 天（温度 t）时:
 *     只要【栈顶那天的温度 < t】，就意味着 ——
 *     栈顶那天盼的"下一个更高温度"就是今天！
 *         answer[栈顶] = i - 栈顶      （相隔的天数）
 *         弹掉它
 *     一直弹，直到栈空 或 栈顶温度 >= t 为止。
 *   最后把 i 压栈（今天也变成"等待者"）。
 *
 * 拿 [73, 74, 75, 71, 69, 72, 76, 73] 走一遍:
 *
 *   i   温度   栈(存下标)     动作
 *   ──────────────────────────────────────────────────────────
 *   0    73    [0]            push
 *   1    74    [1]            temp[0]=73<74 → ans[0]=1，弹；push 1
 *   2    75    [2]            temp[1]=74<75 → ans[1]=1，弹；push 2
 *   3    71    [2,3]          75>=71 → 不弹，push 3
 *   4    69    [2,3,4]        71>=69 → 不弹，push 4
 *   5    72    [2,5]          temp[4]=69<72 → ans[4]=1，弹
 *                             temp[3]=71<72 → ans[3]=2，弹
 *                             temp[2]=75>=72 → 停；push 5
 *   6    76    [6]            temp[5]=72<76 → ans[5]=1，弹
 *                             temp[2]=75<76 → ans[2]=4，弹；push 6
 *   7    73    [6,7]          76>=73 → 不弹，push 7
 *   结束: 栈里剩 6、7 没结算 → 它们的答案就是初始值 0
 *
 *   → [1, 1, 4, 2, 1, 1, 0, 0] ✓
 *
 * 易错点:
 *   1. ★ 栈里存的是【下标】，不是温度 ★
 *      因为答案要算"隔了几天"（i - j），只存温度就算不出来
 *   2. ★ 弹栈条件是 temperatures[栈顶] < 当前温度，【不能用 <=】★
 *      题目要的是"下一个【更高】的温度"，相等不算更高。
 *      用 <= 的话 [30, 30, 40] 会答成 [1, 1, 0]，
 *      而正确答案是 [2, 1, 0]（第 0 天的下一个更高是第 2 天）
 *   3. answer 初始化成全 0 就行 —— "后面没有更高温度"正好就是 0，
 *      不用最后再特判一遍
 *
 * 为什么是 O(n): 每个下标最多进栈一次、出栈一次。
 *   内层 while 看着像嵌套，但总共只弹 n 次，均摊下来是 O(1)。
 *
 * 复杂度: 时间 O(n)，空间 O(n)（栈最多装 n 个下标）
 *
 * ── 对照: 暴力做法（见 dailyTemperaturesBrute） ──
 *   对每一天往后线性找。O(n²)，n = 10^5 时不可行，
 *   但逻辑最直白，也正好拿来当测试的参照实现。
 *
 * ── 还有一条路: 从右往左扫 + 跳跃 ──
 *   从后往前算，利用"已经算好的答案"直接跳到下一个可能更高的位置，
 *   而不是一格一格挪。也是 O(n) 均摊，但推断起来绕，
 *   不如单调栈直观，这里不展开。
 */

/**
 * dailyTemperatures
 * 单调栈
 * 输入: temperatures = [73,74,75,71,69,72,76,73]
 * @param {number[]} temperatures
 * @return {number[]}
 */
const dailyTemperatures = function (temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0); // 默认 0，正好对应"后面没有更高的"
  const stack = []; // 存【下标】，对应温度从栈底到栈顶递减

  for (let i = 0; i < n; i++) {
    const t = temperatures[i];

    // 栈顶那天的温度比今天低 → 它等到了，结算并弹出
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < t) {
      const j = stack.pop();
      answer[j] = i - j; // 相隔天数
    }

    stack.push(i); // 今天也进栈，等以后的某天来结算
  }

  return answer;
};

/**
 * dailyTemperaturesBrute
 * 暴力对照: 每天往后线性找（O(n²)，会超时，仅作参照）
 * @param {number[]} temperatures
 * @return {number[]}
 */
const dailyTemperaturesBrute = function (temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i;
        break;
      }
    }
  }

  return answer;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // 期望: [1, 1, 4, 2, 1, 1, 0, 0]
// console.log(dailyTemperatures([30, 40, 50, 60])); // 期望: [1, 1, 1, 0]
// console.log(dailyTemperatures([30, 60, 90]));     // 期望: [1, 1, 0]
// console.log(dailyTemperatures([90, 80, 70]));     // 期望: [0, 0, 0]  ← 一路递减
// console.log(dailyTemperatures([30]));             // 期望: [0]
// console.log(dailyTemperatures([30, 30, 40]));     // 期望: [2, 1, 0]  ← 相等不算"更高"！
//
// 顺便看看把 < 写成 <= 会错成什么样:
// const buggy = (temperatures) => {
//   const n = temperatures.length;
//   const answer = new Array(n).fill(0);
//   const stack = [];
//   for (let i = 0; i < n; i++) {
//     while (stack.length > 0 && temperatures[stack[stack.length - 1]] <= temperatures[i]) {  // ← 错
//       const j = stack.pop();
//       answer[j] = i - j;
//     }
//     stack.push(i);
//   }
//   return answer;
// };
// console.log(buggy([30, 30, 40])); // 会输出 [1,1,0]，正确答案是 [2,1,0]
