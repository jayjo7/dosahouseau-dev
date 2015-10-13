function openWindow(url, windowName, percent) {
    var w = 630, h = 440; // default sizes
    if (window.screen) {
        w = window.screen.availWidth * percent / 100;
        h = window.screen.availHeight * percent / 100;
    }

    var width       = 'width=' + w;
    var height      = 'height ='+h;
    var fullscreen  = 'fullscreen="no"';
    var location    = 'location="no';
    var menubar     = 'menubar="no"';
    var toolbar     = 'toolbar="no"';


    window.open(url,windowName, width + ' '+ height + ' '+ fullscreen + ' '+ location + ' ' + menubar +' ' + toolbar, false);
}

