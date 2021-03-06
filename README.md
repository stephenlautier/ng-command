# ng-command

[1]: http://angularjs.org/
[2]: https://en.wikipedia.org/wiki/Command_pattern

[Command Pattern][2] implementation for [AngularJS][1].

	bower install ng-command
	
### [Demo](http://stephenlautier.github.io/ng-command-demo)
 
## Summary
 
`ng-command` lets you write commands which can only execute once whilst executing and also if `canExecute` is met.


## Example
```javascript
var app = angular.module('commandLab', ['ng-command'])
		.controller('CommandExampleCtrl', ['$command', '$scope', '$timeout',
			function ($command, $scope, $timeout) {
					
			var self = this;
					
			self.saveCmd = $command($scope, save, canExecute);
 
			function save (){
				return $timeout( function() {
				console.log("save", "yay!");
				}, 2000);
			}
			
			function canExecute() {
				return !self.isBusy;
			}
```

```html
<button class="btn" ng-disabled="!vm.saveCmd.canExecute" ng-click="vm.saveCmd.execute()">
```
