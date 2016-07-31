/**
 * Synthesizer for chords.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createChord2Plugin(specs, my) {

        var that,
            startFrequency,
            fadeOutTime = 2.0,
            chordPitches = [0, 3, 7, 10, 12, 22],
            playingNow = [],
            filterSeq,
            filterMultiply = 1.0,
            lfoOsc,
            lfoGain,
            gain,
            
            init = function() {
                var sixteenthInSeconds = (60 / my.transport.getBPM()) / 4;
                filterSeq = [{
                        freq: 1500,
                        dur: sixteenthInSeconds
                    },{
                        freq: 1300,
                        dur: sixteenthInSeconds
                    },{
                        freq: 800,
                        dur: sixteenthInSeconds * 2
                    },{
                        freq: 1500,
                        dur: sixteenthInSeconds * 4
                    },{
                        freq: 1150,
                        dur: sixteenthInSeconds * 5
                    },{
                        freq: 1300,
                        dur: sixteenthInSeconds / 2
                    },{
                        freq: 1440,
                        dur: sixteenthInSeconds / 2
                    },{
                        freq: 600,
                        dur: sixteenthInSeconds * 2
                    },{
                        freq: 1200,
                        dur: sixteenthInSeconds / 2
                    }
                ];
                gain = my.core.createGain();
                gain.to(my.output);
                lfoOsc = my.core.createOsc();
                lfoOsc.type = 'sine';
                lfoOsc.frequency.value = 4;
                lfoGain = my.core.createGain();
                lfoGain.gain.value = 1.0;
                lfoOsc.to(lfoGain).to(gain.gain);
                lfoOsc.start();
            },
            createChordVoices = function(pitch, velocity, time) {
                var now = my.output.context.currentTime,
                    i, t, 
                    filterIndex,
                    filterFreq,
                    numVoices = chordPitches.length,
                    chord = {
                        pitch: pitch,
                        voices: [],
                        filter: specs.core.createFilter()
                    };
                    
                chord.filter.type.value = 'lowpass';
                chord.filter.Q.value = 15;
                chord.filter.to(gain);
                
                t = time;
                filterIndex = Math.floor(((velocity % 10) + 4) % filterSeq.length);
                filterFreq = filterSeq[filterIndex].freq * filterMultiply;
                chord.filter.frequency.setValueAtTime(filterFreq, time);
                t += filterSeq[filterIndex].dur;
                for (i = 1; i < filterSeq.length; i++) {
                    filterIndex = (filterIndex + 1) % filterSeq.length;
                    filterFreq = filterSeq[filterIndex].freq * filterMultiply;
                    chord.filter.frequency.exponentialRampToValueAtTime(filterFreq, t);
                    t += filterSeq[filterIndex].dur;
                }
                
                for (i = 0; i < numVoices; i++) {
                    voice = {
                        osc: my.core.createOsc(),
                        amp: my.core.createGain(),
                        panner: my.core.createStereoPanner()
                    };
                    voice.amp.gain.set(0, now, now);
                    voice.amp.gain.set((velocity / 127) / (16 + (Math.random() * 8)), now, [time, 0.5], 3);
                    voice.osc.type = 'triangle';
                    voice.osc.frequency.set(WH.mtof(pitch + chordPitches[i]), now, time, 0);
                    voice.panner.pan.value = 1 - (2 * (i / (numVoices - 1)));
                    voice.osc.to(voice.amp).to(voice.panner).to(chord.filter);
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
                    ampRelease = 0.05,
                    now = my.output.context.currentTime;
                // vary end time
                time += Math.floor(Math.random() * 0.005);
                 
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
        my.name = 'chord2';
        my.title = 'Chord Synth 2';
        my.defaultPreset = {
            filtermultiply: 1.0,
            lforate: 2.0,
            lfodepth: 0.5
        };
        my.$filtermultiply = function (value, time, rampType) {
            filterMultiply = value;
        };
        my.$lforate = function (value, time, rampType) {
            lfoOsc.frequency.set(value, lfoOsc.context.currentTime, time, rampType);
        };
        my.$lfodepth = function (value, time, rampType) {
            lfoGain.gain.set(value, lfoGain.context.currentTime, time, rampType);
        };
        
        that = WH.createGeneratorPlugin(specs, my);
            
        init();
        
        my.defineParams({
            filtermultiply: {
                type: 'generic',
                name: 'Filt Freq X',
                default: 1.0,
                min: 0.01,
                max: 8.0,
                unit: 'Multiplier'
            },
            lforate: {
                type: 'generic',
                name: 'LFO Rate',
                default: 1.0,
                min: 0.0,
                max: 20.0,
                unit: 'Hertz'
            },
            lfodepth: {
                type: 'generic',
                name: 'LFO Depth',
                default: 0.5,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
            }
        });
            
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['chord2'] = {
        create: createChord2Plugin,
        type: 'generator'
    };

})(WH);
