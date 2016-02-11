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
     * @param {Number} ppqn Parts Per Quarter Note, the smallest sequencer time unit.
     */
    function Pattern(data, ppqn) {

        var trackCount = 0,
            tracks = [],

            /**
             * Initialise pattern.
             */
            init = function(data, ppqn) {
                trackCount = data.tracks.length;
                for (var i = 0; i < trackCount; i++) {
                    tracks.push(WH.Track(data.tracks[i], i, ppqn));
                }
            };
        
        /**
         * Scan events within time range.
         * @param {Number} absoluteStart Absolute start tick in Transport playback time.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        this.scanEvents = function (absoluteStart, start, end, playbackQueue) {
            // scan for events
            for (var i = 0; i < tracks.length; i++) {
                var events = tracks[i].scanEventsInTimeSpan(absoluteStart, start, end, playbackQueue);
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

        init(data, ppqn);
    }

    /** 
     * Exports
     */
    WH.Pattern = function (data, ppqn) {
        return new Pattern(data, ppqn);
    };

})(WH);