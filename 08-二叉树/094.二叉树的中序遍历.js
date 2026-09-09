/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 94. 二叉树的中序遍历 (Binary Tree Inorder Traversal)
 * 难度: 简单 | 标签: 栈、树、深度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/binary-tree-inorder-traversal/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树的根节点 `root` ，返回 它的 中序 遍历 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,null,2,3]
 *   输出：[1,3,2]
 *
 * 示例 2：
 *
 *   输入：root = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：root = [1]
 *   输出：[1]
 *
 * 提示：
 *   - 树中节点数目在范围 `[0, 100]` 内
 *   - `-100 <= Node.val <= 100`
 *
 * 进阶: 递归算法很简单，你可以通过迭代算法完成吗？
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
 * inorderTraversal
 * @param {TreeNode} root
 * @return {number[]}
 */
const inorderTraversal = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(inorderTraversal(toTree([1, null, 2, 3]))); // 期望: [1, 3, 2]
