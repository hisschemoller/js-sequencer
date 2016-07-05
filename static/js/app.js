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
        // create objects that will be the modules of the app
        var arrangement = {},
            conf = {},
            core = {},
            file = {},
            pluginManager = {},
            studio = {},
            transport = {};
        
        // create old style modules
        var view = WH.createView({
                arrangement: arrangement,
                conf: conf,
                core: core,
                file: file,
                transport: transport
            });
        
        // add functionality and inject dependencies
        WH.createArrangement({
            that: arrangement,
            conf: conf,
            transport: transport,
            view: view
        });
        WH.createConf({
            that: conf
        });
        WH.createCore({
            that: core
        });
        WH.createFile({
            that: file,
            arrangement: arrangement,
            studio: studio,
            transport: transport
        });
        WH.createPluginManager({
            that: pluginManager,
            conf: conf,
            core: core
        });
        WH.createStudio({
            that: studio,
            conf: conf,
            core: core,
            pluginManager: pluginManager,
            view: view
        });
        WH.createTransport({
            that: transport,
            arrangement: arrangement,
            core: core,
            studio: studio,
            view: view
        });
        
        view.setup();
        studio.setup();
        if (!file.loadFromStorage()) {
            file.createNew();
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
