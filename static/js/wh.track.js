/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function Track(data, channelIndex) {
        this.stepCount = 16;
        this.steps = [];
        this.size = 0; // unused?
        this.lengthInTicks = 4 * 480;
        this.init(data, channelIndex);
    };

    Track.prototype = {
        
        /**
         * Initialise empty pattern.
         */
        init: function(data, channel) {
            var stepData;
            for(var i = 0; i < this.stepCount; i++) {
                stepData = data.steps[i];
                this.push(WH.Step(stepData.pitch, stepData.velocity, i * 120, stepData.duration, channel));
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
            this.size++;
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
        }
    };

    /** 
     * Exports
     */
    WH.Track = function (data, channelIndex) {
        return new Track(data, channelIndex);
    };

})(WH);
