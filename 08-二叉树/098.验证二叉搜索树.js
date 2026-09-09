/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 98. 验证二叉搜索树 (Validate Binary Search Tree)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉搜索树、二叉树
 * 链接: https://leetcode.cn/problems/validate-binary-search-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。
 *
 * 有效 二叉搜索树定义如下：
 *   - 节点的左子树只包含 严格小于 当前节点的数。
 *   - 节点的右子树只包含 严格大于 当前节点的数。
 *   - 所有左子树和右子树自身必须也是二叉搜索树。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [2,1,3]
 *   输出：true
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [5,1,4,null,null,3,6]
 *   输出：false
 *   解释：根节点的值是 5 ，但是右子节点的值是 4 。
 *
 * 提示：
 *   - 树中节点数目范围在`[1, 10^4]` 内
 *   - `-2^31 <= Node.val <= 2^31 - 1`
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
 * isValidBST
 * @param {TreeNode} root
 * @return {boolean}
 */
const isValidBST = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isValidBST(toTree([2, 1, 3]))); // 期望: true
// console.log(isValidBST(toTree([5, 1, 4, null, null, 3, 6]))); // 期望: false
