/**
 * LeetCode 热题 100 —— 堆
 *
 * 347. 前 K 个高频元素 (Top K Frequent Elements)
 * 难度: 中等 | 标签: 数组、哈希表、分治、桶排序、计数、快速选择、排序、堆（优先队列）
 * 链接: https://leetcode.cn/problems/top-k-frequent-elements/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 任意顺序 返回答案。
 *
 * 示例 1：
 *
 * 输入：nums = [1,1,1,2,2,3], k = 2
 *
 * 输出：[1,2]
 *
 * 示例 2：
 *
 * 输入：nums = [1], k = 1
 *
 * 输出：[1]
 *
 * 示例 3：
 *
 * 输入：nums = [1,2,1,2,1,2,3,1,3,2], k = 2
 *
 * 输出：[1,2]
 *
 * 提示：
 *   - `1 <= nums.length <= 10^5`
 *   - `-10^4 <= nums[i] <= 10^4`
 *   - `k` 的取值范围是 `[1, 数组中不相同的元素的个数]`
 *   - 题目数据保证答案唯一，换句话说，数组中前 `k` 个高频元素的集合是唯一的
 *
 * 进阶：你所设计算法的时间复杂度 必须 优于 `O(n log n)` ，其中 `n` 是数组大小。
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 哈希表数频率 + (小顶堆 / 桶排序) 取 Top-K
 *
 * ★ 关键转念: 这题是【两件事拼起来的】★
 *
 *   第一步: "出现了几次"   → 哈希表，O(n)
 *   第二步: "频率前 k 高"  → 又是一个 Top-K 问题，就是上一题 215
 *
 *   想清楚这一点，"难"就消失了 —— 只是把 215 里比较的对象
 *   从"元素值"换成了"频率"而已。
 *
 * ── 写法一: 哈希表 + 小顶堆（堆章节正统） ──
 *   和 215 一模一样:
 *     维护一个大小不超过 k 的小顶堆，堆顶是"当前保留集合里频率最低的"
 *     遍历所有 (元素, 频率)，入堆；超过 k 个就把堆顶（频率最低的）弹掉
 *     最后堆里剩下的就是频率最高的 k 个
 *
 *   ★ 又是【小】顶堆 —— 因为要扔掉的是"频率最低的"，
 *     而小顶堆的堆顶正好是它。
 *
 *   复杂度 O(n + m log k)，m 是不同元素的个数。满足进阶要求。
 *
 * ── 写法二: 哈希表 + 桶排序（更妙，O(n)） ──
 *   关键洞察: 【频率的取值范围只有 1 ~ n】！
 *   范围小、又是整数 → 那就别排序了，直接开桶:
 *
 *     bucket[f] = 所有出现恰好 f 次的元素
 *
 *   然后从 f = n 倒着扫到 f = 1，凑够 k 个就停。
 *   因为频率天然是有限的小整数，连排序都省了 —— 这就是
 *   "桶排序"这个名字的由来: 用【值域当数组下标】来排序。
 *
 *   复杂度 O(n)。比堆还快，代码也更短。
 *
 * 易错点:
 *   1. ★ 数频率时别忘了初始化 ★: freq.get(v) || 0
 *      直接写 freq.set(v, freq.get(v) + 1) 会得到 NaN
 *   2. ★ 桶数组大小是 n + 1 ★
 *      频率最大就是 n（所有元素都相同），下标要能取到 n
 *   3. ★ 桶排序要【从大往小】扫 ★（f 从 n 递减到 1）
 *      从小到大扫的话，拿到的是频率最低的那些
 *   4. 题目说"按任意顺序返回"，所以不用操心同频率元素之间的顺序
 *
 * 复杂度:
 *   堆解法 —— 时间 O(n + m log k)，空间 O(m + k)
 *   桶排序 —— 时间 O(n)，空间 O(n)
 *   （m = 不同元素的个数）
 */

/**
 * topKFrequent
 * 哈希表 + 小顶堆
 * 输入: nums = [1,1,1,2,2,3], k = 2
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const topKFrequent = function (nums, k) {
  // ── 第一步: 数频率 ──
  const freq = new Map();
  for (const v of nums) {
    freq.set(v, (freq.get(v) || 0) + 1); // ★ || 0 别漏
  }

  // ── 第二步: 小顶堆求 Top-K（堆里每项是 [元素, 频率]） ──
  const heap = []; // 堆顶是【频率最低】的那个

  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;

    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p][1] <= heap[i][1]) break; // 按【频率】比大小
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };

  const pop = () => {
    const top = heap[0];
    const last = heap.pop();

    if (heap.length > 0) {
      heap[0] = last;

      let i = 0;
      while (true) {
        const l = i * 2 + 1;
        const r = i * 2 + 2;
        let smallest = i;

        if (l < heap.length && heap[l][1] < heap[smallest][1]) smallest = l;
        if (r < heap.length && heap[r][1] < heap[smallest][1]) smallest = r;
        if (smallest === i) break;

        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }

    return top;
  };

  for (const item of freq) {
    push(item); // item 是 [元素, 频率]
    if (heap.length > k) pop(); // 超过 k 个就把频率最低的扔掉
  }

  return heap.map((item) => item[0]);
};

/**
 * topKFrequentBucket
 * 哈希表 + 桶排序: 频率只有 1~n，直接开桶
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const topKFrequentBucket = function (nums, k) {
  // ── 第一步: 数频率 ──
  const freq = new Map();
  for (const v of nums) {
    freq.set(v, (freq.get(v) || 0) + 1);
  }

  // ── 第二步: 桶排序 ──
  // bucket[f] = 所有出现恰好 f 次的元素
  const bucket = new Array(nums.length + 1); // ★ 下标要能取到 n

  for (const [v, f] of freq) {
    if (bucket[f] === undefined) bucket[f] = [];
    bucket[f].push(v);
  }

  // ★ 从大往小扫，凑够 k 个就停
  const res = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    const group = bucket[f];
    if (group === undefined) continue;

    for (const v of group) {
      res.push(v);
      if (res.length === k) break;
    }
  }

  return res;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // 期望: [1, 2](顺序不限)
// console.log(topKFrequent([1], 1)); // 期望: [1]
// console.log(topKFrequent([1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2)); // 期望: [1, 2]
// console.log(topKFrequent([1, 2], 2));        // 期望: [1, 2]  ← k = 不同元素个数
// console.log(topKFrequent([4, 4, 4, 4], 1));  // 期望: [4]     ← 只有一个不同元素
// console.log(topKFrequent([-1, -1, 2], 1));   // 期望: [-1]    ← 负数
// console.log(topKFrequentBucket([1, 1, 1, 2, 2, 3], 2)); // 期望: [1, 2]
//
// 顺序不限,所以验证【性质】而不是直接比数组:
//   ① 返回 k 个  ② 互不重复  ③ 每个都是 nums 里出现过的
//   ④ 这 k 个的频率, 恰好等于"按频率降序排序后取前 k 个"的频率集合
//
// 参照实现: 先数频率,再排序取前 k
// const ref = (nums, k) => {
//   const freq = new Map();
//   for (const v of nums) freq.set(v, (freq.get(v) || 0) + 1);
//   return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(e => e[0]);
// };
