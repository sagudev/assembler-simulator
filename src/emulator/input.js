app.service('input', ['memory', function (memory) {
    var input = {
        address: 256,
        state: false,
        key: 20,
        onkeyup: function(e) {
            var self = this;

            var eventKey = e.keyCode ? e.keyCode : e.which;

            if (eventKey === self.key) {
                var value = memory.load(self.address);
                if(value == 255) {
                    self.state = false;
                }
                else {
                    self.state = true;
                }
                memory.store(self.address, self.state ? 255 : 0);
            }
        },
        onkeydown: function(e) {
            var self = this;
            var eventKey = e.keyCode ? e.keyCode : e.which;
            
        }
    };
    document.onkeydown = function (e){ input.onkeydown(e);};
    document.onkeyup = function (e){ input.onkeyup(e);};
    memory.store(input.address, 0);
    return input;
}]);
