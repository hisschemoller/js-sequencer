/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
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
                    step;
                for (var i = 0; i < this._playbackQueue.length; i++) {
                    step = this._playbackQueue[i];
                    start = this._absOrigin + this.tick2sec(step.start);
                    step.setAbsStart( start );
                    step.setAbsEnd( start + this.tick2sec(step.dur) );
                }

                // play the events with sound generating plugin instruments
                WH.Studio.playEvents(this._playbackQueue);
            }
        }
    };
    
    /** 
     * Singleton
     */
    WH.TimeBase = new TimeBase(120);
})(WH);
