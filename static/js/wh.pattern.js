 /**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function Pattern(data, ppqn) {
        this.trackCount = 0;
        this.tracks = [];
        this.init(data, ppqn);
    }

    Pattern.prototype = {
        
        /**
         * Initialise pattern.
         */
        init: function(data, ppqn) {
            this.trackCount = data.tracks.length;
            for(var i = 0; i < this.trackCount; i++) {
                this.tracks.push(WH.Track(data.tracks[i], i, ppqn));
            }
        }, 

        /**
         * Scan events within time range.
         * @param {Number} absoluteStart Absolute start tick in Transport playback time.
         * @param {Number} start Start of time range in ticks.
         * @param {Number} end End of time range in ticks.
         * @param {Array} playbackQueue Events that happen within the time range.
         */
        scanEvents: function (absoluteStart, start, end, playbackQueue) {
            // scan for events
            for (var i = 0; i < this.tracks.length; i++) {
                var events = this.tracks[i].scanEventsInTimeSpan(absoluteStart, start, end, playbackQueue);
            }
        }
    };

    /** 
     * Exports
     */
    WH.Pattern = function (data, ppqn) {
        return new Pattern(data, ppqn);
    };

})(WH);