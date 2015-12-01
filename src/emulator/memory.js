app.service('memory', ['printer', function (printer) {
    var memory = {
        data: Array(256),
        lastAccess: -1,
        diskdata: Array(256),
        statusnow: 0,
        sector_address: 0,
        memory_address: 0,
        disk_operation: 0,
        disk_latency: 0,
        sectorlength: 16,

        load: function (address) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;

            if (address == 0xFE) {
                return printer.load();
            } else if (address == 0xFF) {
                if (self.disk_latency > 0) {
                    self.disk_latency = self.disk_latency - 1;
                    return 0;
                }
                if (self.disk_operation === 0x00) {
                    for(var i = 0; i < self.sectorlength; i++)
                        self.data[self.memory_address + i] = self.diskdata[self.sector_address * self.sectorlength + i];
                } else if (self.disk_operation === 0x01) {
                    for(var j = 0; j < self.sectorlength; j++)
                        self.diskdata[self.sector_address * self.sectorlength + j] = self.data[self.memory_address + j];
                }
                self.statusnow = 0;
                self.sector_address = 0;
                self.memory_address = 0;
                return 0xFF;
            }
            return self.data[address];
        },
        store: function (address, value) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;

            if (address == 0xFE) {
                return printer.store(value);
            }
            if (address == 0xFF)
            {
                if (self.statusnow === 0)
                {
                    self.statusnow = 1;
                    self.sector_address = value;
                } else if (self.statusnow === 1) {
                    self.statusnow = 2;
                    self.memory_address = value;
                } else if(self.statusnow === 2) {
                    self.disk_operation = value;
                    self.disk_latency = 3;
                }
                return;
            }
            self.data[address] = value;
        },
        reset: function () {
            var self = this;

            self.lastAccess = -1;
            self.statusnow = 0;
            self.sector_address = 0;
            self.memory_address = 0;
            self.disk_operation = 0;
            self.disk_latency = 0;
            for (var i = 0, l = self.data.length; i < l; i++) {
                self.data[i] = 0;
            }
            for(i = 0;i < self.diskdata.length;i++)
            {
                self.diskdata[i] = 0;
            }
        }
    };

    memory.reset();
    return memory;
}]);

/*
 * Local variables:
 * c-basic-offset: 4
 * tab-width: 4
 * indent-tabs-mode: nil
 * End:
 */
