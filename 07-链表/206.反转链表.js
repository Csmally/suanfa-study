/**
 * LeetCode 热题 100 —— 链表
 *
 * 206. 反转链表 (Reverse Linked List)
 * 难度: 简单 | 标签: 递归、链表
 * 链接: https://leetcode.cn/problems/reverse-linked-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4,5]
 *   输出：[5,4,3,2,1]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [1,2]
 *   输出：[2,1]
 *
 * 示例 3：
 *
 *   输入：head = []
 *   输出：[]
 *
 * 提示：
 *   - 链表中节点的数目范围是 `[0, 5000]`
 *   - `-5000  
 *
 * 进阶：链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？
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
 * reverseList
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const reverseList = function (head) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(reverseList(toList([1, 2, 3, 4, 5])))); // 期望: [5, 4, 3, 2, 1]
