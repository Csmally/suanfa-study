/**
 * LeetCode 热题 100 —— 栈
 *
 * 155. 最小栈 (Min Stack)
 * 难度: 中等 | 标签: 栈、设计
 * 链接: https://leetcode.cn/problems/min-stack/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。
 *
 * 实现 `MinStack` 类:
 *   - `MinStack()` 初始化堆栈对象。
 *   - `void push(int value)` 将元素 `value` 推入堆栈。
 *   - `void pop()` 删除堆栈顶部的元素。
 *   - `int top()` 获取堆栈顶部的元素。
 *   - `int getMin()` 获取堆栈中的最小元素。
 *
 * 示例 1:
 *
 *   输入：
 *   ["MinStack","push","push","push","getMin","pop","top","getMin"]
 *   [[],[-2],[0],[-3],[],[],[],[]]
 *
 *   输出：
 *   [null,null,null,null,-3,null,0,-2]
 *
 *   解释：
 *   MinStack minStack = new MinStack();
 *   minStack.push(-2);
 *   minStack.push(0);
 *   minStack.push(-3);
 *   minStack.getMin();   --> 返回 -3.
 *   minStack.pop();
 *   minStack.top();      --> 返回 0.
 *   minStack.getMin();   --> 返回 -2.
 *
 * 提示：
 *   - `-2^31 <= val <= 2^31 - 1`
 *   - `pop`、`top` 和 `getMin` 操作总是在 非空栈 上调用
 *   - `push`, `pop`, `top`, and `getMin`最多被调用 `3 * 10^4` 次
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 用"辅助栈"把每个位置的最小值缓存下来
 *
 * ★ 关键转念: getMin 到底难在哪？★
 *
 *   如果只是"求当前栈的最小值"，遍历一遍就行了 —— 但那是 O(n)。
 *   真正的难点是: 【pop 之后，最小值可能要"退回去"】。
 *
 *     push(-2)   → 最小值 -2
 *     push(0)    → 最小值还是 -2
 *     push(-3)   → 最小值变成 -3
 *     pop()      → 弹掉 -3 之后，最小值必须【变回 -2】
 *
 *   光记一个"当前最小值"变量是不够的 —— 它被弹掉之后，
 *   你得知道"之前那个最小值是谁"。
 *
 *   所以要把【最小值的历史】也存下来，而且必须和栈元素【同步】。
 *
 * ── 写法一: 两个栈同步（最经典，本文件采用） ──
 *   主栈 stack     : 存正常的值
 *   辅助栈 minStack: minStack[i] 存"stack[0..i] 这一段里的最小值"
 *   两个栈【永远等高】—— push 一起 push，pop 一起 pop。
 *
 *   getMin 直接读 minStack 的栈顶，O(1)。
 *   pop 时两个栈一起弹，"退回到上一个最小值"这件事就自动完成了。
 *
 * ── 写法二: 一个栈，每项存 [值, 当时的最小值]（见 MinStackPair） ──
 *   把两个栈"捆"成一对，一个数组就够，更紧凑。
 *   本质和写法一完全一样，只是打包方式不同。
 *
 * 易错点:
 *   1. ★ 在"只在更小时才压辅助栈"的紧凑写法里，
 *      判断条件必须写成 val <= 当前最小值，【等号不能少】★
 *      因为连续 push 两个相同的 5 时，辅助栈也得存两份；
 *      否则 pop 掉一个 5 之后，最小值就跟着丢了。
 *      （本文件的写法一是"每次都压"，两个栈天然等高，不存在这个坑）
 *   2. 如果用两个栈，pop 时必须【两个一起弹】，不能只弹主栈
 *   3. 别用"每次 getMin 都遍历一遍"糊弄 —— 那是 O(n)，
 *      题目要求 O(1)
 *
 * 复杂度: 所有操作 O(1)；空间 O(n)
 */

class MinStack {
  constructor() {
    this.stack = []; // 主栈: 存正常的值
    this.minStack = []; // 辅助栈: 每一项是"到这一层为止的最小值"
  }

  /**
   * push(val)
   * @param {number} val
   * @return {void}
   */
  push(val) {
    this.stack.push(val);

    // 辅助栈【每次都压】，保持和主栈等高
    if (this.minStack.length === 0) {
      this.minStack.push(val); // 第一个元素，它就是最小值
    } else {
      const curMin = this.minStack[this.minStack.length - 1];
      this.minStack.push(val < curMin ? val : curMin); // 新来的更小就更新，否则沿用
    }
  }

  /**
   * pop()
   * @return {void}
   */
  pop() {
    this.stack.pop();
    this.minStack.pop(); // ★ 必须一起弹，否则"退回上一个最小值"就错位了
  }

  /**
   * top()
   * @return {number}
   */
  top() {
    return this.stack[this.stack.length - 1];
  }

  /**
   * getMin()
   * @return {number}
   */
  getMin() {
    return this.minStack[this.minStack.length - 1]; // 直接读栈顶，O(1)
  }
}

/**
 * MinStackPair
 * 写法二: 一个栈，每项存 [值, 入栈那一刻栈内的最小值]
 */
class MinStackPair {
  constructor() {
    this.stack = []; // 每项是 [val, 当时的最小值]
  }

  push(val) {
    const curMin =
      this.stack.length === 0
        ? val
        : Math.min(val, this.stack[this.stack.length - 1][1]);

    this.stack.push([val, curMin]);
  }

  pop() {
    this.stack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1][0];
  }

  getMin() {
    return this.stack[this.stack.length - 1][1];
  }
}

// ─── 测试 ───────────────────────────────────────────
// const stack = new MinStack();
// stack.push(-2);
// stack.push(0);
// stack.push(-3);
// console.log(stack.getMin()); // 期望: -3
// stack.pop();
// console.log(stack.top());    // 期望: 0
// console.log(stack.getMin()); // 期望: -2
//
// 重复最小值是最容易翻车的情形,一定要试:
// const s2 = new MinStack();
// s2.push(5); s2.push(5); s2.push(7);
// console.log(s2.getMin());  // 期望: 5
// s2.pop();                  // 弹掉 7
// console.log(s2.getMin());  // 期望: 5
// s2.pop();                  // 弹掉一个 5 —— 还剩一个 5
// console.log(s2.getMin());  // 期望: 5  ← 写成 val < curMin 的紧凑版会在这里丢最小值
//
// 参照实现(朴素 O(n) 遍历):
// class NaiveMinStack {
//   constructor() { this.arr = []; }
//   push(v) { this.arr.push(v); }
//   pop() { this.arr.pop(); }
//   top() { return this.arr[this.arr.length - 1]; }
//   getMin() { return Math.min(...this.arr); }
// }
