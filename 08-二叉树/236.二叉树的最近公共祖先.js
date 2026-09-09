/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 236. 二叉树的最近公共祖先 (Lowest Common Ancestor of a Binary Tree)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉树、最近公共祖先、Binary Lifting
 * 链接: https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 *
 * 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 *   输出：3
 *   解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
 *   输出：5
 *   解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。
 *
 * 示例 3：
 *
 *   输入：root = [1,2], p = 1, q = 2
 *   输出：1
 *
 * 提示：
 *   - 树中节点数目在范围 `[2, 10^5]` 内。
 *   - `-10^9 <= Node.val <= 10^9`
 *   - 所有 `Node.val` `互不相同` 。
 *   - `p != q`
 *   - `p` 和 `q` 均存在于给定的二叉树中。
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
 * lowestCommonAncestor
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode|null}
 */
const lowestCommonAncestor = function (root, p, q) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// const root = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
// console.log(lowestCommonAncestor(root, root.left, root.right).val); // 期望: 3(节点 5 和 1 的 LCA)
// console.log(lowestCommonAncestor(root, root.left, root.left.right.right).val); // 期望: 5(节点 5 和 4 的 LCA)
