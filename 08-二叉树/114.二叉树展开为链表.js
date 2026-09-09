/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 114. 二叉树展开为链表 (Flatten Binary Tree to Linked List)
 * 难度: 中等 | 标签: 栈、树、深度优先搜索、链表、二叉树
 * 链接: https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你二叉树的根结点 `root` ，请你将它展开为一个单链表：
 *   - 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
 *   - 展开后的单链表应该与二叉树 先序遍历 顺序相同。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,2,5,3,4,null,6]
 *   输出：[1,null,2,null,3,null,4,null,5,null,6]
 *
 * 示例 2：
 *
 *   输入：root = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：root = [0]
 *   输出：[0]
 *
 * 提示：
 *   - 树中结点数在范围 `[0, 2000]` 内
 *   - `-100  
 *
 * 进阶：你可以使用原地算法（`O(1)` 额外空间）展开这棵树吗？
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
 * flatten
 * @param {TreeNode} root
 * @return {void} 原地修改,不返回值
 */
const flatten = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// const root = toTree([1, 2, 5, 3, 4, null, 6]);
// flatten(root);
// // 期望: 展开为右链 1 -> 2 -> 3 -> 4 -> 5 -> 6
// let cur = root;
// while (cur) { console.log(cur.val); cur = cur.right; }
