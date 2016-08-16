/**
 * TracksView shows an overview of each track in a pattern.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createTracksView(specs, my) {
        var that = specs.that,
            conf = specs.conf,
            trackCount = conf.getTrackCount(),
            stepCount = conf.getStepCount(),
            
            /**
             * Initialize the view, create the track lanes.
             */
            init = function() {
                var i, j, trackEl, stepEl,
                    trackTemplate = $('#template-tracks-track'),
                    stepTemplate = $('#template-tracks-step');
                for (i = 0; i < trackCount; i++) {
                    trackEl = trackTemplate.children().first().clone();
                    my.rootEl.append(trackEl);
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
                var i, j, trackData, stepData;
                for (i = 0; i < trackCount; i++) {
                    trackData = patternData.getTrackSteps(i);
                    for (j = 0; j < stepCount; j++) {
                        
                        if (trackData[j].getVelocity()) {
                            
                        }
                    }
                }
            };
            
        var my = my || {};
        my.rootEl = $('#tracks');
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setPattern = setPattern;
        return that;
    }

    ns.createTracksView = createTracksView;

})(WH);
