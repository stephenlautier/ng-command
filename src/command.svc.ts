namespace ng.command {

	export interface ICommand {

		isExecuting: boolean;
		canExecute: boolean;
		execute: () => angular.IPromise<any>;
	}

	export class Command implements ICommand {
		static id = "_commandInstance"

		private canExecuteFn: () => boolean;
		private executeFn: () => angular.IPromise<any>;

		isExecuting: boolean;
		canExecute: boolean;

		constructor(
			$scope: angular.IScope,
			execute: () => angular.IPromise<any>,
			canExecute?: () => boolean
			) {

			this.executeFn = execute;
			this.canExecuteFn = canExecute;
			this.isExecuting = false;

			$scope.$watch(() => {
				return {
					isExecuting: this.isExecuting,
					canExecute: this.canExecuteFn && this.canExecuteFn()
				};
			}, (newValue, oldValue) => {
				//this.logger.info("$watch.canExecute", "Handle change!", newValue);
				this.canExecute = !newValue.isExecuting && !!newValue.canExecute;
			}, true);
		}

		execute(): angular.IPromise<any> {

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
				.finally(() => {
					this.isExecuting = false;
				});
		}

	}

	export interface ICommandFactory {
		($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand;
	}

	angular.module(ng.command.ModuleName)
		.factory("ngCommand", () => {

			return ($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand => {
				return new Command($scope, execute, canExecute);
			};

		});

}