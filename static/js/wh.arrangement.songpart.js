/**
 * SongPart is a
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Object} data
     * @param {Number} data.patternIndex Index of the pattern to play.
     * @param {Number} data.repeats Number of times the pattern is repeated.
     */
    function SongPart(data) {

        var patternIndex = data.patternIndex,
            repeats = data.repeats,
            absoluteStart = data.absoluteStart,
            absoluteEnd = data.absoluteEnd; // end tick of this part relative to song start

        /**
         * Get all settings that should be saved with a project.
         * @return {Object} Object with all songPart data to save.
         */
        this.getData = function() {
            return {
                patternIndex: patternIndex,
                repeats: repeats
            };
        };

        /**
         * Return the index of the pattern that this part plays.
         * @return {Number}
         */
        this.getPatternIndex = function() {
            return patternIndex;
        };

        /**
         * Return the number of times that this part repeats.
         * @return {Number}
         */
        this.getRepeats = function() {
            return repeats;
        };

        /**
         * Return the start tick of this part relative to song start
         * @return {Number}
         */
        this.getStart = function() {
            return absoluteStart;
        };

        /**
         * Return the end tick of this part relative to song start
         * @return {Number}
         */
        this.getEnd = function() {
            return absoluteEnd;
        };
    };

    /**
     * Exports
     */
    WH.SongPart = function (data) {
        return new SongPart(data);
    };

})(WH);
