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
            fadeOutTime = 2.0,
            chordPitches = [-4, 0, 3, 7],
            playingNow = [],
            filterSeq,
            init = function() {
                var sixteenthInSeconds = (60 / my.transport.getBPM()) / 4;
                filterSeq = [{
                        freq: 100,
                        dur: sixteenthInSeconds
                    },{
                        freq: 10000,
                        dur: sixteenthInSeconds
                    },{
                        freq: 20,
                        dur: sixteenthInSeconds * 2
                    },{
                        freq: 4040,
                        dur: sixteenthInSeconds * 4
                    },{
                        freq: 150,
                        dur: sixteenthInSeconds * 5
                    },{
                        freq: 3000,
                        dur: sixteenthInSeconds / 2
                    },{
                        freq: 440,
                        dur: sixteenthInSeconds / 2
                    },{
                        freq: 600,
                        dur: sixteenthInSeconds * 2
                    },{
                        freq: 20,
                        dur: sixteenthInSeconds / 2
                    }
                ];
            },
            createChordVoices = function(pitch, velocity, time) {
                var now = my.output.context.currentTime,
                    i, t, 
                    filterIndex,
                    numVoices = chordPitches.length,
                    chord = {
                        pitch: pitch,
                        voices: [],
                        filter: specs.core.createFilter()
                    };
                    
                chord.filter.type.value = 'lowpass';
                chord.filter.Q.value = 15;
                chord.filter.to(my.output);
                
                t = time;
                filterIndex = Math.floor((velocity % 10) % filterSeq.length);
                chord.filter.frequency.setValueAtTime(filterSeq[filterIndex].freq, time);
                t += filterSeq[filterIndex].dur;
                for (i = 1; i < filterSeq.length; i++) {
                    filterIndex = (filterIndex + 1) % filterSeq.length;
                    chord.filter.frequency.exponentialRampToValueAtTime(filterSeq[filterIndex].freq, t);
                    t += filterSeq[filterIndex].dur;
                }
                
                for (i = 0; i < numVoices; i++) {
                    voice = {
                        osc: specs.core.createOsc(),
                        amp: specs.core.createGain()
                    };
                    voice.amp.gain.set(0, now, now);
                    voice.amp.gain.set((velocity / 127) / (16 + (Math.random() * 8)), now, [time, 0.005], 3);
                    voice.osc.type = 'square';
                    voice.osc.frequency.set(WH.mtof(pitch + chordPitches[i]), now, time, 0);
                    voice.osc.to(voice.amp).to(chord.filter);
                    voice.osc.start(time);
                    chord.voices.push(voice);
                }
                
                playingNow.push(chord);
            },
            endChord = function(pitch, time) {
                var i, j,
                    numPlayingChords = playingNow.length,
                    numVoicesInChord,
                    chord, voice,
                    ampRelease = Math.random() / 10,
                    now = my.output.context.currentTime;
                for (i = 0; i < numPlayingChords; i++) {
                    chord = playingNow[i];
                    if (pitch == chord.pitch) {
                        numVoicesInChord = chord.voices.length;
                        for (j = 0; j < numVoicesInChord; j++) {
                            voice = chord.voices[j];
                            voice.amp.gain.set(0.0, now, [time, ampRelease], 3);
                            voice.osc.stop(time + ampRelease + fadeOutTime);
                        }
                    }
                    playingNow.splice(i, 1);
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
