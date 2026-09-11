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
 * ───────────────────────────────────────────
 * 解题思路: 迭代（哨兵节点 + 双指针）+ 递归两种写法
 *
 * 迭代法:
 *   1. 建一个哨兵节点 dummy，cur 指向新链表的尾巴
 *   2. 两链表都有节点时，反复比较两个"头"：
 *      较小的那个摘下来接到 cur 后面，对应链表指针前进一格
 *   3. 其中一条摘完后，把另一条剩余部分整个接到 cur 后面
 *      （剩余部分本身就是有序的，无需再比较）
 *   4. 返回 dummy.next（哨兵节点只是占位，不算结果）
 *
 * 递归法:
 *   两个头比较，较小的头的 next = "剩下部分的合并结果"，
 *   空链表直接返回另一条（终止条件）
 *
 * 关键点: 哨兵节点 dummy 省掉了"结果头为空"的特殊判断；
 *        摘节点时直接复用原节点（只改 next 指针），不新建节点
 *
 * 复杂度: 迭代 时间 O(m+n)，空间 O(1)；
 *         递归 时间 O(m+n)，空间 O(m+n)（调用栈）
 */

/**
 * mergeTwoLists
 * 输入: list1 = [1,2,4], list2 = [1,3,4]
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode|null}
 */
const mergeTwoLists = function (list1, list2) {
  const dummy = new ListNode(); // 哨兵节点，简化头部处理
  let cur = dummy; // 新链表的尾巴

  debugger

  // 两条都还有节点时，比较头部，摘较小的接上去
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }

  // 其中一条摘完了，把另一条剩余部分整个接上
  cur.next = list1 !== null ? list1 : list2;

  return dummy.next; // 跳过哨兵节点
};

/**
 * mergeTwoListsRecursive
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode|null}
 */
const mergeTwoListsRecursive = function (list1, list2) {
  // 终止条件: 一条为空，返回另一条
  if (list1 === null) return list2;
  if (list2 === null) return list1;

  // 较小的头留下，它的 next 是"剩下部分的合并结果"
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4])))); // 期望: [1, 1, 2, 3, 4, 4]
