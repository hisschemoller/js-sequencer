/**
 * TracksView shows an overview of each track in a pattern.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createTracksView(specs) {
        var that = specs.that,
            conf = specs.conf,
            trackCount = conf.getTrackCount(),
            stepCount = conf.getStepCount(),
            tracksEl = $('#tracks'),
            
            /**
             * Initialize the view, create the track lanes.
             */
            init = function() {
                var i, j, trackEl, stepEl,
                    trackTemplate = $('#template-tracks-track'),
                    stepTemplate = $('#template-tracks-step');
                for (i = 0; i < trackCount; i++) {
                    trackEl = trackTemplate.children().first().clone();
                    tracksEl.append(trackEl);
                    for (j = 0; j < stepCount; j++) {
                        stepEl = stepTemplate.children().first().clone();
                        trackEl.append(stepEl);
                    }
                }
            },
            
            /**
             * Update all tracks of a pattern.
             */
            setPattern = function(patternData) {
                var i, j, trackData;
                for (i = 0; i < trackCount; i++) {
                    trackData = patternData.getTrackSteps(i);
                    // console.log(patternData.getTrackSteps(i));
                    for (j = 0; j < stepCount; j++) {
                        
                    }
                }
            },
            
            /**
             * Set DOM element visibility.
             * @param {boolean} isVisible True if visible.
             */
            setVisible = function(isVisible) {
                tracksEl.toggle(isVisible === true);
            };
        
        init();
        
        that.setPattern = setPattern;
        that.setVisible = setVisible;
        return that;
    }

    ns.createTracksView = createTracksView;

})(WH);
