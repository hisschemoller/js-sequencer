/**
 * A Track contains 16 Steps with playback data.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {object} data Track setup data.
     * @param {Number} channel Channel (and instrument) on which this note is played.
     * @param {Number} ppqn Parts Per Quarter Note, the smallest sequencer time unit.
     */
    function Track(data, channel, ppqn) {
        this.steps = [];
        this.lengthInTicks = 4 * ppqn;
        this.init(data, channel);
    };

    Track.prototype = {
        
        /**
         * Initialise empty pattern.
         * @param {object} data Track setup data.
         * @param {Number} channel Channel (and instrument) on which this note is played.
         */
        init: function(data, channel) {
            var d, 
                n = data.steps.length;
            for(var i = 0; i < n; i++) {
                d = data.steps[i];
                this.push( WH.Step(d.pitch, d.velocity, d.start, d.duration, channel, i) );
            }
        },

        /**
         * Add an event to the pattern.
         * @param {Step} Step object.
         * @return {String} ID of the event.
         */
        push: function (step) {
            var id = WH.getUid4();
            while (this.steps.hasOwnProperty(id)) {
                id = WH.getUid4();
            }
            this.steps[id] = step;
            return id;
        }, 

        /**
         * Find events to be played within a time span
         * If the pattern is shorter than the sequence, the pattern will loop.
         * 
         * @param {Number} absoluteStart Absolute start ticks in Transport playback time.
         * @param {Number} start Start time in ticks.
         * @param {Number} end End time in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        scanEventsInTimeSpan: function (absoluteStart, start, end, playbackQueue) {

            // convert pattern time to track time
            var localStart = start % this.lengthInTicks;
            var localEnd = localStart + (end - start);

            // if the track restarts within the current time span, 
            // scan the bit at the start of the next loop as well
            var secondEnd = 0;
            if(localEnd > this.lengthInTicks) {
                var secondStart = 0;
                secondEnd = localEnd - this.lengthInTicks;
            }

            // get the events
            for (var id in this.steps) {
                var step = this.steps[id];
                if (step) {
                    if (localStart <= step.start && step.start <= localEnd) {
                        // add new step with time relative to time span
                        playbackQueue.push(step.cloneWithChangedStart(absoluteStart + (step.start - localStart)));
                    }
                    if(secondEnd && secondStart <= step.start && step.start <= secondEnd) {
                        // add new event with time relative to time span
                        playbackQueue.push(step.cloneWithChangedStart(absoluteStart + (step.start - secondStart)));
                    }
                }
            }
        },

        /**
         * Get steps array.
         * @return {Array}  Array of Step objects.
         */
        getSteps: function() {
            return this.steps;
        }
    };

    /** 
     * Exports
     */
    WH.Track = function (data, channel, ppqn) {
        return new Track(data, channel, ppqn);
    };

})(WH);
