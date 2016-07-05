
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
            
            getMainOut = function() {
                return ctx.destination;
            }, 
            
            createGain = function() {
                return ctx.createGain();
            }, 
            
            createOsc = function() {
                return ctx.createOscillator();
            }, 
            
            createPanner = function() {
                return ctx.createPanner();
            }, 
            
            createBufferSource = function() {
                return ctx.createBufferSource();
            };
        
        that = {};
        
        createAudioContext();
        
        that.getNow = getNow;
        that.getMainOut = getMainOut;
        that.createGain = createGain;
        that.createOsc = createOsc;
        that.createPanner = createPanner;
        return that;
    }

    /**
     * Singleton
     */
    WH.core = createCore();
    
})(WH);
