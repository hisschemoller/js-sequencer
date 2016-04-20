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
            songPartIndex = 0,
            songPartEnd = 0,
            songPartNextIndex = 0,
            songPartNextStart = 0,

            /**
             * Clear all patterns.
             */
            clearData = function() {
                patterns.length = 0;
                song.length = 0;
            },

            /**
             * Change to another pattern.
             * @param {Number} index Index of pattern in patterns array.
             */
            changePattern = function(index) {
                patternIndex = index;
                WH.View.setSelectedPattern(index);
                WH.View.setSelectedSteps();
            };

        /**
         * Create an arrangement from a data object.
         * @param {Object} data Data object.
         */
        this.setData = function(data) {
            var i = 0,
                patternCount = WH.Conf.getPatternCount(),
                songLength = data.song.length,
                songPartData,
                songPartDuration = 0,
                songPartEnd = 0;

            clearData();

            // create the patterns
            for (i; i < patternCount; i++) {
                patterns.push(WH.Pattern(data.patterns[i]));
            }

            // create the song
            for (i = 0; i < songLength; i++) {
                songPartData = data.song[i];
                songPartData.absoluteStart = songPartEnd;
                songPartEnd += patterns[songPartData.patternIndex].getDuration() * songPartData.repeats;
                songPartData.absoluteEnd = songPartEnd;
                song.push(WH.SongPart(songPartData));
            }

            changePattern(0);
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
            for (i = 0; i < songLength; i++) {
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

            if (isSongMode) {

                // check if there's a current song part
                if (songPartIndex >= 0 && songPartIndex < song.length) {
                    // check if the current part ends during this time range
                    if ((songPartEnd < end) && (start <= songPartEnd)) {
                        // the current part ends during this time range
                        // scan the current part's pattern until the part's end
                        patterns[patternIndex].scanEvents(start, songPartEnd, playbackQueue);
                        // check if there's a next song part
                        if (songPartNextIndex >= song.length) {
                            // the song ends here
                            this.toggleSongMode();
                            WH.TimeBase.pause();
                            WH.TimeBase.rewind();
                        } else {
                            // there's a next song part to play, do nothing
                        }
                    } else {
                        // the current part doesn't end during this time range
                        // just play on
                        patterns[patternIndex].scanEvents(start, end, playbackQueue);
                    }
                } else {
                    // there's no current song part, do nothing
                }

                // check if there's a next song part
                if (songPartNextIndex < song.length) {
                    // check if a new part starts during this time range
                    if ((start <= songPartNextStart) && (songPartNextStart < end)) {
                        // a new song part starts during this time span
                        // update the song state
                        songPartIndex = songPartNextIndex;
                        songPartEnd = song[songPartIndex].getEnd();
                        songPartNextIndex++;
                        if (songPartNextIndex < song.length) {
                            songPartNextStart = song[songPartNextIndex].getStart();
                        } else {
                            songPartNextStart = null;
                        }
                        changePattern(song[songPartIndex].getPatternIndex());
                        // scan the first bit of the new song part
                        patterns[patternIndex].scanEvents(song[songPartIndex].getStart(), end, playbackQueue);
                    } else {
                        // no new song part starts during this time span, do nothing
                    }
                } else {
                    // there's no next song part, do nothing
                }
            } else {
                // pattern mode
                // scan current pattern for events
                patterns[patternIndex].scanEvents(start, end, playbackQueue);
            }
        };

        /**
         * Enter or leave song mode.
         */
        this.toggleSongMode = function() {

            if (!song.length) {
                WH.DialogView({
                    type: 'alert',
                    headerText: 'No song',
                    bodyText: 'There\'s no song yet to play. Please first create a song.'
                });
                return;
            }

            isSongMode = !isSongMode;
            WH.View.updateSongMode(isSongMode);

            if (isSongMode) {
                WH.TimeBase.pause();
                WH.TimeBase.rewind();
                songPartIndex = 0;
                songPartEnd = song[songPartIndex].getEnd();
                songPartNextIndex = 0;
                songPartNextStart = song[songPartNextIndex].getStart();
            } else {

            }
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
