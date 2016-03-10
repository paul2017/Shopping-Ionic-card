'use strict';


// use angular's idiomatic methods, you can just browserify that single library
//`browserify hello.js -o bundle.js`
//browserify looks at hello.js for calls to require() and bundles the source code into the bundle.js

angular.module('stashd.routes', ['ui.router'])


.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");
        //$location.path('/product').search('queryStringKey', value).search( ...);
        $stateProvider

            .state('login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'app/core/login/login.html'
                    }
                },
                controller: function ($ionicHistory, $scope) {
                    console.log('Clearing history!');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                }


            })
            //What does menuContent do?

            .state('cards', { url: '/cards',
                nativeTransitions: { "type": "slide", "direction": "down" },
                views: { 'menuContent': {
                templateUrl: 'app/components/cards/cards.html' } } ,
            })

            .state('cardstest', { url: '/cardstest',
                nativeTransitions: { "type": "slide", "direction": "down" },
                views: { 'menuContent': {
                    templateUrl: 'app/components/cardstest/cardstest.html' } } ,
            })

            .state('stores', {
                url: '/stores',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/stores/stores.html'
                    }
                }

            })

            .state('stylists', {
                url: '/stylists',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/stylists/stylists.html'
                    }
                }
            })

            .state('wardrobes', {
                 url: '/wardrobes',
                 views: {
                     'menuContent': {
                         templateUrl: 'app/components/wardrobes/wardrobes.html'
                     }
                 }
            })

            .state('buynow', {
                 url: '/buynow/:buynowlink',
                 views: {
                     'menuContent': {
                         templateUrl: 'app/components/buynow/buynow.html'
                     }
                 }
            })


            //.state('storeshop', {
            //    url: '/storeshop',
            //    views: {
            //        'menuContent': {
            //            templateUrl: 'app/components/storeshop/storeshop.html'
            //        }
            //    }
            //})

            //.state('product', {
            //    url: '/product/id/{productId:[0-9000000]}',
            //    views: {
            //        'menuContent': {
            //            templateUrl: 'app/components/product/product.html'
            //        }
            //    }
            //})

            .state('menusettings', {
                url: '/menusettings',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/menusettings/menusettings.html'
                    }
                }
            })

            .state('product', {
                url: '/product/:product_vari',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/product/product.html',
                        controller: ProductsCtrl
                    },
                },

                resolve: {
                    productsApi: productsApiProvider

                }
            })

            .state('storeshop', {
                url: '/storeshop/:store_id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/storeshop/storeshop.html',
                        controller: storeCardsCtrl
                        },
                    },
                    resolve: {
                        storecardsApi: storecardsApiProvider
                        }
            })

            .state('stylistshop', {
                url: '/stylistshop/:stylist_id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/components/stylistshop/stylistshop.html',
                        controller: stylistCardsCtrl
                    },
                },
                resolve: {
                    stylistcardsApi: stylistcardsApiProvider

                }
            })
    }
])

    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
    })

.directive('noScroll', function($document) {

    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {

            $document.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }

function ContentController($scope, $ionSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionSideMenuDelegate.toggleLeft();
  };
}

});