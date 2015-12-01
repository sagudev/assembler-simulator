app.controller('Ctrl', ['$document', '$scope', '$timeout', '$http', 'cpu', 'memory', 'printer', 'assembler', 'uploader', function ($document, $scope, $timeout, $http, cpu, memory, printer, assembler, uploader) {
    $scope.printer = printer;
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
                     {speed: 16, desc: "16 HZ"}];
    $scope.speed = 4;
    $scope.example = '';
    $scope.examples = [];

    $scope.code = ";; Choose an example above or write your own code here :)";
    $scope.reset = function () {
        cpu.reset();
        memory.reset();
        printer.reset();
        $scope.error = '';
        $scope.selectedLine = -1;
        $scope.mapping = undefined;
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
                $scope.selectedLine = $scope.mapping[cpu.ip];
            }

            return res;
        } catch (e) {
            $scope.error = e;
            return false;
        }
    };

    var runner;
    $scope.run = function () {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        $scope.isRunning = true;
        runner = $timeout(function () {
            if ($scope.executeStep() === true) {
                $scope.run();
            } else {
                $scope.isRunning = false;
            }
        }, 1000 / $scope.speed);
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

    $scope.assemble = function () {
        try {
            $scope.reset();

            var assembly = assembler.go($scope.code);
            $scope.mapping = assembly.mapping;
            var binary = assembly.code;
            var disk = assembly.disk;
            $scope.labels = assembly.labels;

            if (binary.length > memory.data.length)
                throw {error: "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed"};

            if (disk.length > memory.diskdata.length)
                throw {error: "Disk data does not fit into the disk. Max " + memory.diskdata.length + " bytes are allowed"};

            for (var i = 0, l = binary.length; i < l; i++) {
                memory.data[i] = binary[i];
            }

            for (i = 0, l = disk.length; i < l; i++) {
                memory.diskdata[i] = disk[i];
            }

            if ($scope.labels['.entry'] !== undefined) {
                cpu.ip = $scope.labels['.entry'];
            }
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = e.line + " | " + e.error;
                $scope.selectedLine = e.line;
            } else {
                $scope.error = e.error;
            }
        }
    };

    $scope.upload = function () {
        try {
            $scope.reset();

            var binarycode = uploader.go($scope.code);
            $scope.mapping = binarycode.mapping;
            var binary = binarycode.code;
            $scope.labels = binarycode.labels;

            if (binary.length > memory.data.length)
                throw "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed";

            for (var i = 0, l = binary.length; i < l; i++) {
                memory.data[i] = binary[i];
            }
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = e.line + " | " + e.error;
                $scope.selectedLine = e.line;
            } else {
                $scope.error = e.error;
            }
        }
    };

    $scope.compile = function () {
        $http.post('/', {"source": $scope.code}).success(function(response){
        $scope.code = response; $scope.assemble();});
    };

    $scope.initExamples = function() {
        var response = $http.get('examples/scandir.php');
        response.success(function(data, status, headers, config) {
            var filelist = String(data).split(',');
            for (var i = 0, l = filelist.length; i < l; i++) {
                var contents = filelist[i].split('|');
                var filename = contents[0], desc = contents[1];
                $scope.examples.push({id: filename, desc: desc});
            }
        });
        response.error(function(data, status, headers, config) {
            console.error("ajax failed");
        });
    };

    $scope.showExample = function(key) {
        var response = $http.get('examples/' + $scope.example);

        response.success(function(data, status, headers, config) {
            $scope.code = data;
        });
        response.error(function(data, status, headers, config) {
            console.error("ajax failed");
        });
    };

    $scope.jumpToLine = function (index) {
        $document[0].getElementById('sourceCode').scrollIntoView();
        $scope.selectedLine = $scope.mapping[index];
    };


    $scope.isInstruction = function (index) {
        return $scope.mapping !== undefined &&
            $scope.mapping[index] !== undefined &&
            $scope.displayInstr;
    };

    $scope.getMemoryCellCss = function (index) {
        if ($scope.isInstruction(index)) {
            return 'instr-bg';
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

/*
 * Local variables:
 * c-basic-offset: 4
 * tab-width: 4
 * indent-tabs-mode: nil
 * End:
 */
