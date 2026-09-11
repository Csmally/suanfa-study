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
  let arr = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  let myHead = null;
  let curNode = null;
  let index = 0;
  while (arr.length) {
    const item = arr.pop();
    const node = {
      val: item,
      next: null,
    }
    if (index === 0) {
      myHead = node;
    } else {
      curNode.next = node;
    }
    curNode = node;
    index ++;
  }
  return myHead;
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 原地反转（进阶要求 O(1) 空间）
 *
 * 迭代法（三指针）: 用 prev / cur 两个指针逐个"掰弯"节点的 next 指向
 *   1. 先存下 cur.next（否则改完指针就找不到下一个节点了）
 *   2. cur.next 指向 prev（反转指向）
 *   3. prev、cur 各前进一格
 *   循环结束时 cur 走到 null，prev 停在原链表尾节点 = 新头
 *
 * 例: 1→2→3→null
 *   prev=null, cur=1: 1→null, prev=1, cur=2
 *   prev=1,    cur=2: 2→1,    prev=2, cur=3
 *   prev=2,    cur=3: 3→2,    prev=3, cur=null → 返回 3→2→1 ✓
 *
 * 递归法: 先反转后半段，再让"下一个节点指向自己"
 *   1. 递归到最后一个节点，它就是新头
 *   2. head.next.next = head（下一个节点指回自己）
 *   3. head.next = null（自己指向 null，防止成环）
 *
 * 复杂度: 迭代 时间 O(n) 空间 O(1)；
 *         递归 时间 O(n) 空间 O(n)（调用栈）
 */

/**
 * reverseListIterative
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const reverseListIterative = function (head) {
  let prev = null; // 已反转部分的头
  let cur = head; // 待处理的节点

  debugger

  while (cur) {
    const next = cur.next; // 1. 先记住下一个节点
    cur.next = prev; // 2. 当前节点指向前一个（反转）
    prev = cur; // 3. prev 前进
    cur = next; // 4. cur 前进
  }

  return prev; // 循环结束时 prev = 原链表尾节点 = 新头
};

/**
 * reverseListRecursive
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const reverseListRecursive = function (head) {
  // 空链表或只剩一个节点：它就是新头
  if (head === null || head.next === null) {
    return head;
  }

  const newHead = reverseListRecursive(head.next); // 反转后半段，拿到新头
  head.next.next = head; // 让下一个节点指回自己
  head.next = null; // 自己指向 null，防止成环

  return newHead;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(reverseList(toList([1, 2, 3, 4, 5])))); // 期望: [5, 4, 3, 2, 1]
// console.log(toArray(reverseListIterative(toList([1, 2, 3, 4, 5])))); // 期望: [5, 4, 3, 2, 1]
// console.log(toArray(reverseListRecursive(toList([1, 2, 3, 4, 5])))); // 期望: [5, 4, 3, 2, 1]
