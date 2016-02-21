/**
 * TimeBase provides timing for the app. It extends Transport.
 * 
 * TIMEBASE INFO
 * WX.now               Time since audio context stream started. Current audio context time in seconds, see waax.extension.js.
 * this._now            Transport playhead position in seconds.
 * this._absOrigin      Transport start time since WX.now in seconds.
 * this._absLastNow     Time  since audio context stream started
 * Step.start           Step start time within its track in ticks.
 * Step.dur             Step duration in ticks.
 * Step.absStart        Step start time since audio stream start in seconds.
 *
 *  stream                             playback
 *  started                            started           now
 *   |                                  |                 |
 *   |----------------------------------|-------//--------|
 *
 *   |-------------------- WX.now --------------//--------|
 *   
 *                                      |--- this._now ---|
 *
 *   |--------- this._absOrigin --------|
 *                                    
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Number} bpm Beats Per Minute.
     */
    function TimeBase(bpm) {
        Transport.apply(this, arguments);
    }

    /**
     * The WAAX Transport is extended to deal with a Project object.
     * @type {Transport}
     */
    TimeBase.prototype = Transport.prototype;
    TimeBase.prototype.constructor = TimeBase;

    /**
     * Scan events in time range and advance playhead in each pattern.
     */
    TimeBase.prototype._scheduleNotesInScanRange = function () {
        if (this._needsScan) {
            this._needsScan = false;

            // fill _playbackQueue with project arrangement events 
            WH.Project.scanEvents(this.sec2tick(this._scanStart), this.sec2tick(this._scanEnd), this._playbackQueue);

            if (this._playbackQueue.length) {
                // adjust event timing
                var start, 
                    step,
                    i = 0;
                for (i; i < this._playbackQueue.length; i++) {
                    step = this._playbackQueue[i];
                    start = this._absOrigin + this.tick2sec(step.start);
                    step.setAbsStart( start );
                    step.setAbsEnd( start + this.tick2sec(step.duration) );
                }

                // play the events with sound generating plugin instruments
                WH.Studio.playEvents(this._playbackQueue);
                WH.View.onSequencerEvents(this._playbackQueue);
            }
        }
    };

    /**
     * Toggle between stop and play
     * @return {Boolean} True if transport is running.
     */
    TimeBase.prototype.togglePlayStop = function() {
        if (WH.TimeBase.isRunning()) {
            WH.TimeBase.pause();
            WH.TimeBase.rewind();
        } else {
            WH.TimeBase.start();
        }
        return WH.TimeBase.isRunning();
    }

    /**
     * Get Pulses Per Quarter Note.
     * @return {number} Pulses Per Quarter Note.
     */
    TimeBase.prototype.getPPQN = function() {
        return _TICKS_PER_BEAT;
    };
    
    /** 
     * Singleton
     */
    WH.TimeBase = new TimeBase(120);
})(WH);
