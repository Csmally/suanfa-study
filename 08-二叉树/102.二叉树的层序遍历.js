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
 * ───────────────────────────────────────────
 * 解题思路: BFS（队列 + 分层）为主，另附 DFS 写法
 *
 * 关键转念: 层序遍历就是 BFS，本身不难。
 *          唯一的难点是 —— 【怎么知道这一层什么时候结束？】
 *
 * BFS 的破法: 在开始处理一层之前，先把当前队列的长度记下来，
 *   这个 size 就是"这一层的节点数"。然后只处理 size 个。
 *   处理过程中把下一层的孩子追加到队尾，它们绝不会混进这一轮。
 *
 *   while (队列不空) {
 *     const size = 当前剩余节点数     ← 必须在 for 之前算好！
 *     for (let i = 0; i < size; i++) {
 *       取出队头 → 收进本层数组
 *       把左右孩子追加到队尾
 *     }
 *     本层数组 push 进结果
 *   }
 *
 * 易错点（这题唯一会翻车的地方）:
 *   最容易写成 for (let i = 0; i < queue.length; i++)。
 *   循环条件每一轮都在重新读 queue.length，而循环体里刚把
 *   下一层的孩子塞了进去 —— 于是这一轮会顺带把下一层的节点
 *   也一起吃掉，层就串了。
 *   必须先把长度存进一个变量，再拿它当循环边界。
 *
 * 另一条路（DFS）: 层序遍历不一定要用 BFS。
 *   一路往下递归，多带一个"深度"参数，把节点值放进 res[深度]。
 *   第一次到达某一层时（res.length === depth）先开个空数组。
 *   因为 DFS 总是先访问到一层的【最左边】那个节点，
 *   所以数组是按 0、1、2… 顺序创建的，不会出现空洞。
 *
 * 复杂度: 两种写法都是 时间 O(n)；
 *         BFS 空间 O(n)（最宽那一层的节点数），DFS 空间 O(h)
 */

/**
 * levelOrder
 * 输入: root = [3,9,20,null,null,15,7]
 * @param {TreeNode} root
 * @return {number[][]}
 */
const levelOrder = function (root) {
  const res = [];
  if (root === null) return res;

  const queue = [root];
  let head = 0; // 用下标取队头，避免 shift() 每次 O(n) 的搬移

  while (head < queue.length) {
    const size = queue.length - head; // ← 当前这一层的节点数，先定住
    const level = [];

    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);

      // 下一层的孩子追加到队尾，不会混进这一轮
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    res.push(level);
  }

  return res;
};

/**
 * levelOrderDFS
 * 另一条路: 递归时带上深度，把节点值归位到 res[深度]
 * @param {TreeNode} root
 * @return {number[][]}
 */
const levelOrderDFS = function (root) {
  const res = [];

  const dfs = (node, depth) => {
    if (node === null) return;

    // 第一次到达这一层，先开个空数组
    if (res.length === depth) res.push([]);
    res[depth].push(node.val);

    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  };

  dfs(root, 0);
  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(levelOrder(toTree([3, 9, 20, null, null, 15, 7]))); // 期望: [[3], [9, 20], [15, 7]]
// console.log(levelOrder(toTree([1]))); // 期望: [[1]]
// console.log(levelOrder(toTree([]))); // 期望: []
// console.log(levelOrder(toTree([1, 2, 3, 4, null, null, 5]))); // 期望: [[1], [2, 3], [4, 5]]
// console.log(levelOrderDFS(toTree([3, 9, 20, null, null, 15, 7]))); // 期望: [[3], [9, 20], [15, 7]]
