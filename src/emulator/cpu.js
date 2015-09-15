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

            self.updateTimer = false;
            self.status = '';

            var instr = [memory.load(self.ip), memory.load(self.ip + 1)];
            var opcode = instr[0] >> 4;
            var regDest = instr[0] & 0x0F, regSource1 = instr[1] >> 4, regSource2 = instr[1] & 0x0F;
            var mem = instr[1], num = instr[1];
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
                // TODO
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
                    memory.store(0xFE, self.ip);
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
