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
        var channels = [];
        var instruments = [];

        this.init = function() {
            for(var i = 0; i < 4; i++) {
                var channel = WX.Channel();
                channel.to(WX.Master);
                channels.push(channel);
            }
        };

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
                    instrument.to(channels[i]);
                    instruments.push(instrument);
                }

                channels[i].set('pan', data[i].pan);
            }
        };

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
                instrument.noteOff(step.absEnd);
            }
        };
    }
    
    Studio.prototype = {};
    
    /** 
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
