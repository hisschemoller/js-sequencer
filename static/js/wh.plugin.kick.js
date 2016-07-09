

(function (WH) {

    function createKickPlugin(specs, my) {

        var that,
            startFrequency,
            endFrequency,
            length,
            pitchDecay,
            init = function() {
                startFrequency = my.defaultPreset.startfreq;
                endFrequency = my.defaultPreset.endfreq;
                length = my.defaultPreset.length;
                pitchDecay = my.defaultPreset.pitchdecay;
            },
            createVoice = function(pitch, velocity, time) {
                var osc = specs.core.createOsc();
        		var env = specs.core.createGain();
        		osc.to(env).to(my.output);
        		osc.frequency.value = startFrequency;
        		osc.frequency.setValueAtTime(startFrequency, time);
        		osc.frequency.exponentialRampToValueAtTime(endFrequency, time + pitchDecay);
        		env.gain.value = 0.8;
        		env.gain.setValueAtTime(0.8, time);
        		env.gain.linearRampToValueAtTime(0.0, time + length);
        		osc.start(time);
        		osc.stop(time + length);
            }
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createVoice(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
            };

        my = my || {};
        my.name = 'kick'
        my.title = 'Kick';
        my.defaultPreset = {
            startfreq: 120,
            endfreq: 50,
            length: 0.2,
            pitchdecay: 0.1
        };
        my.$startfreq = function (value, time, rampType) {
            startFrequency = value;
        };
        my.$endfreq = function (value, time, rampType) {
            endFrequency = value;
        };
        my.$length = function (value, time, rampType) {
            length = value;
        };
        my.$pitchdecay = function (value, time, rampType) {
            pitchDecay = value;
        };
        
        that = WH.createGeneratorPlugin(specs, my);
            
        init();
        
        my.defineParams({
            startfreq: {
                type: 'generic',
                name: 'Start Freq',
                default: 120.0,
                min: 60.0,
                max: 200.0,
                unit: 'Hertz'
            },
            endfreq: {
                type: 'generic',
                name: 'End Freq',
                default: 50.0,
                min: 25.0,
                max: 200.0,
                unit: 'Hertz'
            },
            length: {
                type: 'generic',
                name: 'Length',
                default: 0.2,
                min: 0.01,
                max: 2.0,
                unit: 'sec.'
            },
            pitchdecay: {
                type: 'generic',
                name: 'Pitch Dec',
                default: 0.1,
                min: 0.01,
                max: 2.0,
                unit: 'sec.'
            }
        });
            
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['kick'] = {
        create: createKickPlugin,
        type: 'generator'
    };

})(WH);
