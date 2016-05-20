angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http ,Recipes, $ionicModal, $timeout, $ionicSideMenuDelegate,
  $ionicActionSheet, $rootScope, User, $ionicLoading, $window, UserService, $state) {
var ref = new Firebase("https://somali-food-app.firebaseio.com");
  ref.onAuth(function(authData) {
    if (authData) {
      console.log('Logged in with firebase token' + authData.token)
      $window.localStorage.currentAccount = 'firebase'
      $scope.currentUser = true;
      $scope.currentAccount = 'email'
    } else {
      console.log("Client unauthenticated.")
    }
  });

  if($window.localStorage.currentAccount === 'facebook'){
      $scope.currentUser = true;
  }else if($window.localStorage.currentAccount === 'firebase'){
      $scope.currentUser = true;
  }else{
    $scope.currentUser = false;
  }

  console.log("Current Account is ------ : " + $window.localStorage.currentAccount)
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.signUp = false;
  $scope.goSignUp = function(){
    $scope.signUp = true;
    console.log($scope.signUp)
  }

  $scope.goLogin = function(){
    $scope.signUp = false;
    console.log($scope.signUp)
  }

  $scope.createUser = function(email, password, password2){
    User.create(email, password, password2)
    $timeout(function() {
            User.login(email, password)
            $scope.closeSignup();
            $state.go('app.categories');        
          }, 1000);
  }

  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openSignup = function() {
    $scope.modal.show();
  };
  $scope.closeSignup = function() {
    $scope.modal.hide();
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

  $scope.userLogin = function(email, password){
    User.login(email, password)
  }
  // Open the login modal
  $scope.login = function() {
    $state.go('app.login')
  };
  $scope.logout = function() {
                          $ionicLoading.show({
                        template: 'Logging out...',
                        duration: 1000
                      });
        $ionicSideMenuDelegate.toggleLeft();
        if($window.localStorage.currentAccount === 'firebase'){
              User.logout();
              $timeout(function() {
                      $state.go('app.categories');
                      $window.localStorage.currentAccount = null
                      $window.localStorage.token = null;
                      $scope.currentUser = false;
                      $ionicLoading.hide();
                    }, 1000);
        }else if($window.localStorage.currentAccount === 'facebook'){
            $scope.currentUser = false;
          facebookConnectPlugin.logout(function(info){
            $ionicLoading.hide();
            console.log(info)
            $window.localStorage.currentAccount = null
            $window.localStorage.token = null;
            $scope.currentUser = false;
            console.log('facebook logout'+ $window.localStorage.token)
            console.log('facebook logout current User:  '+ $scope.currentUser)
            $state.go('app.categories');
          },
          function(fail){
            console.log(fail)
            $ionicLoading.hide();
          });
        }

      };

  $scope.user = UserService.getUser();

  $scope.showLogOutMenu = function() {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout?',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        $ionicLoading.show({
          template: 'Logging out...'
        });

        // Facebook logout
        facebookConnectPlugin.logout(function(info){
          $scope.currentUser = false;
          $window.localStorage.token = null;
          $state.go('app.categories');
          console.log('facebook logout'+ $window.localStorage.token)
          $ionicLoading.hide();
        },
        function(fail){
          console.log('fail message' + fail)
          $ionicLoading.hide();
        });
      }
    });
  };
})
  

.controller('CategoriesCtrl', function($scope, $ionicModal,$timeout,$http,$window, $state, Recipes, $rootScope, $ionicLoading) {
console.log('SCOPE USER: ---' + $scope.currentUser);
  $scope.foodTest = [];
  var test;
      $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner>',
      showBackdrop: false,
      animation: 'fade-in',
    });
   Recipes.get().success(function(data){
    test = data;
    test.forEach(function(info){
      $scope.foodTest.push(info);
    })
      $scope.foods = $scope.foodTest
      $scope.favoritesImg = $scope.foods[0].FavoritesImg
      // console.log($scope.foods)
      $scope.categories = [];
  for(var i = 0; i < $scope.foods.length; i++){
    if($scope.foods[i].Category){ 
      $scope.categories.push($scope.foods[i])
    }
  }
  var a = $scope.categories;
  function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
  }
  $scope.categories = uniq(a);
  // console.log($scope.categories)
  $ionicLoading.hide();
   }, function(error){
    console.log(error)
   });

})

.controller('FoodCtrl', function($scope, $stateParams,$window, Recipes, $http,$ionicLoading) {
  console.log('welcome buddy')
  $scope.foodTest = [];
  var test;
  var category = $stateParams.foodName
  $scope.info = [];
  console.log(category);
  Recipes.get().success(function(data){
    test = data;
    test.forEach(function(info){
      $scope.foodTest.push(info);
    })
    $scope.foods = $scope.foodTest
    for(var i = 0; i < $scope.foods.length; i++){
      if($scope.foods[i].Category === category){
        $scope.info.push($scope.foods[i])
      }
    }
   });
})

.controller('FoodDetailsCtrl', function($scope, $http, Recipes, $stateParams, $window, $rootScope, User,$ionicLoading, $ionicModal,$ionicPopup) {
  var ref = new Firebase("https://somali-food-app.firebaseio.com");
  var authData = ref.getAuth();
  $scope.things = [];
  for (var i = 0; i < 10000; i++) {
    $scope.things.push(i)
  }
  $scope.foodTest = [];
  $scope.liked = false;
  var currentAccountId;
  currentAccountId = $window.localStorage.currentAccount;
  var name = $stateParams.foodDetails;
  $scope.details = [];
  console.log(name);
  if($scope.currentUser == false){
    Recipes.get().success(function(data){
    test = data;
    test.forEach(function(info){
      $scope.foodTest.push(info);
    })
    $scope.foods = $scope.foodTest
       for(var i = 0; i < $scope.foods.length; i++){
        if($scope.foods[i].Name === name){
          $scope.details.push($scope.foods[i])
          }
      }
          console.log(JSON.stringify($scope.details));
    });

    $scope.likeStatus = function(food){
      $ionicPopup.alert({
         title: 'Don\'t eat that!',
         template: 'It might taste good'
       });
    }
      return  $scope.details

  }

  if($window.localStorage.currentAccount === 'firebase'){
    currentAccountId = authData.uid
  }else if($window.localStorage.currentAccount === 'facebook'){
    currentAccountId = $window.localStorage.token;
  }else{
    console.log('No User Logged in')
  }
                  $http({
                        method: 'POST',
                        // url: 'http://localhost:3000/users/favorites',
                        url: 'https://somali-recipes.herokuapp.com/users/favorites',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {firebaseId: currentAccountId, foodName: name}
                        }).success(function (info) {
                          $scope.liked = info;
                        });

    Recipes.get().success(function(data){
    test = data;
    test.forEach(function(info){
      $scope.foodTest.push(info);
    })
    $scope.foods = $scope.foodTest


$scope.likeStatus = function(food){
  console.log(currentAccountId)
      if(!currentAccountId){
        return $ionicPopup.confirm({
               title: 'Must be logged in!',
               template: 'Would you like to log in to save this recipe?'
             });
      }else{
        $scope.liked = $scope.liked === true ? false : true;
            if($scope.liked != false){
              $http({
                        method: 'POST',
                        // url: 'http://localhost:3000/users/add/favorites',
                        url: 'https://somali-recipes.herokuapp.com/users/add/favorites',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {firebaseId: currentAccountId, foodName: food}
                        }).success(function (info) {
                          console.log(JSON.stringify(info))
                        });
            }else{
              $http({
                        method: 'DELETE',
                        // url: 'http://localhost:3000/users/remove/favorites',
                        url: 'https://somali-recipes.herokuapp.com/users/remove/favorites',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {foodName: food, firebaseId: currentAccountId}
                        }).success(function (info) {
                          console.log(JSON.stringify(info))
                        });
               
          }
        
      }

  }
         for(var i = 0; i < $scope.foods.length; i++){
        if($scope.foods[i].Name === name){
          $scope.details.push($scope.foods[i])
          // console.log(JSON.stringify($rootScope.foods[i]));
          }
      }
   });

    $ionicModal.fromTemplateUrl('templates/creditModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
$scope.showModal = function(){
  $scope.modal.show();
}
    $scope.closeModal = function() {
    $scope.modal.hide();
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
$scope.credits = {
  website:{
    link: "http://www.somalikitchen.com/",
    class:'ion-ios-world-outline'
  },
  facebook:{
    link: 'https://www.facebook.com/TheSomaliKitchen/',
    class:'ion-social-facebook'
  },
  instagram:{
    link: 'https://www.instagram.com/somalikitchen/',
    class:'ion-social-instagram-outline'
  },
  google:{
    link: 'https://plus.google.com/+AbderazzaqNoor/posts',
    class:'ion-social-googleplus'
  }
}
  $scope.openBrowser = function(link){
    console.log(JSON.stringify(link));
    window.open(link, "_blank", "location=no"); return false;
  }
})

.controller('FavoritesCtrl', function($scope,$window,Recipes, $ionicLoading,$http) {
  var ref = new Firebase("https://somali-food-app.firebaseio.com");
  var authData = ref.getAuth();
  var favoritesFoods = [];
  var currentAccountId;
  if($window.localStorage.currentAccount === 'firebase'){
    $ionicLoading.show({
          template: 'Loading favorites...'
        });
      currentAccountId = authData.uid
  }else if($window.localStorage.currentAccount === 'facebook'){
    $ionicLoading.show({
          template: 'Loading favorites...'
        });
    currentAccountId = $window.localStorage.token;
  }else{
    console.log('No User Logged in')
  }
  console.log(currentAccountId)
  $scope.foodTest = [];
  $scope.info = [];
     $http({
                        method: 'POST',
                        // url: 'http://localhost:3000/users/favorites/all',
                        url: 'https://somali-recipes.herokuapp.com/users/favorites/all',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {firebaseId: currentAccountId}
                        }).success(function (serverInfo) {
                          serverInfo.forEach(function(data){
                            favoritesFoods.push(data.foodName)
                          }, function(err){
                            console.log(err)
                          })
                        Recipes.get().success(function(data){
                          test = data;
                          test.forEach(function(info){
                            $scope.foodTest.push(info);
                          })
                          for(var i = 0; i < $scope.foodTest.length; i++){
                            for(var j =0; j < $scope.foodTest.length; j++){
                              if($scope.foodTest[i].Name === favoritesFoods[j]){
                                $scope.info.push($scope.foodTest[i])
                              }
                            }
                          }
                          $ionicLoading.hide();
                         });
                        });
})

.controller('LoginCtrl', function($scope,$window, $state, Recipes, $q, $http, UserService,User, $ionicLoading) {
var ref = new Firebase("https://somali-food-app.firebaseio.com");
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    $window.localStorage.currentAccount = 'facebook'
    var authResponse = response.authResponse;
    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      console.log(profileInfo)
    $window.localStorage.token = profileInfo.email
    $scope.currentUser = true;
      // For the purpose of this example I will store user data on local storage
      $ionicLoading.hide();
      $http({
                            method: 'POST',
                            // url: 'http://localhost:3000/users/facebook',
                            url: 'https://somali-recipes.herokuapp.com/users/facebook',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function(obj) {
                                var str = [];
                                for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {firebaseId: profileInfo.email}
                            }).success(function (info) {
                              console.log('Facebook token:' + $window.localStorage.token + ' and scope.user is '+ $scope.currentUser)
                              console.log(JSON.stringify(info))
                              $window.localStorage.currentAccount = 'facebook'
                              $state.go('app.categories', {}, {reload: false}).then(function(){
                                setTimeout(function() {
                                  $window.location.reload(true);
                                }, 500);
                              })
                            }, function(err){
                              console.log('ERROR: ' + err)
                            });
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    console.log("CLICKED!!!!!!")
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        getFacebookProfileInfo(success).then(function(data){
        $window.localStorage.token = data.email;
          console.log('data facebook here: ' + JSON.stringify(data))
        $http({
                            method: 'POST',
                            // url: 'http://localhost:3000/users/facebook',
                            url: 'https://somali-recipes.herokuapp.com/users/facebook',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function(obj) {
                                var str = [];
                                for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {firebaseId: data.email}
                            }).success(function (info) {
                              console.log('Facebook token:' + $window.localStorage.token)
                              console.log(JSON.stringify(info))
                              $window.localStorage.currentAccount = 'facebook'
                              $scope.currentUser = true;
                              $state.go('app.categories', {}, {reload: false}).then(function(){
                                setTimeout(function() {
                                  $window.location.reload(true);
                                }, 500);
                              })
                            }, function(err){
                              console.log('ERROR: ' + err)
                            });

        })
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus ---- finally connected ---', success.status);

      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
        // but has not authenticated your app
        // Else the person is not logged into Facebook,
        // so we're not sure if they are logged into this app or not.

        console.log('getLoginStatus -- else ---', success.status);
        $ionicLoading.show({
          template: 'Logging in...'
        });

        // Ask the permissions you need. You can learn more about
        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
})

.controller('SearchCtrl', function($scope, $timeout,Recipes, $ionicFilterBar) {
$scope.foodTest = [];
$scope.names = [];
    var filterBarInstance;
        
    function getItems () {
      Recipes.get().success(function(data){
        test = data;
        test.forEach(function(info){
          $scope.foodTest.push(info);
        })
        // console.log($scope.foodTest)
        for(var i = 0; i < $scope.foodTest.length; i++){
          // console.log(JSON.stringify($scope.foodTest[i].Name))
          $scope.names.push($scope.foodTest[i].Name)
        }
        // console.log($scope.names)
        $scope.showFilterBar = function () {
          filterBarInstance = $ionicFilterBar.show({
            items: $scope.names,
            update: function (filteredItems, filterText) {
              $scope.names = filteredItems;
              if (filterText) {
                console.log(filterText);
              }
            }
          });
        };
      });
    }

    getItems();


    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
});













