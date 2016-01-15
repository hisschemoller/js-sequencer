/**
 * @description Application entry point.
 * @author Wouter Hisschemöller
 * @version 0.0.0
 */

/*
The structure of a project:
    a project has 1 song
        a song has a sequence of 16 patterns
    a project has 4 channels
        a channel has 1 instrument (to play the channels )
    a project has 16 patterns
        a pattern has 4 tracks (1 for each channel)
            a track has a duration (of 1 measure)
            a track has events (maximum 16 16th events in the measure)
            a track has note loop start and end
                        pitch loop start and end
                        velocity loop start and end
                        pLock 1 t/m 8 loop start and end

What an event needs:
    the regular MIDI note properties:
        type: type of event like NOTE_ON
        data1: pitch for type note
        data2: velocity for type note
        channel: to know which instrument to play
    the extra WX.Note properties:
        start: in ticks
        duration: in ticks
 */

'use strict';

/**
 * @namespace WH
 */
window.WH = window.WH || {};

/**
 * Application startup.
 */
$(function() {
    var overlay = $('#startup-overlay');
    /**
     * Application startup.
     */
    function startApp() {
        // remove the iOS audio startup overlay
        overlay.remove();
        // create the project
        var project = WH.Project();
        // remove the WX.Transport because we use WH.TimeBase
        WX.Transport = null;
        // add project to timeBase
        WH.TimeBase.setProject(project);

        WH.TimeBase.start();
        console.log('startApp project: ', project);
        // var osc = WX.SimpleOsc();
        // osc.to(WX.Master);
        // osc.noteOn(72, 64);
        // osc.noteOff(WX.now + 1);
    }

    /**
     * On iOS devices the audio stream can only be activated by a user generated event.
     * So for iOS an overlay is shown for the user to click.
     * @see https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     */
    function unlockIOSAudio() {
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
        setTimeout(function() {
            if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
                overlay.off('touchend', unlockIOSAudio);
                startApp();
            }
        }, 0);
    }
    // show click overlay on iOS devices
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        overlay.on('touchend', unlockIOSAudio).show();
    } else {
        startApp();
    }
});
