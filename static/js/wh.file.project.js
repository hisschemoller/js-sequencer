/**
 * Project.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function Project() {

        // private variables
        var settings = {
        };

        /**
         * Create data for a new empty arrangement.
         * @return {Object}  Empty arrangement setup data.
         */
        this.getEmpty = function() {

            var patternCount = WH.Conf.getPatternCount(),
                trackCount = WH.Conf.getTrackCount(),
                stepCount = WH.Conf.getStepCount(),
                stepDuration = Math.floor( WH.Conf.getPPQN() / WH.Conf.getStepsPerBeat() ),
                data = {
                    bpm: 120,
                    racks: [],
                    patterns: []
                };

            for (var j = 0; j < trackCount; j++) {
                var rack = {
                    instrument: {
                        name: 'SimpleOsc',
                        preset: {
                            oscType: WX.findValueByKey(WX.WAVEFORMS, 'Sine'),
                            oscFreq: WX.mtof(60),
                            lfoType: WX.findValueByKey(WX.WAVEFORMS, 'Sine'),
                            lfoRate: 1.0,
                            lfoDepth: 1.0
                        }
                    },
                    channel: {
                        preset: {
                            mute: false,
                            solo: false,
                            pan: 0.0,
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
                data.patterns.push(pattern);
                for (var j = 0; j < trackCount; j++) {
                    var track = {
                        steps: []
                    };
                    pattern.tracks.push(track);
                    for (var k = 0; k < stepCount; k++) {
                        var step = {
                            channel: j,
                            pitch: 60,
                            velocity: 0,
                            start: stepDuration * k,
                            duration: Math.floor( stepDuration / 2 )
                        };
                        track.steps.push(step);
                    }
                }
            }
            return data;
        };

        /**
         * Create data for an arrangement with randomized patterns and data.
         * @return {Object}  Empty arrangement setup data.
         */
        this.getRandomized = function() {

            var patternCount = WH.Conf.getPatternCount(),
                trackCount = WH.Conf.getTrackCount(),
                stepCount = WH.Conf.getStepCount(),
                stepDuration = Math.floor( WH.Conf.getPPQN() / WH.Conf.getStepsPerBeat() ),
                data = {
                    bpm: 100 + Math.floor(Math.random() * 20),
                    racks: [],
                    patterns: []
                },
                pentatonicMinScale = [0, 3, 5, 6, 7, 10];

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
                        name: 'WXS1',
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
                data.patterns.push(pattern);
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
                                velocity = (Math.random() > 0.70 ? 120 : 0);
                                duration = stepDuration / 2;
                                break;
                            case 1:
                                pitch = 24 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                velocity = (Math.random() > 0.8 ? 50 : 0);
                                break;
                            case 2:
                                pitch = 48 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                velocity = (Math.random() > 0.8 ? 20 : 0);
                                duration = stepDuration;
                                break;
                            case 3:
                                pitch = 60 + pentatonicMinScale[Math.floor(Math.random() * pentatonicMinScale.length)];
                                velocity = (Math.random() > 0.7 ? 120 : 0);
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
            return data;
        };
    }

    /**
     * Exports
     */
    WH.Project = function() {
        return new Project();
    };
})(WH);
