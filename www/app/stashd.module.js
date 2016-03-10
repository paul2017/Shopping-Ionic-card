'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in cards.html)
// the 2nd parameter is an array of 'requires'
angular.module('stashd', [

    //Dependency modules
    'ionic',
    'ngRoute',
    'ionic.contrib.ui.tinderCards',

    //App modules
    'stashd.routes',
    'stashd.cards',
    'stashd.mainNav',
    'stashd.login',
    'stashd.wardrobes',
    'stashd.stylists',
    'stashd.products',
    'stashd.stores',
    'stashd.storeshop',
    'stashd.stylistshop',
    'stashd.cardstest',
    'stashd.buynow',
    'stashd.logout',
    'ionic-native-transitions',

    // 'ionic-native-transitions',
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //window.plugins.flurry.logEvent('Wardrobe Clicked');
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
      setInterval(function() {
    var img = new Image();
    img.src = "http://i.stack.imgur.com/GnAR9.png?s=128&g=1"
    img.onload=function(){$(img).fadeIn(500);}
    img.style.display="none";
    document.getElementById('parent').appendChild(img);
}, 500);
    }
  });
})

//.config(function($locationProvider) {
//    $locationProvider.html5Mode({
//        enabled: true,
//        requireBase: false
//    });
//})


//DISABLE BACK DRAG/SWIPES
.config(function($ionicConfigProvider) {
$ionicConfigProvider.views.swipeBackEnabled(false);
})

// Disable the default page transitions
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
})


.config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 400, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    })
});


