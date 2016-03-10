'use strict';
angular.module('stashd.stylists', [])


.factory('stylistsApi', ['$http',
    function($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/tag/';

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

.controller('stylistsCtrl', ['$scope', '$log', 'stylistsApi', 'UserService',
    function($scope, $log, stylistsApi, UserService) {

    // $scope.stylists = [];
    // angular.forEach(data.stylists, function(value, key) {
    //     $scope.stylists.data(value);
    // });

    // <======  Rewrite with accounts preferences
            stylistsApi.getApiData()
                .then(function (result) {
                    console.log(JSON.stringify(result.data)) //Shows log of API incoming
                    $scope.stylists = result.data;
                    window.plugins.flurry.logEvent('StylistNameVisit');
                })
                .catch(function (err) {
                    $log.error(err);
                });

    $scope.refine = function(){
        window.plugins.flurry.logEvent('RefineType');
    }
}
]);