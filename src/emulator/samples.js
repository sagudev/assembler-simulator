/*jshint multistr: true */
var printDecimal = "; Writes the input to output in decimal representation\n\
JMP start\n\
.zero: DB \"0\"\n\
start:\n\
	MOV C, 198\n\
    MOV D, 232\n\
hundred:\n\
    MOV A, C\n\
    DIV 100\n\
    JZ ten\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    INC D\n\
    MUL 100\n\
    SUB C, A\n\
ten:\n\
    MOV A, C\n\
    DIV 10\n\
    JZ one\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    INC D\n\
    MUL 10\n\
    SUB C, A\n\
one:\n\
    MOV A, C\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    HLT";

var helloWorld = "; Simple example\n\
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

var printKey = "; Simple example\n\
; writes 1 or 0 based on key input\n\
JMP .start\n\
one:	DB \"1\"\n\
	DB 0\n\
zero:	DB \"0\"\n\
	DB 0\n\
.start:\n\
	MOV A, [256]\n\
	CMP A, 255d\n\
	JZ .printone\n\
.printzero:\n\
	MOV D, 232\n\
	MOV C, zero\n\
	MOV B, [C]\n\
	MOV [D], B\n\
	JMP .start\n\
.printone:\n\
	MOV D, 232\n\
	MOV C, one\n\
	MOV B, [C]\n\
	MOV [D], B\n\
    JMP .start";
    
var toDecimalValue = "; Simple example\n\
; takes binary string and adds up to decimal value\n\
JMP start\n\
.one: DB \"1\"			; 1\n\
.justbeforeinput: DB 0	; shortcut to get address before input\n\
.input: DB \"00001111\"	; input binary string (8 bits)\n\
; A: number value for index\n\
; B: string index address\n\
; C: string value at index\n\
; D: result by || bitwise\n\
start:\n\
	MOV D, 0            ; init result at 0\n\
	MOV B, .input		; move address of input string to B\n\
    ADD B, 7			; add 7 to address to reach last char\n\
    MOV A, 1			; start with value 1 (most right bit)\n\
.loop:\n\
	PUSH A\n\
	MOV C, [B]			; move current char value into C\n\
    PUSH C\n\
    MOV C, .one			; move value of \"1\" into A\n\
    MOV A, [C]\n\
    POP C\n\
    CMP C, A\n\
    POP A\n\
    JNZ .continueLoop\n\
.bitOn:\n\
	OR D, A				; add current number value to result\n\
.continueLoop:\n\
	DEC B				; go to next bit\n\
    MUL 2				; set number value at next bit\n\
    CMP B, .justbeforeinput		; are we at end?\n\
    JNZ .loop			; continue with next bit\n\
    JMP .writeOuput\n\
    .zero: DB \"0\"\n\
.writeOuput:\n\
    MOV C, D\n\
    MOV D, 232\n\
hundred:\n\
    MOV A, C\n\
    DIV 100\n\
    JZ ten\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    INC D\n\
    MUL 100\n\
    SUB C, A\n\
ten:\n\
    MOV A, C\n\
    DIV 10\n\
    JZ one\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    INC D\n\
    MUL 10\n\
    SUB C, A\n\
one:\n\
    MOV A, C\n\
    MOV B, .zero\n\
    MOV B, [B]\n\
    ADD B, A\n\
    MOV [D], B\n\
    HLT";

app.service('samples', [function () {
    var samples = [
        {name: "Print decimal", code: printDecimal},
        {name: "Hello world!", code: helloWorld},
        {name: "Use key input", code: printKey},
        {name: "To decimal", code: toDecimalValue}
    ];
    return samples;
}]);
