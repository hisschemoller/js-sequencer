
window.WH = window.WH || {};

(function (WH) {
    
    function createCore() {
        var that,
            ctx,
            
            /**
             * Create audio context.
             * Monkey patching and feature detection.
             */
            createAudioContext = function() {
                var webkitCtx = window.hasOwnProperty('webkitAudioContext'),
                    aCtx = window.hasOwnProperty('AudioContext');

                if (!webkitCtx && !aCtx) {
                    throw new Error('Error: Web Audio API is not supported on your browser.');
                } else {
                    if (webkitCtx && !aCtx) {
                        window.AudioContext = window.webkitAudioContext;
                    }
                }
                
                ctx = new AudioContext();
            },
            
            /**
             * Returns current audio context time.
             * @return {Number} Current audio context time in seconds.
             */
            getNow = function() {
                return ctx.currentTime;
            },

            /**
             * Returns current audio device sample rate.
             * @return {Number} Current sample rate.
             */
            getSampleRate = function() {
                return ctx.sampleRate;
            }, 
            
            getGain = function() {
                return ctx.createGain();
            }, 
            
            getOsc = function() {
                return ctx.createOscillator();
            }, 
            
            getPanner = function() {
                return ctx.createPanner();
            },
            
            getMasterOut = function() {
                return ctx.destination;
            };
        
        that = {};
        
        createAudioContext();
        
        that.getNow = getNow;
        that.getGain = getGain;
        that.getOsc = getOsc;
        that.getPanner = getPanner;
        that.getMasterOut = getMasterOut;
        return that;
    }

    /**
     * Singleton
     */
    WH.core = createCore();
    
})(WH);
