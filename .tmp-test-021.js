const fs = require('fs');
let src = fs.readFileSync('07-链表/021.合并两个有序链表.js', 'utf8').replace('  debugger\n\n', '');
src += `
const cases = [
  [[1, 2, 4], [1, 3, 4], [1, 1, 2, 3, 4, 4]],
  [[], [], []],
  [[], [0], [0]],
  [[5], [1, 2, 4], [1, 2, 4, 5]],
  [[2, 2], [2, 2, 2], [2, 2, 2, 2, 2]],
];
for (const [a, b, expected] of cases) {
  const r1 = toArray(mergeTwoLists(toList(a), toList(b)));
  const r2 = toArray(mergeTwoListsRecursive(toList(a), toList(b)));
  const ok = JSON.stringify(r1) === JSON.stringify(expected) && JSON.stringify(r2) === JSON.stringify(expected);
  console.log(JSON.stringify(a), '+', JSON.stringify(b), '→', JSON.stringify(r1), '递归', JSON.stringify(r2), '期望', JSON.stringify(expected), ok ? '✓' : '✗');
}
`;
eval(src);
