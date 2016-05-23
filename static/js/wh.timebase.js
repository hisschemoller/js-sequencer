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

        /**
         * Overridden start function.
         * Note that this function is not added to the prototype so
         * WX.Transport's start function can still be called.
         */
        this.start = function() {
            Transport.prototype.start.call(this);
            WH.View.updateTransportState(WH.TimeBase.isRunning());
        }

        /**
         * Overridden pause function.
         * Note that this function is not added to the prototype so
         * WX.Transport's pause function can still be called.
         */
        this.pause = function() {
            Transport.prototype.pause.call(this);
            WH.View.updateTransportState(WH.TimeBase.isRunning());
        }
    }

    /**
     * The WAAX Transport is extended to deal with an Arrangement object.
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

            // fill _playbackQueue with arrangement events 
            WH.Arrangement.scanEvents(this.sec2tick(this._scanStart), this.sec2tick(this._scanEnd), this._playbackQueue);

            if (this._playbackQueue.length) {
                // adjust event timing
                var start, 
                    step,
                    i = 0;
                for (i; i < this._playbackQueue.length; i++) {
                    step = this._playbackQueue[i];
                    start = this._absOrigin + this.tick2sec(step.getStart());
                    step.setAbsStart( start );
                    step.setAbsEnd( start + this.tick2sec(step.getDuration()) );
                }

                // play the events with sound generating plugin instruments
                WH.Studio.playEvents(this._playbackQueue);
                WH.View.onSequencerEvents(this._playbackQueue);
            }
        }
    };

    /**
     * Toggle between stop and play.
     */
    TimeBase.prototype.togglePlayStop = function() {
        if (WH.TimeBase.isRunning()) {
            WH.TimeBase.pause();
            WH.TimeBase.rewind();
        } else {
            WH.TimeBase.start();
        }
    }

    /**
     * Singleton
     */
    WH.TimeBase = new TimeBase(120);
})(WH);
