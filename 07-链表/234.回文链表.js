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
  const arr = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  let left = 0;
  let right = arr.length -1;
  let flag = true;
  while (left < right) {
    if (arr[left] !== arr[right]) {
      flag = false;
      break;
    }
    left ++;
    right --;
  }
  return flag;
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 快慢指针 + 反转后半段（进阶要求 O(1) 空间）
 *
 * 1. 快慢指针找中点: slow 走一步、fast 走两步，
 *    fast 走到末尾时 slow 正好在链表中点（奇数长度时在正中间）
 * 2. 反转后半段: 用 206 题的迭代反转，把 slow 之后的半段原地反转
 * 3. 前后两段逐节点比较: 前半段从头、后半段从反转后的头开始，
 *    只要值不同就返回 false
 *
 * 例: 1→2→2→1
 *   找中点: slow 停在第二个 2
 *   反转后半段: 2→1 变成 1→2
 *   比较: 前半段 1→2 和反转后 1→2 完全相同 → true
 *
 * 关键点: 用后半段（rightNode）做循环终止条件——奇数长度时
 *         后半段比前半段少一个（中间节点），中间节点无需比较；
 *         此解法会修改原链表结构（后半段被反转），
 *         题目未要求保持结构；如需保持，比较完再反转一次恢复即可
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 */

/**
 * isPalindromeTwoPointers
 * @param {ListNode} head
 * @return {boolean}
 */
const isPalindromeTwoPointers = function (head) {
  // 1. 快慢指针找中点
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. 反转后半段（206 题的迭代反转）
  let prev = null;
  let cur = slow;
  while (cur !== null) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  // 3. 前后两段逐一比较
  let leftNode = head; // 前半段头
  let rightNode = prev; // 反转后的后半段头
  while (rightNode !== null) {
    if (leftNode.val !== rightNode.val) {
      return false;
    }
    leftNode = leftNode.next;
    rightNode = rightNode.next;
  }

  return true;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isPalindrome(toList([1, 2, 2, 1]))); // 期望: true
// console.log(isPalindrome(toList([1, 2]))); // 期望: false
// console.log(isPalindromeTwoPointers(toList([1, 2, 2, 1]))); // 期望: true
// console.log(isPalindromeTwoPointers(toList([1, 2]))); // 期望: false
