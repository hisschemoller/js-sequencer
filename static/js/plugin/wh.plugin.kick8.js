/**
 * 808 type kick drum.
 * From code by Joe Sullivan
 * http://joesul.li/van/
 * @see https://github.com/itsjoesullivan/kick-eight
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createKick8Plugin(specs, my) {

        var that,
        	voices = [],
        	noiseCache,

            /**
             * Create a buffer of white noise.
             * @param {number} sec Length of buffer in seconds.
             * @return {object} AudioBuffer of white noise.
             */
            createWhiteNoise = function(sec) {
                if (noiseCache) {
                    return noiseCache;
                }

                var channels = 1,
                	bufferSize = my.core.getSampleRate() * (60 / my.transport.getBPM()) * sec,
                	buffer = my.core.createBuffer(channels, bufferSize, my.core.getSampleRate()),
                    bufferChannels = buffer.getChannelData(0),
                    i;

                for (i = 0; i < bufferSize; i++) {
                    bufferChannels[i] = Math.random() * 2 - 1;
                }

                noiseCache = buffer;

                return buffer;
            },

            /**
             * Create an 808 kick drum voice.
             * @return {object} Voice public interface.
             */
            createVoice = function(pitch, velocity, time) {
            	var voice, osc, oscGain, choke, noise, noiseGain, noiseFilter;

            	var tone = 64;
            	var decay = 64;
            	var level = 100;
            	var max = 2.2;
    			var min = 0.09;
            	var duration = (max - min) * (decay / 127) + min;

            	osc = my.core.createOsc();
            	osc.frequency.value = 54;	
            	osc.frequency.setValueAtTime(54 + Math.random() * 100, time);
      			osc.frequency.exponentialRampToValueAtTime(32, time + duration);

				oscGain = my.core.createGain();
				oscGain.gain.setValueAtTime(0.0001, time);
      			oscGain.gain.exponentialRampToValueAtTime(1, time + 0.004);
      			oscGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

				choke = my.core.createGain();
				choke.gain.value = 0;
				choke.gain.setValueAtTime(0, time + 0.0001);
				choke.gain.linearRampToValueAtTime(1, time + 0.0002);

				noise = my.core.createBufferSource();
				noise.buffer = createWhiteNoise(1);
				noise.loop = true;

				noiseFilter = my.core.createFilter();
				noiseFilter.type = 'bandpass';
				noiseFilter.frequency.value = 1380 * 2;
				noiseFilter.Q.value = 20;

				noiseGain = my.core.createGain();
				noiseGain.gain.setValueAtTime(2 * Math.max((tone / 127), 0.0001), time);
				noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.01);

				osc.to(oscGain).to(choke);
				noise.to(noiseFilter).to(noiseGain).to(choke);
				choke.to(my.output);

				noise.start(time);
      			noise.stop(time + duration + 1.0);

				osc.start(time);
				osc.stop(time + duration + 1.0);
				// osc.onended = function() {
				// 	gain.disconnect();
				// }

				voice = {
					stop: function(time) {
						choke.gain.setValueAtTime(1, time);
						choke.gain.linearRampToValueAtTime(0, time + 1.0 + 0.0001);
					}
				};

				return voice;
            },

            /**
             * Stop all playing voices.
             */
            stopVoices = function(time) {
            	while (voices.length) {
					voices.pop().stop(time);
				}
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                stopVoices();
                voices.push(createVoice(pitch, velocity, time));
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
                stopVoices(time);
            };

        my = my || {};
        my.name = 'kick8';
        my.title = 'TR-808 Kick';
        my.defaultPreset = {
        };
        
        that = WH.createGeneratorPlugin(specs, my);
        
        my.defineParams({
        });
            
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['kick8'] = {
        create: createKick8Plugin,
        type: 'generator'
    };

})(WH);