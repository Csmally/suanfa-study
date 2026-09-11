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
 * ───────────────────────────────────────────
 * 解题思路: 后序递归（自底向上汇总）为主；另附父指针写法
 *
 * 关键转念: 不要从根往下"猜"，而是【自底向上汇总】——
 *   让每个节点回答一个问题:
 *     "在我的子树里，能找到 p 和 q 吗？找到了哪个？"
 *
 * dfs 的返回值就是"这个子树能给上面什么交代":
 *
 *   1. node 为空 → 返回 null
 *      node 就是 p 或 q → 直接返回 node（"我这里找到一个"）
 *
 *   2. left  = dfs(node.left)
 *      right = dfs(node.right)
 *
 *   3. 合并:
 *      - left、right【都非空】→ p、q 一个在左一个在右，
 *        说明 node 就是那个"分岔点" → 返回 node
 *      - 【只有一个】非空 → p、q 都在那一侧，
 *        把那个结果原样往上传
 *      - 都为空 → 返回 null
 *
 * 为什么"两个都非空就返回 node"是对的:
 *   每个节点的值互不相同，所以一个节点只会被"发现"一次。
 *   左右各返回一个非空结果，就意味着 p、q 分别落在两棵子树里 ——
 *   从 node 再往上走，p、q 就走到一起了，所以 node 是【最近】的
 *   公共祖先（再往上都是它的祖先，深度更小）。
 *
 * 为什么"node 是 p 或 q 就直接返回 node":
 *   定义里说了"一个节点也可以是它自己的祖先"。如果 node 是 p，
 *   而 q 在它的子树里，那 LCA 就是 p 自己。这一条【必须先判】，
 *   不能继续往下找。
 *
 * 易错点:
 *   1. 终止条件写成"node 是 p 或 q 就返回 node"，
 *      不是返回 null，也不是继续往下走
 *   2. 左右都非空时返回【node】，不是返回 left / right
 *   3. 只有一侧非空时返回【那个非空的结果】，不是返回 node
 *
 * 复杂度: 时间 O(n)（每个节点最多访问一次），空间 O(h) 递归栈
 *
 * ── 另一个写法: 父指针 + 两条路径求交点 ──
 *   1. 先 DFS/BFS 一遍，建一张"node → 父节点"的 Map
 *   2. 从 p 一路往上走到根，把沿途节点塞进一个 Set
 *   3. 从 q 一路往上走，【第一个】落在 Set 里的节点就是 LCA
 *   思路更"笨"但更直观，代价是要存整张父指针表。
 *
 * 复杂度: 父指针法 时间 O(n)，空间 O(n)
 */

/**
 * lowestCommonAncestor
 * 后序递归
 * 输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode|null}
 */
const lowestCommonAncestor = function (root, p, q) {
  const dfs = (node) => {
    // 空节点，或者找到了 p / q 之一，就把这个结果往上交
    if (node === null || node === p || node === q) return node;

    const left = dfs(node.left);
    const right = dfs(node.right);

    // p、q 一个在左一个在右 → node 就是分岔点，也就是最近公共祖先
    if (left !== null && right !== null) return node;

    // 否则两个都在同一侧，把那一侧的结果原样往上传
    return left !== null ? left : right;
  };

  return dfs(root);
};

/**
 * lowestCommonAncestorParent
 * 父指针写法: 建 parent 表 → 两条祖先路径求第一个交点
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode|null}
 */
const lowestCommonAncestorParent = function (root, p, q) {
  // 1. 建"node → 父节点"的表（根的父亲记成 null）
  const parent = new Map();
  parent.set(root, null);
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.left !== null) {
      parent.set(node.left, node);
      stack.push(node.left);
    }
    if (node.right !== null) {
      parent.set(node.right, node);
      stack.push(node.right);
    }
  }

  // 2. 从 p 一路往上到根，沿途全记下来
  const ancestors = new Set();
  let cur = p;
  while (cur !== null) {
    ancestors.add(cur);
    cur = parent.get(cur);
  }

  // 3. 从 q 往上走，第一个撞上的就是最近公共祖先
  cur = q;
  while (!ancestors.has(cur)) {
    cur = parent.get(cur);
  }

  return cur;
};

// ─── 测试 ───────────────────────────────────────────
// const root = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
// console.log(lowestCommonAncestor(root, root.left, root.right).val); // 期望: 3(节点 5 和 1 的 LCA)
// console.log(lowestCommonAncestor(root, root.left, root.left.right.right).val); // 期望: 5(节点 5 和 4 的 LCA)
//
// 题目传的是【节点对象】而不是值,所以要先按值把节点找出来:
// const findNode = (n, v) => !n ? null : (n.val === v ? n : (findNode(n.left, v) || findNode(n.right, v)));
// const lca = (arr, a, b) => {
//   const root = toTree(arr);
//   const r = lowestCommonAncestor(root, findNode(root, a), findNode(root, b));
//   return r === null ? null : r.val;
// };
// console.log(lca([3,5,1,6,2,0,8,null,null,7,4], 5, 1)); // 期望: 3
// console.log(lca([3,5,1,6,2,0,8,null,null,7,4], 5, 4)); // 期望: 5 ← 一个节点可以是自己的祖先
// console.log(lca([1,2], 1, 2)); // 期望: 1
