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
                rack.instrument.name = 'SimpleOsc2';
                rack.instrument.preset = {
                    osc1Type: 'sine',
                    osc2Type: 'sine',
                    osc2Detune: 18.73,
                    lfoRate: 0.1,
                    lfoDepth: 57.36
                }
                rack.channel.preset = {
                    level: 0.15,
                    pan: -0.1
                }
            },

            createPatterns0 = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        if (i > 11 && i < 16) {
                            if (j == 2) {
                                step = track.steps[j];
                                step.velocity = (Math.random() > 0.85) ? 120 : 100;
                                step.pitch = (i > 13 ? 48 : 36) + pentatonicMinScale[j % pentatonicMinScale.length];
                                step.duration = stepDuration * 2;
                            }
                        } else if (i > 3 && i < 8) {
                            if (j % 3 == 1) {
                                step = track.steps[j];
                                step.velocity = (Math.random() > 0.85) ? 127 : 120;
                                step.pitch = 48 + pentatonicMinScale[0];
                                step.duration = stepDuration / 2;
                            }
                        } else if (i > 7 && i < 12) {
                                if (j % 5 == 1) {
                                    step = track.steps[j];
                                    step.velocity = (Math.random() > 0.85) ? 127 : 120;
                                    step.pitch = 48 + pentatonicMinScale[0];
                                    step.duration = stepDuration;
                                }
                        } else {
                            if (i == 0) {
                                if (j == 2) {
                                    step = track.steps[j];
                                    step.velocity = (Math.random() > 0.85) ? 70 : 50;
                                    step.pitch = 48 + pentatonicMinScale[j % pentatonicMinScale.length];
                                    step.duration = stepDuration * stepCount;
                                }
                            } else {
                                if (j == 2) {
                                    step = track.steps[j];
                                    step.velocity = (Math.random() > 0.85) ? 70 : 50;
                                    step.pitch = 36 + (Math.random() * 24);
                                    step.duration = stepDuration * stepCount;
                                }
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
                rack.channel.preset = {
                    level: 1.0,
                    pan: -0.5
                }
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
                        } else if (i > 11 && i < 16) {
                            step.velocity = (j % 4 == 0) ? 100 : 0;
                        } else {
                            step.velocity = (j % 4 === 0) ? 100 : 0;
                        }
                        if (Math.random() < 0.1) {
                            step.velocity = 110;
                        }
                        step.pitch = 60;
                        if (Math.random() < 0.15) {
                            step.pitch = 20 + Math.floor(Math.random() * 80);
                        }
                        step.duration = stepDuration;
                        if (Math.random() < 0.07) {
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
                    output: 0.3
                };
                rack.channel.preset = {
                    level: 0.5,
                    pan: 0.3
                }
            },

            createPatterns2 = function() {
                var channel = 2, channel0 = 0, channel1 = 1, track, track0, track1, step, step0, i, j, stepIndex, pichShift, velocity;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track0 = data.arrangement.patterns[i].tracks[channel0];
                    track1 = data.arrangement.patterns[i].tracks[channel1];
                    for(j = 0; j < stepCount; j++) {
                        if (i > 3 && i < 12) {
                            step = track.steps[j];
                            step.pitch = (j % 3 == 1) ? 84 : 60;
                            step.pitch = (j % 3 == 2) ? 36 : 60;
                            // step.duration = (j % 5 == 0) ? stepDuration * 2 : stepDuration;
                            step.velocity = 100;
                        } else {
                            step = track.steps[j];
                            step.pitch = 60;
                            step.velocity = 100;
                        }
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
                    osc1gain: 0.6,
                    osc2gain: 0.6,
                    ampAttack: 0.01,
                    ampSustain: 1,
                    ampRelease: 0.02,
                    cutoff: 1440.0,
                    reso: 13.2,
                    filterMod: 0.3,
                    filterAttack: 0.06,
                    filterSustain: 1,
                    filterRelease: 0.01,
                    output: 0.8,
                    
                };
                rack.channel.preset = {
                    level: 0.65,
                    pan: 0.5
                }
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
                        if (i > 3 && i < 8) {
                            // if (j % 5 == 0) {
                            //     var origStep = track.steps[0];
                            //     step.pitch = origStep.pitch;
                            //     step.duration = origStep.duration;
                            //     step.velocity = origStep.velocity;
                            // } else {
                            if (j == 1 || j == 2) {
                                step.velocity = 0;
                            }
                        } else if (i > 7 && i < 12) {
                            var origStep = track.steps[0];
                            if (j == 0) {
                                step.pitch = origStep.pitch;
                                step.duration = origStep.duration;
                                step.velocity = 100; // origStep.velocity;
                            } else if (j == 1) {
                                step.pitch = origStep.pitch - 5;
                                step.duration = origStep.duration;
                                step.velocity = 30; // origStep.velocity;
                            } else {
                                step.velocity = 0;
                            }
                        } else if (i > 11 && i < 16) {
                            var origStep = track.steps[j % 8];
                            if (j % 8 < 3) {
                                step.pitch = origStep.pitch;
                                step.duration = origStep.duration;
                                step.velocity = origStep.velocity;
                            } else {
                                step.velocity = 0;
                            }
                        }
                    }
                }
            },

            createSong = function() {
                var i, j;
                // 16 x A
                for (i = 0; i < 2; i++) {
                    data.arrangement.song.push({
                        patternIndex: 0,
                        repeats: 5
                    });
                    data.arrangement.song.push({
                        patternIndex: 1,
                        repeats: 1
                    });
                    data.arrangement.song.push({
                        patternIndex: 2,
                        repeats: 1
                    });
                    data.arrangement.song.push({
                        patternIndex: 3,
                        repeats: 1
                    });
                }
                // 16 x C
                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 4; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 8,
                            repeats: 2
                        });
                    }
                }
                // 16 x B
                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 4; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 4,
                            repeats: 2
                        });
                    }
                }
                // 8 x D1
                for (i = 0; i < 4; i++) {
                    for (j = 0; j < 2; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 12,
                            repeats: 1
                        });
                    }
                }
                // 8 x D2
                for (i = 0; i < 4; i++) {
                    for (j = 0; j < 2; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 14,
                            repeats: 1
                        });
                    }
                }
                // 16 x A
                for (i = 0; i < 4; i++) {
                    data.arrangement.song.push({
                        patternIndex: i,
                        repeats: 4
                    });
                }
                // 16 x B
                for (i = 0; i < 4; i++) {
                    for (j = 0; j < 4; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 8,
                            repeats: 1
                        });
                    }
                }
                // 32
                // for (i = 0; i < 4; i++) {
                //     data.arrangement.song.push({
                //         patternIndex: i + 4,
                //         repeats: 4
                //     });
                //     for (j = 0; j < 2; j++) {
                //         for (k = 0; k < 2; k++) {
                //             data.arrangement.song.push({
                //                 patternIndex: k + 14,
                //                 repeats: 1
                //             });
                //         }
                //     }
                // }
                // 8 x D1
                for (i = 0; i < 4; i++) {
                    for (j = 0; j < 2; j++) {
                        data.arrangement.song.push({
                            patternIndex: j + 12,
                            repeats: 1
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
