angular.module('stashd.cards', [])

    .config(function ($stateProvider, $urlRouterProvider) {

    })

    .directive('noScroll', function ($document) {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                $document.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })

    .factory('cardsApi', ['$http', function ($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/list/';

        var getApiData = function (numCards) {
            return $http.get(apiUrl + "?numCards=" + numCards);
        };

        var postRecordLikes = function (product_id) {
            return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_id);
        }

        return {
            getApiData: getApiData,
            postRecordLikes: postRecordLikes
        };
    }])

    .controller('CardsCtrl', ['$scope', 'TDCardDelegate', 'cardsApi', '$http',
        function ($scope, TDCardDelegate, cardsApi, $http) {
            var MIN_CARDS = 7;
            var CARDS_TO_GET_AT_ONCE = 10;

            console.log('CARDS CTRL');
            $scope.cards = [];

            $scope.onSwipeRight = function (product_id) {
                console.log(product_id)
                var dataObj = {
                    'like' : 1,
                    'uid' : 21,
                };
            }

            $scope.onSwipeLeft = function (product_id) {
                console.log(product_id)
            }


            // <======  Rewrite with accounts preferences
            //for (var i = 0; i < MIN_CARDS; i++) {
            cardsApi.getApiData()
                .then(function (result) {
                    //console.log(result.data) //Shows log of API incoming
                    $scope.cards = result.data;
                    $scope.product_id = result.data.product_id;
                })
                .catch(function (err) {
                    //$log.error(err);
                });
            //}
            // Rewrite with accounts preferences (from local) =====>

            //$scope.$watchCollection('cards', function (newVal, oldVal) {
            //    console.log(newVal.length);
            //    fetchMoreIfNeeded()
            //});

            $scope.cardSwiped = function (card) {
                console.log(card);
                postRecordLikes(card);
            };

            //$scope.cards = Array.prototype.slice.call(cardTypes, 0);

            //Removes card from top of stack
            $scope.cardDestroyed = function (index) {
                $scope.cards.splice(index, 1);
                fetchMoreIfNeeded();
            };

            function fetchMoreIfNeeded() {
                console.log($scope.cards.length);
                if ($scope.cards.length < MIN_CARDS) {
                    console.log("GETTING MORE");
                    cardsApi.getApiData(CARDS_TO_GET_AT_ONCE)
                        .then(function (result) {

                            // console.log(JSON.stringify(result.data)); Shows log of API results

                            for (var i = 0; i < result.data.length; i++) {
                                $scope.cards.unshift(result.data[i]);
                            }
                            //$scope.cards. = result.data;

                            // console.log($scope.cards);

                        })
                    //.catch(function (err) {
                    //    console.log(err);
                    //});
                }
            }

            $scope.addCard = function () {
                var newCard = $scope.cards[$scope.cards.length];
                //newCard.id = Math.random();
                $scope.cards.push(angular.extend({}, newCard));
            };

            var postRecordLikes = function (product_id) {
                cardsApi.postRecordLikes(product_id)
                    .then(function successCallback(product_id) {
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            };

        }
    ])
