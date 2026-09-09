/**
 * LeetCode 热题 100 —— 链表
 *
 * 2. 两数相加 (Add Two Numbers)
 * 难度: 中等 | 标签: 递归、链表、数学
 * 链接: https://leetcode.cn/problems/add-two-numbers/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 *
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 *
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：l1 = [2,4,3], l2 = [5,6,4]
 *   输出：[7,0,8]
 *   解释：342 + 465 = 807.
 *
 * 示例 2：
 *
 *   输入：l1 = [0], l2 = [0]
 *   输出：[0]
 *
 * 示例 3：
 *
 *   输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 *   输出：[8,9,9,9,0,0,0,1]
 *
 * 提示：
 *   - 每个链表中的节点数在范围 `[1, 100]` 内
 *   - `0 <= Node.val <= 9`
 *   - 题目数据保证列表表示的数字不含前导零
 */

// 链表节点定义(与 LeetCode 一致)
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

// 辅助函数: 数组转链表
const toList = (arr) => {
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
};

// 辅助函数: 链表转数组
const toArray = (head) => {
  const res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
};

/**
 * addTwoNumbers
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode|null}
 */
const addTwoNumbers = function (l1, l2) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4])))); // 期望: [7, 0, 8]
