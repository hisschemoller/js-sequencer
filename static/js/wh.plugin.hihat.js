/**
 * Hihat plugin.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createHihatPlugin(specs, my) {
        
        var that,
            fundamental = 40,
            ratios = [2, 3, 4.16, 5.43, 6.79, 8.21],
            init = function() {
            },
            createHihatVoice = function(pitch, velocity, time) {
                var volume = velocity / 127;
                    gain = my.core.createGain(),
                    bandpass = my.core.createFilter(),
                    highpass = my.core.createFilter(),
                    oscs = ratios.map(function(ratio) {
                        var osc = my.core.createOsc();
                        osc.type = 'square';
                        osc.frequency.value = fundamental * ratio;
                        osc.to(bandpass);
                        osc.start(time);
                        osc.stop(time + 0.15 +  + (Math.random() * 0.1));
                        return osc;
                    });
                
                bandpass.type = 'bandpass';
                bandpass.frequency.value = 9500 + (Math.random() * 1000);
                highpass.type = 'highpass';
                highpass.frequency.value = 6500 + (Math.random() * 1000);
                gain.gain.setValueAtTime(0.00001, time);
                gain.gain.exponentialRampToValueAtTime(volume, time + 0.02);
                gain.gain.exponentialRampToValueAtTime(volume / 3, time + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.25 + (Math.random() * 0.1));
            
                bandpass.to(highpass).to(gain).to(my.output);
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createHihatVoice(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
            };

        my = my || {};
        my.name = 'hihat';
        my.title = 'Hi Hat';
        my.defaultPreset = {
        };
        
        that = WH.createGeneratorPlugin(specs, my);
            
        init();
        
        my.defineParams({
        });
            
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['hihat'] = {
        create: createHihatPlugin,
        type: 'generator'
    };

})(WH);
