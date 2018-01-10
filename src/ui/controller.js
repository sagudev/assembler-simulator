/*jshint multistr: true */
var startCode = "; Simple example\n\
; Writes Hello World to the output\n\
\n\
JMP start\n\
hello: DB \"Hello World!\"; Variable\n\
       DB 0				; String terminator\n\
       \n\
start:\n\
	MOV C, hello        ; Point to var\n\
	MOV D, 232			; Point to output\n\
	CALL print\n\
    HLT                 ; Stop execution\n\
    \n\
print:					; print(C:*from, D:*to)\n\
	PUSH A\n\
	PUSH B\n\
	MOV B, 0\n\
.loop:\n\
	MOV A, [C]			; Get char from var\n\
	MOV [D], A			; Write to output\n\
	INC C\n\
	INC D\n\
	CMP B, [C]			; Check if end\n\
	JNZ .loop			; jump if not\n\
    \n\
	POP B\n\
	POP A\n\
	RET";


app.controller('Ctrl', ['$document', '$scope', '$timeout', 'cpu', 'memory', 'assembler','input', function ($document, $scope, $timeout, cpu, memory, assembler, input) {
    $scope.memory = memory;
    $scope.cpu = cpu;
    $scope.error = '';
    $scope.isRunning = false;
    $scope.displayHex = true;
    $scope.displayInstr = true;
    $scope.displayA = false;
    $scope.displayB = false;
    $scope.displayC = false;
    $scope.displayD = false;
    $scope.speeds = [{speed: 1, desc: "1 HZ"},
                     {speed: 4, desc: "4 HZ"},
                     {speed: 8, desc: "8 HZ"},
                     {speed: 16, desc: "16 HZ"},
                     {speed: 32, desc: "32 HZ"},
                     {speed: 64, desc: "64 HZ"},
                     {speed: 1000, desc: "1 MHZ"},
                     {speed: 1000000, desc: "1 GHZ"},
                     {speed: 10000000, desc: "10 GHZ"}];
    $scope.speed = 8;
    $scope.outputStartIndex = 232;
    $scope.outputStopIndex = 255;

    $scope.code = startCode;
    var textarea = document.getElementById("sourceCode");
    var codeMirror = CodeMirror(function(elt) {
        textarea.parentNode.replaceChild(elt, textarea);
      },{
        lineNumbers: true,
        value: $scope.code,
        mode: "asm"
      });
    codeMirror.doc.setValue($scope.code);
    $scope.reset = function () {
        cpu.reset();
        memory.reset();
        $scope.error = '';
        $scope.selectLine(0);
    };

    $scope.selectLine = function(line) {
        $scope.selectedLine = line;
        codeMirror.doc.setSelection({line:line, ch:0},{line:line+1, ch:0});
    };

    $scope.executeStep = function () {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        try {
            // Execute
            var res = cpu.step();

            // Mark in code
            if (cpu.ip in $scope.mapping) {
                var line = $scope.mapping[cpu.ip];
                $scope.selectLine(line);
            }

            return res;
        } catch (e) {
            $scope.error = ""+e;
            return false;
        }
        return false;
    };

    var runner;
    $scope.run = function () {
        var ready = true;
        if (!$scope.checkPrgrmLoaded()) {
            ready = $scope.assemble();
        }
        if(ready) {
            $scope.isRunning = true;
            runner = $timeout(function () {
                if ($scope.executeStep() === true) {
                    $scope.run();
                } else {
                    $scope.isRunning = false;
                }
            }, 1000 / $scope.speed);
        }
    };

    $scope.stop = function () {
        $timeout.cancel(runner);
        $scope.isRunning = false;
    };

    $scope.checkPrgrmLoaded = function () {
        for (var i = 0, l = memory.data.length; i < l; i++) {
            if (memory.data[i] !== 0) {
                return true;
            }
        }

        return false;
    };

    $scope.getChar = function (value) {
        var text = String.fromCharCode(value);

        if (text.trim() === '') {
            return '\u00A0\u00A0';
        } else {
            return text;
        }
    };

    $scope.getCode = function () { return codeMirror.doc.getValue(); };

    $scope.assemble = function () {
        $scope.reset();
            var code = $scope.getCode();
        try {
            var assembly = assembler.go(code);
            $scope.mapping = assembly.mapping;
            var binary = assembly.code;
            $scope.labels = assembly.labels;

            if (binary.length > memory.data.length)
                throw "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed";

            for (var i = 0, l = binary.length; i < l; i++) {
                memory.data[i] = binary[i];
            }
            return true;
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = (1+e.line) + " | " + e.error;
                $scope.selectLine(e.line);
            } else {
                $scope.error = "Unkown error:"+e.error;
            }
            return false;
        }
    };

    $scope.jumpToLine = function (index) {
        $document[0].getElementById('sourceCode').scrollIntoView();
        $scope.selectLine($scope.mapping[index]);
    };


    $scope.isInstruction = function (index) {
        return $scope.mapping !== undefined &&
            $scope.mapping[index] !== undefined &&
            $scope.displayInstr;
    };

    $scope.getMemoryCellCss = function (index) {
        if (index >= $scope.outputStartIndex && index <= $scope.outputStopIndex) {
            return 'output-bg';
        } else if (index > $scope.outputStopIndex) {
            return 'input-bg';
        } else if ($scope.isInstruction(index)) {
            return 'instr-bg';
        } else if (index > cpu.sp && index <= cpu.maxSP) {
            return 'stack-bg';
        } else {
            return '';
        }
    };

    $scope.getMemoryInnerCellCss = function (index) {
        if (index === cpu.ip) {
            return 'marker marker-ip';
        } else if (index === cpu.sp) {
            return 'marker marker-sp';
        } else if (index === cpu.gpr[0] && $scope.displayA) {
            return 'marker marker-a';
        } else if (index === cpu.gpr[1] && $scope.displayB) {
            return 'marker marker-b';
        } else if (index === cpu.gpr[2] && $scope.displayC) {
            return 'marker marker-c';
        } else if (index === cpu.gpr[3] && $scope.displayD) {
            return 'marker marker-d';
        } else {
            return '';
        }
    };
}]);
