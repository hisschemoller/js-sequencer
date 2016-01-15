/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    function Project(data) {
        this.beatsPerMinute = 0;
        this.secondsPerBeat = 0;
        this.oldBPM = 0;
        this.isSongMode = false;
        this.totalDurationInTicks = 4 * 480; // pattern length is 4 beats
        this.patterns = [];
        this.patternIndex = 0;
        this.patternCount = 16;
        if(data) {
            this.initFromData(data);
        } else {
            this.init();
        }
    }
    
    Project.prototype = {

        /**
         * [init description]
         */
        init: function() {
            // set default tempo
            this.setBPM(121);
            // set up empty patterns
            for(var i = 0; i < this.patternCount; i++) {
                this.patterns.push(WH.Pattern());
            }
        },

        /**
         * Scan events within time range.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        scanEvents: function (start, end, playbackQueue) {

            // convert transport time to song time
            var localStart = start % this.totalDurationInTicks;
            var localEnd = localStart + (end - start);
            
            // scan current pattern for events
            var events = this.patterns[this.patternIndex].scanEvents(start, localStart, localEnd, playbackQueue);

            // // test if sequences change
            // var n = this.sequences.length;
            // for(var i = 0; i < n; i++) {
            //     var startBeat = this.sequences[i].getStartBeat();
            //     if (localStart <= startBeat && startBeat <= localEnd) {
            //         // add all-notes-off-on-every-channel event at end of sequence
            //         this.addScannedSongEvent(start + (startBeat - localStart));
            //         // next sequence index
            //         this.sequenceIndex++;
            //     }
            // }

            // // test if song ends
            // if (localStart <= this.songLength && this.songLength <= localEnd) {
            //     // add all-notes-off-on-every-channel event at end of sequence
            //     this.addScannedSongEvent(start + (this.songLength - localStart));
            //     // update scan range for restart of song
            //     localStart -= this.songLength;
            //     localEnd -= this.songLength;
            //     // loop back to to first sequence
            //     this.sequenceIndex = 0;
            // }
            
            // if(this.songEvents.length) {
            //     // scan patterns in current sequence for events
            //     if(this.sequenceIndex >= 0 && this.sequenceIndex < this.sequences.length) {
            //         var events = this.sequences[this.sequenceIndex].scanEvents(start, localStart, localEnd, playbackQueue);
            //     }
            // }
        }, 

        /**
         * Getter for BPM.
         * @return {Number} Song tempo in Beats Per Minute.
         */
        getBPM: function() {
            return this.beatsPerMinute;
        },

        /**
         * Set BPM and update related variables.
         * @param {Number} Project tempo in Beats Per Minute.
         * @return {Number} Factor by which the playback speed has changed.
         */
        setBPM: function(beatsPerMinute) {
            console.log('setBPM: ', beatsPerMinute);
            var factor = this.beatsPerMinute / beatsPerMinute;
            this.beatsPerMinute = beatsPerMinute;
            this.secondsPerBeat = 60 / this.beatsPerMinute;
            return factor;
        }
    };
    /** 
     * Exports
     */
    WH.Project = function (data) {
        return new Project(data);
    };
})(WH);
