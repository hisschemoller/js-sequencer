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
                channelSelectClass: '.channel__select',
                rackClass: '.rack',
                rackGeneratorContainerClass: '.rack__generator',

                tabs: ['Sound', 'Mixer', 'Pattern', 'Song'],
                transport: ['Play', 'Song', 'New', 'Random']
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                channelSelects: null,
                channelSelectsContainer: $('.channel-selects'),
                channelContainer: $('.channels'),
                racks: null,
                rackContainer: $('.racks'),
                rackTemplate: $('#template-rack'),
                transportContainer: $('.transport'),
                tabContainer: $('.tabs')
            },

            /**
             * Channel currently selected to view and edit.
             * @type {Number}
             */
            channelIndex = -1,

            /**
             * Reference to this once function has closed.
             * @type {Object}
             */
            self = this,

            /**
             * ControlsView creates UI controls.
             * @type {Object}
             */
            controls = null,

            /**
             * StepsView creates sequencer steps UI controls.
             * @type {Object}
             */
            steps = null,

            /**
             * WH.PluginView plugin view objects.
             * Instruments, channels, all together by ID.
             * @type {Object}
             */
            pluginViews = {},

            /**
             * PatternView pattern selection controls.
             * @type {Object}
             */
            patterns = null,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                var i = 0,
                    n = WH.Conf.getTrackCount(),
                    rackEl;

                controls = WH.ControlsView();

                steps = WH.StepsView();

                patterns = WH.PatternView();

                // create the channel select buttons
                elements.channelSelects = controls.addChannelSelectControls(elements.channelSelectsContainer);

                // create the plugin racks
                for (i = 0; i < n; i++) {
                    rackEl = elements.rackTemplate.children().first().clone();
                    elements.rackContainer.append(rackEl);
                }

                elements.racks = elements.rackContainer.find(settings.rackClass);

                // create tabs
                elements.tabs = controls.addTabControls(elements.tabContainer, settings.tabs);

                // create transport buttons
                controls.addTransportControls(elements.transportContainer, settings.transport);

                self.setSelectedTab(0);
            },

            /**
             * Delay screen update to keep it synchronised with the audio.
             * @param  {Number} start Time to wait before update in milliseconds.
             * @param  {Array} activeSteps Steps that play in the current timespan.
             */
            delayUpdateSequencerActivity = function(start, activeSteps) {
                if (start > 0) {
                    setTimeout(function() {
                        updateSequencerActivity(activeSteps);
                    }, start);
                } else {
                    updateSequencerActivity(activeSteps);
                }
            },

            /**
             * Update the active step, this creates the 'running light' animation.
             * Also display flashing activity on the channel selectors.
             * @param  {Array} stepArray Steps that play in the current timespan.
             */
            updateSequencerActivity = function(stepArray) {
                var i = 0,
                    n = stepArray.length,
                    step,
                    stepEl;

                for (i; i < n; i++) {
                    step = stepArray[i];

                    // update the steps
                    if (step.channel == channelIndex) {
                        steps.updateActiveStep(step.index);
                    }

                    // update the channels
                    if (step.velocity > 0) {
                        self.animateHighlight($(elements.channelSelects.get(step.channel)));
                    }
                }
            };

        /**
         * Initialization.
         */
        this.setup = function() {
            init();
        };

        /**
         * Receive Step objects during playback to update the view with.
         * @param  {Array} playbackQueue Array of Step objects.
         */
        this.onSequencerEvents = function(playbackQueue) {
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
                    delayUpdateSequencerActivity(oldStart, stepArray);
                    stepArray = [];
                }

                stepArray.push(step);
                oldStart = start;
            }

            delayUpdateSequencerActivity(oldStart, stepArray);
        };

        /**
         * Set a tab as selected and update the view state..
         * @param {Number} index Index of the tab to select.
         */
        this.setSelectedTab = function(index) {
            var tabEl = $(elements.tabs[index]),
                isOpen = tabEl.hasClass(settings.selectedClass);

            if (!isOpen) {
                elements.tabs.removeClass(settings.selectedClass);
                tabEl.addClass(settings.selectedClass);
                switch (index) {
                    case 0:
                        // open instrument
                        elements.channelContainer.hide();
                        patterns.setVisible(false);
                        elements.rackContainer.show();
                        break;
                    case 1:
                        // open mixer
                        elements.rackContainer.hide();
                        patterns.setVisible(false);
                        elements.channelContainer.show();
                        break;
                    case 2:
                        // open patterns
                        elements.channelContainer.hide();
                        patterns.setVisible(true);
                        elements.rackContainer.hide();
                        break;
                }
            }
        };

        /**
         * Select a channel.
         * - Set selected channel button as selected.
         * - Show selected channel's instrument rack.
         * @param {Number} index Index of the channel to select.
         */
        this.setSelectedChannel = function(index) {
            if (index == channelIndex) {
                return;
            }

            channelIndex = index;

            elements.channelSelects.removeClass(settings.selectedClass);
            elements.channelSelects.get(channelIndex).className += ' ' + settings.selectedClass;

            elements.racks.removeClass(settings.selectedClass);
            elements.racks.get(channelIndex).className += ' ' + settings.selectedClass;

            this.setSelectedSteps();
        };

        /**
         * Update the pattern to show selected steps.
         * Typically after switching patterns or tracks.
         * @param {Number} index Channel / track index.
         */
        this.setSelectedSteps = function(index) {
            index = isNaN(index) ? channelIndex : index;
            steps.setSelected(index);
        };

        /**
         * Set the selected pattern element.
         * @param {Number} index Index of the element to set as selected.
         */
        this.setSelectedPattern = function(index) {
            patterns.setSelected(index);
        };

        /**
         * Fill a mixer channel with mixer channel controls.
         * This happens once because the mixer is created only once.
         * @param {Object} channel WX.PlugIn Processor object.
         * @param {Number} index Channel index in which to create the channel controls.
         */
        this.setChannel = function(channel, index) {
            var pluginView,
                containerEl = elements.channelContainer;

            pluginViews[channel.getId()] = WH.PluginView(channel, containerEl, index);
        };

        /**
         * Set the instrument controls,
         * typically after project initialisation or channel switch.
         * @param {Object} instrument WX.PlugIn Generator object.
         * @param {Number} index Rack index in which to set the instrument.
         */
        this.setInstrument = function(instrument, index) {
            var pluginView,
                rackEl = $(elements.racks[index]),
                containerEl = rackEl.find(settings.rackGeneratorContainerClass);

            pluginViews[instrument.getId()] = WH.PluginView(instrument, containerEl, index);
        };

        /**
         * Remove the instrument from the rack and delete it
         * @param {Object} instrument WX.PlugIn Generator object.
         * @param {Number} index Rack index from which to remove the instrument.
         */
        this.clearInstrument = function(instrument, index) {
            pluginViews[instrument.getId()].destroy();
            delete pluginViews[instrument.getId()];
        }

        /**
         * Update a control to reflect a changed plugin parameter.
         * @param {Number} pluginId Unique ID of the plugin.
         * @param {String} paramKey The parameter to change.
         * @param {Object} paramValues Object containing all the values of the parameter.
         */
        this.updatePluginControl = function(pluginId, paramKey, paramValues) {
            pluginViews[pluginId].updateControl(paramKey, paramValues);
        };

        /**
         * Apply a plugin preset to the plugin with the provided ID.
         * @param {Number} pluginId Unique lugin ID.
         * @param {Array} presetValues Plugin preset as array of objects with key value pairs.
         */
        this.setPluginPreset =  function(pluginId, presetValues) {
            var paramKey,
                paramValues;

            for (paramKey in presetValues) {
                paramValues = presetValues[paramKey];
                if (paramValues.isEditable) {
                    this.updatePluginControl(pluginId, paramKey, paramValues);
                }
            }
        };

        /**
         * Song mode entered or left.
         */
        this.updateSongMode = function(isSongMode) {
            // TODO: the song button will move somewhere better
            $(elements.transportContainer.find(settings.ctrlClass)[1]).toggleClass(settings.selectedClass, isSongMode);
        };

        /**
         * Playback started or stopped.
         */
        this.updateTransportState = function(isRunning) {
            // TODO: this must be done better
            $(elements.transportContainer.find(settings.ctrlClass)[0]).toggleClass(settings.selectedClass, isRunning);
        };

        // extend AbstractView
        WH.AbstractView.call(this, settings);
    }

    /**
     * Singleton
     */
    WH.View = new View();
})(WH);
