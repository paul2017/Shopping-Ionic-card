// json data=
// [{"product__name":"Test ","product__pk":231},{"product__name":"Test2 ","product__pk":351}]

'use strict';
angular.module('stashd.buynowpage', [])

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


.controller('BuynowpageCtrl', ['$scope', '$state', function($scope, $state) {
    
}]);