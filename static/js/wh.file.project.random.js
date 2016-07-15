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
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        switch (j) {
                            case 0:
                                step.velocity = 100;
                                break
                            case 2:
                            case 10:
                                step.velocity = (Math.random() > 0.2) ? 95 : 0;
                                break;
                            case 6:
                            case 12:
                            case 14:
                                step.velocity = (Math.random() > 0.85) ? 60 : 0;
                                break;
                            case 1:
                            case 4:
                            case 8:
                            case 9:
                            case 11:
                            case 15:
                                step.velocity = (Math.random() > 0.95) ? 30 : 0;
                                break;
                        }
                    }
                }
            },

            createRack1 = function() {
                var channel = 1,
                    rack = data.racks[channel];
                rack.instrument.name = 'chord';
                rack.channel.preset.pan = 0.3;
            },

            createPatterns1 = function() {
                var channel = 1, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    step = track.steps[2];
                    step.pitch = 60;
                    step.velocity = 50 + i;
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
                    for(j = 0; j < stepCount; j++) {
                        step = track.steps[j];
                        step.pitch = 60;
                        step.velocity = (Math.random() > 0.5) ? 100 : 0;
                        step.duration = stepDuration;
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
        createRack1();
        createPatterns1();
        createRack2();
        createPatterns2();
        createSong();

        return data;
    }

    /**
     * Exports
     */
    WH.createRandomizedProject = createRandomizedProject;
})(WH);
