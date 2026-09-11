/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 199. 二叉树的右视图 (Binary Tree Right Side View)
 * 难度: 中等 | 标签: 树、深度优先搜索、广度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/binary-tree-right-side-view/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树的 根节点 `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 *
 * 示例 1：
 *
 * 输入：root = [1,2,3,null,5,null,4]
 *
 * 输出：[1,3,4]
 *
 * 解释：
 *
 * [图片]
 *
 * 示例 2：
 *
 * 输入：root = [1,2,3,4,null,null,null,5]
 *
 * 输出：[1,3,4,5]
 *
 * 解释：
 *
 * [图片]
 *
 * 示例 3：
 *
 * 输入：root = [1,null,3]
 *
 * 输出：[1,3]
 *
 * 示例 4：
 *
 * 输入：root = []
 *
 * 输出：[]
 *
 * 提示:
 *   - 二叉树的节点个数的范围是 `[0,100]`
 *   - `-100 <= Node.val <= 100`
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
 * 解题思路: 本质就是 102 层序遍历 —— 每层取最后一个
 *
 * 关键转念: "站在右边看"到底看到了什么？
 *
 *   直觉很容易想成"沿着右孩子一路往下走"，这是【错的】。
 *   反例: [1,2,3,4,null,null,null,5]  —— 示例 2
 *
 *           1
 *          / \
 *         2   3
 *        /
 *       4
 *      /
 *     5
 *
 *   沿右孩子走只能得到 1 → 3，但正确答案是 [1,3,4,5]：
 *   第 4 层的 5 明明是 4 的【左】孩子，站右边照样看得见。
 *
 *   正确的理解: 右视图 = 【每一层最右边那个节点】。
 *   因为同一层的节点里，靠右的会把靠左的挡住，无论它挂在哪。
 *
 * ── BFS 写法 ──
 *   直接套 102 的层序遍历骨架，每层只多记一件事:
 *   这一层【最后一个出队】的节点，就是该层最右边的那个。
 *   （入队顺序是先左后右，所以最后出队的必然最靠右。）
 *
 * ── DFS 写法（更妙，两处对调） ──
 *   沿用 102 那个"递归时带深度参数"的思路，只改两点:
 *     1. 先走【右】子树，再走左子树
 *     2. 只在 depth === res.length（第一次到达这一层）时记录
 *   两处一配合: 先走右 → 每层第一个被到达的必然是最右节点;
 *              "第一次到达该层" → 正好把它挑出来记下。
 *
 * 易错点:
 *   1. 别想成"沿右孩子一直走"（见上面反例）
 *   2. DFS 版【必须】先走右子树。先走左的话，
 *      每层第一个到达的就变成最左节点了，答案全反
 *   3. BFS 版判断"这一层最后一个"要用下标 i === size - 1，
 *      别用 node.right === null 之类的条件去猜
 *
 * 复杂度: 两种都是 时间 O(n)；
 *         BFS 空间 O(n)（最宽那一层），DFS 空间 O(h)
 */

/**
 * rightSideView
 * BFS: 层序遍历，每层取最后一个
 * 输入: root = [1,2,3,null,5,null,4]
 * @param {TreeNode} root
 * @return {number[]}
 */
const rightSideView = function (root) {
  const res = [];
  if (root === null) return res;

  const queue = [root];
  let head = 0;

  while (head < queue.length) {
    const size = queue.length - head; // 当前这一层的节点数，先定住

    for (let i = 0; i < size; i++) {
      const node = queue[head++];

      // 这一层最后一个出队的，就是最右边那个
      if (i === size - 1) res.push(node.val);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }

  return res;
};

/**
 * rightSideViewDFS
 * DFS: 先走右子树，每层第一次到达时记录
 * @param {TreeNode} root
 * @return {number[]}
 */
const rightSideViewDFS = function (root) {
  const res = [];

  const dfs = (node, depth) => {
    if (node === null) return;

    // 第一次到达这一层 → 它就是该层最右边的节点
    if (depth === res.length) res.push(node.val);

    // 先右后左！这样才能保证每层最先被到达的是最右节点
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  };

  dfs(root, 0);
  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(rightSideView(toTree([1, 2, 3, null, 5, null, 4]))); // 期望: [1, 3, 4]
// console.log(rightSideView(toTree([1, 2, 3, 4, null, null, null, 5]))); // 期望: [1, 3, 4, 5] ← 5 是左孩子,照样看得见
// console.log(rightSideView(toTree([1, null, 3]))); // 期望: [1, 3]
// console.log(rightSideView(toTree([]))); // 期望: []
// console.log(rightSideViewDFS(toTree([1, 2, 3, 4, null, null, null, 5]))); // 期望: [1, 3, 4, 5]
