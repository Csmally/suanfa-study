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
 * ───────────────────────────────────────────
 * 解题思路: 本文件保留三份实现，可以对照着看
 *
 *   inorderTraversal          你自己写的原始版本，原样保留
 *   inorderTraversalSharedRes 改进版，只动了两个点（见下）
 *   inorderTraversalIterative 迭代版（进阶要求）
 *
 * 中序遍历 = 左 → 根 → 右
 *
 * 递归法:
 *   1. 在函数外面准备一个 res 数组，递归函数把它"传下去累积"，
 *      而不是每层新建一个数组返回给上一层
 *   2. 递归函数体就三行: 走左、把当前值推进 res、走右
 *   3. 开头统一判空: if (node === null) return
 *
 * 为什么"每层返回新数组"是坑:
 *   写成 `const rl = func(node.left); res.push(...rl)` 的话，
 *   每个节点会被复制【它到根的深度】那么多次 —— 平衡树 O(n log n)，
 *   退化成一条链的树直接 O(n²)。而且 push(...arr) 是把数组展开成
 *   实参，数组一大就可能爆调用栈。
 *   正确姿势是全程共用同一个 res，每个节点只写一次，O(n)。
 *
 * 把判空放在函数开头，还有个附带好处:
 *   所有 `if (node.left)` 这类守卫都不用写了，root 为空也天然正确。
 *
 * 迭代法（进阶要求）:
 *   用栈手动模拟递归的"回溯"过程:
 *   1. 从 cur 一路向左走，沿途的节点全部入栈（它们的左子树还没走完）
 *   2. 走不动了（cur === null）就弹栈顶 —— 它就是"左子树已处理完"
 *      的那个节点，访问它（对应"左 → 根"）
 *   3. 然后转向它的右子树（cur = cur.right）
 *
 * 易错点:
 *   第 3 步是 cur = cur.right，【不是】继续往左！
 *   弹出并访问后，左子树整棵都已经处理完了，这一轮该轮到右子树。
 *   这里写成继续往左就会死循环。
 *
 * 复杂度: 两种写法都是 时间 O(n)；空间 O(h)，h 为树高
 *         （递归版是递归栈，迭代版是显式栈；链状树退化为 O(n)）
 *
 * 再进一步: Morris 遍历能把空间压到 O(1) —— 借用"右子树最右节点的
 * 空 right 指针"当回程线索，遍历完再拆掉。本题不要求。
 */

/**
 * inorderTraversal
 * 你自己写的原始版本，原样保留（没动过一行）
 *
 * 两个待改进的地方:
 *   1. 没判传进来的 tree 本身是否为空 —— root 为 null 时会崩
 *      （守卫写在了调用处 if (tree.left)，管不到最外层的入口）
 *   2. 每层新建数组返回给上层，上层再 push(...) 整个复制一遍，
 *      每个节点会被复制"它到根的深度"那么多次
 *
 * 输入: root = [1,null,2,3]
 * @param {TreeNode} root
 * @return {number[]}
 */
const inorderTraversal = function (root) {
  // TODO: 在这里实现你的解法
  const res = [];
  const func = (tree) => {
    if (tree === null) return;
    func(tree.left);
    res.push(tree.val);
    func(tree.right);
  }
  func(root)
  return res;
};

/**
 * inorderTraversalSharedRes
 * 改进版：跟上面只差两点 —— 判空位置、共用数组
 * @param {TreeNode} root
 * @return {number[]}
 */
const inorderTraversalSharedRes = function (root) {
  const res = []; // 全程共用这一个数组，每个节点只写一次

  const dfs = (node) => {
    if (node === null) return; // 统一判空，省掉所有子节点守卫

    dfs(node.left); // 左
    res.push(node.val); // 根
    dfs(node.right); // 右
  };

  dfs(root);
  return res;
};

/**
 * inorderTraversalIterative
 * 进阶要求的迭代写法
 * @param {TreeNode} root
 * @return {number[]}
 */
const inorderTraversalIterative = function (root) {
  const res = [];
  const stack = [];
  let cur = root;

  while (cur !== null || stack.length > 0) {
    // 一路向左，沿途入栈: 这些节点的左子树还没走完
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }

    // 栈顶就是"左子树已处理完"的节点
    cur = stack.pop();
    res.push(cur.val); // 左 → 根，访问它

    // 转向右子树（不是继续往左！）
    cur = cur.right;
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(inorderTraversal(toTree([1, null, 2, 3]))); // 期望: [1, 3, 2]
// console.log(inorderTraversal(toTree([]))); // ⚠️ 会崩: Cannot read properties of null
// console.log(inorderTraversal(toTree([1]))); // 期望: [1]
// console.log(inorderTraversalSharedRes(toTree([]))); // 期望: []  ← 改进版不崩
// console.log(inorderTraversalIterative(toTree([1, null, 2, 3]))); // 期望: [1, 3, 2]
