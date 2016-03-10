angular.module('stashd.cardstest', [])

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
    //Below analytics needs to be much smarter/better. Should be able to 'update' products, and add to
    // numbers. Need to also 'track' movement better. Track js movement?
    .factory('cardstestApi', ['$http', function ($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/list'//STORE 14 is test store
        var like = JSON.stringify({uid:22, click:1, like:1, image:0, scroll:1, clickbuy:0}); //USER 22 is test user
        var dislike = JSON.stringify({uid:22, click:1, like:0, image:0, scroll:1, clickbuy:0});


        var getApiData = function (numCards) {
            return $http.get(apiUrl);
        };

        var postRecordLikes = function (product_vari) {
            return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_vari + "/", like);
        }

        var postRecordDislikes = function (product_vari) {
            return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_vari + "/", dislike);
        }

        return {
            getApiData: getApiData,
            postRecordLikes: postRecordLikes,
            postRecordDislikes: postRecordDislikes
        };
    }])

    .controller('CardstestCtrl', ['$scope', 'TDCardDelegate', 'cardstestApi', '$http',
        function ($scope, TDCardDelegate, cardsApi, $http) {
            var MIN_CARDS = 7;
            var CARDS_TO_GET_AT_ONCE = 10; //Currently not working- server to be configured

            console.log('CARDS CTRL');
            $scope.cardstest = [];

            // <======  Rewrite with accounts preferences
            cardsApi.getApiData()
                .then(function (result) {
                    console.log(result.data) //Shows log of API incoming
                    $scope.cards = result.data;
                    $scope.product_vari = result.data.product_vari;
                })
                .catch(function (err) {
                    //$log.error(err);
                });
            // Rewrite with accounts preferences (from local) =====>

            $scope.$watchCollection('cards', function (newVal, oldVal) {
                if (newVal.length < oldVal.length) {
                    cardsApi.getApiData()
                        .then(function (result) {

                            // console.log(JSON.stringify(result.data)); Shows log of API results

                            $scope.cards.unshift(result.data);

                            // console.log($scope.cards);

                        })
                }
            });

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

                            console.log($scope.cards);

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

            $scope.cardSwipedRight = function (card) {
                console.log('RIGHT');
                postRecordLikes(card);
            };

            $scope.cardSwipedLeft = function (card) {
                console.log(card);
                postRecordDislikes(card);
            };


            var postRecordLikes = function (product_vari) {
                cardsApi.postRecordLikes(product_vari)
                    .then(function successCallback(product_vari) {

                    }, function errorCallback(response) {
                        console.log(response);
                    });
            };
            var postRecordDislikes = function (product_vari) {
                cardsApi.postRecordLikes(product_vari)
                    .then(function successCallback(product_vari) {
                        //console.log('Success');
                    }, function errorCallback(response) {
                        console.log(response);
                    });
            };

        }
    ])