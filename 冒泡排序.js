function bubbleSort(nums) {
    // [1,2,3,4]
    const n = nums.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (nums[j] > nums[j + 1]) {
                let a = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = a;
            }
        }
    }
    return nums;
}

console.log(bubbleSort([5,23,56,9,1,354]));