/**
 * Short impulse percussion.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createNoisePlugin(specs, my) {   

        var that,
            voices = [],
            channels = 1,
            noiseType,
            noiseCache,
            bufferSize,

            init = function() {
                bufferSize = my.core.getSampleRate() * (60 / my.transport.getBPM()) * 2;
                noiseCache = {
                    white: null,
                    pink: null,
                    brown: null
                };
            },

            /**
             * Create a buffer of white noise.
             * @return {object} AudioBuffer of white noise.
             */
            createWhiteNoise = function() {
                if (noiseCache.white) {
                    return noiseCache.white;
                }

                var buffer = my.core.createBuffer(channels, bufferSize, my.core.getSampleRate()),
                    bufferChannels = buffer.getChannelData(0),
                    i;

                for (i = 0; i < bufferSize; i++) {
                    bufferChannels[i] = Math.random() * 2 - 1;
                }

                noiseCache.white = buffer;

                return buffer;
            },

            /**
             * Create a buffer of pink noise.
             * @return {object} AudioBuffer of pink noise.
             */
            createPinkNoise = function() {
                if (noiseCache.pink) {
                    return noiseCache.pink;
                }

                var buffer = my.core.createBuffer(channels, bufferSize, my.core.getSampleRate()),
                    bufferChannels = buffer.getChannelData(0),
                    white, i, b0, b1, b2, b3, b4, b5, b6;

                b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
                for (i = 0; i < bufferSize; i++) {
                    white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    bufferChannels[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    bufferChannels[i] *= 0.11;
                    b6 = white * 0.115926;
                }

                noiseCache.pink = buffer;

                return buffer;
            },

            /**
             * Create a buffer of brown noise.
             * @return {object} AudioBuffer of brown noise.
             */
            createBrownNoise = function() {
                if (noiseCache.brown) {
                    return noiseCache.brown;
                }

                var buffer = my.core.createBuffer(channels, bufferSize, my.core.getSampleRate()),
                    bufferChannels = buffer.getChannelData(0),
                    i, white,
                    lastOut = 0.0;

                for (i = 0; i < bufferSize; i++) {
                    white = Math.random() * 2 - 1;
                    bufferChannels[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = bufferChannels[i];
                    bufferChannels[i] *= 3.5; // (roughly) compensate for gain
                }

                noiseCache.brown = buffer;

                return buffer;
            },

            /**
             * Create a voice that plays a single sound.
             * @param  {number} pitch    Note pitch as in MIDI.
             * @param  {number} velocity Note velocity as in MIDI.
             * @param  {number} time     Time to start play in ms.
             */
            createVoice = function(pitch, velocity, time) {
                var voice = {
                        bufferSource: my.core.createBufferSource(),
                        gain: my.core.createGain()
                    };

                if (voices[pitch]) {
                    noteOff(pitch);
                }

                voices[pitch] = voice;

                switch (noiseType) {
                    case 'white':
                        voice.bufferSource.buffer = createWhiteNoise();
                        break;
                    case 'pink':
                        voice.bufferSource.buffer = createPinkNoise();
                        break;
                    case 'brown':
                        voice.bufferSource.buffer = createBrownNoise();
                        break;
                }

                
                voice.bufferSource.to(voice.gain).to(my.output);
                voice.bufferSource.start(time);
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createVoice(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
                if (voices[pitch]) {
                    voices[pitch].bufferSource.stop(time);
                    voices[pitch] = null;
                }
            };

        my = my || {};
        my.name = 'noise';
        my.title = 'Noise';
        my.defaultPreset = {
            noisetype: 'white'
        };
        my.$noisetype = function(value, time, rampType) {
            noiseType = value;
        };
        
        that = WH.createGeneratorPlugin(specs, my);

        my.defineParams({
            noisetype: {
                type: 'itemized',
                name: 'Noise Type',
                default: 'white',
                model:  my.conf.getModel('noisetypes')
            }
        });

        init();
            
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['noise'] = {
        create: createNoisePlugin,
        type: 'generator'
    };

})(WH);
