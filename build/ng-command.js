var ngCommand;
(function (ngCommand) {
    ngCommand.ModuleName = "ng-command";
    var app = angular.module(ngCommand.ModuleName, []);
})(ngCommand || (ngCommand = {}));

var ngCommand;
(function (ngCommand) {
    var Command = (function () {
        function Command($scope, execute, canExecute) {
            var _this = this;
            this.executeFn = execute;
            this.canExecuteFn = canExecute;
            this.isExecuting = false;
            $scope.$watch(function () {
                return {
                    isExecuting: _this.isExecuting,
                    canExecute: _this.canExecuteFn && _this.canExecuteFn()
                };
            }, function (newValue, oldValue) {
                //this.logger.info("$watch.canExecute", "Handle change!", newValue);
                //console.info(`[cmd] $watch.canExecute - handle change!`,{ newValue: newValue, oldValue: oldValue});
                _this.canExecute = !newValue.isExecuting && !!newValue.canExecute;
            }, true);
        }
        Command.prototype.execute = function () {
            var _this = this;
            if (this.isExecuting) {
                //this.logger.info("handleExecute", "Still executing! exit.");
                return;
            }
            if (this.canExecute && !this.canExecuteFn()) {
                //this.logger.info("handleExecute", "Can execute states nope!");
                return;
            }
            this.isExecuting = true;
            return this.executeFn()
                .finally(function () {
                _this.isExecuting = false;
            });
        };
        Command.id = "_commandInstance";
        return Command;
    })();
    ngCommand.Command = Command;
    angular.module(ngCommand.ModuleName)
        .factory("ngCommand", function () {
        return function ($scope, execute, canExecute) {
            return new Command($scope, execute, canExecute);
        };
    });
})(ngCommand || (ngCommand = {}));

//# sourceMappingURL=ng-command.js.map