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

            var instr = [memory.load(self.ip), memory.load(self.ip + 1)];
            var opcode = instr[0] >> 4;
            var regDest = instr[0] & 0x0F, regSource1 = instr[1] >> 4, regSource2 = instr[1] & 0x0F;
            var mem = instr[1], num = instr[1];
            self.ip = self.ip + 2;
            switch(opcode) {
            case opcodes.NONE:
                self.ip = self.ip - 2;
                return false; // Abort step
            case opcodes.LOAD_FROM_MEMORY:
                self.gpr[regDest] = memory.load(mem);
                break;
            case opcodes.LOAD_WITH_CONSTANT:
                self.gpr[regDest] = num;
                break;
            case opcodes.STORE_TO_MEMORY:
                memory.store(mem, self.gpr[regDest]);
                break;
            case opcodes.MOVE:
                self.gpr[regSource2] = self.gpr[regSource1];
                break;
            case opcodes.ADD_INT:
                self.gpr[regDest] = (self.gpr[regSource1] + self.gpr[regSource2]) & 0xFF;
                break;
            case opcodes.ADD_FLOAT:
                // TODO
                break;
            case opcodes.OR:
                self.gpr[regDest] = self.gpr[regSource1] | self.gpr[regSource2];
                break;
            case opcodes.AND:
                self.gpr[regDest] = self.gpr[regSource1] & self.gpr[regSource2];
                break;
            case opcodes.XOR:
                self.gpr[regDest] = self.gpr[regSource1] ^ self.gpr[regSource2];
                break;
            case opcodes.ROTATE:
                var delta = num % 8, val = self.gpr[regDest];
                self.gpr[regDest] = (val >> delta) + ((val & ((1 << delta) - 1)) << (8 - delta));
                break;
            case opcodes.JUMP_IF_EQUAL:
                if (self.gpr[regDest] == self.gpr[0]) {
                    self.ip = mem;
                }
                break;
            case opcodes.HALT:
                self.ip = self.ip - 2;
                return false;
            case opcodes.LOAD_FROM_POINTER:
                self.gpr[regDest] = memory.load(self.gpr[regSource2]);
                break;
            case opcodes.STORE_TO_POINTER:
                memory.store(self.gpr[regSource2], self.gpr[regDest]);
                break;
            case opcodes.JUMP_IF_LESS:
                if (byteToNumber(self.gpr[regDest]) < byteToNumber(self.gpr[0])) {  // TODO
                    self.ip = mem;
                }
                break;
            }

            return true;
        },
        reset: function() {
            var self = this;

            self.gpr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            self.ip = 0;
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
