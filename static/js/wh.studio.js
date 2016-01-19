/**
 *  Studio contains the sound generating instruments.
 *  One instrument for each channel.
 *  Studio receives Step objects that trigger the instruments.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH, WX) {

    /**
     * @constructor
     */
    function Studio() {

        // private variables
        var instruments = [];

        /**
         * Add instuments and connect them to the output.
         * @param {object} data Studio setup data.
         */
        this.setup = function(data) {
            var instrument;
            for(var i = 0; i < data.length; i++) {

                switch(data[i].instrument.name) {
                    case 'simpleosc':
                        instrument = WX.SimpleOsc();
                        break;
                }
                
                if(instrument) {
                    instrument.to(WX.Master);
                    instruments.push(instrument);
                }
            }
        }

        /**
         * Add instuments and connect them to the output.
         * @param {Array} playbackQueue Array to collect Steps.
         */
        this.playEvents = function(playbackQueue) {
            var step,
                instrument;
            for (var i = 0; i < playbackQueue.length; i++) {
                step = playbackQueue[i];
                instrument = instruments[step.channel];
                instrument.noteOn(step.pitch, step.velocity, step.absStart);
                instrument.noteOff(step.pitch, step.velocity, step.absEnd);
            }
        }
    }
    
    Studio.prototype = {};
    
    /** 
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
