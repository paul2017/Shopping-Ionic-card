'use strict';
angular.module('stashd.stylistshop', [])

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

function stylistcardsApiProvider($http, $stateParams) {

    var stylist_id = $stateParams.stylist_id;
    //var product_id = $stateParams.product_id;
    var like = JSON.stringify({uid:21, click:1, like:1, image:0, scroll:1, clickbuy:0});
    var dislike = JSON.stringify({uid:21, click:1, like:0, image:0, scroll:1, clickbuy:0});

    var postRecordLikes = function (product_id) {
        return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_id + "/", like);
    }

    var postRecordDislikes = function (product_id) {
        return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_id + "/", dislike);
    }

    var getApiData = function () {
        return $http.get(BASE_URL + stylist_id);

    };
    var BASE_URL = 'http://stashdapp-t51va1o0.cloudapp.net/api/list/?tag=';


    return {
        getApiData: getApiData,
        postRecordLikes: postRecordLikes,
        postRecordDislikes: postRecordDislikes
    };

}




function stylistCardsCtrl($scope, $log, stylistcardsApi, UserService) {
    console.debug("YO Products")

    var MIN_CARDS = 7;
    var CARDS_TO_GET_AT_ONCE = 10; //Currently not working- server to be configured

    console.log('CARDS CTRL');
    $scope.stylistcards = [];

    // <======  Rewrite with accounts preferences
    stylistcardsApi.getApiData()
        .then(function (result) {
            console.log(result.data) //Shows log of API incoming
            $scope.stylistcards = result.data;
            $scope.product_id = result.data.product_id;
        })
        .catch(function (err) {
            //$log.error(err);
        });
    // Rewrite with accounts preferences (from local) =====>

    $scope.$watchCollection('cards', function (newVal, oldVal) {
        if (newVal.length < oldVal.length) {
            stylistcardsApi.getApiData()
                .then(function (result) {

                    // console.log(JSON.stringify(result.data)); Shows log of API results

                    $scope.stylistcards.unshift(result.data);

                    // console.log($scope.cards);

                })
        }
    });

    $scope.cardDestroyed = function (index) {
        $scope.stylistcards.splice(index, 1);
        fetchMoreIfNeeded();
    };

    function fetchMoreIfNeeded() {
        console.log($scope.stylistcards.length);
        if ($scope.stylistcards.length < MIN_CARDS) {
            console.log("GETTING MORE");
            stylistcardsApi.getApiData(CARDS_TO_GET_AT_ONCE)
                .then(function (result) {

                    // console.log(JSON.stringify(result.data)); Shows log of API results

                    for (var i = 0; i < result.data.length; i++) {
                        $scope.stylistcards.unshift(result.data[i]);
                    }
                    //$scope.cards. = result.data;

                    console.log($scope.stylistcards);

                })
            //.catch(function (err) {
            //    console.log(err);
            //});
        }
    }
    $scope.addCard = function () {
        var newCard = $scope.stylistcards[$scope.stylistcards.length];
        //newCard.id = Math.random();
        $scope.stylistcards.push(angular.extend({}, newCard));
    };

    $scope.cardSwipedRight = function (card) {
        console.log('RIGHT');
        postRecordLikes(card);
    };

    $scope.cardSwipedLeft = function (card) {
        console.log(card);
        postRecordDislikes(card);
    };


    var postRecordLikes = function (product_id) {
        stylistcardsApi.postRecordLikes(product_id)
            .then(function successCallback(product_id) {

            }, function errorCallback(response) {
                console.log(response);
            });
    };
    var postRecordDislikes = function (product_id) {
        stylistcardsApi.postRecordLikes(product_id)
            .then(function successCallback(product_id) {
                //console.log('Success');
            }, function errorCallback(response) {
                console.log(response);
            });
    };

};
    //
    //
    //
    //
    ////.factory('stylistcardsApi', ['$http', function ($http) {
    ////    var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/list/';
    ////    var like = JSON.stringify({uid:21, click:1, like:1, image:0, scroll:1, clickbuy:0});
    ////    var dislike = JSON.stringify({uid:21, click:1, like:0, image:0, scroll:1, clickbuy:0});
    ////
    ////
    ////    var getApiData = function (numCards) {
    ////        return $http.get(apiUrl + "?numCards=" + numCards);
    ////    };
    ////
    ////    var postRecordLikes = function (product_id) {
    ////        return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_id + "/", like);
    ////    }
    ////
    ////    var postRecordDislikes = function (product_id) {
    ////        return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_id + "/", dislike);
    ////    }
    ////
    ////    return {
    ////        getApiData: getApiData,
    ////        postRecordLikes: postRecordLikes,
    ////        postRecordDislikes: postRecordDislikes
    ////    };
    ////}])
    //
    //.controller('stylistcardsCtrl', ['$scope', 'TDCardDelegate', 'cardsApi', '$http',
    //    function ($scope, TDCardDelegate, cardsApi, $http) {
    //        var MIN_CARDS = 7;
    //        var CARDS_TO_GET_AT_ONCE = 10; //Currently not working- server to be configured
    //
    //        console.log('CARDS CTRL');
    //        $scope.cards = [];
    //
    //        // <======  Rewrite with accounts preferences
    //        cardsApi.getApiData()
    //            .then(function (result) {
    //                console.log(result.data) //Shows log of API incoming
    //                $scope.cards = result.data;
    //                $scope.product_id = result.data.product_id;
    //            })
    //            .catch(function (err) {
    //                //$log.error(err);
    //            });
    //        // Rewrite with accounts preferences (from local) =====>
    //
    //        $scope.$watchCollection('cards', function (newVal, oldVal) {
    //            if (newVal.length < oldVal.length) {
    //                cardsApi.getApiData()
    //                    .then(function (result) {
    //
    //                        // console.log(JSON.stringify(result.data)); Shows log of API results
    //
    //                        $scope.cards.unshift(result.data);
    //
    //                        // console.log($scope.cards);
    //
    //                    })
    //            }
    //        });
    //
    //        $scope.cardDestroyed = function (index) {
    //            $scope.cards.splice(index, 1);
    //            fetchMoreIfNeeded();
    //        };
    //
    //        function fetchMoreIfNeeded() {
    //            console.log($scope.cards.length);
    //            if ($scope.cards.length < MIN_CARDS) {
    //                console.log("GETTING MORE");
    //                cardsApi.getApiData(CARDS_TO_GET_AT_ONCE)
    //                    .then(function (result) {
    //
    //                        // console.log(JSON.stringify(result.data)); Shows log of API results
    //
    //                        for (var i = 0; i < result.data.length; i++) {
    //                            $scope.cards.unshift(result.data[i]);
    //                        }
    //                        //$scope.cards. = result.data;
    //
    //                        console.log($scope.cards);
    //
    //                    })
    //                //.catch(function (err) {
    //                //    console.log(err);
    //                //});
    //            }
    //        }
    //        $scope.addCard = function () {
    //            var newCard = $scope.cards[$scope.cards.length];
    //            //newCard.id = Math.random();
    //            $scope.cards.push(angular.extend({}, newCard));
    //        };
    //
    //        $scope.cardSwipedRight = function (card) {
    //            console.log('RIGHT');
    //            postRecordLikes(card);
    //        };
    //
    //        $scope.cardSwipedLeft = function (card) {
    //            console.log(card);
    //            postRecordDislikes(card);
    //        };
    //
    //
    //        var postRecordLikes = function (product_id) {
    //            cardsApi.postRecordLikes(product_id)
    //                .then(function successCallback(product_id) {
    //
    //                }, function errorCallback(response) {
    //                    console.log(response);
    //                });
    //        };
    //        var postRecordDislikes = function (product_id) {
    //            cardsApi.postRecordLikes(product_id)
    //                .then(function successCallback(product_id) {
    //                    //console.log('Success');
    //                }, function errorCallback(response) {
    //                    console.log(response);
    //                });
    //        };
    //
    //    }
    //])
