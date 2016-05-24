/**
 * WH.transport provides timing for the app.
 * 
 * TIMEBASE INFO
 * WX.now               Time since audio context stream started. Current audio context time in seconds, see waax.extension.js.
 * this._now            Transport playhead position in seconds.
 * this._absOrigin      Transport start time since WX.now in seconds.
 * this._absLastNow     Time  since audio context stream started
 * Step.start           Step start time within its track in ticks.
 * Step.dur             Step duration in ticks.
 * Step.absStart        Step start time since audio stream start in seconds.
 *
 *  stream                             playback
 *  started                            started           now
 *   |                                  |                 |
 *   |----------------------------------|-------//--------|
 *
 *   |-------------------- WX.now --------------//--------|
 *   
 *                                      |--- this._now ---|
 *
 *   |--------- this._absOrigin --------|
 *                                    
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {
    
    /**
     * @description Creates a transport object.
     */
    function createTransport() {
        var that,
            playbackQueue,
            
            /**
             * 
             */
            flushPlaybackQueue = function() {
                playbackQueue.length = 0;
            },
            
            /**
             * Sets current playhead position by seconds (audioContext).
             * @param {number} seconds 
             */
            setPlayheadPosition = function() {
                
            };
        
        that = {};
        
        return that;
    }
    
    WH.transport = createTransport();

})(WH);
