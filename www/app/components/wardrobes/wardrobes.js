// json data=
// [{"product__name":"Test ","product__pk":231},{"product__name":"Test2 ","product__pk":351}]

'use strict';
angular.module('stashd.wardrobes', [])


.factory('wardrobesApi', ['$http',
    function($http) {
        var apiUrl = 'http://stashdapp-t51va1o0.cloudapp.net/api/wardrobe/?user=21&&page=1';
        var remove = JSON.stringify({uid:21, click:1, like:1, removed:1, imagecl:0, scroll:1, clickbuy:0});

        var getApiData = function() {
            return $http.get(apiUrl)
        };

        var postRecordremove = function (product_vari) {
            return $http.post('http://stashdapp-t51va1o0.cloudapp.net/api/item/' + product_vari + "/", remove);
        }

        return {
            getApiData: getApiData,
            postRecordremove: postRecordremove,
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

.controller('wardrobesCtrl', ['$scope', '$ionicLoading', '$timeout', '$log', 'wardrobesApi', 'UserService',
    function($scope, $ionicLoading, $timeout, $log, wardrobesApi, UserService) {

    // $scope.wardrobes = [];
    // angular.forEach(data.wardrobes, function(value, key) {
    //     $scope.wardrobes.data(value);
    // });

    $scope.isVisible = function(name){
        return true;// return false to hide this artist's albums
    };

    $scope.remove = function(wardrobe){
        window.plugins.flurry.logEvent('WardrobeProductDelete');
        $scope.wardrobes.splice($scope.wardrobes.indexOf(wardrobe), 1);
        postRecordremove(wardrobe.vari);
        console.log('removed');
    }

    $scope.warprovisit = function(){
        window.plugins.flurry.logEvent('WardrobeProductVisit');
    }

    var postRecordremove = function (product_vari) {
        wardrobesApi.postRecordremove(product_vari)
            .then(function successCallback(product_vari) {

            }, function errorCallback(response) {
                console.log(response);
            });
    };


    // <======  Rewrite with accounts preferences
            wardrobesApi.getApiData()
                .then(function (result) {
                    console.log(JSON.stringify(result.data)); //Shows log of API incoming
                    $scope.wardrobes = result.data;
                    console.log($scope.wardrobes);
                    window.plugins.flurry.logEvent('Wardrobe Visit');

                })
                .catch(function (err) {
                    $log.error(err);
                });


            $ionicLoading.show({
                content: 'Loading', 
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay:0
            });

            $(function(){
                $timeout(function(){

                    $ionicLoading.hide();

                    var num = 2;
                    while(num < 20)
                    {
                        $.ajax({
                            url:"http://stashdapp-t51va1o0.cloudapp.net/api/wardrobe/?user=21&&page="+num,
                            success: function(result){
                                
                                console.log(result);                                

                                //$timeout(function(){
                                    for(var i=0; i<10; i++)
                                    {
                                        var ward = result[i];                                      
                                        
                                        $("#walist>div").append("<ion-wardrobe class='wardrobe-thumbnail-right' ng-repeat='wardrobe in wardrobes'><ion-list class='disable-user-behavior' can-swipe='true' show-delete='false'><div class='list'><ion-item class='item item-avatar item-complex item-right-editable' native-options=\"{type: 'slide', direction:'up'}\" href='#/product/"+ward['vari']+"'><a class='item-content' ng-href='#/product/"+ward['vari']+"' href='#/product/"+ward['vari']+"'><img src='"+ward['image']+"'><h2 class='ng-binding'>"+ward['name']+"</h2><p class='ng-binding'>$"+ward['price']+"</p></a><div class='item-options invisible'><ion-option-button class='button-assertive button' ng-click='remove(wardrobe)'> Delete </ion-option-button></div></ion-item></div></ion-list></ion-wardrobe>");
                                    }
                                //}, 1000);
        

                                //$("#walist").append("<ion-wardrobe ng-repeat='wardrobe in wardrobess'  class='wardrobe-thumbnail-right'><ion-list show-delete='false' can-swipe='true'><ion-item href='#/product/{{wardrobe.vari}}' native-options=\"{type: 'slide', direction:'up'}\" class='item item-avatar'><img src='{{wardrobe.image}}'><h2>{{wardrobe.name}}</h2><p>${{wardrobe.price}}</p><ion-option-button class='button-assertive' ng-click='remove(wardrobe)'>Delete</ion-option-button></ion-item></ion-list></ion-wardrobe>");
                            }
                        });
                        num++;
                    }
                    
                }, 2000);
            
            });

    

}
]);

// for (var i = Things.length - 1; i >= 0; i--) {
//     item = data[i]
// };
