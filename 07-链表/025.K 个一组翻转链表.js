/**
 * LeetCode 热题 100 —— 链表
 *
 * 25. K 个一组翻转链表 (Reverse Nodes in k-Group)
 * 难度: 困难 | 标签: 递归、链表
 * 链接: https://leetcode.cn/problems/reverse-nodes-in-k-group/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。
 *
 * `k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。
 *
 * 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4,5], k = 2
 *   输出：[2,1,4,3,5]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4,5], k = 3
 *   输出：[3,2,1,4,5]
 *
 * 提示：
 *   - 链表中的节点数目为 `n`
 *   - `1 <= k <= n <= 5000`
 *   - `0 <= Node.val <= 1000`
 *
 * 进阶：你可以设计一个只用 `O(1)` 额外内存空间的算法解决此问题吗？
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
 * reverseKGroup
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode|null}
 */
const reverseKGroup = function (head, k) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 2))); // 期望: [2, 1, 4, 3, 5]
