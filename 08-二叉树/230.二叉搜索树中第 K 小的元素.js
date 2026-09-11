/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 230. 二叉搜索树中第 K 小的元素 (Kth Smallest Element in a BST)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉搜索树、二叉树
 * 链接: https://leetcode.cn/problems/kth-smallest-element-in-a-bst/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 小的元素（`k` 从 1 开始计数）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [3,1,4,null,2], k = 1
 *   输出：1
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [5,3,6,2,4,null,null,1], k = 3
 *   输出：3
 *
 * 提示：
 *   - 树中的节点数为 `n` 。
 *   - `1 <= k <= n <= 10^4`
 *   - `0 <= Node.val <= 10^4`
 *
 * 进阶：如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 `k` 小的值，你将如何优化算法？
 */

// 二叉树节点定义(与 LeetCode 一致)
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// 辅助函数: 层序遍历数组转二叉树(null 表示空节点)
const toTree = (arr) => {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 中序遍历 + 剪枝（数到第 k 个就停）
 *
 * 关键转念: 这题【不需要】任何"求第 k 小"的特殊技巧。
 *          BST 的中序遍历本身就是递增序列 —— 所以
 *          "第 k 个被访问到的节点"就是"第 k 小的元素"。
 *
 *   （这正是 108 那句话的直接应用: BST 的中序 = 有序数组。
 *     中序遍历一遍，等于把 BST 就地"摊平"成一个排好序的序列，
 *     只不过我们不用真的把它存下来。）
 *
 * 递归版:
 *   在标准中序遍历（左 → 根 → 右）上加两样东西:
 *     - 一个计数器 count，记录"已经访问过几个节点"
 *     - 数到 k 就立刻返回，不再往下走（剪枝）
 *
 * 迭代版:
 *   直接复用 094 的迭代中序遍历，每弹出一个节点就 --k，
 *   减到 0 就返回。天然就是"数到第 k 个就停"，连剪枝都不用写。
 *
 * 易错点:
 *   1. 别写成"先中序遍历存成数组，再取 arr[k-1]"。
 *      那样必须走完整棵树，白白浪费 —— 这题的精髓就在【提前终止】。
 *   2. 计数器要在访问【根】的那一步自增，不能在刚进入节点时就加。
 *      中序的顺序是 左 → 根 → 右，节点被"访问"发生在中间那一步。
 *   3. 找到答案后要真的停住，别继续往右子树走。
 *
 * 进阶（面试常追问）:
 *   "如果 BST 经常被插入/删除，又要频繁查第 k 小，怎么优化？"
 *
 *   答案: 在每个节点里多存一个字段 size = 以它为根的子树节点数。
 *   查找时从根出发，设 leftSize = node.left ? node.left.size : 0:
 *     - k <= leftSize        → 答案在左子树，往左走
 *     - k === leftSize + 1   → 答案就是当前节点
 *     - k >  leftSize + 1    → 在右子树，且 k -= leftSize + 1
 *   每次查找只要 O(h)，不用重新遍历。
 *   代价是插入/删除时要沿途更新 size（也还是 O(h)）。
 *   —— 这就是所谓的"顺序统计树"。
 *
 * 复杂度: 时间 O(h + k)（h 为树高: 先一头扎到最左，再数 k 个），
 *         最坏 O(n)；空间 O(h) 递归栈
 */

/**
 * kthSmallest
 * 递归中序 + 剪枝
 * 输入: root = [3,1,4,null,2], k = 1
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
const kthSmallest = function (root, k) {
  let count = 0; // 已经访问过几个节点
  let res = null; // 答案

  const inorder = (node) => {
    // 剪枝: 已经数够 k 个，剩下的不用走了
    if (node === null || count >= k) return;

    inorder(node.left); // 左

    // 根: 中序里"第几个被访问"就等于"第几小"
    count++;
    if (count === k) {
      res = node.val;
      return; // 找到了，右子树不必再走
    }

    inorder(node.right); // 右
  };

  inorder(root);
  return res;
};

/**
 * kthSmallestIterative
 * 迭代中序: 复用 094 的写法，弹一个 --k，减到 0 就是答案
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
const kthSmallestIterative = function (root, k) {
  const stack = [];
  let cur = root;

  while (cur !== null || stack.length > 0) {
    // 一路向左，沿途入栈
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }

    cur = stack.pop();
    if (--k === 0) return cur.val; // 弹出的第 k 个就是答案，直接收工

    cur = cur.right; // 转向右子树
  }

  return -1; // 题目保证 1 <= k <= n，走不到这里
};

// ─── 测试 ───────────────────────────────────────────
// console.log(kthSmallest(toTree([3, 1, 4, null, 2]), 1)); // 期望: 1
// console.log(kthSmallest(toTree([5, 3, 6, 2, 4, null, null, 1]), 3)); // 期望: 3
// console.log(kthSmallest(toTree([1]), 1)); // 期望: 1
// console.log(kthSmallestIterative(toTree([5, 3, 6, 2, 4, null, null, 1]), 3)); // 期望: 3
