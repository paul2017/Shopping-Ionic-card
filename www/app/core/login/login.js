'use strict';

angular.module('stashd.login', [])


//.factory('UserFactory', ['$http',
.factory('facebookConnectPlugin', ['$http',
    function($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/accounts/facebook/login';

        var getAccountData = function() {
            return $http.get(apiUrl)
                .then(function(data) {
                    return data;
                });
        };

        return {
            getAccountData: getAccountData
        };
    }
])

.service('UserService', ['$http', '$log',
    function($http, $log) {
        // Store user data on ionic local storage
        var setUser = function(user_data) {
            window.localStorage.starter_facebook_user = JSON.stringify(user_data);
            $log.info(user_data);
            var userApi = 'http://stashdapp-t51va1o0.cloudapp.net/api/user/';

             $http.post(userApi + JSON.stringify(user_data))
                     .then(function successCallback(response) {
                         $log.log(success);
              }, function errorCallback(response) {
                         $log.error(err);
                     })
        };

        var getUser = function(){
            return JSON.parse(window.localStorage.starter_facebook_user || '{}');
        };

        return {
            getUser: getUser,
            setUser: setUser
        };
    }
])

    .controller('LoginController', function($scope, $state, $q, UserService, $ionicLoading, $log) {

    //StatusBar.hide(); ### Need to install ngCordova Status Bar


    if(window.localStorage.getItem('uid') != null)
    {
        var uid = window.localStorage.getItem('uid');
        //state.go('cards' {uid: uid});
        $state.go('cards');
    }



    else
    {
        // This is the success callback from the login method
    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                // Store user data on local storage
                UserService.setUser({
                    yob: profileInfo.age_range,
                    first: profileInfo.first_name,
                    last: profileInfo.last_name,
                    extra: {
                        authResponse: authResponse,
                        userID: profileInfo.id,
                        gender: profileInfo.gender,
                        email: profileInfo.email,
                        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                    }
                });

                $ionicLoading.hide();
                $state.go('cards');
                $log.log(profileInfo);
            }, function(fail){
                // Fail get profile info
                // $log.log('profile info fail', fail);
            });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
        // $log.log('fbLoginError', error);
        $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
            function (response) {
                console.log(response);
                info.resolve(response);
            },
            function (response) {
                console.log(response);
                info.reject(response);
            }
        );
        return info.promise;
    };

    $scope.eventlog = function(){
        window.plugins.flurry.logEvent('UserVisit');
    }

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
        //window.plugins.flurry.logEvent('UserVisit');

        facebookConnectPlugin.getLoginStatus(function(success){
            if(success.status === 'connected'){
                // The user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                // console.log('getLoginStatus', success.status);

                // Check if we have our user saved
                var user = UserService.getUser('facebook');

                window.localStorage.setItem('uid', user.userID);

                if(!user.userID){
                    getFacebookProfileInfo(success.authResponse)
                        .then(function(profileInfo) {
                            // Store user data on local storage
                            UserService.setUser({
                                authResponse: authResponse,
                                userID: profileInfo.id,
                                first: profileInfo.first_name,
                                last: profileInfo.last_name,
                                gender: profileInfo.gender,
                                email: profileInfo.email,
                                yob: profileInfo.age_range,
                                picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                            });

                            $state.go('cards');
                        }, function(fail){
                            // Fail get profile info
                            // console.log('profile info fail', fail);
                        });
                }else{
                    $state.go('cards');
                }
            } else {
                // If (success.status === 'not_authorized') the user is logged in to Facebook,
                // but has not authenticated your app
                // Else the person is not logged into Facebook,
                // so we're not sure if they are logged into this app or not.

                // console.log('getLoginStatus', success.status);

                $ionicLoading.show({
                    template: 'Logging in...'
                });

                // Ask the permissions
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };
    }
})

.directive('loginView', ['$document',
    function($document) {
        return {
            restrict: 'E',
            templateUrl: 'app/core/login/login.html',
            link: function($scope, $element, $attr) {
            }
        }

    }
])

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('MainCtrl', function($scope, $state) {
  console.log('MainCtrl');
  
  $scope.toIntro = function(){
    $state.go('intro');
  }
});


