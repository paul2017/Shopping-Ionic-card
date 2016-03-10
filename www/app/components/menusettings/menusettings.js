'use strict';

//Card controller
//Retrieves product data and apples to card
//Adds card to swipe stack

angular.module('stashd.wardrobes', [])

/*.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cards', {
                url: '',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/cards/cards.html'
                    }
                }
            });

    }
])*/

// .factory('wardrobeFactory', ['$http',
//     function($http) {
//         var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/wardrobe/?user=1';

//          var getApiData = function() {
//             return $http.get(apiUrl)
//         };

//         return {
//             getApiData: getApiData
//         };
//     }]
// )

// .directive('noScroll', '$document',
//     function($document) {
//         return {
//             restrict: 'A',
//             link: function($scope, $element, $attr) {

//                 $document.on('touchmove', function(e) {
//                     e.preventDefault();
//                 });
//             }
//         }
//     }
// )

// .controller('WardrobesCtrl', ['$scope', '$log', 'wardrobeFactory', 'UserService',
//     function($scope, $log, TDCardDelegate, wardrobeFactory, UserService) {

//         $scope.items = []
        
//             wardrobeFactory.getWardrobe()
//             .then(function (result) {
//                 $scope.items = result.data
//             })

//         $scope.$watchCollection('wardrobes', function (newVal, oldVal) {
//             if(newVal < oldVal) {
//                 wardrobeFactory.getApiData()
//                     .then(function (result) {

//                         // console.log(result.data); Shows log of API results

//                         $scope.wardrobes.unshift(result.data);

//                         // console.log($scope.cards);

//                     })
//                     .catch(function (err) {
//                         console.log(err);
//                     });
//             }
//         });
//     }
// ]);