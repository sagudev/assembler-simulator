function log(msg) {
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}

app.service('cpu', ['opcodes', 'memory', function(opcodes, memory) {
    var cpu = {
        step: function() {
            var self = this;

            var byteToNumber = function(val) {
                if (val < 128) {
                    return val;
                } else {
                    return val - 255;
                }
            };

            var readReg = function(id) {
                return self.gpr[id];
            };

            var writeReg = function(id, val) {
                self.gpr[id] = val;
                if (id == 15) {
                    self.updateTimer = true;
                    if (val > 0) {
                        self.countdown = val;
                    } else {
                        self.countdown = 0;
                    }
                }
            };

            var findHighestBit = function(bits, max) {
                var i;
                for (i = max; i >= 0; i--) {
                    if ((bits >> i) !== 0)
                        break;
                }
                return i;
            };

            var floatingAdd = function(a, b) {
                var a_sign = (a & 0x80) >> 7, a_expo = ((a & 0x70) >> 4), a_mant = a & 0x0F;
                var b_sign = (b & 0x80) >> 7, b_expo = ((b & 0x70) >> 4), b_mant = b & 0x0F;
                var a_fix = (a_mant << a_expo), b_fix = (b_mant << b_expo);
                var result_sign, result_fix;
                if (a_sign == b_sign) {
                    result_sign = a_sign;
                    result_fix = a_fix + b_fix;
                } else {
                    if (a_fix > b_fix) {
                        result_sign = a_sign;
                        result_fix = a_fix - b_fix;
                    } else if (a_fix < b_fix) {
                        result_sign = b_sign;
                        result_fix = b_fix - a_fix;
                    } else {
                        result_fix = 0;
                        result_sign = 0;
                    }
                }
                var result_expo = findHighestBit(result_fix, 16) - 3;
                if (result_expo > 7) {
                    result_expo = 7;
                } else if (result_expo < 0) {
                    result_expo = 0;
                }
                var result_mant = (result_fix >> result_expo) & 0xF;
                var result = (result_sign << 7) | (result_expo << 4) | result_mant;
                return result;
            };

            var updateIR = function(instr) {
                self.ir = '';
                if (instr[0] <= 15)
                    self.ir += '0' + instr[0].toString(16);
                else
                    self.ir += instr[0].toString(16);
                if (instr[1] <= 15)
                    self.ir += '0' + instr[1].toString(16);
                else
                    self.ir += instr[1].toString(16);
            };

            self.updateTimer = false;
            self.status = '';

            var instr = [memory.load(self.ip), memory.load(self.ip + 1)];
            var opcode = instr[0] >> 4;
            var regDest = instr[0] & 0x0F, regSource1 = instr[1] >> 4, regSource2 = instr[1] & 0x0F;
            var mem = instr[1], num = instr[1];
            updateIR(instr);
            self.ip = (self.ip + 2) & 0xFF;
            switch(opcode) {
            case opcodes.LOAD_FROM_MEMORY:
                writeReg(regDest, memory.load(mem));
                break;
            case opcodes.LOAD_WITH_CONSTANT:
                writeReg(regDest, num);
                break;
            case opcodes.STORE_TO_MEMORY:
                memory.store(mem, readReg(regDest));
                break;
            case opcodes.MOVE:
                writeReg(regSource2, readReg(regSource1));
                break;
            case opcodes.ADD_INT:
                writeReg(regDest, (readReg(regSource1) + readReg(regSource2)) & 0xFF);
                break;
            case opcodes.ADD_FLOAT:
                writeReg(regDest, floatingAdd(readReg(regSource1), readReg(regSource2)));
                break;
            case opcodes.OR:
                writeReg(regDest, readReg(regSource1) | readReg(regSource2));
                break;
            case opcodes.AND:
                writeReg(regDest, readReg(regSource1) & readReg(regSource2));
                break;
            case opcodes.XOR:
                writeReg(regDest, readReg(regSource1) ^ readReg(regSource2));
                break;
            case opcodes.ROTATE:
                var delta = num % 8, val = readReg(regDest);
                writeReg(regDest, (val >> delta) + ((val & ((1 << delta) - 1)) << (8 - delta)));
                break;
            case opcodes.JUMP_IF_EQUAL:
                if (readReg(regDest) == readReg(0)) {
                    self.ip = mem;
                }
                break;
            case opcodes.HALT:
                self.ip = (self.ip - 2) & 0xFF;
                return false;
            case opcodes.LOAD_FROM_POINTER:
                writeReg(regDest, memory.load(readReg(regSource2)));
                break;
            case opcodes.STORE_TO_POINTER:
                memory.store(readReg(regSource2), readReg(regDest));
                break;
            case opcodes.JUMP_IF_LESS:
                if (byteToNumber(readReg(regDest)) < byteToNumber(readReg(0))) {
                    self.ip = mem;
                }
                break;
            }

            if (self.countdown > 0 && !self.updateTimer) {
                self.countdown -= 1;
                if (self.countdown === 0) {
                    memory.store(0xFD, self.ip);
                    self.ip = 0x80;
                    self.countdown = readReg(15);
                    self.status = '(Interrupted!)';
                }
            }

            return true;
        },
        reset: function() {
            var self = this;

            self.gpr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            self.ip = 0;
            self.ir = '0000';
            self.status = '';

            self.countdown = 0;
            self.updateTimer = false;
        }
    };

    cpu.reset();
    return cpu;
}]);

/*
 * Local variables:
 * c-basic-offset: 4
 * tab-width: 4
 * indent-tabs-mode: nil
 * End:
 */
