(function($) {

    var permitted = false, notification;

    function showNotification(icon, title, body) {
        if(!permitted) return;

        closeNotification();

        notification = new Notification(title, {
            icon: icon,
            body: body
        });

        setTimeout(closeNotification, 6000);
    }

    function closeNotification() {
        if(notification) {
            notification.close();
            notification = null;
        }
    }

    function initialize() {
        if(!Notification) return;

        if(Notification.permission == "default") {
            Notification.requestPermission(function(permission) {
                if(permission === "granted") {
                    permitted = true;
                }
            });
        } else if(Notification.permission == "granted") {
            permitted = true;
        }

        app.socket.on("notification", showNotification);
    }

    $(initialize);

})(jQuery);