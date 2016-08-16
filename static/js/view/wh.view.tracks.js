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
            stepEls = [],
            columns = [],
            activeColomnIndex,
            
            /**
             * Initialize the view, create the track lanes.
             */
            init = function() {
                var i, j, trackEl, stepEl, colorClass,
                    trackTemplate = $('#template-tracks-track'),
                    stepTemplate = $('#template-tracks-step');
                for (i = 0; i < trackCount; i++) {
                    trackEl = trackTemplate.children().first().clone();
                    my.rootEl.append(trackEl);
                    stepEls.push([]);
                    colorClass = conf.getColor(i);
                    for (j = 0; j < stepCount; j++) {
                        stepEl = stepTemplate.children().first().clone();
                        stepEl.addClass(colorClass);
                        trackEl.append(stepEl);
                        stepEls[i].push(stepEl);
                    }
                }
                
                // cache column selectors for playback animation.
                for (i = 0; i < trackCount; i++) {
                    columns.push(my.rootEl.children('.tracks__track').find(':nth-child(' + (i + 1) + ')'));
                }
            },
            
            /**
             * Update all tracks of a pattern.
             * A step plays if it's velocity is greater than 0.
             * @param {object} patternData Pattern data includes all it's tracks and steps.
             */
            setPattern = function(patternData) {
                var i, j, trackData, stepData;
                for (i = 0; i < trackCount; i++) {
                    trackData = patternData.getTrackSteps(i);
                    for (j = 0; j < stepCount; j++) {
                        stepEls[i][j].toggleClass('selected', trackData[j].getVelocity() > 0);
                    }
                }
            },
            
            setActiveStep = function() {
                
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
