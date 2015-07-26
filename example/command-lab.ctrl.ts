module App {
	'use strict';

	//TODO: implement commandDirective? 

	export class CommandLabController {
		static id = "commandLabController";

		private _logger: ILog;
			
			
		/*@ngInject*/
		constructor(
			private $scope: angular.IScope,
			private loggerFactory: ILoggerFactory,
			private $timeout: angular.ITimeoutService,
			private commandFactory: ng.command.ICommandFactory
			) {

			this._logger = loggerFactory(CommandLabController.id);
			this._logger.info("ctor", "init");
			
			// destroy
			this.destroyCmd = commandFactory($scope, () => this.save(), () => !this.isBusy);
			this.destroyCmd2 = commandFactory($scope, () => this.save(), () => !this.isBusy);

			// command specific
			this.execute = this.save;
			this.canExecute = () => {
				return !this.isBusy;
			}

			// command
			$scope.$watch(() => {
				return {
					isExecuting: this.isExecuting,
					canExecute: this.canExecute && this.canExecute()
				};
			}, (newValue, oldValue) => {
				this._logger.info("$watch.enabled", "Handle change!", newValue);
				this.isEnabled = !newValue.isExecuting && !!newValue.canExecute;
			}, true);
		}

		title = "Command Lab";
		alias: string;

		isBusy = false;
		
		// command
		isExecuting: boolean = false;
		canExecute: () => boolean;
		execute: () => angular.IPromise<any>;
		isEnabled = true;

		destroyCmd: ng.command.ICommand;
		destroyCmd2: ng.command.ICommand;


		private handleExecute() {

			if (this.isExecuting) {
				this._logger.info("handleExecute", "Still executing! exit.");
				return;
			}

			if (this.canExecute && !this.canExecute()) {
				this._logger.info("handleExecute", "Can execute states nope!");
				return;
			}
			this.isExecuting = true;
			return this.execute()
				.finally(() => {
					this.isExecuting = false;
				});
		}

		saveCmd() {
			this.handleExecute();
		}


		save() {
			this._logger.info("save", "init!");
			return this.$timeout(() => {
				this._logger.info("save", "yay!", { alias: this.alias });
			}, 2000);

		}



	}

	angular.module("command-lab")
		.controller(CommandLabController.id, CommandLabController);

}