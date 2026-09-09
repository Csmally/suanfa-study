/**
 * LeetCode 热题 100 —— 链表
 *
 * 234. 回文链表 (Palindrome Linked List)
 * 难度: 简单 | 标签: 栈、递归、链表、双指针
 * 链接: https://leetcode.cn/problems/palindrome-linked-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,2,1]
 *   输出：true
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [1,2]
 *   输出：false
 *
 * 提示：
 *   - 链表中节点数目在范围`[1, 10^5]` 内
 *   - `0 <= Node.val <= 9`
 *
 * 进阶：你能否用 `O(n)` 时间复杂度和 `O(1)` 空间复杂度解决此题？
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
 * isPalindrome
 * @param {ListNode} head
 * @return {boolean}
 */
const isPalindrome = function (head) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isPalindrome(toList([1, 2, 2, 1]))); // 期望: true
// console.log(isPalindrome(toList([1, 2]))); // 期望: false
