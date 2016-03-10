var myPushNotification;

var server_url="http://localhost/push/yarn.php";
// result contains any message sent from the plugin call
function successHandler (result) {
   // alert('result = ' + result);

}
// result contains any error description text returned from the plugin call
function errorHandler (error) {
    //alert('error = ' + error);
}
window.shouldRotateToOrientation = function(degrees) {
    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";

  return true;
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        try
        {
            if(window.plugins && window.plugins.pushNotification){
                myPushNotification = window.plugins.pushNotification;
            }else{
                window.plugins = {};
                window.plugins.pushNotification = new PushNotification();
            }

            if(typeof window.device === 'undefined' || typeof device === 'undefined'){
                alert('Device plugin not found');
            }else{

                //Android register
                if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
                    myPushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            "senderID":"177754782124",
                            "ecb":"onNotification"
                        });

                    //Blackberry
                }else if(device.platform == 'blackberry10'){
                    myPushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            invokeTargetId : "replace_with_invoke_target_id",
                            appId: "replace_with_app_id",
                            ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                            ecb: "pushNotificationHandler",
                            simChangeCallback: replace_with_simChange_callback,
                            pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                            launchApplicationOnPush: true
                        });

                    //iPhone - iPad
                }else{
                    myPushNotification.register(
                        tokenHandler,
                        errorHandler,
                        {
                            "badge":"true",
                            "sound":"true",
                            "alert":"true",
                            "ecb":"onNotificationAPN"
                        });
                }

            }//End device plugin check.

        }catch(e){
            alert("Plugin of PushNotify niet beschikbaar\n" + e.message);
        }
    }
};

// Android and Amazon Fire OS onNotification
function onNotification(e) {

    switch( e.event )
    {

        case 'registered':
           // alert( "registered");

            if ( e.regid.length > 0 )
            {
                //Register our device

  
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                //console.log("regID = " + e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
              //  alert('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload

                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
               // var my_media = new Media("./ringtone.mp3");
                //my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {

                  //  alert('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {

                    //alert('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }
          

            /*alert('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            alert('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            alert('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');*/
            break;

        case 'error':
            alert('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

// iOS Notification Receive Handler

//iOS Notification receive event
function onNotificationAPN (event) {
    navigator.notification.alert(event.alert, receivehandler, "Notification","OK");
  //  myApp.alert(event.alert,"Notification");
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        myPushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }

}

// BlackBerry10

function pushNotificationHandler(pushpayload) {
    var contentType = pushpayload.headers["Content-Type"],
        id = pushpayload.id,
        data = pushpayload.data;//blob

    // If an acknowledgement of the push is required (that is, the push was sent as a confirmed push
    // - which is equivalent terminology to the push being sent with application level reliability),
    // then you must either accept the push or reject the push
    if (pushpayload.isAcknowledgeRequired) {
        // In our sample, we always accept the push, but situations might arise where an application
        // might want to reject the push (for example, after looking at the headers that came with the push
        // or the data of the push, we might decide that the push received did not match what we expected
        // and so we might want to reject it)
        pushpayload.acknowledge(true);
    }
}

function tokenHandler(result){
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
   
    $.ajax({
        url: server_url+"?token="+result,
        success: function(data){
          
        }
    });
    
    
}

//When HTML document is finished loading. Jquery should be available
function documentReady(){

}



app.initialize();
