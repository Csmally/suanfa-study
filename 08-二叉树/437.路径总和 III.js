/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 437. 路径总和 III (Path Sum III)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/path-sum-iii/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 路径 的数目。
 *
 * 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 *   输出：3
 *   解释：和等于 8 的路径有 3 条，如图所示。
 *
 * 示例 2：
 *
 *   输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 *   输出：3
 *
 * 提示:
 *   - 二叉树的节点个数的范围是 `[0,1000]`
 *   - `-10^9 <= Node.val <= 10^9` 
 *   - `-1000 <= targetSum <= 1000` 
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
 * 解题思路: 前缀和 + 哈希表 O(n)（主推）；另附暴力双递归 O(n²)
 *
 * 关键转念: 题目说"路径不需要从根节点开始"，这才是真正的难点 ——
 *   每条路径有它自己的起点，暴力做就得对每个节点都重新起一次头。
 *
 *   换个角度: 一条向下的路径，总可以写成
 *     "根 → 某个祖先 a" 这一段，减去 "根 → 当前节点 c" 这一段
 *
 *       路径和 = prefix[c] - prefix[a]
 *
 *   （prefix[x] 表示"从根一路加到 x"的前缀和）
 *
 *   于是"路径和等于 targetSum"就等价于:
 *
 *       prefix[c] - prefix[a] = targetSum
 *   ⟺   prefix[a] = prefix[c] - targetSum
 *
 *   也就是说 —— 站在当前节点 c 上，只要回头数一数
 *   "从根到 c 这条路上，有多少个祖先的前缀和等于
 *     prefix[c] - targetSum"，答案就出来了。
 *
 *   "回头数"这件事交给哈希表: 边 DFS 边记账，查表 O(1)。
 *   一趟 DFS 搞定，O(n)。
 *
 *   （这就是 560.和为 K 的子数组 的树上版本，
 *     套路完全一致: 前缀和 + 哈希表 + 边走边记账。）
 *
 * 步骤:
 *   1. count = Map(前缀和 → 它在当前路径上出现的次数)
 *   2. count.set(0, 1)   ← 【必须】，见易错点 2
 *   3. DFS 带着 prefix:
 *        cur = prefix + node.val
 *        res += count.get(cur - targetSum) || 0   ← 数祖先
 *        count.set(cur, ...+1)                    ← 把自己记上
 *        dfs(左); dfs(右)
 *        count.set(cur, ...-1)                    ← 【回溯】把自己摘掉
 *
 * 易错点:
 *   1. 【忘了回溯】。count 里存的是"当前这条 根→当前节点 路径上"
 *      的前缀和，不是全树的前缀和。离开一个节点时必须把它减掉，
 *      否则别的分支的前缀和会串进来，答案偏大。
 *   2. 【忘了 count.set(0, 1)】。这个 0 代表"空路径"，
 *      用来接住那些"从根节点开始"的路径。少了它这些全漏。
 *   3. 是 cur - targetSum，别写反成 targetSum - cur。
 *   4. 数值范围: val 可达 ±10^9、节点数最多 1000，前缀和最大约
 *      ±10^12 —— 超出 32 位但在 JS Number（双精度，安全整数到
 *      2^53）范围内，安全。
 *
 * 复杂度: 前缀和法 时间 O(n)，空间 O(h)（哈希表 + 递归栈）
 *
 * ── 暴力做法（O(n²)，但最不容易写错） ──
 *   把"起点"枚举一遍: 对每个节点，都以它为起点往下 DFS，
 *   看沿途能凑出多少个 targetSum。
 *   节点多起来会慢，但逻辑一眼就懂，可以先写它保底。
 *
 * 复杂度: 暴力法 时间 O(n²)，空间 O(h)
 */

/**
 * pathSum
 * 前缀和 + 哈希表
 * 输入: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
const pathSum = function (root, targetSum) {
  // 前缀和 → 它在【当前这条路径上】出现的次数
  const count = new Map();
  count.set(0, 1); // 空路径: 用来接住"从根开始"的那些路径

  let res = 0;

  const dfs = (node, prefix) => {
    if (node === null) return;

    const cur = prefix + node.val; // 根 → 当前节点 的前缀和

    // 有多少个祖先的前缀和等于 cur - targetSum，就有多少条路径以当前节点结尾
    res += count.get(cur - targetSum) || 0;

    // 把自己记进当前路径
    count.set(cur, (count.get(cur) || 0) + 1);

    dfs(node.left, cur);
    dfs(node.right, cur);

    // 回溯: 离开这条分支时把自己摘掉
    count.set(cur, count.get(cur) - 1);
  };

  dfs(root, 0);
  return res;
};

/**
 * pathSumBrute
 * 暴力双递归: 枚举每个节点当起点
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
const pathSumBrute = function (root, targetSum) {
  if (root === null) return 0;

  // 以 root 为起点的路径数 + 以左子树里某点为起点的 + 以右子树里某点为起点的
  return (
    countFrom(root, targetSum) +
    pathSumBrute(root.left, targetSum) +
    pathSumBrute(root.right, targetSum)
  );
};

// 以 node 为起点，一路向下，数出和等于 rest 的路径条数
const countFrom = (node, rest) => {
  if (node === null) return 0;

  let c = 0;

  // 注意: 相等时【不能 return】，后面的节点还可能是 0 或负数，
  // 继续往下走仍可能再凑出 rest
  if (node.val === rest) c++;

  return c + countFrom(node.left, rest - node.val) + countFrom(node.right, rest - node.val);
};

// ─── 测试 ───────────────────────────────────────────
// console.log(pathSum(toTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 期望: 3
// console.log(pathSum(toTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)); // 期望: 3
// console.log(pathSum(toTree([]), 0)); // 期望: 0
// console.log(pathSum(toTree([1]), 1)); // 期望: 1
// console.log(pathSumBrute(toTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 期望: 3
