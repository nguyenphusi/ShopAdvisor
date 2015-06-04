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
      if(categoryString) {
        return angular.fromJson(categoryString);
      }
      return [];
    },
    save: function(categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    },
  /*  newProject: function(projectTitle) {
      // Add a new project
      return {
      title: projectTitle,
      tasks: []
      };
    },*/
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
.controller('shopCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, Categories, $ionicModal){
  $rootScope.categories = ['Shirt','T-Shirt','Pants'];
  Categories.save($scope.categories);
  // Load or initialize projects
  //$scope.projects = Projects.all();
  // Grab the last active, or the first project
  $scope.activeCategory = $scope.categories[Categories.getLastActiveIndex()];

  $rootScope.products = [];
  $scope.products = createSampleProducts();
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
    $scope.activeCategory = category;
    Categories.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  $scope.selectSortOption = function(){
    $scope.closeModal(1);
  }
  function createSampleProducts(){
    var products = [];
    var product = {
      id:1,
      name: "long shirt",
      brand: "Nike",
      price: 100,
      description: "High quality long shirt from Nike!",
      size: "XL",
      image: "img/ionic.png"
    }
    products.push(product);
    product = {
      id:2,
      name: "long shirt 2",
      brand: "Nike",
      price: 100,
      description: "High quality long shirt from Nike!",
      size: "XL",
      image: "img/ionic.png"
    }
    products.push(product);
    product = {
      id:3,
      name: "long shirt 3",
      brand: "Nike",
      price: 100,
      description: "High quality long shirt from Nike!",
      size: "XL",
      image: "img/ionic.png"
    }
    products.push(product);
    product = {
      id:4,
      name: "long shirt 4",
      brand: "Nike",
      price: 100,
      description: "High quality long shirt from Nike!",
      size: "XL",
      image: "img/ionic.png"
    }
    products.push(product);
    product = {
      id:5,
      name: "long shirt 5",
      brand: "Nike",
      price: 100,
      description: "High quality long shirt from Nike!",
      size: "XL",
      image: "img/ionic.png"
    }
    products.push(product);
    return products;
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

