# 每周总结可以写在这里
JS的类型与语法
  Unicode
  ACSII
  code point:编码的码点
  Unicode Blocks
    查看Unicode list：http://www.fileformat.info/info/unicode/block/basic_latin/list.htm
    可记住两个Character
      U+000A：LINE FEED
      U+0020：SPACE
      不可视字符起语法调整和文本美观作用
    CJK:中日韩字符
    增补字符：导致使用Unicode来判断不太准确
    BMP：1.基本字符平面，兼容性好;2. 使用环境较少;3.主要应用在Emoji中;4.JS处理Emoji时要注意API兼容问题
    不建议使用超出ASCII字符范围的字符，会涉及到文件本身编码问题，不同条件下文件编码会比较复杂。
    硬性使用方式：1.源码中使用\u + 十六进制转义  2.字符串中可以直接使用
    举例：{代码块}
    {
    console.log(“厉害”.codePointAt(0).toString(16));//5389;
    console.log(“厉害”.codePointAt(1).toString(16));//5bb3;
    var \u5389\u5bb3 = 1; console.log(‘厉害’);//1}
  Categories
    Separator,Space
    Unicode里的Space在JS中都是合法的
  Lex Grammar
    InputElement
    White Space
      <TAB> :表意为制表符，就是数据表格用，现在通常用来做缩进
          早年间使用打印机，默认8位的tab
          仅次于空白格的常见的缩进符
          Unicode：U+0009（可通过’\t’.codePointAt(0)获取）
          转义符：\t
      <VT>:特殊空白符
          Unicode:U+000B
          转义符：\v
      <SP>:普通空白符
          Unicode：U+0020
          建议使用该空白符
      <NBSP>:空白符
        全称：No-Break Space
        意义：是一个处理排版上非常有用的词，而非普通的空格
        Unicode：U+00A0
        使用方式：&nbsp
      <ZWNBSP>:零宽空格
        历史：如果文件第一行有“<feff>”这个字符串，可根据它反猜字符的编码格式
        全称：Zero Width No-Break Space
        Unicode:U+FEFF
        FEFF的别称：当出现在文本第一行时称为FEFF；当出现在文本中时被称为BOM，Bit Order Mask。
      Line Terminator Code Points-换行符
        不推荐使用<LS><PS>,因为已经超出ACSII编码范围
        推荐使用<LF>，可了解<CR>
        拓展：为何Line Terminator不归类到White Space中
      Comment
        单行：使用//
        多行：使用/* */，无任何嵌套关系，易语言可嵌套
      Token
        Punctuator标识符：
        Keywords关键字：
        旧Identifier
        变量名：不可与关键字重合
        属性名：可与关键字重合//todo 74min
        新IdentifierName:ID_Start字符(英文，$，下划线_）+ID_Continue（英文，$,下划线_，数字）
        Keywords
        Identifier
        Future Reserved Keywords:enum
        拓展：JS引入了语法设施
      TYPE
      Number：
      定义：a double-precision 64-bit binary format IEEE 754-2008 value ,是双精度的遵循IEEE 754 二进制标准的64位浮点类型
      内存布局
      typeArray//todo
      Grammar
      拓展:旧的Chorme版本中，parseInt(‘010’) 不会输出10，需要填写第二个参数，parseInt(‘010’,10),表明这是10进制
      FLOAT COMPARE:
      Safe IntegerNumber.MAX_SAFE_INTEGER.toString(16) = ‘1fffffffffffff’
      0.2 + 0.3 ！=0.5会导致浮点数溢出也是由IEEE标准导致
      String：
        支持的字符集：ASCII ，Unicode UCS（U+0000-U+FFFF) ，GB（GB2312，GBK（GB13000），GB18030，一般存储中文字符) ， ISO-8859 (欧洲使用较多)，BIG5（繁体中文与ASCII）
        Encoding
        UTF8:占8个字符
        UTF16：前面补0，占16个字符
        用不同编码形式来存储字符，有各种优劣
        JS以UTF16为存储，不承认BMP以外的字符
        GRAMMER
        SingleStringCharacters单引号语法：
        DoubleStringCharacter双引号语法：
        反引号语法：`I said :”${s1}”,”{s2}”`
        拓展\r,\n，老式打印机上这是两个动作，ASCII从中继承了这两个动作
      Boolean
          值：true && false
      Undefined
          值：undefined
      Null
          值：null


