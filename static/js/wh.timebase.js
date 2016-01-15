/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    function TimeBase(bpm) {
        this.project;
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
            if (this.project) {
                // fill _playbackQueue with project arrangement events 
                this.project.scanEvents(this.sec2tick(this._scanStart), this.sec2tick(this._scanEnd), this._playbackQueue);
            }

            // send queued notes to target plug-ins and view
            if (this._playbackQueue.length > 0) {
                for (var i = 0; i < this._playbackQueue.length; i++) {
                    var note = this._playbackQueue[i],
                        start = this._absOrigin + this.tick2sec(note.start),
                        end = start + this.tick2sec(note.dur);
                    // console.log(note.channel, note.start);
                }
            }
        }
    };

    /**
     * Set the project to play.
     * @param {WH.Song} project Project object.
     */
    TimeBase.prototype.setProject = function (project) {
        // get tempo change factor if a current project is replaced
        var factor = this.project ? (this.project.getBPM() / project.getBPM()) : 1;
        // set project
        this.project = project;
        // update time references
        // this.setTempoChange(this.project.getBPM(), factor);
        this.setBPM(this.project.getBPM());
    };
    /** 
     * Singleton
     */
    WH.TimeBase = new TimeBase(120);
})(WH);
