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

        /**
         * Initialisation.
         */
        this.setup = function() {
            for (var i = 0; i < WH.Settings.getTrackCount(); i++) {
                var channel = WX.Channel();
                channel.to(WX.Master);
                channels.push(channel);
                WH.View.setChannel(channel, i);
            }
        };

        /**
         * Add instuments and connect them to the output.
         * @param {object} data Studio setup data.
         */
        this.setProject = function(data) {
            var instrument,
                i = 0;

            for (i; i < data.length; i++) {

                switch (data[i].instrument.name) {
                    case 'simpleosc':
                        instrument = WX.SimpleOsc(data[i].instrument.preset);
                        break;
                }
                
                if (instrument) {
                    instrument.to(channels[i]);
                    instruments.push(instrument);
                }

                WH.View.setInstrument(instrument, i);

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
    }
    
    Studio.prototype = {};
    
    /** 
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
