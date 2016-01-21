/**
 * View is a layer between the HTML and the rest of the application.
 * It updates the view to represent the app state and 
 * passes DOM events generated by the user to the app.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function View() {

        // private variables
        var settings = {
                activeClass: 'is-active',
                selectedClass: 'is-selected',
                channelHighlightClass: '.channel__hilight'
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                playStopButton: $('#play-control'),
                steps: $('.pattern__step'),
                channels: $('.channel__item'),
            },

            /**
             * Channel currently selected to view and edit.
             * @type {Number}
             */
            channelIndex = 0,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                elements.playStopButton.on('click', onPlayStopClick);
            },

            /**
             * Play / Pause toggle button clicked.
             * @param  {Event} e Click event.
             */
            onPlayStopClick = function(e) {
                if (WH.TimeBase.isRunning()) {
                    WH.TimeBase.pause();
                    elements.playStopButton.removeClass(settings.activeClass);
                } else {
                    WH.TimeBase.start();
                    elements.playStopButton.addClass(settings.activeClass);
                }
            }, 

            /**
             * Delay screen update to keep it synchronised with the audio.
             * @param  {Number} start Time to wait before update in milliseconds.
             * @param  {Array} activeSteps Steps that play in the current timespan. 
             */
            delayUpdateActiveSteps = function(start, activeSteps) {
                if (start > 0) {
                    setTimeout(function() {
                        updateActiveSteps(activeSteps);
                    }, start);
                } else {
                    updateActiveSteps(activeSteps);
                }
            },

            /**
             * Update the active step, this creates the 'running light' animation.
             * Also display flashing activity on the channel selectors.
             * @param  {Array} stepArray Steps that play in the current timespan. 
             */
            updateActiveSteps = function(stepArray) {
                var i = 0,
                    n = stepArray.length,
                    step;

                for (i; i < n; i++) {
                    step = stepArray[i];
                    
                    // update the steps
                    if (step.channel == channelIndex) {
                        elements.steps.removeClass(settings.activeClass);
                        $(elements.steps[step.index]).addClass(settings.activeClass);
                    }

                    // update the channels
                    if (step.velocity > 0) {
                        $(elements.channels[step.channel])
                            .find(settings.channelHighlightClass)
                                .show()
                                .stop()
                                .fadeIn(0)
                                .fadeOut(300);
                    }
                }
            };

        /**
         * Receive Step objects during playback to update the view with.
         * @param  {Array} playbackQueue Array of Step objects.
         */
        this.onStepEvents = function(playbackQueue) {
            var i = 0,
                n = playbackQueue.length,
                step,
                start,
                stepArray = [],
                oldStart = -1;

            for (i; i < n; i++) {
                step = playbackQueue[i];
                start = Math.max(0, WX.now - step.absStart) * 1000;

                if (start != oldStart && stepArray.length > 0) {
                    delayUpdateActiveSteps(oldStart, stepArray);
                    stepArray = [];
                }

                stepArray.push(step);
                oldStart = start;
            }

            delayUpdateActiveSteps(oldStart, stepArray);
        };

        /**
         * Update the pattern to show selected steps.
         * Typically after switching patterns or tracks.
         */
        this.updateSelectedSteps = function() {
            var steps = WH.Project.getTrackSteps(channelIndex);
            elements.steps.removeClass(settings.selectedClass);
            for (var id in steps) {
                var step = steps[id];
                if(step.velocity) {
                    $(elements.steps[step.index]).addClass(settings.selectedClass);
                }
            }
        }

        // Initialise.
        init();
    }
    
    /** 
     * Singleton
     */
    WH.View = new View();
})(WH);