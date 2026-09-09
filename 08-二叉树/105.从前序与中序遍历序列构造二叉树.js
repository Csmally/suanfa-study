/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 105. 从前序与中序遍历序列构造二叉树 (Construct Binary Tree from Preorder and Inorder Traversal)
 * 难度: 中等 | 标签: 树、数组、哈希表、分治、二叉树
 * 链接: https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的先序遍历， `inorder` 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 *
 * 示例 1:
 *
 * [图片]
 *
 *   输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 *   输出: [3,9,20,null,null,15,7]
 *
 * 示例 2:
 *
 *   输入: preorder = [-1], inorder = [-1]
 *   输出: [-1]
 *
 * 提示:
 *   - `1 <= preorder.length <= 3000`
 *   - `inorder.length == preorder.length`
 *   - `-3000 <= preorder[i], inorder[i] <= 3000`
 *   - `preorder` 和 `inorder` 均 无重复 元素
 *   - `inorder` 均出现在 `preorder`
 *   - `preorder` 保证 为二叉树的前序遍历序列
 *   - `inorder` 保证 为二叉树的中序遍历序列
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
 * buildTree
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode|null}
 */
const buildTree = function (preorder, inorder) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// const root = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
// console.log(root.val, root.left.val, root.right.val, root.right.left.val, root.right.right.val); // 期望: 3 9 20 15 7
