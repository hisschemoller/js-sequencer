/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    function View() {

        // private
        var settings = {
                activeClass: 'is-active',
                selectedClass: 'is-selected'
            },
            elements = {
                playStopButton: $('#play-control'),
                steps: $('.pattern__step')
            },
            channelIndex = 0,
            init = function() {
                elements.playStopButton.on('click touchend', onPlayStopClick);
            },
            onPlayStopClick = function(e) {
                if (WH.TimeBase.isRunning()) {
                    WH.TimeBase.pause();
                    elements.playStopButton.removeClass(settings.activeClass);
                } else {
                    WH.TimeBase.start();
                    elements.playStopButton.addClass(settings.activeClass);
                }
            },
            updateSteps = function(index) {
                elements.steps.removeClass(settings.activeClass);
                $(elements.steps[index]).addClass(settings.activeClass);
            };

        this.onStepEvents = function(playbackQueue) {
            var channel = 0,
                i = 0,
                n = playbackQueue.length,
                now = WH.TimeBase.getNow(),
                step,
                start;
            for (i; i < n; i++) {
                step = playbackQueue[i];
                if (step.channel == channel) {
                    start = Math.max(0, WX.now - step.absStart) * 1000;
                    if (start > 0) {
                        setTimeout(function() {
                            updateSteps(step.index);
                        }, start);
                    } else {
                        updateSteps(step.index);
                    }
                }
            }
        };


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

        init();
    }
    
    /** 
     * Singleton
     */
    WH.View = new View();
})(WH);