/**
 * LeetCode 热题 100 —— 链表
 *
 * 21. 合并两个有序链表 (Merge Two Sorted Lists)
 * 难度: 简单 | 标签: 递归、链表
 * 链接: https://leetcode.cn/problems/merge-two-sorted-lists/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：l1 = [1,2,4], l2 = [1,3,4]
 *   输出：[1,1,2,3,4,4]
 *
 * 示例 2：
 *
 *   输入：l1 = [], l2 = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：l1 = [], l2 = [0]
 *   输出：[0]
 *
 * 提示：
 *   - 两个链表的节点数目范围是 `[0, 50]`
 *   - `-100 非递减顺序 排列
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
 * mergeTwoLists
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode|null}
 */
const mergeTwoLists = function (list1, list2) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4])))); // 期望: [1, 1, 2, 3, 4, 4]
