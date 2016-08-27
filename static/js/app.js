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
    function createApp() {
        // create objects that will be the modules of the app
        var appView = {},
            arrangement = {},
            channelSelectView = {},
            conf = {},
            controlBarView = {},
            parameterEditView = {},
            core = {},
            file = {},
            mixerView = {},
            patternSelectView = {},
            pluginManager = {},
            pubSub = {},
            rackView = {},
            songView = {},
            stepsView = {},
            studio = {},
            tabsView = {},
            tracksView = {},
            transport = {};
        
        // create old style modules
        var view = WH.createView({});
        
        // add functionality and inject dependencies
        WH.createAppView({
            that: appView,
            arrangement: arrangement,
            file: file,
            transport: transport
        });
        WH.createArrangement({
            that: arrangement,
            conf: conf,
            controlBarView: controlBarView,
            patternSelectView: patternSelectView,
            songView: songView,
            stepsView: stepsView,
            tracksView: tracksView,
            transport: transport
        });
        WH.createChannelSelectView({
            that: channelSelectView,
            conf: conf,
            rackView: rackView,
            stepsView: stepsView
        });
        WH.createConf({
            that: conf
        });
        WH.createControlBarView({
            that: controlBarView,
            arrangement: arrangement,
            file: file,
            transport: transport
        });
        WH.createCore({
            that: core
        });
        WH.createFile({
            that: file,
            arrangement: arrangement,
            conf: conf,
            studio: studio,
            transport: transport
        });
        WH.createParameterEditView({
            that: parameterEditView,
            pubSub: pubSub
        });
        WH.createPatternSelectView({
            that: patternSelectView,
            arrangement: arrangement,
            conf: conf
        });
        WH.createPluginManager({
            that: pluginManager,
            conf: conf,
            core: core,
            pubSub: pubSub,
            transport: transport
        });
        WH.createPluginRackView({
            that: mixerView,
            conf: conf,
            parameterEditView: parameterEditView,
            pubSub: pubSub,
            rootEl: $('.channels'),
            rackSlotContainerSel: '.channels'
        });
        WH.createPluginRackView({
            that: rackView,
            conf: conf,
            parameterEditView: parameterEditView,
            pubSub: pubSub,
            rootEl: $('.rack'),
            rackSlotContainerSel: '.rack__slot-list'
        });
        WH.createPubSub({
            that: pubSub
        });
        WH.createStepsView({
            that: stepsView,
            arrangement: arrangement,
            channelSelectView: channelSelectView,
            conf: conf
        });
        WH.createSongView({
            that: songView
        });
        WH.createStudio({
            that: studio,
            channelSelectView: channelSelectView,
            conf: conf,
            core: core,
            mixerView: mixerView,
            pluginManager: pluginManager,
            rackView: rackView,
            view: view
        });
        WH.createTabsView({
            that: tabsView,
            channelSelectView: channelSelectView,
            mixerView: mixerView,
            patternSelectView: patternSelectView,
            rackView: rackView,
            stepsView: stepsView,
            tracksView: tracksView,
            songView: songView,
        });
        WH.createTransport({
            that: transport,
            arrangement: arrangement,
            channelSelectView: channelSelectView,
            controlBarView: controlBarView,
            core: core,
            stepsView: stepsView,
            studio: studio
        });
        WH.createTracksView({
            that: tracksView,
            conf: conf
        });
        
        // app initialisation
        mixerView.setup();
        rackView.setup();
        stepsView.setup();
        channelSelectView.setup();
        studio.setup();
        tabsView.setSelectedTab(0);
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
                createApp();
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
        createApp();
    }
});
