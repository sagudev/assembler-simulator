# Simple 8-bit V8-CPU Simulator with Assembler/C-subset Compiler
V8-CPU simulator is used for labs& exercises on first-year(freshman) undergraduate CS course "An Overview of Computer Science" in Dept. of CS in Tsinghua Univ. This simulator provides a simplified assembler/C syntax and is simulating a simple 8-bit RISC cpu. Press Help inside the simulator to see an overview about the supported instructions, which is based on Appendix C contents in <a href="http://www.amazon.com/Computer-Science-Overview-12th-Edition/dp/0133760065" target="_blank">Computer Science: An Overview</a> textbook.

####<a href="http://166.111.132.191:8080/" target="_blank">TRY IT ONLINE</a>

### Features
- 8-bit CPU
- 15 general purpose registers
- program counter register
- 1 timer count-downregister
- 256 bytes of memory
- a printer(like a output serial)
- assembler (see 'assemble' button)
- binary code/data uploader(see 'upload' button)
- several assembly code example(see 'Examples' list)
- 4KB disk (To Be Done)
- C-subset compiler (To Be Done)

### How to build
Make sure you have <a href="http://www.gruntjs.com/" target="_blank">Grunt</a> installed to compile the `asmsimulator.js` script.
Run `npm install && grunt` to build the project and `grunt http` to run.

### Background
A technical introduction is available on Marco Schweighauser's blog: [www.mschweighauser.com](https://www.mschweighauser.com/make-your-own-assembler-simulator-in-javascript-part1/).

### License
**The MIT License**

Copyright (c) 2015 Yuanchun Shi, Yu Chen, Junjie Mao, Yukang Yan

Copyright (c) 2015 Marco Schweighauser

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
