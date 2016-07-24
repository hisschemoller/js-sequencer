/**
 * Project.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    function createRandomizedProject(specs) {

        // private variables
        var conf = specs.conf,
            patternCount = conf.getPatternCount(),
            trackCount = conf.getTrackCount(),
            stepCount = conf.getStepCount(),
            stepDuration = Math.floor(conf.getPPQN() / conf.getStepsPerBeat()),
            pentatonicMinScale = [0, 3, 5, 6, 7, 10],
            data = {
                bpm: 100 + Math.floor(Math.random() * 20),
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
                rack.instrument.name = 'kick';
                rack.channel.preset.pan = 0.1;
            },

            createPatterns0 = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[0].velocity = 127;
                    track.steps[2].velocity = 100;
                    track.steps[3].velocity = 100;
                    track.steps[3].pitch = 100;
                    track.steps[5].velocity = 100;
                    track.steps[5].pitch = 103;
                    // track.steps[15].velocity = 70;
                    // track.steps[15].pitch = 130;
                    
                    // for(j = 0; j < st    epCount; j++) {
                    //     step = track.steps[j];
                    //     switch (j) {
                    //         case 0:
                    //             step.velocity = 127;
                    //             break
                    //         case 6:
                    //         case 8:
                    //         case 14:
                    //             step.velocity = (Math.random() > 0.1) ? 110 : 0;
                    //             break;
                    //         case 4:
                    //             step.pitch = 100;
                    //             step.velocity = (Math.random() > 0.15) ? 100 : 0;
                    //             break;
                    //         case 2:
                    //         case 12:
                    //             step.velocity = (Math.random() > 0.85) ? 60 : 0;
                    //             break;
                    //         case 1:
                    //         case 9:
                    //         case 11:
                    //         case 15:
                    //             step.velocity = (Math.random() > 0.95) ? 20 : 0;
                    //             break;
                    //     }
                    // }
                }
            },

            createRack1 = function() {
                var channel = 1,
                    rack = data.racks[channel];
                rack.instrument.name = 'chord';
                rack.channel.preset.pan = 0.0;
            },

            createPatterns1 = function() {
                var channel = 1, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    step = track.steps[8];
                    step.pitch = (Math.floor(i / 4) % 2 == 0) ? 60 : 58;
                    step.pitch = (i >= 10 && i < 12) ? step.pitch + 1 : step.pitch;
                    step.pitch = (i >= 14 && i < 16) ? step.pitch + 1 : step.pitch;
                    step.velocity = 30 + i;
                    step.duration = stepDuration * 8;
                }
            },

            createRack2 = function() {
                var channel = 2,
                    rack = data.racks[channel];
                rack.instrument.name = 'impulse';
                rack.channel.preset.pan = 0.0;
            },

            createPatterns2 = function() {
                var channel = 2, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[6].velocity = 40;
                    track.steps[8].velocity = 40;
                    track.steps[12].velocity = 40;
                    track.steps[14].velocity = 40;
                    // track.steps[8].velocity = 40;
                    // for(j = 0; j < stepCount; j++) {
                    //     step = track.steps[j];
                    //     switch (j) {
                    //         case 2:
                    //         case 6:
                    //         case 10:
                    //         // case 14:
                    //             step.pitch = 60;
                    //             step.velocity = (Math.random() > 0.1) ? 50 : 0;
                    //             break;
                    //         case 1:
                    //         case 5:
                    //         case 9:
                    //         // case 13:
                    //             step.pitch = 60;
                    //             step.velocity = (Math.random() > 0.65) ? 50 : 0;
                    //             break;
                    //     }
                    // }
                }
            },

            createRack3 = function() {
                var channel = 3,
                    rack = data.racks[channel];
                rack.instrument.name = 'chord2';
                rack.channel.preset.pan = 0.0;
            },

            createPatterns3 = function() {
                var channel = 3, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        switch (j) {
                            case 3:
                                step.pitch = (Math.floor(i / 4) % 2 == 0) ? 48 : 46;
                                step.velocity = (i >= 12) ? 0 : 100 + i;
                                step.duration = stepDuration * 4;
                                break;
                            case 14:
                                step.pitch = (Math.floor(i / 4) % 2 == 0) ? 48 : 46;
                                step.pitch = (i >= 14 && i < 16) ? step.pitch + 1 : step.pitch;
                                step.velocity = ((i >= 2 && i < 4) || (i >= 6 && i < 8)) ? 0 : 100 + i;
                                step.duration = (i >= 12) ? stepDuration * 6 : stepDuration * 4;
                                break;
                            // case 9:
                            //     step.pitch = (Math.floor(i / 4) % 2 == 0) ? 49 : 47;
                            //     step.velocity = (i >= 8 && i < 12) ? 50 + i : 0;
                            //     step.duration = stepDuration * 3;
                            //     break;
                            case 11:
                                step.pitch = (Math.floor(i / 4) % 2 == 0) ? 49 : 47;
                                step.velocity = (i >= 8 && i < 12) ? 100 + i : 0;
                                step.duration = stepDuration * 3;
                                break;
                        }
                    }
                }
            },

            createRack4 = function() {
                var channel = 4,
                    rack = data.racks[channel];
                rack.instrument.name = 'hihat';
                rack.channel.preset.pan = 0.0;
            },

            createPatterns4 = function() {
                var channel = 4, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[2].velocity = 30;
                    track.steps[6].velocity = 30;
                    track.steps[10].velocity = 30;
                    track.steps[14].velocity = 30;
                }
            },

            createSong = function() {
                for (var i = 0; i < 2; i++) {
                    data.arrangement.song.push({
                        patternIndex: i,
                        repeats: 1,
                        mutes: null
                    });
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
        createRack4();
        createPatterns4();
        createSong();

        return data;
    }

    /**
     * Exports
     */
    WH.createRandomizedProject = createRandomizedProject;
})(WH);
