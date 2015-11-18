#define emits(s) emit(s, strlen(s))

#define TYPE_NUM_SIZE 2
static int mem_pos = 0;

#define GEN_ADD   "LOADP RB,RE\nADDI RE,RE,R1\nADDI RA,RA,RB\n"
#define GEN_ADDSZ strlen(GEN_ADD)

#define GEN_SUB   "LOADP RB,RE\nADDI RE,RE,R1\nA:=B-A \n"
#define GEN_SUBSZ strlen(GEN_SUB)

#define GEN_SHL   "LOADP RB,RE\nADDI RE,RE,R1\nA:=B<<A\n"
#define GEN_SHLSZ strlen(GEN_SHL)

#define GEN_SHR   "LOADP RB,RE\nADDI RE,RE,R1\nROT RA,RB\n"
#define GEN_SHRSZ strlen(GEN_SHR)

#define GEN_LESS  "LOADP RB,RE\nADDI RE,RE,R1\nA:=B<A \n"
#define GEN_LESSSZ strlen(GEN_LESS)

#define GEN_EQ "LOADP RB,RE\nADDI RE,RE,R1\nXOR RA,RA,RB\nNOT RA\n"
#define GEN_EQSZ strlen(GEN_EQ)
#define GEN_NEQ  "LOADP RB,RE\nADDI RE,RE,R1\nXOR RA,RA,RB\n"
#define GEN_NEQSZ strlen(GEN_NEQ)

#define GEN_OR "LOADP RB,RE\nADDI RE,RE,R1\nOR RA,RA,RB\n"
#define GEN_ORSZ strlen(GEN_OR)
#define GEN_AND  "LOADP RB,RE\nADDI RE,RE,R1\nAND RA,RA,RB\n"
#define GEN_ANDSZ strlen(GEN_AND)

#define GEN_ASSIGN "LOADP RB,RE\nADDI RE,RE,R1\nSTOREP RA,RB\n"
#define GEN_ASSIGNSZ strlen(GEN_ASSIGN)
#define GEN_ASSIGN8 "LOADP RB,RE\nADDI RE,RE,R1\nm[B]:=A\n"
#define GEN_ASSIGN8SZ strlen(GEN_ASSIGN8)

#define GEN_JMP "JUMP R0,.....\n"
#define GEN_JMPSZ strlen(GEN_JMP)

#define GEN_JZ "JUMP RA,.....\n"
#define GEN_JZSZ strlen(GEN_JZ)

static void gen_start() {
	emits("LOADB R1,1\nLOADB R2,-1\nLOADB RE,.stack\nADDI RE,RE,R2\n");
	//emits("jmpCAFE\n");
	
	
}

static void gen_finish() {
	struct sym *funcmain = sym_find("main");
	char s[32];
	sprintf(s, "%04x", funcmain->addr);
	//memcpy(code+27, s, 4);
    emits("HALT    \n");
	emits(".stack@0xC0:");
	printf("%s", code);
	FILE* fp = fopen("after.txt", "w");
	fputs(code, fp);
	fclose(fp);	
}

static void gen_ret() {
	emits("HALT    \n");
	emits(".stack@0xC0:");
	stack_pos = stack_pos - 1;
}

static void gen_const(int n) {
	char s[32];
	sprintf(s, "LOADB RA,%02d\n",n);
	emits(s);
}

static void gen_sym(struct sym *sym) {
	if (sym->type == 'G') {
		sym->addr = mem_pos;
		mem_pos = mem_pos + TYPE_NUM_SIZE;
	}
}

static void gen_loop_start() {}

static void gen_sym_addr(struct sym *sym) {
	//gen_const(sym->addr);
}

static void gen_push() {
	emits("ADDI RE,RE,R2\nSTOREP RA,RE\n");
	stack_pos = stack_pos + 1;
}

static void gen_pop(int n) {
	char s[32];
	if (n > 0) {
		sprintf(s, "ADDI RE,RE,R1\n");
		emits(s);
		stack_pos = stack_pos - n;
	}
}

static void gen_stack_addr(int addr) {
	char s[32];
	sprintf(s, "LOADB RC, %02x\nADDI RA,RE,RC\n", addr);
	emits(s);
}

static void gen_unref(int type) {
	if (type == TYPE_INTVAR) {
		emits("LOADP RA,RA\n");
	} else if (type == TYPE_CHARVAR) {
		emits("LOADP RA,RA\n");
	}
}

static void gen_call() {
	emits("call A\n");
}

static void gen_array(char *array, int size) {
	int i = size;
	char *tok = array;
	/* put token on stack */
	for (; i >= 0; i-=2) {
		//gen_const((tok[i] << 8 | tok[i-1]));
		gen_push();
	}
	/* put token address on stack */
	gen_stack_addr(0);
}


static void gen_patch(uint8_t *op, int value) {
	char s[32];
	sprintf(s, "%04x", value);
	memcpy(op-5, s, 4);
}

static void gen_patch_str(uint8_t *op, char* address)
{
	memcpy(op-6,address,5);
}
