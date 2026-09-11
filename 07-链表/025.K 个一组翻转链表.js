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
 * ───────────────────────────────────────────
 * 解题思路: 分组迭代翻转（哨兵节点 + 复用"反转链表"）
 *
 * 一句话概括: 这题不是新算法，它是 206.反转链表 的"分段循环版"。
 *            每 k 个节点当一条独立的小链表翻转一次，再把各段接起来。
 *
 * 关键洞察: 翻转链条本身不难，难的是"接缝"—— 把上一组的尾巴
 *          接上这一组的新头。用一个 groupPrev 指针始终指向
 *          "当前组的前驱"，接缝问题就收敛成两个赋值。
 *
 * 每一步:
 *   设当前组的范围是 groupPrev.next ... kth，groupNext = kth.next
 *
 *   1. 从 groupPrev 往后数 k 个，找到 kth
 *      —— 数不满 k 个就 break：剩下的节点保持原序，整个链表处理完毕
 *
 *   2. 翻转这一组（把 groupNext 当作"null"，即翻转的终点）
 *        prev = groupNext
 *        cur  = groupPrev.next
 *        while (cur !== groupNext) { nxt = cur.next; cur.next = prev; ... }
 *      翻完后 prev 是这一组的新头
 *
 *   3. 接缝:
 *        newGroupTail = groupPrev.next  // 翻转前的组头，现在是组尾
 *        groupPrev.next = prev          // 前驱接上新头
 *        groupPrev = newGroupTail       // 移到下一组的前驱
 *
 * 易错点:
 *   - 一定要"先数够 k 个再翻"。数不满就 break（不是 continue），
 *     否则最后那截不足 k 个的尾巴会被错误翻转
 *   - newGroupTail 必须在 groupPrev.next = prev 之前存下来，
 *     那行赋值一执行，"旧的组头"这个地址就找不到了
 *   - 翻转的终止条件用 cur !== groupNext，而不是"数 k 次"。
 *     这样不需要在翻转前把这一组的尾巴切断，少一次断链两次接触
 *   - 哨兵节点：第一组没有前驱，靠 dummy 补齐
 *
 * 复杂度: 时间 O(n)（每个节点恰好被翻一次），空间 O(1)
 *         —— 正好满足进阶要求
 */

/**
 * reverseKGroup
 * 输入: head = [1,2,3,4,5], k = 2
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode|null}
 */
const reverseKGroup = function (head, k) {
  const dummy = new ListNode(0, head); // 哨兵节点，给第一组补前驱
  let groupPrev = dummy; // 当前这一组的前驱

  while (true) {
    // ① 从 groupPrev 往后数 k 个，找这一组的尾巴 kth
    let kth = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) {
      kth = kth.next;
    }
    // 数不满 k 个，剩下的保持原序，直接收工
    if (kth === null) break;

    const groupNext = kth.next; // 这一组之后的第一个节点

    // ② 翻转这一组的 k 个节点，把 groupNext 当作翻转的"终点"
    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur !== groupNext) {
      const nxt = cur.next;
      cur.next = prev;
      prev = cur;
      cur = nxt;
    }
    // 翻完 prev 是这一组的新头

    // ③ 接缝：先存下旧的组头（它现在是组尾），再接上新的头
    const newGroupTail = groupPrev.next;
    groupPrev.next = prev;
    groupPrev = newGroupTail; // 下一组的前驱
  }

  return dummy.next; // 跳过哨兵节点
};

/**
 * reverseKGroupRecursive
 * 思路: 先检查是否够 k 个，够就"翻转前 k 个 + 递归处理剩下的"，
 *      递归结果直接当作前 k 个翻转后的尾巴。
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode|null}
 */
const reverseKGroupRecursive = function (head, k) {
  // 先数 k 个看看够不够，不够就原样返回
  let kth = head;
  for (let i = 0; i < k; i++) {
    if (kth === null) return head; // 不足 k 个，保持原序
    kth = kth.next;
  }
  // 此时 kth 是这一组之后的第一个节点

  // 剩下的部分先处理完，它将成为这一组翻转后的"后继"
  let prev = reverseKGroupRecursive(kth, k);

  // 翻转前 k 个节点，接在 prev 前面
  let cur = head;
  for (let i = 0; i < k; i++) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }

  return prev; // 翻转后 kth 位置上的节点成了新头
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 2))); // 期望: [2, 1, 4, 3, 5]
// console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 3))); // 期望: [3, 2, 1, 4, 5]  ← 尾巴不足 3 个
// console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 1))); // 期望: [1, 2, 3, 4, 5]  ← k = 1 等于不动
// console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 5))); // 期望: [5, 4, 3, 2, 1]
// console.log(toArray(reverseKGroup(toList([1, 2]), 3))); // 期望: [1, 2]  ← 不够一组
