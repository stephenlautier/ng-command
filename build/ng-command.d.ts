declare module ngCommand {
    var ModuleName: string;
}

declare module ngCommand {
    interface ICommand {
        isExecuting: boolean;
        canExecute: boolean;
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
    interface ICommandFactory {
        ($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand;
    }
}
