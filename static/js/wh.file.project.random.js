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
                bpm: 110 + Math.floor(Math.random() * 10),
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
                var channel = 0, rack = data.racks[channel];
                // rack.instrument.name = 'kick';
                rack.channel.preset.level = 1.0;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsA = function() {
                var channel = 0, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                }
            },

            createRackB = function() {
                var channel = 1, rack = data.racks[channel];
                // rack.instrument.name = 'chord';
                rack.channel.preset.level = 1.0;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsB = function() {
                var channel = 1, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                }
            },

            createRackC = function() {
                var channel = 2, rack = data.racks[channel];
                // rack.instrument.name = 'impulse';
                rack.channel.preset.level = 1.0;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsC = function() {
                var channel = 2, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                }
            },

            createRackD = function() {
                var channel = 3, rack = data.racks[channel];
                // rack.instrument.name = 'chord2';
                rack.channel.preset.level = 0.8;
                rack.channel.preset.pan = -0.2;
                rack.channel.preset.mute = true;
            },

            createPatternsD = function() {
                var channel = 3, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                }
            },

            createRackE = function() {
                var channel = 4, rack = data.racks[channel];
                rack.instrument.name = 'noise';
                rack.channel.preset.level = 1.0;
                rack.channel.preset.pan = 0.0;
            },

            createPatternsE = function() {
                var channel = 4, track, step, i, j;
                for (i = 0; i < patternCount; i++) {
                    track = data.arrangement.patterns[i].tracks[channel];
                    step = track.steps[0];
                    step.velocity = 100;
                    step.duration = stepDuration * 16;
                }
            },

            createSong = function() {
                data.arrangement.song.push({patternIndex: 0, repeats: 8});
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
