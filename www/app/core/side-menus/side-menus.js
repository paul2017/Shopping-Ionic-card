'use strict';

angular.module('stashd.sideMenus', [])

.directive('sideMenuLeft', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/core/side-menus/side-menu-left.html'
    }
})

.directive('sideMenuRight', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/core/side-menus/side-menu-right.html'
    }

});