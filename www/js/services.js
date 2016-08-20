angular.module('services', [])

.service('UserService', function() {
  // For the purpose of this example I will store user response on ionic local storage but you should save it on a responsebase
  var setUser = function(user_response) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_response);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})

.factory('User', function($ionicLoading, $state, $rootScope, $http, $timeout, $window, $ionicPopup, $q){
  var ref = new Firebase("https://somali-food-app.firebaseio.com");
  var usersRef = ref.child("users");
  var authData = ref.getAuth();
  var response;
  return {
            login: function (email, password){
            	      function authHandler(error, authresponse) {
            	      	 $ionicLoading.show({
					          template: '<ion-spinner icon="ios"></ion-spinner>'
					        });
					    if (error) {
					      console.log("Login Failed!", error);
					      $ionicLoading.hide();
					      $ionicPopup.alert({
						     title: 'Login error',
						     template: 'Incorrect email or password, please try again.'
						   });
					    } else {
					      console.log("Authenticated successfully with payload:", authresponse);     
					      $ionicLoading.hide();
					      $window.localStorage.currentAccount = 'firebase'
					      $window.localStorage.userId = authresponse.uid;
					      $window.localStorage.token = authresponse.token;
					      $state.go('app.categories'); 
					    }
					  }
                  // Or with an email/password combination
				    ref.authWithPassword({
				      email    : email,
				      password : password
				    }, authHandler);
            },
            logout: function(){
                ref.unauth();
           		console.log(' -----You have been logged out----');

            },
            create: function(email, password, password2, callback){
      			    var isNewUser = true;
      			    if(password != password2){                
                  return $ionicPopup.alert({
                         title: 'Sign up error',
                         template: 'Passwords do not match, please try again.'
                        });
      			    }else{
      			      ref.createUser({
      			      email    : email,
      			      password : password
      			      }, function(error, userresponse) {
      			        if (error) {
      			          console.log("Error creating user:", JSON.stringify(error.code));
                      return $ionicPopup.alert({
                         title: 'Sign up error',
                         template: 'Error creating user, please try again.'
                        });
      			        }else {
      			          console.log("Successfully created user account with uid:", userresponse.uid);
      			          console.log(JSON.stringify(userresponse));
                      callback(userresponse)
      			               $window.localStorage.userId = userresponse.uid;
      			                     $http({
      					                  method: 'POST',
      					                  // url: 'http://localhost:3000/users/create',
      					                  url: 'https://somali-recipes.herokuapp.com/users/create',
      					                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      					                  transformRequest: function(obj) {
      					                      var str = [];
      					                      for(var p in obj)
      					                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      					                      return str.join("&");
      					                  },
      					                  data: {email: email, firebaseId: $window.localStorage.userId}
      					                  }).success(function (info) {  
      					                    console.log('WE HIT IT: ', JSON.stringify(info))
      					                  }, function(error){
                                    console.log('An error occurred creating the user', error)
                                  });
      			        }
      			      });
      			    }
      			  
                  },

            addFavorite: function(food){
            	// console.log(JSON.stringify(food))
            	$window.localStorage.user.favorites = food
            	console.log($window.localStorage.user.favorites)
            }
  }

})

.factory('Recipes', function($ionicLoading, $state, $rootScope, $http, $timeout, $window){
  return {
    get: function (){
    	$ionicLoading.show({
    		template: '<ion-spinner icon="ios"></ion-spinner>'
    	});
    	 // Simple GET request example:
		return $http({
		  method: 'GET',
		  url: 'js/recipes.json',
		  // url: 'https://somali-recipes.herokuapp.com/recipes',
		  // url: 'http://localhost:3000/recipes',
		  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data) {
			$ionicLoading.hide();
	var newData = [];
		for(var i = 0; i < data.length; i++){
          if(data[i].Category === "Appetizers"){
            data[i]['CategoryImg'] = "img/appetizers.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Prep_Detail){
            data[i]['Credit'] = "The Somali Kitchen"
            newData.push(data[i])
          }

          if(data[i].Category === "Breakfast"){
            data[i]['CategoryImg'] = "img/breakfast.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Desserts"){
            data[i]['CategoryImg'] = "img/Desserts.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Grains & Legumes"){
            data[i]['CategoryImg'] = "img/grains.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Main Courses"){
            data[i]['CategoryImg'] = "img/main-course.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Soups"){
            data[i]['CategoryImg'] = "img/soups.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Vegetables"){
            data[i]['CategoryImg'] = "img/vegetables.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Side-Dishes"){
            data[i]['CategoryImg'] = "img/side-dishes.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Bread"){
            data[i]['CategoryImg'] = "img/bread.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Meat"){
            data[i]['CategoryImg'] = "img/Meat.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Fish"){
            data[i]['CategoryImg'] = "img/fish.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Eggs"){
            data[i]['CategoryImg'] = "img/Eggs.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Featured"){
            data[i]['CategoryImg'] = "img/Featured.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Vegan"){
            data[i]['CategoryImg'] = "img/Vegan.jpeg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Rice"){
            data[i]['CategoryImg'] = "img/Rice.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Salads"){
            data[i]['CategoryImg'] = "img/Salads.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }

          if(data[i].Category === "Beverages"){
            data[i]['CategoryImg'] = "img/beverages.jpg"
            data[i]['FavoritesImg'] = "img/favorites.jpg"
            newData.push(data[i])
          }
      }
		    return newData
		  }, function(error) {
		  	console.log('ERROR HERE ------>' + JSON.stringify(error))
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });  
		    }
		}

})
