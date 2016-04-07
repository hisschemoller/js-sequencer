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
            repeats = data.repeats;

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
    };

    /**
     * Exports
     */
    WH.SongPart = function (data) {
        return new SongPart(data);
    };

})(WH);
