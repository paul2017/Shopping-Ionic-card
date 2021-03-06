angular.module('stashd.logout', [])

.controller('LogoutController', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading){
    $scope.user = UserService.getUser();

    $scope.showLogOutMenu = function() {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout? This app is awesome so I recommend you to stay.',
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
                facebookConnectPlugin.logout(function(){
                        $ionicLoading.hide();
                        $state.go('welcome');
                    },
                    function(fail){
                        $ionicLoading.hide();
                    });
            }
        });
    };
})