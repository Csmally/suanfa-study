const fs = require('fs');
let src = fs.readFileSync('07-链表/141.环形链表.js', 'utf8').replace('  debugger\n\n', '');
src += `
let head;
head = toList([3, 2, 0, -4]); head.next.next.next.next = head.next;
console.log('示例1(环):', hasCycle(head), '期望 true');
head = toList([1, 2]); head.next.next = head;
console.log('示例2(整环):', hasCycle(head), '期望 true');
console.log('示例3(无环):', hasCycle(toList([1])), '期望 false');
console.log('空链表:', hasCycle(null), '期望 false');
head = toList([1]); head.next = head;
console.log('自环:', hasCycle(head), '期望 true');
head = toList([1, 2, 3, 4]);
console.log('长无环:', hasCycle(head), '期望 false');
`;
eval(src);
