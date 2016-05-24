/**
 * Project.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * Create data for a new empty arrangement.
     * @return {Object}  Empty arrangement setup data.
     */
    function createProject() {
        
        var patternCount = WH.conf.getPatternCount(),
            trackCount = WH.conf.getTrackCount(),
            stepCount = WH.conf.getStepCount(),
            stepDuration = Math.floor( WH.conf.getPPQN() / WH.conf.getStepsPerBeat() ),
            data = {
                bpm: 120,
                racks: [],
                arrangement: {
                    patterns: [],
                    song: {}
                }
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
            data.arrangement.patterns.push(pattern);
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
    }

    /**
     * Exports
     */
    WH.createProject = createProject;
    
})(WH);
