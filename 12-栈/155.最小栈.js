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

class MinStack {
  constructor() {
    // TODO: 初始化数据结构
  }

  /**
   * push(val)
   * @param {number} val
   * @return {void}
   */
  push(val) {
    // TODO
  }

  /**
   * pop()
   * @return {void}
   */
  pop() {
    // TODO
  }

  /**
   * top()
   * @return {number}
   */
  top() {
    // TODO
  }

  /**
   * getMin()
   * @return {number}
   */
  getMin() {
    // TODO
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
