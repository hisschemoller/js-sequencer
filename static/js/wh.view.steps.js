/**
 * StepsView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function StepsView() {

        // private variables
        var settings = {
                stepClass: '.step'
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                stepsContainer: $('.steps'),
                steps: null,
                templates: {
                    step: $('#template-step')
                }
            },

            /**
             * Reference to this, once function has closed.
             * @type {Object}
             */
            self = this,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                addStepControls();
            },

            /**
             * Add controls for all steps in a pattern track.
             */
            addStepControls = function() {
                var i = 0,
                    stepEl,
                    stepEls;

                for (i; i < WH.Conf.getStepCount(); i++) {
                    stepEl = elements.templates.step.children().first().clone();
                    stepEl.find(settings.ctrlTextClass).text(i + 1);
                    elements.stepsContainer.append(stepEl);
                }

                elements.steps = elements.stepsContainer.find(settings.stepClass);
                elements.steps.on(self.eventType.click, function(e) {});
            };

        /**
         * Show or hide the patterns section.
         * @param {Boolean} isVisible True to show the patterns section.
         */
        this.setVisible = function(isVisible) {
            elements.stepsContainer.toggle(isVisible == true);
        };

        /**
         * Update the pattern to show selected steps.
         * Typically after switching patterns or tracks.
         * @param {Number} index Channel / track index.
         */
        this.setSelected = function(index) {
            var steps = WH.Arrangement.getTrackSteps(index),
                channelColorClass = settings.channelColorClasses[index],
                i = 0,
                n = steps ? steps.length : 0;

            this.clearColors(elements.steps, settings.channelColorClasses);

            // set selected state
            elements.steps.removeClass(settings.selectedClass);
            for (i; i < n; i++) {
                var step = steps[i];
                if (step.getVelocity()) {
                    var stepEl = $(elements.steps[step.getIndex()]);
                    stepEl.addClass(settings.selectedClass);
                }
            }

            this.setColor($(elements.steps.filter('.' + settings.selectedClass)), channelColorClass);
        };

        /**
         * Receive Step objects during playback to update the view with.
         * @param  {Number} index Index of the step that becomes active.
         */
        this.updateActiveStep = function(index) {
            elements.steps.removeClass(settings.activeClass);
            stepEl = $(elements.steps[index]);
            stepEl.addClass(settings.activeClass);
            this.animateHighlight(stepEl);
        };

        // extend AbstractView
        WH.AbstractView.call(this, settings);

        // initialise
        init();
    }

    /**
     * Exports
     */
    WH.StepsView = function() {
        return new StepsView();
    };
})(WH);
