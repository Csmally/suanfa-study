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
 * rightSideView
 * @param {TreeNode} root
 * @return {number[]}
 */
const rightSideView = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(rightSideView(toTree([1, 2, 3, null, 5, null, 4]))); // 期望: [1, 3, 4]
