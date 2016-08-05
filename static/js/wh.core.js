
window.WH = window.WH || {};

(function (WH) {
    
    function createCore(specs) {
        var that = specs.that,
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
                        
            /**
             * Creates an instance of WA Oscillator node.
             * @return {AudioNode} WA Oscillator node.
             * @see  http://www.w3.org/TR/webaudio/#OscillatorNode
             */
            createOsc = function() {
                return ctx.createOscillator();
            }, 
            
            /**
             * Creates an instance of WA BufferSource node.
             * @return {AudioNode} WA BufferSource node.
             * @see  http://www.w3.org/TR/webaudio/#BufferSourceNode
             */
            createBufferSource = function() {
                return ctx.createBufferSource();
            },

            /**
             * Creates an instance of WA Buffer object.
             * @return {AudioNode} WA Buffer object.
             * @see  http://www.w3.org/TR/webaudio/#Buffer
             */
            createBuffer = function () {
                return ctx.createBuffer.apply(ctx, arguments);
            }, 
            
            /**
             * Creates an instance of WA Gain node.
             * @return {AudioNode} WA Gain node.
             * @see  http://www.w3.org/TR/webaudio/#GainNode
             */
            createGain = function() {
                return ctx.createGain();
            }, 
                        
            /**
             * Creates an instance of WA Panner node.
             * @return {AudioNode} WA Panner node.
             * @see  http://www.w3.org/TR/webaudio/#PannerNode
             */
            createPanner = function() {
                return ctx.createPanner();
            },
                        
            /**
             * Creates an instance of WA Panner node.
             * @return {AudioNode} WA Panner node.
             * @see  http://www.w3.org/TR/webaudio/#PannerNode
             */
            createStereoPanner = function() {
                return ctx.createStereoPanner();
            },
            
            /**
             * Creates an instance of WA Delay node.
             * @return {AudioNode} WA Delay node.
             * @see  http://www.w3.org/TR/webaudio/#DelayNode
             */
            createDelay = function() {
                return ctx.createDelay();
            };

            /**
             * Creates an instance of WA BiquadFilter node.
             * @return {AudioNode} WA BiquadFilter node.
             * @see  http://www.w3.org/TR/webaudio/#BiquadFilterNode
             */
            createFilter = function() {
                return ctx.createBiquadFilter();
            },
            
            /**
             * Creates an instance of WA DynamicCompressor node.
             * @return {AudioNode} WA DynamicsCompressor node.
             * @see  http://www.w3.org/TR/webaudio/#DynamicsCompressorNode
             */
            createCompressor = function() {
                return ctx.createDynamicsCompressor();
            };

            /**
             * Creates an instance of WA Convolver node.
             * @return {AudioNode} WA Convolver node.
             * @see  http://www.w3.org/TR/webaudio/#ConvolverNode
             */
            createConvolver = function() {
                return ctx.createConvolver();
            },
                        
            /**
             * Creates an instance of WA WaveShaper node.
             * @return {AudioNode} WA WaveShaper node.
             * @see  http://www.w3.org/TR/webaudio/#WaveShaperNode
             */
            createWaveShaper = function() {
                return ctx.createWaveShaper();
            },

            /**
             * Creates an instance of WA Analyzer node.
             * @return {AudioNode} WA Analyzer node.
             * @see  http://www.w3.org/TR/webaudio/#AnalyzerNode
             */
            createAnalyzer = function() {
                return ctx.createAnalyser();
            },
            
            /**
             * Creates an instance of WA PerodicWave object.
             * @return {AudioNode} WA PeriodicWave object.
             * @see  http://www.w3.org/TR/webaudio/#PeriodicWave
             */
            createPeriodicWave = function () {
                return ctx.createPeriodicWave.apply(ctx, arguments);
            },

            /**
             * Creates an instance of WA Splitter node.
             * @return {AudioNode} WA Splitter node.
             * @see  http://www.w3.org/TR/webaudio/#SplitterNode
             */
            createSplitter = function () {
                return ctx.createChannelSplitter.apply(ctx, arguments);
            },
            
            /**
             * Creates an instance of WA Merger node.
             * @return {AudioNode} WA Merger node.
             * @see  http://www.w3.org/TR/webaudio/#MergerNode
             */
            createMerger = function () {
                return ctx.createChannelMerger.apply(ctx, arguments);
            };
        
        createAudioContext();
        
        that.getNow = getNow;
        that.getMainOut = getMainOut;
        that.createOsc = createOsc;
        that.createBufferSource = createBufferSource;
        that.createBuffer = createBuffer;
        that.createGain = createGain;
        that.createPanner = createPanner;
        that.createStereoPanner = createStereoPanner;
        that.createDelay = createDelay;
        that.createFilter = createFilter;
        that.createCompressor = createCompressor;
        that.createConvolver = createConvolver;
        that.createWaveShaper = createWaveShaper;
        that.createAnalyzer = createAnalyzer;
        that.createPeriodicWave = createPeriodicWave;
        that.createSplitter = createSplitter;
        that.createMerger = createMerger;
        return that;
    }

    /**
     * Singleton
     */
    WH.createCore = createCore;
    
})(WH);
