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
    }
    
    Project.prototype = {

        /**
         * [init description]
         */
        init: function(data) {
            // set default tempo
            this.setBPM(data.bpm);
            WH.TimeBase.setBPM(data.bpm);
            // set up patterns
            this.patternCount = data.patterns.length;
            for(var i = 0; i < this.patternCount; i++) {
                this.patterns.push(WH.Pattern(data.patterns[i]));
            }
            // setup studio
            WH.Studio.setup(data.channels);
        },

        createNew: function() {
            this.init(this.getEmptyProject());
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
        }, 

        /**
         * [playEvents description]
         * @param  {[type]} playbackQueue [description]
         * @return {[type]}               [description]
         */
        playEvents: function(playbackQueue) {

        },

        /**
         * [getEmptyProject description]
         * @return {[type]} [description]
         */
        getEmptyProject: function() {
            var data = {
                bpm: 120,
                channels: [{
                    instrument: {
                        name: 'simpleosc'
                    }
                }], 
                patterns: []
            };

            for(var i = 0; i < 16; i++) {
                var pattern = {
                    tracks: []
                };
                data.patterns.push(pattern);
                for(var j = 0; j < 1; j++) {
                    var track = {
                        steps: []
                    };
                    pattern.tracks.push(track);
                    for(var k = 0; k < 16; k++) {
                        var step = {
                            channel: j,
                            pitch: 60 + k,
                            velocity: (Math.random() > 0.66 ? 100 : 0),
                            start: 0,
                            duration: 60
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
            console.log('setBPM: ', beatsPerMinute);
            var factor = this.beatsPerMinute / beatsPerMinute;
            this.beatsPerMinute = beatsPerMinute;
            this.secondsPerBeat = 60 / this.beatsPerMinute;
            return factor;
        }
    };
    
    /** 
     * Singleton
     */
    WH.Project = new Project();
})(WH);
