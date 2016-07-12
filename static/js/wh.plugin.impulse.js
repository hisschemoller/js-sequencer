/**
 * Short impulse percussion.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createImpulsePlugin(specs, my) {   

        var that,
            init = function() {
            },
            createImpulseVoice = function(pitch, velocity, time) {
                var osc = my.core.createOsc(),
                    filter = my.core.createFilter();
                osc.type = 'sawtooth';
                osc.frequency.value = 20 + (Math.random() * 50);
                filter.type = 'lowpass';
                filter.Q.value = 20;
                filter.frequency.value = 1000 + (Math.random() * 10000);
                osc.to(filter).to(my.output);
                osc.start(time);
                osc.stop(time + (1 / osc.frequency.value));
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createImpulseVoice(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
            };

        my = my || {};
        my.name = 'impulse';
        my.title = 'Impulse Percussion';
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
    WH.plugins['impulse'] = {
        create: createImpulsePlugin,
        type: 'generator'
    };

})(WH);
