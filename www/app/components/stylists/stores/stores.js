'use strict';
angular.module('stashd.stores', [])


.factory('storesApi', ['$http',
    function($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/store/';

         var getApiData = function() {
            return $http.get(apiUrl)
        };

        return {
            getApiData: getApiData
        };
    }]
)
.directive('noScroll', '$document',
    //[ '$document', function($document){}]
    function($document) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    }
)

.controller('storesCtrl', ['$scope', '$log', 'storesApi', 'UserService',
    function($scope, $log, storesApi, UserService) {
    // $scope.stores = [];
    // angular.forEach(data.stores, function(value, key) {
    //     $scope.stores.data(value);
    // });

    $scope.isVisible = function(name){
        return true;// return false to hide this artist's albums
    };

    // <======  Rewrite with accounts preferences
            storesApi.getApiData()
                .then(function (result) {
                    console.log(JSON.stringify(result.data)) //Shows log of API incoming
                    $scope.stores = result.data;
                    $scope.store_pk = result.data.store_pk;
                })
                .catch(function (err) {
                    $log.error(err);
                });
}
]);