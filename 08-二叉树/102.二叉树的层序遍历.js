/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 102. 二叉树的层序遍历 (Binary Tree Level Order Traversal)
 * 难度: 中等 | 标签: 树、广度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/binary-tree-level-order-traversal/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你二叉树的根节点 `root` ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [3,9,20,null,null,15,7]
 *   输出：[[3],[9,20],[15,7]]
 *
 * 示例 2：
 *
 *   输入：root = [1]
 *   输出：[[1]]
 *
 * 示例 3：
 *
 *   输入：root = []
 *   输出：[]
 *
 * 提示：
 *   - 树中节点数目在范围 `[0, 2000]` 内
 *   - `-1000 <= Node.val <= 1000`
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
 * levelOrder
 * @param {TreeNode} root
 * @return {number[][]}
 */
const levelOrder = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(levelOrder(toTree([3, 9, 20, null, null, 15, 7]))); // 期望: [[3], [9, 20], [15, 7]]
