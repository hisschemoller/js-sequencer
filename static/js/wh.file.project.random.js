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

            createRackA = function() {
                var channel = 0,
                    rack = data.racks[channel];
                rack.instrument.name = 'kick';
                rack.channel.preset.pan = 0.1;
            },

            createPatternsA = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    if (i == 8 || i == 9) {
                        continue;
                    }
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[0].velocity = 127;
                    track.steps[2].velocity = 100;
                    track.steps[3].velocity = 100;
                    track.steps[3].pitch = 100;
                    track.steps[5].velocity = 100;
                    track.steps[5].pitch = 103;
                }
            },

            createRackB = function() {
                var channel = 1,
                    rack = data.racks[channel];
                rack.instrument.name = 'chord';
                rack.channel.preset.pan = 0.0;
            },

            createPatternsB = function() {
                var channel = 1, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    step = track.steps[8];
                    step.pitch = (Math.floor(i / 4) % 2 == 0) ? 60 : 58;
                    step.pitch = (i == 11) ? step.pitch + 1 : step.pitch;
                    step.pitch = (i >= 14 && i < 16) ? step.pitch + 1 : step.pitch;
                    step.velocity = 30 + i;
                    step.duration = stepDuration * 8;
                }
            },

            createRackC = function() {
                var channel = 2,
                    rack = data.racks[channel];
                rack.instrument.name = 'impulse';
                rack.channel.preset.level = 0.2;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsC = function() {
                var channel = 2, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    if (i == 8 || i == 9) {
                        continue;
                    }
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[6].velocity = 40;
                    track.steps[8].velocity = 40;
                    track.steps[12].velocity = 40;
                    track.steps[14].velocity = 40;
                }
            },

            createRackD = function() {
                var channel = 3,
                    rack = data.racks[channel];
                rack.instrument.name = 'chord2';
                rack.instrument.preset.lfodepth = 0;
                rack.channel.preset.level = 0.85;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsD = function() {
                var channel = 3, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        switch (j) {
                            case 3:
                                step.pitch = (Math.floor(i / 4) % 2 == 0) ? 48 : 46;
                                step.velocity = (i >= 12) ? 0 : 100 + i;
                                step.pitch = (i == 11) ? step.pitch + 1 : step.pitch;
                                step.duration = stepDuration * 4;
                                break;
                            case 14:
                                step.pitch = (Math.floor(i / 4) % 2 == 0) ? 48 : 46;
                                step.pitch = (i >= 14 && i < 16) ? step.pitch + 1 : step.pitch;
                                step.pitch = (i == 11) ? step.pitch + 1 : step.pitch;
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

            createRackE = function() {
                var channel = 4,
                    rack = data.racks[channel];
                rack.instrument.name = 'hihat';
                rack.channel.preset.pan = 0.0;
            },

            createPatternsE = function() {
                var channel = 4, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    if (i == 8) {
                        continue;
                    }
                    track = data.arrangement.patterns[i].tracks[channel];
                    track.steps[2].velocity = 30 + Math.floor(Math.random() * 30);
                    track.steps[6].velocity = 30 + Math.floor(Math.random() * 30);
                    track.steps[10].velocity = 30 + Math.floor(Math.random() * 30);
                    track.steps[14].velocity = 30 + Math.floor(Math.random() * 30);
                    
                    // pitch 61 only plays sometimes
                    track.steps[3].velocity = 40;
                    track.steps[3].pitch = 61;
                    track.steps[15].velocity = 40;
                    track.steps[15].pitch = 61;
                }
            },

            createSong = function() {
                data.arrangement.song.push({patternIndex: 2, repeats: 8});
                data.arrangement.song.push({patternIndex: 3, repeats: 8});
                data.arrangement.song.push({patternIndex: 2, repeats: 8});
                data.arrangement.song.push({patternIndex: 3, repeats: 8});
                
                data.arrangement.song.push({patternIndex: 0, repeats: 12});
                data.arrangement.song.push({patternIndex: 1, repeats: 4});
                data.arrangement.song.push({patternIndex: 4, repeats: 12});
                data.arrangement.song.push({patternIndex: 5, repeats: 4});
                
                data.arrangement.song.push({patternIndex: 0, repeats: 8});
                
                data.arrangement.song.push({patternIndex: 8, repeats: 8});
                data.arrangement.song.push({patternIndex: 9, repeats: 8});
                data.arrangement.song.push({patternIndex: 10, repeats: 8});
                data.arrangement.song.push({patternIndex: 11, repeats: 8});
                
                data.arrangement.song.push({patternIndex: 8, repeats: 8});
                data.arrangement.song.push({patternIndex: 2, repeats: 8});
                
                data.arrangement.song.push({patternIndex: 0, repeats: 12});
                data.arrangement.song.push({patternIndex: 1, repeats: 4});
                data.arrangement.song.push({patternIndex: 4, repeats: 12});
                data.arrangement.song.push({patternIndex: 5, repeats: 4});
            };

        init();
        createRackA();
        createPatternsA();
        createRackB();
        createPatternsB();
        createRackC();
        createPatternsC();
        createRackD();
        createPatternsD();
        createRackE();
        createPatternsE();
        createSong();

        return data;
    }

    /**
     * Exports
     */
    WH.createRandomizedProject = createRandomizedProject;
})(WH);
