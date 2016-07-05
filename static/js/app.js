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

    

    /**
     * Application startup.
     */
    function startApp() {
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
    function unlockIOSAudio(core, overlay) {
        // event listener did its job
        overlay.removeEventListener('touchend', unlockIOSAudio);

        // create an empty buffer
        var buffer = core.createBuffer(1, 1, 22050);
        var source = core.createBufferSource();
        source.buffer = buffer;
        source.connect(core.getMainOut());

        // play the empty buffer
        if (typeof source.start === 'undefined') {
            source.noteOn(0);
        } else {
            source.start(0);
        }

        // setup a timeout to check that we are unlocked on the next event loop
        var interval = setInterval(function() {
            if (core.getNow() > 0) {
                clearInterval(interval);
                overlay.parentNode.removeChild(overlay);
                startApp();
            }
        }, 100);
    }

    // show click overlay on iOS devices
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        var el = document.getElementById('overlay-startup');
        el.addEventListener('touchend', function() {
            unlockIOSAudio(WH.core, this);
        });
        el.style.display = 'block';
    } else {
        startApp();
    }
});
