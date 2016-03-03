/**
 * Arrangement holds all data of the current piece of music. 
 * In that way it's sort of a model for the app.
 * It can also provide the musical events that happen within a given timespan.
 * It will probably also keep state of song or pattern mode.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Object} data Arrangement data.
     */
    function Arrangement(data) {

        var isSongMode = false,
            patterns = [],
            patternIndex = 0;

        /**
         * Create an arrangement from a data object.
         * @param {Object} data Data object.
         */
        this.setData = function(data) {
            var i = 0,
                patternCount = WH.Conf.getPatternCount();

            for (i; i < patternCount; i++) {
                patterns.push(WH.Pattern(data[i]));
            }

            WH.View.setSelectedSteps();
        };

        /**
         * Get all settings that should be saved with a project.
         * @return {Array} Array of objects with all data per channel and rack.
         */
        this.getData = function() {
            var data = [],
                i = 0,
                n = WH.Conf.getPatternCount();

            for (i; i < n; i++) {
                data.push(patterns[i].getData());
            }

            return data;
        };

        /**
         * Scan events within time range.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        this.scanEvents = function (start, end, playbackQueue) {
            // scan current pattern for events
            var events = patterns[patternIndex].scanEvents(start, end, playbackQueue);
        };

        /**
         * Get steps of the track at index on the current pattern.
         * @param  {Number} index Track index.
         * @return {Array} Array of Step objects.
         */
        this.getTrackSteps = function(index) {
            if (patterns[patternIndex]) {
                return patterns[patternIndex].getTrackSteps(index);
            }
            return null;
        };
    }
    
    /** 
     * Singleton
     */
    WH.Arrangement = new Arrangement();
})(WH);
