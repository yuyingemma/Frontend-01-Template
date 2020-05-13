# 浏览器原理-HTTP协议
## 简介
1. 定义：超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是一种用于分布式、协作式和超媒体信息系统的应用层协议，是数据通信的基础。
2. 发展历程：
   1. 1999年6月公布的 RFC 2616，定义了HTTP协议中现今广泛使用的一个版本——HTTP 1.1。
   2. HTTP/2标准于2015年5月以RFC 7540正式发表，取代HTTP 1.1成为HTTP的实现标准。
## 协议工作原理
HTTP协议采取了请求/响应模型，即WEB客户端向服务器发送一个请求报文，服务器响应后返回一个状态给客户端。
 1. 请求报文：包含请求方式（method），URL，协议版本（HTTP 1.1、HTTP/2),请求头部（headers）和请求数据（body）
 2. 相应内容：协议版本，响应代码（code），服务器信息，响应头部（headers）和响应数据
   
##### 发送请求/响应步骤
1. 客户端连接到服务器：通常是浏览器与HTTP端口建立一个TCP链接
```
const http = require("http");
const server = http.createServer((req, res) => {
    console.log('request received');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo1', 'bar');
    res.setHeader('X-Foo2', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  });
server.listen(8088);
```
2. 发送HTTP请求 
3. 服务器接受请求并返回HTTP响应
``` 
`void async function(){
    //发送请求
  let request = new Request({
      method:"POST",//请求头部
      host:"127.0.0.1",//浏览器IP
      port:"8088",//指定HTTP端口
      path:"/",
      headers:{
          ["X-FOO3"]:"customed",
          ["X-FOO4"]:'testtest'
      },
      body:{//请求数据
          name: "winter"
      }
  });
  //得到HTTP返回的响应文本
  let response = await request.send();
  console.log(response);
}()

  ```
4. 释放TCP连接

    若connection 模式为close，则服务器主动关闭TCP连接，客户端被动关闭连接，释放TCP连接;若connection 模式为keepalive，则该连接会保持一段时间，在该时间内可以继续接收请求;

5. 客户端浏览器解析响应的内容
    1. 首先解析状态行，查看表明请求是否成功的状态代码 
    2. 然后解析每一个响应头，响应头告知以下返回的是HTML文档以及文档字符集
## HTTP状态码
所有HTTP响应的第一行都是状态行，依次是当前HTTP版本号，3位数字组成的状态代码，以及描述状态的短语，彼此由空格分隔。

状态代码的第一个数字代表当前响应的类型：

1. 1xx消息——请求已被服务器接收，继续处理
2. 2xx成功——请求已成功被服务器接收、理解、并接受
3. 3xx重定向——需要后续操作才能完成这一请求
4. 4xx请求错误——请求含有词法错误或者无法被执行
5. 5xx服务器错误——服务器在处理某个正确请求时发生错误

## HTTP请求格式
请求报文组成:  

请求方法 + 空格 + URL + 空格 + 协议版本 +回车符+换行符 ---请求行  

    POST / HTTP/1.1  

头部字段名 ： 值 + 回车符 +换行符  
...  
头部字段名 ： 值 + 回车符 +换行符  
```
Content-Type:application/x-www-form-urlencoded  
Content-Length:11  
```

回车符+换行符  
```
\r\n  
```

请求数据  
```
body:{
    name:winter
}
```
## HTTP响应格式
协议版本 + 空格 + 状态码 + 空格 + 状态码描述 + 回车符 + 换行符 ---请求行  
```
HTTP/1.1 200 OK
```

头部字段名 ： 值 + 回车符 +换行符  
...  
头部字段名 ： 值 + 回车符 +换行符  
```
Content-Type:text/html
Connection: 'keep-alive',
```

回车符+换行符  
```
\r\n  
```

响应正文
```
<html>
...
```
