// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'services', 'jett.ionic.filter.bar','ionic.ion.imageCacheFactory'])

.run(function($ionicPlatform,$rootScope,$timeout,$state, $ionicLoading, Recipes,$ImageCacheFactory) {
  $rootScope.appReady = {status:false};
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //Cache all images on app load
    Recipes.get().success(function(data){
      var images = [];
        for(var i = 0; i < data.length; i++){
          images.push(data[i].image_src);
        }
        $ImageCacheFactory.Cache(images).then(function(info){
            console.log("Images done loading!");
        },function(failed){
            console.log("An image filed: "+failed);
        });
    });
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  },$timeout(function() {
    $ionicLoading.hide();
    $state.go('app.foodDetails');
    }, 0));
})

.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
 $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.login', {
      url: '/login2',
      views: {
        'menuContent': {
          templateUrl: 'templates/login2.html',
          controller: 'LoginCtrl'
        }
      }
    })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.categories', {
      url: '/categories',
      views: {
        'menuContent': {
          templateUrl: 'templates/categories.html',
          controller: 'CategoriesCtrl'
        }
      }
    })

  .state('app.food', {
    url: '/categories/:foodName',
    views: {
      'menuContent': {
        templateUrl: 'templates/food.html',
        controller: 'FoodCtrl'
      }
    }
  })

  .state('app.foodDetails', {
    url: '/categories/:foodName/:foodDetails',
    views: {
      'menuContent': {
        templateUrl: 'templates/foodDetails.html',
        controller: 'FoodDetailsCtrl'
      }
    }
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  })

  .state('app.modal', {
    url: '/creditModal',
    views: {
      'menuContent': {
        templateUrl: 'templates/creditModal.html',
        controller: 'FoodDetailsCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/categories');
})

