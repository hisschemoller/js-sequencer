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
        this.patternDurationInTicks; // pattern length is 4 beats
        this.patternDurationInBeats = 4;
        this.patterns = [];
        this.patternIndex = 0;
        this.patternCount = 16;
        this.trackCount = 1;
        this.stepCount = 16;
    }
    
    Project.prototype = {

        /**
         * [setup description]
         */
        setup: function(data) {
            
            var ppqn = WH.TimeBase.getPPQN();
            this.patternDurationInTicks = this.patternDurationInBeats * ppqn;

            var data = data || this.getEmptyProject();

            // setup timing
            this.setBPM(data.bpm);
            WH.TimeBase.setBPM(data.bpm);

            // setup patterns
            for(var i = 0; i < this.patternCount; i++) {
                this.patterns.push(WH.Pattern(data.patterns[i], ppqn));
            }

            // setup studio
            WH.Studio.setup(data.channels);
        },

        createNew: function() {
            this.setup();
        },

        /**
         * Scan events within time range.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        scanEvents: function (start, end, playbackQueue) {

            // convert transport time to song time
            var localStart = start % this.patternDurationInTicks;
            var localEnd = localStart + (end - start);
            
            // scan current pattern for events
            var events = this.patterns[this.patternIndex].scanEvents(start, localStart, localEnd, playbackQueue);
        },

        /**
         * [getEmptyProject description]
         * @return {[type]} [description]
         */
        getEmptyProject: function() {

            var ppqn = WH.TimeBase.getPPQN();
            var stepDuration = Math.floor( this.patternDurationInTicks / this.stepCount );  

            var data = {
                bpm: 120,
                channels: [{
                    instrument: {
                        name: 'simpleosc'
                    }
                }], 
                patterns: []
            };

            for(var i = 0; i < this.patternCount; i++) {
                var pattern = {
                    tracks: []
                };
                data.patterns.push(pattern);
                for(var j = 0; j < this.trackCount; j++) {
                    var track = {
                        steps: []
                    };
                    pattern.tracks.push(track);
                    for(var k = 0; k < this.stepCount; k++) {
                        var step = {
                            channel: j,
                            pitch: 60 + k,
                            velocity: (Math.random() > 0.66 ? 100 : 0),
                            start: stepDuration * k,
                            duration: Math.floor( stepDuration / 2 )
                        };
                        track.steps.push(step);
                    }
                }
            }
            return data;
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
            var factor = this.beatsPerMinute / beatsPerMinute;
            this.beatsPerMinute = beatsPerMinute;
            return factor;
        }
    };
    
    /** 
     * Singleton
     */
    WH.Project = new Project();
})(WH);
