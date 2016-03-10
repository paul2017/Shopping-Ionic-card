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

    //Below analytics needs to be much smarter/better. Should be able to 'update' products, and add to
    // numbers. Need to also 'track' movement better. Track js movement?
    .factory('cardsApi', ['$http', '$ionicLoading', '$timeout', function ($http, $ionicLoading, $timeout) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/list';
        // Offline data /app/components/cards/test.json
        var like = JSON.stringify({uid:21, click:1, like:1, imagecl:0, removed:0, scroll:1, clickbuy:0});
        var dislike = JSON.stringify({uid:21, click:0, like:0, imagecl:0, removed:0, scroll:0, clickbuy:0});

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var getApiData = function () {
            return $http.get(apiUrl);
            /*.then($ionicLoading.hide, $ionicLoading.hide)*/
            //IF HTTP resonsponse is NOT 200- hide the content
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
            postRecordDislikes: postRecordDislikes,
        };
    }])

    .controller('CardsCtrl', ['$scope', '$http', '$state', '$q', '$ionicLoading', '$ionicModal', 'TDCardDelegate', 'cardsApi', '$http', '$timeout', '$element',
        function ($scope, $http, $state, $q, $ionicLoading, $ionicModal, TDCardDelegate, cardsApi, $http, $timeout, $element) {


            //var loginuid = $stateParams.uid;


            var MIN_CARDS = 3;
            var MIN_CACHE = 7;
            var CARDS_TO_GET_AT_ONCE = 10; //Currently not working- server to be configured

            console.log('CARDS CTRL');
            $scope.cards = [];
            $scope.temp = [];

            // <======  Rewrite with accounts preferences
            //  var canceler = $q.defer();
            // $http.get('http://stashdapp-t51va1o0.cloudapp.net/api/item/12345/', {timeout: canceler.promise})
            // .then(function mySuccess(response){
            //     console.log(response.data);
            //     console.log(response.status);
            // }, function myError(response){
            //     console.log(response.status);
            // });



            cardsApi.getApiData()
                .then(function (result) {
                    console.log(result.data); //Shows log of API incoming
                    $scope.cards = result.data;


                    //$scope.product_vari = result.data.product_vari;

                    //HANDLE json field "image"
                    //If does NOT load within 4000seconds, ignore that object.
                    //If does NOT return a 200
                    // For both scenarios, setup a DB that checks images/product availablitiy

                    //Wait for the digest cycle...
                    //...promise.then(

                    result.data.forEach(function(card) {
                        var imgurl = card.image;
                        console.log(imgurl);
                        var canceler = $q.defer();
                        $http.get(imgurl, {timeout: canceler.promise})
                            .then(function mySuccess(response){
                                //console.log(response);
                                if(response.data == null){$scope.cards.splice(index, 1);}
                                // var imgid = "card-image-" + card.vari;
                                // console.log(imgid);
                                // var img = document.getElementById(imgid);
                                // console.log(img);
                                //img.src = '';
                            }, function myError(response){
                                /*
                                 console.log(response.status);

                                 //$scope.cardDestroyed = function (index) {
                                 $scope.cards.splice(index, 1);
                                 //fetchMoreIfNeeded();
                                 //};
                                 // console.log('deleted');
                                 var imgpid = "#card-image-" + card.vari;
                                 console.log(imgpid);
                                 //$(imgpid).parent().remove();
                                 */
                            });
                        $timeout(function() {
                            $ionicLoading.hide();
                            canceler.resolve();
                        }, 3000);


                        // var image = new Image();
                        // //card.loaded = false;
                        // image.src = card.image;
                        // //console.log("test");

                        // var imgElem = document.getElementById('card-image-' + card.vari);

                        // console.log("Card element id=", imgElem);
                        // console.log(card);

                        // image.onload = function () {
                        //     imgElem.src = image.src;

                        //     card.loaded = true;

                        //     $scope.$apply();

                        //     console.log("Yew!");
                        // };

                        // // We still want to hide the loading message if the image fails to load - 404, 401 or network timeout etc
                        // image.onerror = function () {
                        //     console.log("Ooops");
                        // };

                    });

                })
                .catch(function (err) {
                    //$log.error(err);

                });
            // Rewrite with accounts preferences (from local) =====>
            /*
             $scope.$watchCollection('cards', function (newVal, oldVal) {
             if (newVal.length < MIN_CARDS) {
             cardsApi.getApiData()
             .then(function (result) {

             // console.log(JSON.stringify(result.data)); Shows log of API results

             $scope.cards.unshift(result.data);

             // console.log($scope.cards);

             })
             }
             });
             */
            $scope.cardDestroyed = function (index) {

                $scope.cards.splice(index, 1);

                if ($scope.temp.length > 0) {

                    while($scope.temp.length > 0 && $scope.cards.length < MIN_CARDS) {
                        $scope.cards.unshift($scope.temp[0]);
                        $scope.temp.splice(0, 1);
                    }

                    console.log('temp count: ' + $scope.temp.length);
                }

                fetchMoreIfNeeded();

            };

            function fetchMoreIfNeeded() {
                console.log('card count: ' + $scope.cards.length);
                if ($scope.temp.length < MIN_CACHE && !$scope.fetchInProgress) {
                    console.log("GETTING MORE");

                    $scope.fetchInProgress = true;
                    cardsApi.getApiData(CARDS_TO_GET_AT_ONCE)
                        .then(
                        function (result) {

                            console.log(JSON.stringify(result.data)); //Shows log of API results

                            $scope.accessTemp = true;

                            for (var i = 0; i < result.data.length; i++) {
                                $scope.temp.push(result.data[i]);
                            }

                            if ($scope.cards.length == 0) {
                                while($scope.temp.length > 0 && $scope.cards.length < MIN_CARDS) {
                                    $scope.cards.unshift($scope.temp[0]);
                                    $scope.temp.splice(0, 1);
                                }
                            }

                            $scope.fetchInProgress = false;

                        },
                        function (error) {
                            $scope.fetchInProgress = false;
                        }
                    )
                    //.catch(function (err) {
                    //    console.log(err);
                    //});
                }
            }
            /*
             $scope.addCard = function () {
             var newCard = $scope.cards[$scope.cards.length];
             //newCard.id = Math.random();
             $scope.cards.push(angular.extend({}, newCard));
             };
             */

            $scope.cardSwipedRight = function (card) {
                console.log('RIGHT');
                postRecordLikes(card);
            };

            var postRecordLikes = function (product_vari) {
                cardsApi.postRecordLikes(product_vari)
                    .then(function successCallback(product_vari) {

                    }, function errorCallback(response) {
                        console.log(response);
                    });
            };

            $scope.cardSwipedLeft = function (card) {
                console.log('LEFT');
                postRecordDislikes(card);
            };

            var postRecordDislikes = function (product_vari) {
                cardsApi.postRecordDislikes(product_vari)
                    .then(function successCallback(product_vari) {

                    }, function errorCallback(response) {
                        console.log(response);
                    });
            };

            $scope.cardevent = function(){
                //window.plugins.flurry.logEvent('CardClick');
            }

            // $ionicModal.fromTemplateUrl('../stores/stores.html', {
            //     scope: $scope,
            //     animation: 'slide-in-up'
            // }).then(function(modal){$scope.modal = modal;});

            // $scope.openModal = function(){$scope.modal.show();};

            // $scope.$on('modal.shown', function(){console.log('Modal is shown!');});

            // $scope.refineevent = function(index){
            //     $scope.openModal();
            //     console.log('dddd');
            // }

            $scope.refineevent = function(index){
                $state.go('stores');

                // $('#popup2').bPopup({
                //     easing: 'easeOutBack', //uses jQuery easing plugin
                //     speed: 100,
                //     transition: 'slideUp',
                //     content:'iframe',
                //     contentContainer:'.content',
                //     loadUrl:'../stores/stores.html'
                // });
            }

        }
    ])