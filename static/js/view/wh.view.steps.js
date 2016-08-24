/**
 * StepsView shows the 16 steps of a track.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createStepsView(specs, my) {
        // private variables
        var that,
            arrangement = specs.arrangement,
            channelSelectView = specs.channelSelectView,
            conf = specs.conf,
            rootEl = $('.steps'),
            stepTemplate = $('#template-step'),
            stepEls,
            
            selectors = {
                step: '.step'
            },

            /**
             * Initialise the view, add DOM event handlers.
             */
            setup = function() {
                addStepControls();
            },

            /**
             * Add controls for all steps in a pattern track.
             */
            addStepControls = function() {
                var i, n, stepEl;
                    
                n = conf.getStepCount();
                for (i = 0; i < n; i++) {
                    stepEl = stepTemplate.children().first().clone();
                    stepEl.find(my.classes.ctrlText).text(i + 1);
                    rootEl.append(stepEl);
                }

                stepEls = rootEl.find(selectors.step);
                stepEls.on(my.eventType.click, function(e) {});
            },

            /**
             * Update the pattern to show selected steps.
             * Typically after switching patterns or tracks.
             * @param {Number} index Channel / track index.
             */
            setSelected = function(index) {
                var i, n, stepEl, stepsData, colorClass;
                    
                index = isNaN(index) ? channelSelectView.getSelectedChannel() : index;
                stepsData = arrangement.getTrackSteps(index);
                colorClass = my.classes.colors[index];
                
                stepEls.removeClass(my.classes.allColors);
                stepEls.removeClass(my.classes.selected);

                // set selected state
                n = stepsData ? stepsData.length : 0;
                for (i = 0; i < n; i++) {
                    var step = stepsData[i],
                        stepEl = $(stepEls[step.getIndex()]);
                    if (step.getVelocity()) {
                        stepEl.addClass(my.classes.selected);
                        stepEl.find(my.selectors.ctrlBackground).addClass(colorClass);
                    }
                }
            },

            /**
             * Receive Step objects during playback to update the view with.
             * @param  {Number} index Index of the step that becomes active.
             */
            updateActiveStep = function(index) {
                stepEls.removeClass(my.classes.active);
                stepEl = $(stepEls[index]);
                stepEl.addClass(my.classes.active);
                stepEl.find(my.selectors.ctrlHighlight)
                    .show()
                    .stop()
                    .fadeIn(0)
                    .fadeOut(300);
            };
        
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        that.setup = setup;
        that.setSelected = setSelected;
        that.updateActiveStep = updateActiveStep;
        return that;
    }
    
    WH.createStepsView = createStepsView;
    
})(WH);
