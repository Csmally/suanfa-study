/**
 * LeetCode 热题 100 —— 堆
 *
 * 215. 数组中的第K个最大元素 (Kth Largest Element in an Array)
 * 难度: 中等 | 标签: 数组、分治、快速选择、排序、堆（优先队列）
 * 链接: https://leetcode.cn/problems/kth-largest-element-in-an-array/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。
 *
 * 请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。
 *
 * 你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。
 *
 * 示例 1:
 *
 *   输入: [3,2,1,5,6,4], k = 2
 *   输出: 5
 *
 * 示例 2:
 *
 *   输入: [3,2,3,1,2,4,5,5,6], k = 4
 *   输出: 4
 *
 * 提示：
 *   - `1 <= k <= nums.length <= 10^5`
 *   - `-10^4 <= nums[i] <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 小顶堆（堆章节正统解法）+ 快速选择（真正的 O(n)）
 *
 * ★ 关键转念 ①: 求"第 k 大"，要用【小顶堆】★
 *
 *   直觉容易反 —— 求最大不该用大顶堆吗？不是。
 *
 *   我们要的是"保留最大的 k 个数"。所以需要一个能快速扔掉
 *   "这 k 个里最小的那个"的结构，而【小顶堆的堆顶正好就是
 *   当前保留集合里的最小值】。
 *
 *   做法: 遍历数组，元素入堆；堆大小超过 k 就把堆顶弹掉。
 *   遍历完，堆里剩下的是【最大的 k 个数】，堆顶就是其中
 *   最小的那个 —— 也就是第 k 大。
 *
 *   拿 [3,2,1,5,6,4], k=2 走一遍:
 *     push 3        heap=[3]
 *     push 2        heap=[2,3]
 *     push 1        heap=[1,2,3]  → 超过 k，弹堆顶 1  → [2,3]
 *     push 5        heap=[2,3,5]  → 弹 2            → [3,5]
 *     push 6        heap=[3,5,6]  → 弹 3            → [5,6]
 *     push 4        heap=[4,5,6]  → 弹 4            → [5,6]
 *   堆顶 5 = 第 2 大 ✓
 *
 * ★ 关键转念 ②: 严格 O(n) 得用【快速选择】★
 *
 *   堆解法的复杂度其实是 O(n log k)，题目要求的 O(n) 严格来说
 *   要另外一招。快速选择借用了快排的 partition:
 *
 *     "第 k 大" = 升序排好后的下标 nums.length - k   （记为 target）
 *
 *   快排的 partition 会把基准放到【它最终的位置】上。设返回 p:
 *     p === target → 找到了，直接返回 nums[p]
 *     p <  target  → 答案在右边，只在右半边继续找
 *     p >  target  → 答案在左边，只在左半边继续找
 *
 *   ★ 关键: 【只走一边】★ 两边都走就退化成快排的 O(n log n) 了。
 *
 *   为什么只走一边就是 O(n):
 *     第一层处理 n 个元素，第二层 n/2，第三层 n/4 ……
 *     n + n/2 + n/4 + … = 2n = O(n)
 *
 * 易错点:
 *   1. ★ 求第 k 大用【小】顶堆（求第 k 小才用大顶堆）★ 容易搞反
 *   2. ★ 快速选择只走【一边】★
 *   3. ★ 快速选择的基准要随机选 ★
 *      每次都固定取最后一个的话，遇到已排好序的数组会退化成 O(n²)
 *   4. target = nums.length - k —— "第 k 大"的下标是 n-k，不是 k-1
 *
 * 复杂度:
 *   小顶堆   —— 时间 O(n log k)，空间 O(k)
 *   快速选择 —— 时间 平均 O(n) / 最坏 O(n²)，空间 O(1)（原地）
 *
 * 注: 快速选择会【原地修改】nums，而堆解法不会。
 *     如果不想动输入数组，快速选择要先拷贝一份。
 */

/**
 * findKthLargest
 * 小顶堆
 * 输入: nums = [3,2,1,5,6,4], k = 2
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const findKthLargest = function (nums, k) {
  const heap = []; // 小顶堆（堆顶最小）

  // 入堆 + 上浮
  const push = (v) => {
    heap.push(v);
    let i = heap.length - 1;

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] <= heap[i]) break; // 父亲更小，堆序已满足
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  // 弹堆顶 + 下沉
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

        if (l < heap.length && heap[l] < heap[smallest]) smallest = l;
        if (r < heap.length && heap[r] < heap[smallest]) smallest = r;
        if (smallest === i) break; // 已经比两个孩子都小，停

        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }

    return top;
  };

  for (const v of nums) {
    push(v);
    if (heap.length > k) pop(); // 超过 k 个就把最小的扔掉
  }

  return heap[0]; // 堆里是最大的 k 个，堆顶就是第 k 大
};

/**
 * findKthLargestQuick
 * 快速选择: 平均 O(n)
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const findKthLargestQuick = function (nums, k) {
  const n = nums.length;
  const target = n - k; // "第 k 大"在升序数组里的下标

  // 把 nums[lo..hi] 按 nums[hi] 为基准分区，返回基准的最终下标
  const partition = (lo, hi) => {
    // ★ 随机挑个基准换到末尾，避免有序数组退化
    const rand = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[rand], nums[hi]] = [nums[hi], nums[rand]];

    const pivot = nums[hi];
    let store = lo;

    for (let i = lo; i < hi; i++) {
      if (nums[i] < pivot) {
        [nums[store], nums[i]] = [nums[i], nums[store]];
        store++;
      }
    }

    [nums[store], nums[hi]] = [nums[hi], nums[store]];
    return store;
  };

  let lo = 0;
  let hi = n - 1;

  while (true) {
    const p = partition(lo, hi);

    if (p === target) return nums[p]; // 基准正好落在答案位置上
    if (p < target) lo = p + 1; // ★ 答案在右半边，只走这一边
    else hi = p - 1; // ★ 答案在左半边，只走这一边
  }
};

// ─── 测试 ───────────────────────────────────────────
// console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 期望: 5        ← 示例 1
// console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望: 4  ← 示例 2，有重复
// console.log(findKthLargest([1], 1));         // 期望: 1
// console.log(findKthLargest([2, 1], 1));      // 期望: 2   ← k=1 就是最大值
// console.log(findKthLargest([2, 1], 2));      // 期望: 1   ← k=n 就是最小值
// console.log(findKthLargest([3, 3, 3], 2));   // 期望: 3   ← 全相等
// console.log(findKthLargestQuick([3, 2, 1, 5, 6, 4], 2)); // 期望: 5
//
// 参照实现: 直接排序后取 nums[n-k]
// const ref = (nums, k) => nums.slice().sort((a, b) => a - b)[nums.length - k];
//
// 注意: findKthLargestQuick 会【原地修改】nums，所以测试时要么喂拷贝，
//       要么放在 findKthLargest 后面跑（堆解法不改数组）
