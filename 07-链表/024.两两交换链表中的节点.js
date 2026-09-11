/**
 * LeetCode 热题 100 —— 链表
 *
 * 24. 两两交换链表中的节点 (Swap Nodes in Pairs)
 * 难度: 中等 | 标签: 递归、链表
 * 链接: https://leetcode.cn/problems/swap-nodes-in-pairs/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4]
 *   输出：[2,1,4,3]
 *
 * 示例 2：
 *
 *   输入：head = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：head = [1]
 *   输出：[1]
 *
 * 提示：
 *   - 链表中节点的数目在范围 `[0, 100]` 内
 *   - `0 <= Node.val <= 100`
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
 * 解题思路: 迭代（哨兵节点 + 三步重接指针）+ 递归两种写法
 *
 * 关键洞察: 交换本质上是"重新接三根线"。设一组里的两个节点为
 *          first、second，prev 是这一组的前驱:
 *
 *              prev ──→ first ──→ second ──→ 后面
 *
 *          交换后要变成:
 *
 *              prev ──→ second ──→ first ──→ 后面
 *
 *          所以只要重接 prev.next、first.next、second.next 三根线，
 *          节点本身不动（题目也要求不能改 val）。
 *
 * 迭代法:
 *   1. 建哨兵节点 dummy 指向 head，prev = dummy
 *   2. 只要 prev 后面还有至少两个节点，就交换这一组:
 *        first  = prev.next
 *        second = prev.next.next
 *        prev.next   = second       // 前驱改指 second
 *        first.next  = second.next  // first 跳过 second，接后面
 *        second.next = first        // second 翻上来指向 first
 *        prev = first               // 交换后 first 就是这组的尾巴，
 *                                   // 即下一组的前驱
 *   3. 返回 dummy.next
 *
 * 递归法:
 *   把"交换整条链表"缩小成"交换前两个 + 交换剩下的"：
 *   取到 second，让 head 的 next 等于"剩下部分交换完的结果"，
 *   再让 second 指回 head，返回 second（它成了新头）。
 *   终止条件: 没有节点或只剩一个节点，直接原样返回。
 *
 * 易错点:
 *   - 三步重接的顺序不能乱。必须先把 first.next 指向 second.next，
 *     再改 second.next；反过来的话 second.next 已经被覆盖，
 *     "后面那一串"就找不回来了，链表直接断掉
 *   - 循环条件要写 `${prev.next} && ${prev.next.next}`，
 *     奇数个节点时最后一个节点不参与交换，得原样留在原地
 *   - prev 跳的是 first 而不是 second：交换后 first 在 second 后面，
 *     它才是这一组的末尾
 *
 * 复杂度: 迭代 时间 O(n)，空间 O(1)；
 *         递归 时间 O(n)，空间 O(n)（调用栈）
 */

/**
 * swapPairs
 * 输入: head = [1,2,3,4]
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const swapPairs = function (head) {
  const dummy = new ListNode(0, head); // 哨兵节点，简化第一组的处理
  let prev = dummy; // 当前这一组的前驱

  // 后面至少还有两个节点才需要交换
  while (prev.next !== null && prev.next.next !== null) {
    const first = prev.next;
    const second = prev.next.next;

    // 三步重接，顺序不能乱
    prev.next = second; // 前驱改指 second
    first.next = second.next; // first 跳过 second，接上后面一串
    second.next = first; // second 翻上来指向 first

    prev = first; // first 成了这一组的尾巴，即下一组的前驱
  }

  return dummy.next; // 跳过哨兵节点
};

/**
 * swapPairsRecursive
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const swapPairsRecursive = function (head) {
  // 终止条件: 没有节点或只剩一个节点，没有可交换的
  if (head === null || head.next === null) return head;

  const second = head.next;

  // head 的后面接"剩下部分交换完的结果"
  head.next = swapPairsRecursive(second.next);
  // second 翻上来指向 head
  second.next = head;

  return second; // 新头是 second
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(swapPairs(toList([1, 2, 3, 4])))); // 期望: [2, 1, 4, 3]
// console.log(toArray(swapPairs(toList([])))); // 期望: []
// console.log(toArray(swapPairs(toList([1])))); // 期望: [1]
// console.log(toArray(swapPairs(toList([1, 2, 3])))); // 期望: [2, 1, 3]  ← 奇数个，最后那个不动
// console.log(toArray(swapPairsRecursive(toList([1, 2, 3, 4])))); // 期望: [2, 1, 4, 3]
