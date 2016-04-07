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

        var patterns = [],
            patternIndex = 0,
            isSongMode = false,
            song = [],
            songIndex = 0;

            /**
             * Clear all patterns.
             */
            clearData = function() {
                patterns.length = 0;
                song.length = 0;
            };

        /**
         * Create an arrangement from a data object.
         * @param {Object} data Data object.
         */
        this.setData = function(data) {
            var i = 0,
                patternCount = WH.Conf.getPatternCount(),
                songLength = data.song.length;

            clearData();

            // create the patterns
            for (i; i < patternCount; i++) {
                patterns.push(WH.Pattern(data.patterns[i]));
            }

            // create the song
            for (i = 0; i < songLength; i++) {
                song.push(WH.SongPart(data.song[i]));
            }

            WH.View.setSelectedPattern(0);
            WH.View.setSelectedSteps();
        };

        /**
         * Get all settings that should be saved with a project.
         * @return {Array} Array of objects with all data per channel and rack.
         */
        this.getData = function() {
            var data = {
                    patterns: [],
                    song: []
                },
                i = 0,
                patternCount = WH.Conf.getPatternCount(),
                songLength = song.length;

            // get pattern data
            for (i; i < patternCount; i++) {
                data.patterns.push(patterns[i].getData());
            }

            // get song data
            for (i; i < songLength; i++) {
                data.song.push(song[i].getData());
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
         * Enter or leave song mode.
         */
        this.toggleSongMode = function() {
            isSongMode = !isSongMode;
            WH.View.updateSongMode(isSongMode);
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

        /**
         * Set the selected pattern.
         * @param {Number} index Index of the element to set as selected.
         */
        this.setSelectedPattern = function(index) {
            patternIndex = Math.max(0, Math.min(index, WH.Conf.getPatternCount()));
            WH.View.setSelectedPattern(patternIndex);
            WH.View.setSelectedSteps();
        };
    }

    /**
     * Singleton
     */
    WH.Arrangement = new Arrangement();
})(WH);
