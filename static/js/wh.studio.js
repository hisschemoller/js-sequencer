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
        var channels = [],

            /**
             * Plugin instruments used by the current project.
             * @type {Array}
             */
            instruments = [];

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
                        instrument = WX.SimpleOsc(data[i].instrument.preset);
                        break;
                }
                
                if(instrument) {
                    instrument.to(channels[i]);
                    instruments.push(instrument);

                    // refresh the instrument view with the instrument's controls
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
                if (step.velocity > 0) {
                    instrument = instruments[step.channel];
                    instrument.noteOn(step.pitch, step.velocity, step.absStart);
                    instrument.noteOff(step.absEnd);
                }
            }
        };

        /**
         * Get the instrument plugin at the specified channel index.
         * @param  {Number} channelIndex Channel index.
         * @return {Object}              WX.PlugIn Generator instrument.
         */
        this.getInstrument = function(channelIndex) {
            return instruments[channelIndex];
        };
    }
    
    Studio.prototype = {};
    
    /** 
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
