/**
 * Synthesizer for chords.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createChordPlugin(specs, my) {

        var that,
            startFrequency,
            chordPitches = [0, 3, 7, 10],
            current = [],
            voices = [],
            numVoices = 5,
            init = function() {
            },
            createChordVoices = function(pitch, velocity, time) {
                var now = my.output.context.currentTime,
                    i,
                    numVoices = chordPitches.length,
                    chord = {
                    pitch: pitch,
                    voices: []
                };
                
                for (i = 0; i < numVoices; i++) {
                    voice = {
                        osc: specs.core.createOsc(),
                        amp: specs.core.createGain()
                    };
                    voice.amp.gain.set(0, now, now);
                    voice.amp.gain.set(velocity / 127, now, [time, 0.005], 3);
                    voice.osc.frequency.set(WH.mtof(pitch + chordPitches[i]), now, time, 0);
                    voice.osc.to(voice.amp).to(my.output);
                    voice.osc.start(time);
                    chord.voices.push(voice);
                }
                
                current.push(chord);
            },
            endChord = function(pitch, time) {
                var i, j,
                    numPlayingChords = current.length,
                    numVoicesInChord,
                    chord, voice,
                    ampRelease = Math.random() / 10,
                    now = my.output.context.currentTime;
                for (i = 0; i < numPlayingChords; i++) {
                    chord = current[i];
                    if (pitch == chord.pitch) {
                        numVoicesInChord = chord.voices.length;
                        for (j = 0; j < numVoicesInChord; j++) {
                            voice = chord.voices[j];
                            voice.amp.gain.set(0.0, now, [time, ampRelease], 3);
                            voice.osc.stop(time + ampRelease + 2.0);
                            console.log('stop');
                        }
                    }
                    current.splice(i, 1);
                }
            },
            noteOn = function(pitch, velocity, time) {
                time = (time || specs.core.getNow());
                createChordVoices(pitch, velocity, time);
            },
            noteOff = function(pitch, time) {
                time = (time || specs.core.getNow());
                endChord(pitch, time);
            };

        my = my || {};
        my.name = 'chord';
        my.title = 'Chord Synth';
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
    WH.plugins['chord'] = {
        create: createChordPlugin,
        type: 'generator'
    };

})(WH);
