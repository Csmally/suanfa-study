/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 226. 翻转二叉树 (Invert Binary Tree)
 * 难度: 简单 | 标签: 树、深度优先搜索、广度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/invert-binary-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [4,2,7,1,3,6,9]
 *   输出：[4,7,2,9,6,3,1]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [2,1,3]
 *   输出：[2,3,1]
 *
 * 示例 3：
 *
 *   输入：root = []
 *   输出：[]
 *
 * 提示：
 *   - 树中节点数目范围在 `[0, 100]` 内
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
 * invertTree
 * @param {TreeNode} root
 * @return {TreeNode|null}
 */
const invertTree = function (root) {
  // TODO: 在这里实现你的解法
  const func = (node) => {
    if (!node) return;
    const leftNode = node.left;
    const rightNode = node.right;
    node.left = rightNode;
    node.right = leftNode;
    func(leftNode);
    func(rightNode);
  }
  func(root);
  return root;
};

// ─── 测试 ───────────────────────────────────────────
// const root = invertTree(toTree([4, 2, 7, 1, 3, 6, 9]));
// console.log(root.val, root.left.val, root.right.val, root.left.left.val, root.left.right.val, root.right.left.val, root.right.right.val); // 期望: 4 7 2 9 6 3 1
