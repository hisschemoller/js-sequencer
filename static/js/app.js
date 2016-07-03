/**
 * @description Application entry point.
 * @author Wouter Hisschemöller
 * @version 0.0.0
 */

'use strict';

/**
 * Application startup.
 */
$(function() {

    var overlay = $('#overlay-startup');

    /**
     * Application startup.
     */
    function startApp() {
        // remove the iOS audio startup overlay
        overlay.remove();
        // remove WX.Transport because extended with WH.TimeBase
        WX.Transport = null;
        WH.View.setup();
        WH.studio.setup();
        if (!WH.file.loadFromStorage()) {
            WH.file.createNew();
        }
        
        // console.log('All properties in namespace WH:');
        // for (var prop in WH) {
        //     if (WH.hasOwnProperty(prop)) {
        //         console.log('- ', prop, ' - ', typeof prop);
        //     }
        // }
    }

    /**
     * On iOS devices the audio stream can only be activated by a user generated event.
     * So for iOS an overlay is shown for the user to click.
     * @see https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     */
    function unlockIOSAudio() {
        // remove event listener
        overlay.off('touchend', unlockIOSAudio);

        // create an empty buffer
        var buffer = WX._ctx.createBuffer(1, 1, 22050);
        var source = WX._ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(WX._ctx.destination);

        // play the empty buffer
        if (typeof source.start === 'undefined') {
            source.noteOn(0);
        } else {
            source.start(0);
        }

        // setup a timeout to check that we are unlocked on the next event loop
        var interval = setInterval(function() {
            if (WX.now > 0) {
                clearInterval(interval);
                startApp();
            }
        }, 100);
    }

    // show click overlay on iOS devices
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        overlay.on('touchend', unlockIOSAudio).show();
    } else {
        startApp();
    }
});
