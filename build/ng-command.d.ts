declare module ngCommand {
    var ModuleName: string;
}

declare module ngCommand {
    /**
     * Command proxy object.
     */
    interface ICommand {
        /**
         * Determines whether the command is currently executing.
         */
        isExecuting: boolean;
        /**
         * Determines whether the command can execute or not.
         */
        canExecute: boolean;
        /**
         * Executes the command function.
         */
        execute: () => angular.IPromise<any>;
    }
    class Command implements ICommand {
        static id: string;
        private canExecuteFn;
        private executeFn;
        isExecuting: boolean;
        canExecute: boolean;
        constructor($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean);
        execute(): angular.IPromise<any>;
    }
    /**
     * Command factory which creates instances of @see ICommand.
     */
    interface ICommandFactory {
        /**
         * Factory instance creator method.
         * @param $scope Scope which will keep track of the command.
         * @param execute The execute function when the command is executed.
         * @param canExecute Additional function which determines whether the command can executes.
         */
        ($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand;
    }
}
