# 每周总结可以写在这里
## JS中所有的对象
### ordinary object-普通对象
万物起源，对象的始祖，ordinary objectj具备了对象的内置方法
### exotic object-外来对象
如果不完全具备普通对象的基本内置方法，那么这个对象就被称为外来对象，JS标准里，非普通对象就是外来对象
1. Bound Function-有界函数外来对象
2. Array-数组外来对象
3. String-字符串对象
4. Arguments-参数对象
5. Integer-Indexed-索引对象
6. Module Namespace-模块空间化对象
7. Immutable Prototype-不可变对象
8. Proxy Object-代理对象
### standard object-标准对象
语义由ES6标准制定的对象
### built-in object-内置对象

# JavaScript 里有哪些对象是我们无法实现

javascript中的原生对象是无法用纯javascript代码实现的。 比如：

### 基本类型:

1. Object
2. Function
3. Boolean
4. Symbol
### 基本功能和数据结构:

1. Array
2. Data
3. RegExp
4. Promise
5. Proxy
6. Function

### 错误类型:

1. AggregateError
2. EvalError
3. RangeError
4. ReferenceError
5. SyntaxError
6. TypeError

### 二进制操作:

1. ArrayBuffe
2. sharedArrayBuffer
3. DataView

### 带类型的数组:

1. Float32Array
2. Float64Array
3. Int8Array
4. Int16Array
5. Int32Array
6. Unit8Array
7. Unit16Array
8. Unit32Array
9. Unit8ClampedArrray
