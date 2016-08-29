/**
 * SongPart is a
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @description Create song part object.
     * @param {Object} specs
     * @param {Number} specs.patternIndex Index of the pattern to play.
     * @param {Number} specs.repeats Number of times the pattern is repeated.
     */
    function createSongPart(specs) {

        var that,
            trackCount = specs.trackCount,
            patternIndex = specs.patternIndex,
            repeats = specs.repeats,
            absoluteStart = specs.absoluteStart,
            absoluteEnd = specs.absoluteEnd, // end tick of this part relative to song start
            mutes = specs.mutes,

            init = function() {
                var i;
                if (!mutes) {
                    mutes = [];
                    for (i = 0; i < trackCount; i++) {
                        mutes.push(false);
                    }
                }
            },

            /**
             * Toggle the mute with the given index.
             * @param  {number} index Index of the mute to toggle.
             */
            toggleMute = function(index) {
                mutes[index] = !mutes[index];
            },

            /**
             * Get all settings that should be saved with a project.
             * @return {Object} Object with all songPart data to save.
             */
            getData = function() {
                return {
                    patternIndex: patternIndex,
                    repeats: repeats,
                    mutes: mutes
                };
            },

            /**
             * Return the index of the pattern that this part plays.
             * @return {Number}
             */
            getPatternIndex = function() {
                return patternIndex;
            },

            /**
             * Return the number of times that this part repeats.
             * @return {Number}
             */
            getRepeats = function() {
                return repeats;
            },

            /**
             * Return the start tick of this part relative to song start
             * @return {Number}
             */
            getStart = function() {
                return absoluteStart;
            },

            /**
             * Return the end tick of this part relative to song start
             * @return {Number}
             */
            getEnd = function() {
                return absoluteEnd;
            }, 

            /**
             * Return muted tracks in this part.
             * @return {array} Array of Booleans.
             */
            getMutes = function() {
                return mutes;
            },

            /**
             * Return object properties as a string.
             * @return {string} Info string.
             */
            getInfo = function() {
                return 'SongPart, index: ' + patternIndex + ', repeats: ' + repeats;
            };

        init();
        
        that = {};
        that.toggleMute = toggleMute;
        that.getData = getData;
        that.getPatternIndex = getPatternIndex;
        that.getRepeats = getRepeats;
        that.getStart = getStart;
        that.getEnd = getEnd;
        that.getMutes = getMutes;
        that.getInfo = getInfo;
        return that;
    };

    /**
     * Exports
     */
    WH.createSongPart = createSongPart;

})(WH);
