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

            /**
             * Create a buffer of white noise.
             * @return {object} AudioBuffer of white noise.
             */
            createWhiteNoise = function() {
                var channels = 1,
                    sampleRate = my.core.getSampleRate(),
                    bufferSize = sampleRate * (60 / my.transport.getBPM()) * 2,
                    buffer = my.core.createBuffer(channels, bufferSize, sampleRate),
                    bufferChannels = buffer.getChannelData(0),
                    i;

                for (i = 0; i < bufferSize; i++) {
                    bufferChannels[i] = Math.random() * 2 - 1;
                }

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

                voice.bufferSource.buffer = createWhiteNoise();
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
            
        };
        
        that = WH.createGeneratorPlugin(specs, my);
        
        my.defineParams({
            noisetype: {
                type: 'itemized',
                name: 'Noise Type',
                default: 'white',
                model:  my.conf.getModel('noisetypes')
            },
        });
            
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
