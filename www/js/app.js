// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('shopAdvisor', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})
.factory('Categories', function() {
	return {
		all: function() {
			var categoryString = window.localStorage['categories'];
			if(!categoryString) {
				return angular.fromJson(categoryString);
			}
      
			return [];
		},
		save: function(categories) {
			window.localStorage['categories'] = angular.toJson(categories);
		},
		getLastActiveIndex: function() {
			return parseInt(window.localStorage['lastActiveCategory']) || 0;
		},
		setLastActiveIndex: function(index) {
			window.localStorage['lastActiveCategory'] = index;
		}
	}
})
.filter('inSlicesOf', 
	['$rootScope',  
	function($rootScope) {
		makeSlices = function(items, count) { 
			if (!count)            
				count = 3;
			
			if (!angular.isArray(items) && !angular.isString(items)) return items;
			
			var array = [];
			for (var i = 0; i < items.length; i++) {
				var chunkIndex = parseInt(i / count, 10);
				var isFirst = (i % count === 0);
				if (isFirst)
					array[chunkIndex] = [];
				array[chunkIndex].push(items[i]);
			}

			if (angular.equals($rootScope.arrayinSliceOf, array))
				return $rootScope.arrayinSliceOf;
			else
				$rootScope.arrayinSliceOf = array;
				
			return array;
		};
		
		return makeSlices; 
	}]
)
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
      cache: false,
			url: '/',
			controller: 'shopCtrl',
			templateUrl: 'home.html'
		})
		.state('item', {
			url: '/item/:id',
			controller: 'itemCtrl',
			templateUrl: 'item.html'
		});

	$urlRouterProvider.otherwise('/');
})
.controller('shopCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, Categories, $ionicModal, $state, $stateParams, $window){
	$rootScope.categories = createSampleCategories();
	Categories.save($scope.categories);
	// Load or initialize projects
	//$scope.projects = Projects.all();
	// Grab the last active, or the first project
	$scope.activeCategory = $scope.categories[Categories.getLastActiveIndex()];

	$rootScope.products = [];
	$scope.products = $scope.activeCategory.products;
	$scope.sortOptions = [
		{id:"0",name:"Most popular"},
		{id:"1",name:"From A to Z"},
		{id:"2",name:"From Z to A"},
		{id:"3",name:"From high to low"},
		{id:"4",name:"From low to high"}
	];

	/* MODAL START*/
	//sort modal
	$ionicModal.fromTemplateUrl('sort-modal.html', {
		id: '1',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.oModal1 = modal;
	});
	//filter-modal
	$ionicModal.fromTemplateUrl('filter-modal.html', {
		id: '2',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.oModal2 = modal;
	});
 
	$scope.openModal = function(index) {
			if (index == 1) $scope.oModal1.show();
			else $scope.oModal2.show();
		};

	$scope.closeModal = function(index) {
		if (index == 1) $scope.oModal1.hide();
		else $scope.oModal2.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
		// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
		// Execute action
	});

	/* MODAL END*/


	/* FUNCTIONS DECLARE*/
	$scope.toggleProjects = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	// Called to select the given category
	$scope.selectCategory = function(category, index) {
    var isSelectNew;
    if(category.name != $scope.activeCategory.name){
      isSelectNew = true;
    }
    
		$scope.activeCategory = category;
		Categories.setLastActiveIndex(index);
    
		$ionicSideMenuDelegate.toggleLeft(false);
    
    if(isSelectNew){
      //$state.go($state.current, {}, {reload: true});
      $window.location.reload(true);
      //$state.go('home', {}, {reload: true});
    }
    

	};
	$scope.selectSortOption = function(){
		$scope.closeModal(1);
	}
	function Product(id, name, brand, price, image, description, size){
		this.id = id;
		this.name = name;
		this.brand = brand;
		this.price = price;
		this.image = image;
		this.description = description;
		this.size = size;
	}
	function createShirtProducts(){
		var products = [];
		var product;

		product = new Product(1, "Blue Shirt", "Viettien", 200, "img/shirt_blue.jpg", "High quality shirt!", "XL");
		products.push(product);
		product = new Product(2, "Dark Blue Shirt", "Viettien", 100, "img/shirt_blue_2.png", "Beautiful shirt!", "XL");
		products.push(product);
		product = new Product(3, "Black Shirt", "N.L", 110, "img/shirt_black.jpg", "Beautiful shirt!", "XL");
		products.push(product);
		product = new Product(4, "White Shirt", "N.L", 140, "img/shirt_white.jpg", "High quality shirt!", "XL");
		products.push(product);
		product = new Product(5, "Gray Shirt", "N.L", 150, "img/shirt_gray.jpg", "Beautiful shirt!", "XL");
		products.push(product);
		product = new Product(6, "Red Shirt", "Viettien", 210, "img/shirt_red.jpg", "High quality shirt!", "XL");
		products.push(product);
		return products;
	}
  function createPantProducts(){
    var products = [];
    var product;

    product = new Product(1, "Brown Pant", "Viettien", 200, "img/pant1.jpg", "High quality pant!", "XL");
    products.push(product);
    product = new Product(2, "Black Pant", "N.L", 219, "img/pant2.jpg", "Beautiful pant!", "XL");
    products.push(product);
    product = new Product(3, "Light Brown Pant", "Viettien", 229, "img/pant3.jpg", "Beautiful pant!", "XL");
    products.push(product);
    product = new Product(4, "Gray Pant", "Viettien", 399, "img/pant4.jpg", "High quality pant!", "XL");
    products.push(product);
    product = new Product(5, "Dark Brown Pant", "N.L", 150, "img/pant5.png", "High quality pant!", "XL");
    products.push(product);
    product = new Product(6, "Yellow Pant", "N.L", 50, "img/pant6.jpg", "Beautiful", "XL");
    products.push(product);
    return products;
  }
  function createHatProducts(){
    var products = [];
    var product;

    product = new Product(1, "Red Hat", "Melin", 50, "img/hat1.jpg", "Beautiful hat!", "XL");
    products.push(product);
    product = new Product(2, "Light Brown Hat", "Diamond", 40, "img/hat2.jpg", "Cheap hat!", "XL");
    products.push(product);
    product = new Product(3, "Gray Brown Hat", "Diamond", 60, "img/hat3.jpg", "High quality hat!", "XL");
    products.push(product);
    product = new Product(4, "Dark Brown Hat", "Melin", 45, "img/hat4.png", "High quality hat!", "XL");
    products.push(product);
    product = new Product(5, "Fedora", "Son", 53, "img/hat5.jpg", "High quality hat!", "XL");
    products.push(product);
    product = new Product(6, "Charlie's Hat", "Charlie", 999, "img/hat6.jpg", "Charlie Chaplin's hat", "XL");
    products.push(product);
    return products;
  }

	function Category(id, name, products){
    this.id = id;
		this.name = name;
		this.products = products;
	}
	function createSampleCategories(){
		var categories = [];
    var category;
    var products = [];

    products = createShirtProducts();
    category = new Category(1, "Shirt", products);
    categories.push(category);
    products = createPantProducts();
    category = new Category(2, "Pant", products);
    categories.push(category);
    products = createHatProducts();
    category = new Category(3, "Hat", products);
    categories.push(category);

    return categories;

	}
})
.controller('itemCtrl', function ($scope, $rootScope, $stateParams) {
	var id = $stateParams.id;
	$scope.selectedProduct;
	for (var i = 0; i < $scope.products.length; i++) {
		selectedProduct = $scope.products[i];
		if(id == selectedProduct.id){
			break;
		}
	}
	$scope.name = selectedProduct.name;
	$scope.brand = selectedProduct.brand;
	$scope.image = selectedProduct.image;
	$scope.description = selectedProduct.description;
	$scope.price = selectedProduct.price;
})

