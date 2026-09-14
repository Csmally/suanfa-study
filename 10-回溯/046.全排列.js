/**
 * LeetCode 热题 100 —— 回溯
 *
 * 46. 全排列 (Permutations)
 * 难度: 中等 | 标签: 数组、回溯
 * 链接: https://leetcode.cn/problems/permutations/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个不含重复数字的数组 `nums` ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
 *
 * 示例 1：
 *
 *   输入：nums = [1,2,3]
 *   输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * 示例 2：
 *
 *   输入：nums = [0,1]
 *   输出：[[0,1],[1,0]]
 *
 * 示例 3：
 *
 *   输入：nums = [1]
 *   输出：[[1]]
 *
 * 提示：
 *   - `1 <= nums.length <= 6`
 *   - `-10 <= nums[i] <= 10`
 *   - `nums` 中的所有整数 互不相同
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 回溯（把"决策树"走一遍，做选择 / 撤销选择）
 *
 * ★ 回溯的通用框架（背下来，一整个章节都用它）★
 *
 *   result = []
 *   backtrack(路径, 选择列表):
 *     if (满足结束条件):
 *       result.push(路径的拷贝)     ← 注意"拷贝"两个字
 *       return
 *     for 选择 in 选择列表:
 *       做选择                      ← 把 选择 加进 路径
 *       backtrack(新路径, 新选择列表)
 *       撤销选择                    ← ★ 这一步就叫"回溯"
 *
 *   把整个过程想成一棵【决策树】:
 *     - 每一层 = 排列里的一个位置
 *     - 每个节点 = "这个位置放哪个数"的一次选择
 *     - 从根走到叶子 = 一条完整的排列
 *   "回溯"就是走到底之后退回上一层，换个分支再试。
 *
 * 本题的决策树（nums = [1,2,3]）:
 *
 *                      ( )
 *            ┌──────────┼──────────┐
 *            1          2          3       ← 第 1 位选谁
 *          ┌─┴─┐      ┌─┴─┐      ┌─┴─┐
 *          2   3      1   3      1   2     ← 第 2 位选谁
 *          │   │      │   │      │   │
 *          3   2      3   1      2   1     ← 第 3 位选谁
 *
 *   叶子一共 3! = 6 个，正好就是全部排列。
 *
 * 易错点:
 *   1. ★【res.push 的时候必须拷贝 path】★ 这是本题最大的坑。
 *      写成 res.push(path) 的话，存进去的只是同一个数组的【引用】，
 *      后面回溯一改 path，res 里所有"排列"会跟着一起变，
 *      最后全变成空数组。必须写 res.push(path.slice()) 或 [...path]
 *   2. 【做选择和撤销选择必须成对】。push 了就 pop，
 *      标记了 used 就取消标记。漏一个结果就乱
 *   3. 终止条件是 path.length === nums.length（凑齐了），
 *      别手滑写成 nums.length - 1
 *
 * 复杂度: 时间 O(n * n!)（n! 个排列，每个要 O(n) 拷贝一份），
 *         空间 O(n)（递归栈 + path，不含结果本身）
 *
 * ── 另一种写法: 交换法（见 permuteBySwap） ──
 *   不用 used 数组，改成"把候选依次换到前面来":
 *   前 start 个位置是已确定的前缀，[start, end) 是剩下的候选。
 *   好处是省掉了 used 数组，坏处是顺序不如 used 版直观。
 */

/**
 * permute
 * used 数组标记法（最直观）
 * 输入: nums = [1,2,3]
 * @param {number[]} nums
 * @return {number[][]}
 */
const permute = function (nums) {
  const res = [];
  const path = []; // 当前正在构建的这个排列（全程复用同一个数组）
  const used = new Array(nums.length).fill(false); // 哪些数已经被选走了

  debugger
  
  const backtrack = () => {
    // 结束条件: 凑齐了 n 个数，就是一整个排列
    if (path.length === nums.length) {
      res.push(path.slice()); // ★ 必须拷贝！否则存的是引用，后面全被改掉
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; // 已经用过的数不能再选 → 这就是"选择列表"

      // 做选择
      used[i] = true;
      path.push(nums[i]);

      backtrack(); // 进下一层，去定第 path.length + 1 个位置

      // 撤销选择（回溯）
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return res;
};

/**
 * permuteBySwap
 * 交换法: 把候选依次换到 start 位置上，省掉 used 数组
 * @param {number[]} nums
 * @return {number[][]}
 */
const permuteBySwap = function (nums) {
  const res = [];
  const arr = nums.slice(); // 原地交换会改数组，先拷一份

  // arr[0..start-1] 是已确定的前缀，arr[start..] 是还没排的候选
  const backtrack = (start) => {
    if (start === arr.length) {
      res.push(arr.slice()); // 同样要拷贝
      return;
    }

    for (let i = start; i < arr.length; i++) {
      // 做选择: 把候选里的第 i 个换到 start 位置
      [arr[start], arr[i]] = [arr[i], arr[start]];

      backtrack(start + 1);

      // 撤销选择: 换回去
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  };

  backtrack(0);
  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(permute([1, 2, 3])); // 期望: 6 种全排列(顺序不限)
// console.log(permute([0, 1])); // 期望: [[0,1],[1,0]]
// console.log(permute([1])); // 期望: [[1]]
// console.log(permuteBySwap([1, 2, 3])); // 期望: 6 种
//
// 因为题目说"按任意顺序返回答案",所以不能直接比数组,
// 应该验证【性质】:
//   ① 个数 === n!
//   ② 每个结果都是 nums 的一个排列(排序后和 nums 排序后相同)
//   ③ 所有结果互不重复
//
// 顺便,看看【忘了拷贝】会错成什么样:
// const buggy = (nums) => {
//   const res = [], path = [], used = new Array(nums.length).fill(false);
//   const bt = () => {
//     if (path.length === nums.length) { res.push(path); return; }   // ← 没 slice!
//     for (let i = 0; i < nums.length; i++) {
//       if (used[i]) continue;
//       used[i] = true; path.push(nums[i]);
//       bt();
//       path.pop(); used[i] = false;
//     }
//   };
//   bt();
//   return res;
// };
// console.log(buggy([1, 2, 3])); // 会打印出 6 个空数组 [[] x 6]
