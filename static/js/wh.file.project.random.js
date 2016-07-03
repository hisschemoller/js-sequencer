/**
 * Project.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    function getRandomizedProject() {

        // private variables
        var patternCount = WH.Conf.getPatternCount(),
            trackCount = WH.Conf.getTrackCount(),
            stepCount = WH.Conf.getStepCount(),
            stepDuration = Math.floor( WH.Conf.getPPQN() / WH.Conf.getStepsPerBeat() ),
            pentatonicMinScale = [0, 3, 5, 6, 7, 10],
            data = {
                bpm: 100 + Math.floor(Math.random() * 20),
                racks: [],
                arrangement: {
                    patterns: [],
                    song: []
                }
            },

            /**
             * Create data for an arrangement with randomized patterns and data.
             * @return {Object}  Empty arrangement setup data.
             */
            create = function() {
                for (var j = 0; j < trackCount; j++) {
                    var osc1type = WX.findValueByKey(WX.WAVEFORMS, 'Sine'),
                        osc2type = WX.findValueByKey(WX.WAVEFORMS, 'Sine'),
                        filterMod = 0;
                    switch (j) {
                        case 0:
                            break;
                        case 1:
                            osc1type = WX.findValueByKey(WX.WAVEFORMS, 'Sawtooth');
                            break;
                        case 2:
                            osc1Type = WX.findValueByKey(WX.WAVEFORMS, 'Square');
                            break;
                        case 3:
                            osc1Type = WX.findValueByKey(WX.WAVEFORMS, 'Triangle');
                            break;
                    }
                    var rack = {
                        instrument: {
                            name: 'simpleosc',
                            preset: {
                                ampAttack: 0.1,
                                ampDecay: 0.1,
                                ampSustain: 1.0,
                                ampRelease: 0.2,
                                filterAttack: 0.0,
                                filterDecay: 0.0,
                                filterSustain: 1.0,
                                filterRelease: 0.0,
                                osc1type: osc1type,
                                osc2type: osc2type,
                                osc1octave: 0,
                                filterMod: filterMod,
                                cutoff: 20000,
                                reso: 0
                            }
                        },
                        channel: {
                            preset: {
                                mute: false,
                                solo: false,
                                pan: (j * 0.4) - 0.6,
                                level: 1.0
                            }
                        }
                    };
                    data.racks.push(rack);
                }

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
                            var pitch = 0,
                                velocity = 0,
                                duration = stepDuration / 2;
                            switch (j) {
                                case 0:
                                    pitch = 48 + (Math.floor(Math.random() * 3) * 12) + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                    velocity = (Math.random() > 0.85 ? 120 : 0);
                                    duration = stepDuration / 2;
                                    break;
                                case 1:
                                    pitch = 24 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                    velocity = (Math.random() > 0.95 ? 50 : 0);
                                    break;
                                case 2:
                                    pitch = 48 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                    velocity = (Math.random() > 0.9 ? 20 : 0);
                                    duration = stepDuration;
                                    break;
                                case 3:
                                    pitch = 60 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                    velocity = (Math.random() > 0.85 ? 120 : 0);
                                    duration = Math.floor( stepDuration / 8 );
                                    break;
                            }
                            var step = {
                                channel: j,
                                pitch: pitch,
                                velocity: velocity,
                                start: stepDuration * k,
                                duration: duration
                            };
                            track.steps.push(step);
                        }
                    }
                }

                for (var i = 0; i < 4; i++) {
                    data.arrangement.song.push({
                        patternIndex: i,
                        repeats: 1
                    });
                }
            },

            init = function() {
                // create racks
                for (var i = 0; i < trackCount; i++) {
                    var rack = {
                        instrument: {
                            name,
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
                rack.instrument.name = 'simpleosc';
                rack.channel.preset.pan = -0.1;
            },

            createPatterns0 = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        step.velocity = (Math.random() > 0.85 ? 120 : 0);
                    }
                }
            },

            createSong = function() {
                for (var i = 0; i < 2; i++) {
                    data.arrangement.song.push({
                        patternIndex: i,
                        repeats: 1
                    });
                }
            };

        init();
        createRack0();
        createPatterns0();
        createSong();

        return data;
    }

    /**
     * Exports
     */
    WH.getRandomizedProject = function() {
        return getRandomizedProject();
    };
})(WH);
