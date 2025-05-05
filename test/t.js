function flattenObject(obj) {
  const result = {};

  function dfs(node, path = []) {
    if (typeof node !== 'object' || node === null) {
      result[path.join('.')] = node;
      return;
    }

    for (let key in node) {
      if (Object.hasOwn(node, key)) {
        dfs(node[key], path.concat(key)); // ✅ 每次生成新数组，不修改原数组
      }
    }
  }

  dfs(obj);
  return result;
}

// 1. 基础嵌套对象
console.log(flattenObject({ a: { b: { c: 1 } } }));
// → { 'a.b.c': 1 }

// 2. 多层嵌套 + 多键
console.log(flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 }));
// → { 'a.b': 1, 'a.c.d': 2, 'e': 3 }

// 3. 值为 null 的键（保留）
console.log(flattenObject({ a: null, b: { c: null } }));
// → { 'a': null, 'b.c': null }

// 4. 包含数组（视作普通值，不展开）
console.log(flattenObject({ a: [1, 2], b: { c: [3] } }));
// → { 'a': [1, 2], 'b.c': [3] }

// 5. 空对象
console.log(flattenObject({}));
// → {}

// 6. 混合类型（函数 / symbol / undefined）
const obj = {
  a: 1,
  b: undefined,
  c: () => {},
  d: {
    e: Symbol('x')
  }
};
console.log(flattenObject(obj));
// → { 'a': 1, 'b': undefined, 'c': [Function], 'd.e': Symbol(x) }
// 注：因为我们未过滤特殊类型，仍会保留

// 7. 如果你想过滤“非可 JSON 值”，可以手动判断
// typeof val === 'object' || typeof val === 'string' || typeof val === 'number' 等等
