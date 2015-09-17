app.service('printer', [function () {
    var printer = {
        data: '',
        load: function() {
            return 0;
        },
        store: function(value) {
            var self = this;
            if (value < 16)
                self.data += '0' + value.toString(16) + " ";
            else
                self.data += value.toString(16) + " ";
        },
        reset: function () {
            var self = this;
            self.data = '';
        }
    };

    printer.reset();
    return printer;
}]);

/*
 * Local variables:
 * c-basic-offset: 4
 * tab-width: 4
 * indent-tabs-mode: nil
 * End:
 */
