/**
 * Pattern contains a track for each channel.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Object} data Pattern setup data.
     */
    function Pattern(data) {

        var trackCount = 0,
            tracks = [],
            lengthInTicks,

            /**
             * Initialise pattern.
             */
            init = function(data) {
                trackCount = data.tracks.length;
                lengthInTicks = WH.Conf.getPPQN() * WH.Conf.getPatternDurationInBeats();
                for (var i = 0; i < trackCount; i++) {
                    tracks.push(WH.Track(data.tracks[i], i));
                }
            };

        /**
         * Scan events within time range.
         * @param {Number} absoluteStart Absolute start tick in Transport playback time.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        this.scanEvents = function (start, end, playbackQueue) {

            // convert transport time to song time
            var localStart = start % lengthInTicks;
            var localEnd = localStart + (end - start);

            // scan for events
            for (var i = 0; i < tracks.length; i++) {
                var events = tracks[i].scanEventsInTimeSpan(start, localStart, localEnd, playbackQueue);
            }
        };

        /**
         * Get steps of the track at index.
         * @param  {Number} index Track index.
         * @return {Array}  Array of Step objects.
         */
        this.getTrackSteps = function(index) {
            return tracks[index].getSteps();
        };

        /**
         * Get the duration of this pattern.
         * @return {Number}  Duration of this pattern in ticks.
         */
        this.getDuration = function() {
            return lengthInTicks;
        };

        /**
         * Get all settings that should be saved with a project.
         * @return {Array} Array of objects with all data per channel and rack.
         */
        this.getData = function() {
            var patternData = {
                    tracks: []
                },
                i = 0;

            for (i; i < trackCount; i++) {
                patternData.tracks.push(tracks[i].getData());
            }

            return patternData;
        };

        init(data);
    }

    /**
     * Exports
     */
    WH.Pattern = function (data) {
        return new Pattern(data);
    };

})(WH);
