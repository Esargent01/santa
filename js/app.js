var app = angular.module('SantaList', ['ngRoute']);

app.factory('NaughtyOrNice', ['$http', function ($http){

	return{
		get: function(callback){
			$http.get('js/list.json')
			.then(function(data) {
				callback(data);
			})
			.catch(function(data) {
				console.error('There is no list here Santa...', data.status);
			});
		}
    };
}]);

app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
   
   when('/', {
      templateUrl: 'pages/list.html', controller: 'kidsCtrl'
   }).
   
   when('/wishlist', {
      templateUrl: 'pages/wishlist.html'
   }).
   
   otherwise({
      redirectTo: '/'
   });
	
}]);

app.controller('formCtrl',['$scope', 'NaughtyOrNice', function ($scope, NaughtyOrNice){

	NaughtyOrNice.get(function(data){
      $scope.kids = data.data.list;
    });

    $scope.edit = false;
    $scope.openAdd = false;

	$scope.addChild = function(kids) {
		$scope.kids.push({'name': $scope.newKid, 'wish': $scope.newWish, 'state': $scope.newState, 'coal': 0});
		$scope.newWish = '';
		$scope.newKid = '';
		$scope.newState = '';
		$scope.add = false;
	};

  	$scope.update = function () {
		$scope.edit = !$scope.edit;
		$scope.add = false;
	};

	$scope.deleteChild = function(index) {	
		$scope.kids.splice(index, 1);
	};

  	$scope.menu = function() {
		$scope.add = !$scope.add;
		$scope.edit = false;
	};
}]);

app.controller('kidsCtrl', ['$scope', 'NaughtyOrNice', function ($scope, NaughtyOrNice){
	var nice = {state: 'Nice'};
	var naughty = {state: 'Naughty'};
	$scope.stateFilter = '';
	$scope.stateSort = function() {
		if ($scope.stateFilter == '') {
			$scope.stateFilter = nice;
		} else if ($scope.stateFilter == nice){
			$scope.stateFilter = naughty;
		} else {
			$scope.stateFilter = '';
		}
	};

	$scope.addCoal = function (item){
		item.coal += 1;
	};

	$scope.removeCoal = function (item){
		if (item.coal > 0) {
			item.coal -= 1;
		};
	};
}]);

app.controller('PrintCtrl', ['$scope', 'NaughtyOrNice', function ($scope, NaughtyOrNice){
	$scope.printLog = function() {
		$scope.goodKids = [];
		$scope.badKids = [];
		angular.forEach($scope.kids, function(value, key){
			if (value.state == 'Nice') {
				$scope.goodKids.push(value);
			} else {
				$scope.badKids.push(value);
			}
		});
		console.log('Nice:' + JSON.stringify($scope.goodKids));
		console.log('Naughty:' + JSON.stringify($scope.badKids));
	};
}]);