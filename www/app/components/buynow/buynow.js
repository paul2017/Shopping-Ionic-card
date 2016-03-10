// json data=
// [{"product__name":"Test ","product__pk":231},{"product__name":"Test2 ","product__pk":351}]

'use strict';
angular.module('stashd.buynow', [])

.controller('buynowCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

    var buynowlink = $stateParams.buynowlink;
    console.log(buynowlink);
    //$scope.buynowlink = buynowlink;

    $('#myIFrame').attr('src', buynowlink);

    var h = window.innerHeight;
    var Height = (h - 60);
    $("#myIFrame").css("height", Height);
    $("#myIFrame").css("width", '100vw');
}]);