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
                channelClass: '.channel',
                channelSelectClass: '.channel__select',
                channelControlsClass: '.channel__controls',
                channelColorClasses: ['color1', 'color2', 'color3', 'color4'],

                rackClass: '.rack',
                rackGeneratorClass: '.rack__generator',

                pluginClass: '.plugin',
                pluginControlsClass: '.plugin__controls',

                data: {
                    pluginId: 'plugin_id'
                },

                tabs: ['Sound', 'Mixer', 'Song', ''],

                transport: ['Play']
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                steps: null,
                stepsContainer: $('.steps'),

                channels: null,
                channelContainer: $('.channels'),
                channelTemplate: $('#template-channel'),

                racks: null,
                rackContainer: $('.racks'),
                rackTemplate: $('#template-rack'),

                transportContainer: $('.transport'),
                pluginTemplate: $('#template-plugin'),
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
             * Initialise the view, add DOM event handlers.
             */
            init = function() {

                controls = WH.ControlsView();

                // create the step elements
                elements.steps = controls.addStepControls(elements.stepsContainer, WH.Conf.getStepCount());

                // create the channel elements
                var i = 0,
                    n = WH.Conf.getTrackCount(),
                    channelEl;

                for (i; i < n; i++) {
                    // create channel element
                    channelEl = elements.channelTemplate.children().first().clone();
                    elements.channelContainer.append(channelEl);
                }
                elements.channels = $(settings.channelClass);

                // create channel select controls.
                var channelSelectContainers = elements.channelContainer.find(settings.channelSelectClass);
                controls.addChannelSelectControls(channelSelectContainers, settings.channelColorClasses);

                // create the plugin racks
                var i = 0,
                    n = WH.Conf.getTrackCount(),
                    rackEl,
                    generatorRackspaceEls,
                    generatorPluginEl;

                // create a rack for each channel
                for (i; i < n; i++) {
                    rackEl = elements.rackTemplate.children().first().clone();
                    elements.rackContainer.append(rackEl);
                }

                elements.racks = elements.rackContainer.find(settings.rackClass);

                // add an empty default generator plugin to each rack 
                generatorPluginEl = elements.pluginTemplate.children().first().clone();
                elements.racks.find(settings.rackGeneratorClass).append(generatorPluginEl);

                // create tabs
                elements.tabs = controls.addTabControls(elements.tabContainer, settings.tabs);

                // create transport buttons
                controls.addTransportControls(elements.transportContainer, settings.transport);

                self.setSelectedChannel(0);
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
                    step,
                    stepEl;

                for (i; i < n; i++) {
                    step = stepArray[i];
                    
                    // update the steps
                    if (step.channel == channelIndex) {
                        elements.steps.removeClass(settings.activeClass);
                        stepEl = $(elements.steps[step.index]);
                        stepEl.addClass(settings.activeClass);
                        controls.animateHighlight(stepEl);
                    }

                    // update the channels
                    if (step.velocity > 0) {
                        controls.animateHighlight($(elements.channels[step.channel]).find(settings.channelSelectClass));
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
         * Set a tab as selected and update the view state..
         * @param {Number} index Index of the tab to select.
         */
        this.setSelectedTab = function(index) {
            var tabEl = $(elements.tabs[index]);
                isOpen = tabEl.hasClass(settings.selectedClass),
                openTabs = elements.tabs.filter('.' + settings.selectedClass),
                i = 0,
                n = openTabs.length;

            for (i; i < n; i++) {
                var tab = $(openTabs[i]),
                    tabIndex = elements.tabs.index(tab);
                tab.removeClass(settings.selectedClass);
                switch (tabIndex) {
                    case 1:
                        // close mixer
                        elements.channels.find(settings.channelControlsClass).slideUp();
                        break;
                }
            }

            if (!isOpen) {
                tabEl.addClass(settings.selectedClass);
                switch (index) {
                    case 1:
                        // open mixer
                        elements.channels.find(settings.channelControlsClass).slideDown();
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

            elements.channels.removeClass(settings.selectedClass);
            elements.channels.get(channelIndex).className += ' ' + settings.selectedClass;

            elements.racks.removeClass(settings.selectedClass);
            elements.racks.get(channelIndex).className += ' ' + settings.selectedClass;

            self.setSelectedSteps(channelIndex);
        };

        /**
         * Update the pattern to show selected steps.
         * Typically after switching patterns or tracks.
         * @param {Number} index Channel / track index.
         */
        this.setSelectedSteps = function(index) {
            var steps = WH.Project.getTrackSteps(index),
                id,
                channelColorClass = settings.channelColorClasses[index];

            controls.clearColors(elements.steps, settings.channelColorClasses);

            // set selected state
            elements.steps.removeClass(settings.selectedClass);
            for (var id in steps) {
                var step = steps[id];
                if (step.velocity) {
                    var stepEl = $(elements.steps[step.index]);
                    stepEl.addClass(settings.selectedClass);
                }
            }

            controls.setColor($(elements.steps.filter('.' + settings.selectedClass)), channelColorClass);
        };

        /**
         * Fill a mixer channel with mixer channel controls.
         * This happens once because the mixer is created only once.
         * @param {Object} channel WX.PlugIn Processor object.
         * @param {Number} index Channel index in which to create the channel controls.
         */
        this.setChannel = function(channel, index) {
            var channelEl = $(elements.channels[index]),
                controlsEl = channelEl.find(settings.channelControlsClass);

            channelEl.attr('data-' + settings.data.pluginId, channel.getId());
            controls.addControls(controlsEl, channel);
            controls.setColor(controlsEl, settings.channelColorClasses[index]);
        };

        /**
         * Set the instrument controls,
         * typically after project initialisation or channel switch.
         * @param {Object} instrument WX.PlugIn Generator object.
         * @param {Number} index Rack index in which to set the instrument.
         */
        this.setInstrument = function(instrument, index) {
            var rack = $(elements.racks[index]),
                generatorRack = rack.find(settings.rackGeneratorClass),
                controlsEl = generatorRack.find(settings.pluginControlsClass);

            controlsEl.empty();
            controls.addControls(controlsEl, instrument);
            controls.setColor(controlsEl, settings.channelColorClasses[index]);
        };

        /**
         * Update a control to reflect a changed plugin parameter.
         * @param  {Number} pluginId Unique ID of the plugin.
         * @param  {String} paramKey The parameter to change.
         * @param  {Number, String or Boolean} paramValue The new value for the parameter.
         */
        this.updatePluginControl = function(pluginId, paramKey, paramValue) {
            var pluginEl = $('[data-' + settings.data.pluginId + '="' + pluginId + '"]');
            controls.updateControl(pluginEl, paramKey, paramValue);
        };

        // extend AbstractView
        WH.AbstractView.call(this, settings);

        // initialise
        init();
    }
    
    /** 
     * Singleton
     */
    WH.View = new View();
})(WH);
