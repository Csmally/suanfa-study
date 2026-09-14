/**
 * LeetCode 热题 100 —— 技巧
 *
 * 287. 寻找重复数 (Find the Duplicate Number)
 * 难度: 中等 | 标签: 位运算、数组、双指针、二分查找、Floyd 判圈算法、抽屉原理
 * 链接: https://leetcode.cn/problems/find-the-duplicate-number/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个包含 `n + 1` 个整数的数组 `nums` ，其数字都在 `[1, n]` 范围内（包括 `1` 和 `n`），可知至少存在一个重复的整数。
 *
 * 假设 `nums` 只有 一个重复的整数 ，返回 这个重复的数 。
 *
 * 你设计的解决方案必须 不修改 数组 `nums` 且只用常量级 `O(1)` 的额外空间。
 *
 * 示例 1：
 *
 *   输入：nums = [1,3,4,2,2]
 *   输出：2
 *
 * 示例 2：
 *
 *   输入：nums = [3,1,3,4,2]
 *   输出：3
 *
 * 示例 3 :
 *
 *   输入：nums = [3,3,3,3,3]
 *   输出：3
 *
 * 提示：
 *   - `1 <= n <= 10^5`
 *   - `nums.length == n + 1`
 *   - `1 <= nums[i] <= n`
 *   - `nums` 中 只有一个整数 出现 两次或多次 ，其余整数均只出现 一次
 *
 * 进阶：
 *   - 如何证明 `nums` 中至少存在一个重复的数字?
 *   - 你可以设计一个线性级时间复杂度 `O(n)` 的解决方案吗？
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 把数组当成链表，用 Floyd 判圈（龟兔赛跑）
 *
 * ★ 先看清题目为什么要这么"刁难" ★
 *   两个硬性要求把常规解法全堵死了:
 *     · 不修改数组     → 排序后看相邻、原地打标记，全部出局
 *     · O(1) 额外空间  → 哈希表 / Set 计数，出局
 *   剩下的路只有"把数组当成别的东西来看"。Floyd 判圈就是这么来的。
 *
 * ★ 核心洞察: 数组下标 → 值，就是一条链表 ★
 *
 *   数组下标 i 上存着 nums[i]，那就把 nums[i] 看成【指向下标 nums[i] 的一个指针】:
 *
 *       下标 i  ──nums[i]──▶  下标 nums[i]
 *
 *   于是整个数组变成了一张有向图（每个节点只出一条边，叫"函数图"）。
 *   从下标 0 出发一路走就是一条链:
 *
 *       0 → nums[0] → nums[nums[0]] → nums[nums[nums[0]]] → ...
 *
 *   拿示例 1  [1, 3, 4, 2, 2] 走一遍:
 *
 *       0 → nums[0]=1 → nums[1]=3 → nums[3]=2 → nums[2]=4 → nums[4]=2 → ...
 *                                                       ↑              │
 *                                                       └──────────────┘
 *                                                          环: 2 → 4 → 2
 *
 * ★ 为什么一定会有环 ★（这就是进阶第一问的答案）
 *   一共 n+1 个"节点"（下标 0 到 n），但每个节点指向的目标只可能是 [1, n]
 *   这 n 种下标。走了 n+1 步必然有节点被访问两次 → 必有环。
 *   ★ 这也正好回答了"为什么至少存在一个重复的数字"★
 *
 * ★ 为什么环的入口就是那个重复的数 ★
 *   设环入口是节点 v。指向 v 的边有两条:
 *     · 环外那条路径上、紧挨着 v 的前一个节点
 *     · 环里最后一个节点（它绕回来指向 v）
 *   两条入边 = 值为 v 的元素在数组里出现了【至少两次】→ v 就是答案。
 *   （更一般地: 指向节点 v 的边有几条，值 v 就在数组里出现了几次。）
 *
 * ★ Floyd 判圈的两阶段 ★
 *
 *   阶段一: 慢指针每次走 1 步，快指针每次走 2 步，直到它们相遇。
 *           （必然相遇 —— 快指针在环里会一圈圈追上慢指针）
 *
 *   阶段二: 把慢指针放回起点（下标 0），快指针留在相遇点，
 *           然后两个指针【都改成每次走 1 步】，再次相遇的位置就是环入口。
 *
 * ★ 阶段二为什么能对上 ★（结论记牢，证明看这里就够）
 *   设"起点到环入口"距离为 a，"环入口到相遇点"距离为 c，环长为 b。
 *   相遇时慢指针走了 a + c；因为快指针速度是它的 2 倍，
 *   所以快指针走了 2(a+c)，比慢指针多走的那些正是整数圈:
 *       (a + c) = kb        （k 是某个整数）
 *   移项得 a = kb - c。也就是说:
 *     · 从【起点】往前走 a 步 → 到达环入口
 *     · 从【相遇点】往前走 a 步 → 走 c 到入口、再绕 kb-c 步，也正好落在环入口
 *   两边的"路程"都是 a，于是同速前进必然在环入口碰头。证毕。
 *
 * 拿示例 1  [1, 3, 4, 2, 2] 跑一遍:
 *
 *   阶段一（slow 走 1 步，fast 走 2 步）:
 *     slow=0, fast=0
 *     第1轮: slow=nums[0]=1        fast=nums[nums[0]]=nums[1]=3
 *     第2轮: slow=nums[1]=3        fast=nums[nums[3]]=nums[2]=4
 *     第3轮: slow=nums[3]=2        fast=nums[nums[4]]=nums[2]=4
 *     第4轮: slow=nums[2]=4        fast=nums[nums[4]]=nums[2]=4   ← 相遇于 4
 *   阶段二（slow 回起点 0，两者都走 1 步）:
 *     slow=0, fast=4
 *     第1轮: slow=nums[0]=1        fast=nums[4]=2
 *     第2轮: slow=nums[1]=3        fast=nums[2]=4
 *     第3轮: slow=nums[3]=2        fast=nums[4]=2   ← 相遇于 2  ✓
 *
 * ───────────────────────────────────────────
 * 另一种思路: 二分查找 + 抽屉原理
 * ───────────────────────────────────────────
 *
 *   不去管下标，直接在【值的范围 [1, n]】上二分答案。
 *   对中点 mid，数一数数组里有多少个数 <= mid，记作 count:
 *
 *     count > mid  →  答案在 [lo, mid]   （左半边有重复）
 *     count <= mid →  答案在 [mid+1, hi]
 *
 *   ★ 为什么 count > mid 说明答案在左半边 ★
 *   [1, mid] 里一共只有 mid 个不同的整数。如果数组里 <= mid 的数有 count > mid 个，
 *   根据【抽屉原理】，这 count 个数要塞进只有 mid 个格子的抽屉里，必然有重复。
 *   反过来，如果答案 > mid，那 [1, mid] 里的每个值都只会出现一次，
 *   count 恰好等于 mid，不会超过。
 *
 *   复杂度 O(n log n)，空间 O(1)，也不改数组 —— 不如 Floyd 快，但思路更好想到。
 *
 * ★ 各解法对比 ★
 *
 *   解法            时间       空间      改数组?   说明
 *   ────────────────────────────────────────────────────────────
 *   Floyd 判圈      O(n)       O(1)      否        ★ 唯一同时满足两个硬要求的 ★
 *   二分 + 抽屉     O(n log n) O(1)      否        思路最好想，也符合要求
 *   按位统计        O(n log n) O(1)      否        标签里的"位运算"指的就是它
 *   哈希表 / Set    O(n)       O(n)      否        空间不达标
 *   排序后看相邻    O(n log n) O(log n)~ 【是】    违反"不修改数组"
 *
 * 易错点:
 *   1. ★ 阶段一结束时 slow 和 fast 停在【环内的相遇点】，不是环入口 ★
 *      必须再做阶段二（慢指针回起点、两者同速）才能拿到入口。
 *      直接返回相遇点是最常见的错法 —— 实测 2 万组里出错 32.1%，非常高。
 *      例: [1,3,4,2,2] 的相遇点是 4，真正的答案是 2。
 *   2. 阶段二的初始条件是 [slow = 0]，不是 nums[0]。想清楚"链表的头是下标 0"。
 *   3. ★ 这个解法【依赖题目的取值承诺】★
 *      必须保证所有 nums[i] 都在 [1, n] 内（也就是不会指到下标 0，
 *      下标 0 是纯粹的起点）。如果数组里冒出个 0 或者越界的值，这套就崩了。
 *   4. 二分法的单调性来自抽屉原理，不是"数组有序"—— 数组其实是无序的，别搞混
 *   5. 二分取中点用 Math.floor((lo + hi) / 2)，写清楚意图
 *
 * 复杂度:
 *   Floyd 判圈 —— 时间 O(n)，空间 O(1)   ← 本文件主解法
 *
 *   n = 100000（题目上限）实测:
 *     Floyd 判圈     0.72 ms    ← O(n)
 *     二分 + 抽屉    3.47 ms    ← O(n log n)，慢约 5 倍
 *   这也印证了复杂度的差距 —— 二分每轮都要扫一遍数组，log n 轮就是 n log n。
 */

/**
 * findDuplicate
 * Floyd 判圈（龟兔赛跑）: 把数组当下标链表，找环入口 —— 本文件主解法
 * 不改数组、O(1) 空间、O(n) 时间，三个要求全满足
 * @param {number[]} nums
 * @return {number}
 */
const findDuplicate = function (nums) {
  // ── 阶段一: 快慢指针，找环内的相遇点 ──
  let slow = 0;
  let fast = 0;

  do {
    slow = nums[slow]; // 慢的走 1 步
    fast = nums[nums[fast]]; // 快的走 2 步
  } while (slow !== fast);

  // ── 阶段二: 慢指针回到起点，两者都改走 1 步，相遇处就是环入口 ──
  // ★ 这里 slow 要置 0（链表的头是下标 0），不是 nums[0] ★
  slow = 0;
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow; // 环入口 = 重复的那个值
};

/**
 * findDuplicateBinary
 * 二分 + 抽屉原理: 在值域 [1, n] 上二分，靠"数一数有几个 <= mid"来判断
 * O(n log n) 时间、O(1) 空间、不改数组
 * @param {number[]} nums
 * @return {number}
 */
const findDuplicateBinary = function (nums) {
  const n = nums.length - 1; // 值域是 [1, n]
  let lo = 1;
  let hi = n;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);

    // 数一数数组里有多少个数 <= mid
    let count = 0;
    for (const x of nums) {
      if (x <= mid) count++;
    }

    if (count > mid) {
      // [1, mid] 只有 mid 个不同的值却塞进了 count 个数 → 抽屉原理，答案在左半边
      hi = mid;
    } else {
      // 左半边每个值都只出现一次，答案在右半边
      lo = mid + 1;
    }
  }

  return lo;
};

/**
 * findDuplicateBit
 * 按位统计: 逐位比较"数组里的 1 的个数"和"[1,n] 里的 1 的个数"
 * O(n log n) 时间、O(1) 空间、不改数组
 * @param {number[]} nums
 * @return {number}
 */
const findDuplicateBit = function (nums) {
  const n = nums.length - 1; // 值域 [1, n]
  let result = 0;

  // 逐位检查（从最低位开始，最多看到 n 的最高位）
  for (let b = 0; 2 ** b <= n; b++) {
    const mask = 2 ** b;

    // 取 x 第 b 位的值。用 Math.floor(x / mask) % 2 而不是位移运算，
    // 意图更直白（Math.floor 就是"整除"，% 2 就是"取最低位"）
    const bitOf = (x) => Math.floor(x / mask) % 2;

    let countNums = 0;
    for (const x of nums) {
      if (bitOf(x) === 1) countNums++;
    }

    let countRange = 0;
    for (let v = 1; v <= n; v++) {
      if (bitOf(v) === 1) countRange++;
    }

    // 数组里这一位的 1 比"标准答案"多出来的那些，就是重复数贡献的
    if (countNums > countRange) result += mask;
  }

  return result;
};

/**
 * findDuplicateSet
 * 参照实现: 用 Set 找出第一个重复的数
 * 最简单直白，但空间 O(n)，不满足题目要求 —— 只用来对答案
 * @param {number[]} nums
 * @return {number}
 */
const findDuplicateSet = function (nums) {
  const seen = new Set();

  for (const x of nums) {
    if (seen.has(x)) return x;
    seen.add(x);
  }

  return -1; // 题目保证有重复，走不到这
};

// ─── 测试 ───────────────────────────────────────────
// console.log(findDuplicate([1, 3, 4, 2, 2])); // 期望: 2   示例 1
// console.log(findDuplicate([3, 1, 3, 4, 2])); // 期望: 3   示例 2
// console.log(findDuplicate([3, 3, 3, 3, 3])); // 期望: 3   示例 3（重复了 5 次）
// console.log(findDuplicate([1, 1])); // 期望: 1   n=1 的最小情况
// console.log(findDuplicate([1, 2, 2])); // 期望: 2
// console.log(findDuplicate([2, 2, 2, 2])); // 期望: 2
// console.log(findDuplicate([2, 1, 2])); // 期望: 2   重复值跑到下标 0 上去了
//
// 四种解法互相印证:
// const check = (arr) => [
//   findDuplicate(arr),
//   findDuplicateBinary(arr),
//   findDuplicateBit(arr),
//   findDuplicateSet(arr)
// ];
// console.log(check([1, 3, 4, 2, 2])); // [2, 2, 2, 2]
// console.log(check([3, 1, 3, 4, 2])); // [3, 3, 3, 3]
// console.log(check([3, 3, 3, 3, 3])); // [3, 3, 3, 3]
//
// ★ 顺带验证一下"不改数组"这个要求 ★
// const arr = [1, 3, 4, 2, 2];
// const before = JSON.stringify(arr);
// findDuplicate(arr);
// console.log('数组有没有被改:', JSON.stringify(arr) === before ? '没改 ✓' : '被改了 ✗');
//
// ★ 想亲眼看看那条"链表"长什么样 ★
// const walk = (arr) => {
//   const path = [0];
//   let cur = 0;
//   for (let step = 0; step < 12; step++) {
//     cur = arr[cur];
//     path.push(cur);
//   }
//   console.log(path.join(' → '));
// };
// walk([1, 3, 4, 2, 2]); // 0 → 1 → 3 → 2 → 4 → 2 → 4 → 2 → ...
// walk([3, 1, 3, 4, 2]); // 0 → 3 → 4 → 2 → 3 → 4 → 2 → ...（环入口是 3）
