/**
 * Short impulse percussion.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createNoisePlugin(specs, my) {   

        var that,
            init = function() {
            },
            createVoice = function(pitch, velocity, time) {
                
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createVoice(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
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
            
        init();
        
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
