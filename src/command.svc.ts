namespace ngCommand {

	/**
	 * Command proxy object.
	 */
	export interface ICommand {
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
				//console.info(`[cmd] $watch.canExecute - handle change!`,{ newValue: newValue, oldValue: oldValue});
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

	/**
	 * Command factory which creates instances of @see ICommand.
	 */
	export interface ICommandService {
		/**
		 * Factory instance creator method.
		 * @param $scope Scope which will keep track of the command.
		 * @param execute The execute function when the command is executed.
		 * @param canExecute Additional function which determines whether the command can executes.
		 */
		($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand;
	}

	angular.module(ngCommand.ModuleName)
		.factory("$command", () => {

			return ($scope: angular.IScope, execute: () => angular.IPromise<any>, canExecute?: () => boolean): ICommand => {
				return new Command($scope, execute, canExecute);
			};

		});

}