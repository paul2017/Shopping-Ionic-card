'use strict';

angular.module('stashd.mainNav', [])

.directive('mainNav', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/core/main-nav/main-nav.html'
    }
});