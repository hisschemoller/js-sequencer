/**
 * Project.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    function createRandomizedProject() {

        // private variables
        var patternCount = WH.conf.getPatternCount(),
            trackCount = WH.conf.getTrackCount(),
            stepCount = WH.conf.getStepCount(),
            stepDuration = Math.floor( WH.conf.getPPQN() / WH.conf.getStepsPerBeat() ),
            pentatonicMinScale = [0, 3, 5, 6, 7, 10],
            data = {
                bpm: 115 + Math.floor(Math.random() * 5),
                racks: [],
                arrangement: {
                    patterns: [],
                    song: []
                }
            },

            init = function() {
                // create racks
                for (var i = 0; i < trackCount; i++) {
                    var rack = {
                        instrument: {
                            name: null,
                            preset: {}
                        },
                        channel: {
                            preset: {}
                        }
                    };
                    data.racks.push(rack);
                }

                // create all patterns and tracks and steps
                for (var i = 0; i < patternCount; i++) {
                    var pattern = {
                        tracks: []
                    };
                    data.arrangement.patterns.push(pattern);
                    for (var j = 0; j < trackCount; j++) {
                        var track = {
                            steps: []
                        };
                        pattern.tracks.push(track);
                        for(var k = 0; k < stepCount; k++) {
                            var step = {
                                channel: 0,
                                pitch: 0,
                                velocity: 0,
                                start: stepDuration * k,
                                duration: stepDuration / 2
                            };
                            track.steps.push(step);
                        }
                    }
                }
            },

            createRack0 = function() {
                var channel = 0,
                    rack = data.racks[channel];
                rack.instrument.name = 'WXS1';
                rack.instrument.preset = {
                    osc1type: 'sawtooth',
                    osc2type: 'square',
                    osc1gain: 0.8,
                    osc2gain: 0.8
                }
                rack.instrument.preset.osc1octave = 4.34;
                rack.instrument.preset.osc2detune = 45.1;
                rack.instrument.preset.ampSustain = 1.0;
                rack.instrument.preset.cutoff = 47.21;
                rack.instrument.preset.reso = 1.0;
                rack.instrument.preset.filterMod = 2.6;
                rack.instrument.preset.filterSustain = 1.0;
                rack.instrument.preset.output = 0.5;
                rack.channel.preset.pan = -0.1;
            },

            createPatterns0 = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        if (i == 0) {
                            if (j == 2) {
                                step = track.steps[j];
                                step.velocity = (Math.random() > 0.85) ? 120 : 100;
                                step.pitch = 48 + pentatonicMinScale[j % pentatonicMinScale.length];
                                step.duration = stepDuration * stepCount;
                            }
                        } else {
                            if (j == 2) {
                                step = track.steps[j];
                                step.velocity = (Math.random() > 0.85) ? 120 : 100;
                                step.pitch = 36 + (Math.random() * 24);
                                step.duration = stepDuration * stepCount;
                            }
                        }
                    }
                }
            },

            createRack1 = function() {
                var channel = 1,
                    rack = data.racks[channel];
                rack.instrument.name = 'WXS1';
                rack.instrument.preset = {
                    osc1type: 'sawtooth',
                    osc2type: 'sawtooth',
                    osc1gain: 0,
                    osc2gain: 0.8,
                    osc1octave: -5,
                    osc2detune: -59,
                    ampAttack: 0.01,
                    ampSustain: 1,
                    ampRelease: 0.01,
                    cutoff: 1000,
                    reso: 18,
                    filterMod: 5.5,
                    filterAttack: 0.01,
                    filterSustain: 1,
                    filterRelease: 0.01,
                    output: 1.0,
                    
                };
                rack.channel.preset.pan = 0.5;
            },

            createPatterns1 = function() {
                var channel = 1, channel0 = 0, track, track0, step, step0, i, j, stepIndex, pichShift;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track0 = data.arrangement.patterns[i].tracks[channel0];
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        // stepIndex = (Math.random() > 0.65) ? (stepCount + j - 1) % stepCount : j;
                        // step0 = track0.steps[stepIndex];
                        // pichShift = (Math.random() > 0.5) ? 7 : 3;
                        if (i > 3 && i < 8) {
                            step.velocity = (j % 4 === 0) ? 100 : 30;
                        } else if (i > 7 && i < 12) {
                            step.velocity = (j % 2 === 0) ? 100 : 0;
                        } else {
                            step.velocity = (j % 4 === 0) ? 100 : 0;
                        }
                        if (Math.random() < 0.1) {
                            step.velocity = 110;
                        }
                        step.pitch = 60;
                        if (Math.random() < 0.1) {
                            step.pitch = 20 + Math.floor(Math.random() * 80);
                        }
                        step.duration = stepDuration;
                        if (Math.random() < 0.05) {
                            step.duration = stepDuration * 4;
                        }
                    }
                }
            },

            createRack2 = function() {
                var channel = 2,
                    rack = data.racks[channel];
                rack.instrument.name = 'WXS1';
                rack.instrument.preset = {
                    osc1type: 'sawtooth',
                    osc2type: 'sawtooth',
                    osc1octave: -2,
                    osc2detune: -12,
                    osc1gain: 0.73,
                    osc2gain: 0.75,
                    ampAttack: 0.01,
                    ampDecay: 0.01,
                    ampRelease: 0.01,
                    cutoff: 81,
                    filterMod: 2,
                    filterAttack: 0.01,
                    filterDecay: 0.01,
                    filterRelease: 0.01,
                    output: 0.26
                };
                rack.channel.preset.pan = 0.1;
            },

            createPatterns2 = function() {
                var channel = 2, channel0 = 0, channel1 = 1, track, track0, track1, step, step0, i, j, stepIndex, pichShift, velocity;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track0 = data.arrangement.patterns[i].tracks[channel0];
                    track1 = data.arrangement.patterns[i].tracks[channel1];
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        step.pitch = 60;
                        step.velocity = 100;
                        // stepIndex = (Math.random() > 0.65) ? (stepCount + j - 1) % stepCount : j;
                        // step0 = track0.steps[j];
                        // step1 = track1.steps[j];
                        // velocity = (Math.random() > 0.65) ? 120 : 0;
                        // step.velocity = (step0.velocity || step1.velocity) ? 0 : velocity;
                        // pichShift = (Math.random() > 0.5) ? 7 : -2;
                        // step.pitch = 60 + pichShift;
                    }
                }
            },

            createRack3 = function() {
                var channel = 3,
                    rack = data.racks[channel];
                rack.instrument.name = 'WXS1';
                rack.instrument.preset = {
                    osc1type: 'square',
                    osc2type: 'sawtooth',
                    osc1octave: -0.6,
                    osc2detune: -2.06,
                    osc1gain: 0.8,
                    osc2gain: 0.8,
                    ampAttack: 0.01,
                    ampSustain: 1,
                    ampRelease: 0.02,
                    cutoff: 1440.0,
                    reso: 13.2,
                    filterMod: 0.3,
                    filterAttack: 0.06,
                    filterSustain: 1,
                    filterRelease: 0.01,
                    output: 0.93,
                    
                };
                rack.channel.preset.pan = 0.5;
            },

            createPatterns3 = function() {
                var channel = 3, track, step, i, j, velocity;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        // if (j == 0) {
                            step = track.steps[j];
                            velocity = (j % 2 == 0) ? 110 : 40;
                            switch (j) {
                                case 0:
                                case 1:
                                case 2:
                                // case 2:
                                    step.pitch = 48 + pentatonicMinScale[0];
                                    step.duration = stepDuration / 3;
                                    step.velocity = velocity;
                                    if (j === 2) {
                                        step.velocity = 20;
                                    }
                                    break;
                                // case 6:
                                //     step.pitch = 48 + pentatonicMinScale[2];
                                //     step.duration = stepDuration / 3;
                                //     break;
                                case 7:
                                    step.pitch = 48 - 12 + pentatonicMinScale[pentatonicMinScale.length - 1];
                                    step.duration = stepDuration / 3;
                                    step.velocity = velocity;
                                    break;
                                case 8:
                                    step.pitch = 48 + pentatonicMinScale[0];
                                    step.duration = stepDuration / 3;
                                    step.velocity = velocity;
                                    break;
                                case 10:
                                    step.pitch = 48 + pentatonicMinScale[0];
                                    step.duration = stepDuration / 3;
                                    step.velocity = 30;
                                    break;
                                // case 14:
                                //     step.pitch = 48 - 12 + pentatonicMinScale[pentatonicMinScale.length - 1];
                                //     step.duration = stepDuration / 3;
                                //     break;
                                // case 15:
                                //     step.pitch = 48 - 12 + pentatonicMinScale[pentatonicMinScale.length - 1];
                                //     step.duration = stepDuration / 3;
                                //     step.velocity = velocity;
                                //     break;
                                default: 
                                    break;
                            }
                        // }
                    }
                }
            },

            createSong = function() {
                for (var j = 0; j < 2; j++) {
                    for (var i = 0; i < 4; i++) {
                        data.arrangement.song.push({
                            patternIndex: i + 8,
                            repeats: 2
                        });
                    }
                }
            };

        init();
        createRack0();
        createPatterns0();
        createRack1();
        createPatterns1();
        createRack2();
        createPatterns2();
        createRack3();
        createPatterns3();
        createSong();

        return data;
    }

    /**
     * Exports
     */
    WH.createRandomizedProject = createRandomizedProject;
    
})(WH);
