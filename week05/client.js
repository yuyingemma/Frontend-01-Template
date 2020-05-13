const net = require('net');
// const client = net.createConnection({ 
//     host:"127.0.0.1",
//     port: 8088,
//   }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');

//   // client.write('POST / HTTP/1.1\r\n');
//   // // client.write('Host:127.0.0.1\r\n');
//   // client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//   // client.write('Content-Length: 11\r\n');
//   // client.write('\r\n');//请求要换行
//   // client.write('name=winter');

  
//   let request = new Request({
//       method: "POST",
//       host: "127.0.0.1",
//       port: "8088",
//       path: "/",
//       headers:{
//           ["X-FOO2"]:"customed",
//       },
//       body:{
//           name:"winter"
//       }
//   })

//   request.send();

//   console.log(request.toString());

// //手动向server发送请求
// //   client.write(
// // `POST / HTTP/1.1\r
// // Content-Type: application/x-www-form-urlencoded\r
// // Content-Length: 11\r
// // \r
// // name=winter`);

// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });

class TrunkedBodyParser{
  constructor(){
      this.WATTING_LENGTH = 0;
      this.WATTING_LENGTH_LINE_END = 1;
      this.READING_TRUNK = 2;
      this.WAITING_NEW_LINE = 3;
      this.WAITING_NEW_LINE_END = 4;
      this.isFinished = false;
      this.length = 0;//剩余的chunked
      this.content = [];
      this.current = this.WATTING_LENGTH;
  }
 
  reciveChar(char){
      if(this.current === this.WATTING_LENGTH){
         //以 0 为结束标志
         if(this.length === 0){
          console.log("/////////////");
            this.isFinished = true;
        }
          if(char === '\r'){
              this.current=this.WATTING_LENGTH_LINE_END;
          }else {
            //文本返回字段是十进制长度，可以直接计算剩余字符
              this.length *=10;
              this.length +=char.charCodeAt(0) - '0'.charCodeAt(0);
          }
      }else if(this.current === this.WATTING_LENGTH_LINE_END){
          if(char === '\n'){
              this.current=this.READING_TRUNK;
          }
      }else if(this.current === this.READING_TRUNK){
          this.content.push(char);
          this.length --;
          if(this.length === 0){
              this.current = this.WAITING_NEW_LINE;
          }
      }else if(this.current === this.WAITING_NEW_LINE){
          if(char === '\r'){
              this.current = this.WAITING_NEW_LINE_END;
          }
  
      }else if(this.current === this.WAITING_NEW_LINE_END){
        if(char === '\n'){
            this.current = this.WAITING_NEW_LINE_END;
        }

    }
  }
}
class RespondParser{
  constructor(){
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WATTING_HEADER_SPACE = 3;//冒号后面还有一个空格
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WATTING_BODY = 7;
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParse = null;

    }
    get isFinished(){
        return this.bodyParse && this.bodyParse.isFinished;
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
          statusCode:RegExp.$1,
           statusText:RegExp.$2,
          headers:this.headers,
        body:this.bodyParse.content.join('')     };
    }
    receive(string){
            for(let i = 0; i <string.length;i++){
                this.reciveChar(string.charAt(i))
                // console.log(string[i]);
                // console.log(string[i].charCodeAt(0));
            }
    }

    reciveChar(char){
      // console.log(char.charCodeAt(0));
        if(this.current === this.WAITING_STATUS_LINE){
            if(char === '\r'){
              //statusline以\r结束
                this.current = this.WAITING_HEADER_LINE_END;
            }else if(char === '\n'){
              //\n即为跳到新行开头
                this.current = this.WAITING_HEADER_NAME;
            }else{//状态不改变，即不是换行，则会被追加到字符串里
                this.statusLine+=char;
            }
        }
        else  if(this.current === this.WAITING_STATUS_LINE_END){
          if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if(this.current === this.WAITING_HEADER_NAME){
          if(char ==='\r'){
            this.current = this.WAITING_HEADER_BLOCK_END;
            if(this.headers['Transfer-Encoding'] === 'chunked')
                this.bodyParse = new TrunkedBodyParser();
          }else if(char === ':'){
                this.current = this.WATTING_HEADER_SPACE;

            }else{
              this.headerName += char;
            }
        } 
        else if(this.current=== this.WATTING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WAITING_HEADER_VALUE;

            }
        }
        else if(this.current=== this.WAITING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            }else{
                this.headerValue += char;
            }
        }
        else if (this.current=== this.WAITING_HEADER_LINE_END){
            if(char==='\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === '\n')
                this.current = this.WATTING_BODY;
        }else if (this.current === this.WATTING_BODY){
          this.bodyParse.reciveChar(char);
          console.log(JSON.stringify(char));//输出有多少个回车
        }
    }
    
  }
      
class Request{
    //method, url = host+port+path
constructor(option){
  // console.log(option);
    this.method = option.method || "GET";
    this.host = option.host;
    this.port = option.port || 80;
    this.path = option.path || "/";
    this.body = option.body || {};
    this.headers = option.headers || {};
    if(!this.headers["Content-Type"]){
        this.headers["Content-Type"] = 'application/x-www-form-urlencoded';
    }
    if(this.headers["Content-Type"] === "application/json"){
        this.bodyText = JSON.stringify(this.body);
    }else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
        this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');//${key}=${encodeURIComponent(this.body[key])},这句代码里等号两边不能有空格，不然会计算多两个字符
        this.headers["Content-Length"] = this.bodyText.length;
    }
   
}
  toString(){
        //headers部分开始不能有任何缩进，接下去的\r不能跟在headers部分，必须回车新一行
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`;

    }
    //发送请求function
  send(connection){
        return new Promise((resolve,reject) =>{
            const parser = new RespondParser();
            const bodyParse = new TrunkedBodyParser();
            if(connection){
                connection.write(this.toString())
            }else {
              
              //主动创建connection

                connection = net.createConnection({
                    host:this.host,
                    port:this.port
                },()=>{
                    connection.write(this.toString())
                })
                //可能有多个Data，如果body比较大=>chunked
                //1.buffer满了会触发 2.服务端收到一个IP包
                //使用状态机处理TCP流
                connection.on('data', (data) => {
                  // console.log('data')
                  // console.log(data.toString());
                    parser.receive(data.toString());
                    // console.log(parser.statusLine);
                    console.log(parser.headers);
                    
                    if(parser.isFinished ){
                      // console.log(parser.bodyParse);

                      resolve(parser.response);
                    }
                    connection.end();
                  });
                connection.on('end', () => {
                    console.log('disconnected from server');
                    connection.end();
                  });
            }
        })
       
    }
}

void async function(){
  let request = new Request({
      method:"POST",
      host:"127.0.0.1",
      port:"8088",
      path:"/",
      headers:{
          ["X-FOO3"]:"customed",
          ["X-FOO4"]:'testtest'
      },
      body:{
          name: "winter"
      }
  });
  let response = await request.send();
  // request.send();
  // console.log("1111111111");
  console.log(response);
}()

// class Respond{}

