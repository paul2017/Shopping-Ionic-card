// json data=
// [{"product__name":"Test ","product__pk":231},{"product__name":"Test2 ","product__pk":351}]

'use strict';
angular.module('stashd.products', [])

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

function productsApiProvider($http, $stateParams) {


    var product_vari = $stateParams.product_vari;

    var getApiData = function () {
        return $http.get(BASE_URL + product_vari);
    };
    var BASE_URL = 'http://stashdapp-t51va1o0.cloudapp.net/api/detail/?variation=';

    return {
        getApiData: getApiData
    };

    var win      = $(window),
        fxel     = $('prodback'),
        eloffset = fxel.offset().top;

    win.scroll(function() {
        if (eloffset < win.scrollTop()) {
            fxel.addClass("fixed");
        } else {
            fxel.removeClass("fixed");
        }
    });

}


function ProductsCtrl($scope, $state, $stateParams, $ionicSlideBoxDelegate, $ionicModal, $log, productsApi, UserService) {
    console.debug("YO Products")
    // <======  Rewrite with accounts preferences
    $scope.imgs = [];
    productsApi.getApiData()
        .then(function (result) {
            console.log(JSON.stringify(result.data)) //Shows log of API incoming
            $scope.products = result.data[0];
            var imgtemp = result.data[0].image;
            $scope.imgs = imgtemp.split(',');
            console.log($scope.imgs.length);
            console.log($scope.imgs);

        })
        .catch(function (err) {
            $log.error(err);
        });

    //var sidebar = document.getElementById('sidebar');
    //Stickyfill.add(sidebar);



    $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){$scope.modal = modal;});

    $scope.openModal = function(){$scope.modal.show();};

    $scope.closeModal = function(){$scope.modal.hide();};


    $scope.$on('modal.shown', function(){console.log('Modal is shown!');});

    $scope.fullscreenfunc = function(){
        $scope.imageSrc = $('.imgurl:last').val();
        console.log($scope.imageSrc);
        $scope.openModal();
    }

    // $scope.fullscreenfunc = function(image){
    //     console.log(image);
    //     var imgurl = '#imageurl_' + image;
    //     $scope.imageSrc = $(imgurl).val();
    //     $scope.openModal();
    //     //$('.fullimg:last').pinchzoomer();
    //     $(function(){
    //         $('.fullscreen-image:last').ion-zoom();
    //     });
    // }


    $scope.buyevent = function(){
        //window.plugins.flurry.logEvent('BuyNow');
        var buylink = $('#buylink').val();
        console.log(buylink);
        $state.go('buynow', {buynowlink: buylink});
    }
    $scope.prostorevisit = function(){
        window.plugins.flurry.logEvent('ProductStoreVisit');
    }

    
}

// .controller('ProductsCtrl', function($scope, $log, productsApi, UserService) {
//     var sidebar = document.getElementById('sidebar');
//     Stickyfill.add(sidebar);
// }]);