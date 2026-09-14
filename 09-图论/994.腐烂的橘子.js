/**
 * LeetCode 热题 100 —— 图论
 *
 * 994. 腐烂的橘子 (Rotting Oranges)
 * 难度: 中等 | 标签: 广度优先搜索、数组、矩阵
 * 链接: https://leetcode.cn/problems/rotting-oranges/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 在给定的 `m x n` 网格 `grid` 中，每个单元格可以有以下三个值之一：
 *   - 值 `0` 代表空单元格；
 *   - 值 `1` 代表新鲜橘子；
 *   - 值 `2` 代表腐烂的橘子。
 *
 * 每分钟，腐烂的橘子 周围 4 个方向上相邻 的新鲜橘子都会腐烂。
 *
 * 返回 直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 `-1` 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：grid = [[2,1,1],[1,1,0],[0,1,1]]
 *   输出：4
 *
 * 示例 2：
 *
 *   输入：grid = [[2,1,1],[0,1,1],[1,0,1]]
 *   输出：-1
 *   解释：左下角的橘子（第 2 行， 第 0 列）永远不会腐烂，因为腐烂只会发生在 4 个方向上。
 *
 * 示例 3：
 *
 *   输入：grid = [[0,2]]
 *   输出：0
 *   解释：因为 0 分钟时已经没有新鲜橘子了，所以答案就是 0 。
 *
 * 提示：
 *   - `m == grid.length`
 *   - `n == grid[i].length`
 *   - `1 <= m, n <= 10`
 *   - `grid[i][j]` 仅为 `0`、`1` 或 `2`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 多源 BFS —— BFS 的"层数"就是分钟数
 *
 * ★ 两个关键转念 ★
 *
 * ① 这是【多源】BFS，不是单源
 *    一开始可能有好几个腐烂的橘子，它们【同时】开始扩散。
 *    所以第一步必须把所有腐烂橘子【一起】塞进队列当起点。
 *    （只放一个、外面再套一层循环逐个 BFS 的话，时间会算错。）
 *
 * ② BFS 的"层"就是"分钟"
 *    第 0 层是初始的腐烂橘子；它们扩出去的是第 1 分钟烂的；
 *    再扩出去是第 2 分钟烂的……
 *    这跟 102 层序遍历里"每层算一次"是同一个套路，
 *    只不过这里的"层"有了时间含义。
 *
 * 步骤:
 *   1. 扫一遍网格: 所有 2 进队列（多源！），顺便数出新鲜橘子数 fresh
 *   2. 一层一层 BFS，每层 = 一分钟:
 *        取出这一层的所有橘子，向四个方向看
 *        邻居是新鲜橘子 → 立刻标记腐烂 + fresh-- + 入队
 *   3. 结束时看 fresh:
 *        还有剩 → 这些橘子被水隔开了，永远烂不了 → -1
 *        没剩   → 返回分钟数
 *
 * 易错点:
 *   1. 【一定要多源】。只把第一个腐烂橘子入队是最常见的错
 *   2. 【扩散时立刻标记 grid[nx][ny] = 2】，不能等出队再标记。
 *      否则同一分钟里，一个新鲜橘子会被多个腐烂邻居重复入队
 *      （和 200 岛屿数量 BFS 版是同一个坑）
 *   3. 【最后一层可能"什么都没腐化"】，那一分钟不该算。
 *      用个标志位记一下，或者用下面"携带时间"的写法绕开
 *   4. 别忘了最后检查 fresh === 0，否则 -1 那条分支会漏
 *
 * 复杂度: 时间 O(m * n)（每个格子最多入队一次），空间 O(m * n)
 *
 * ── 另一种记时间的写法（见 orangesRottingByTime） ──
 *   队列元素直接带上"这个橘子是第几分钟烂的": [x, y, t]
 *   扩散时 push [nx, ny, t + 1]，全局记 max(t + 1)。
 *   好处是天然绕开"空层"问题，坏处是每个元素多存一个字段。
 */

/**
 * orangesRotting
 * 多源 BFS + 分层记时间
 * 输入: grid = [[2,1,1],[1,1,0],[0,1,1]]
 * @param {number[][]} grid
 * @return {number}
 */
const orangesRotting = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右

  const queue = [];
  let head = 0;
  let fresh = 0; // 还剩多少个新鲜橘子

  // 第一趟: 把所有腐烂橘子【一起】收进队列（多源），顺便数新鲜橘子
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) queue.push([i, j]);
      else if (grid[i][j] === 1) fresh++;
    }
  }

  let minutes = 0;

  while (head < queue.length) {
    const size = queue.length - head; // 这一层（这一分钟）有多少个腐烂橘子
    let rotted = false; // 这一分钟有没有腐化出新的

    for (let k = 0; k < size; k++) {
      const [x, y] = queue[head++];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
        if (grid[nx][ny] !== 1) continue; // 空的、或已经烂了

        grid[nx][ny] = 2; // 【立刻标记】，防止同一分钟被重复入队
        fresh--;
        queue.push([nx, ny]);
        rotted = true;
      }
    }

    // 最后一层可能一个都没腐化，那一分钟不算
    if (rotted) minutes++;
  }

  // 还有新鲜橘子剩下 → 它们被水隔开了，永远烂不了
  return fresh === 0 ? minutes : -1;
};

/**
 * orangesRottingByTime
 * 另一种记时间的方式: 队列元素带上"烂掉的时刻"
 * @param {number[][]} grid
 * @return {number}
 */
const orangesRottingByTime = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const queue = [];
  let head = 0;
  let fresh = 0;

  // 初始的腐烂橘子，时刻记为 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) queue.push([i, j, 0]);
      else if (grid[i][j] === 1) fresh++;
    }
  }

  let minutes = 0;

  while (head < queue.length) {
    const [x, y, t] = queue[head++];

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      if (grid[nx][ny] !== 1) continue;

      grid[nx][ny] = 2;
      fresh--;
      queue.push([nx, ny, t + 1]);
      minutes = Math.max(minutes, t + 1); // 答案就是最大的腐烂时刻
    }
  }

  return fresh === 0 ? minutes : -1;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])); // 期望: 4
// console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])); // 期望: -1  ← 被水隔开
// console.log(orangesRotting([[0, 2]])); // 期望: 0   ← 一开始就没有新鲜橘子
// console.log(orangesRotting([[0, 0]])); // 期望: 0   ← 一个橘子都没有
// console.log(orangesRotting([[1]])); // 期望: -1     ← 只有新鲜橘子,没人能烂
// console.log(orangesRottingByTime([[2, 1, 1], [1, 1, 0], [0, 1, 1]])); // 期望: 4
//
// 注意: 函数会【原地修改 grid】(把 1 改成 2),比较两个实现要各喂一份拷贝
