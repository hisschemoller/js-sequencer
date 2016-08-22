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
    function View(specs) {
        
        // private variables
        var arrangement = specs.arrangement,
            channelSelectView = specs.channelSelectView,
            conf = specs.conf,
            core = specs.core,
            file = specs.file,
            patternSelectView = specs.patternSelectView,
            stepsView = specs.stepsView,
            songView = specs.songView,
            studio = specs.studio,
            transport = specs.transport,
            tracksView = specs.tracksView,
            settings = {
                // channelSelectClass: '.channel__select',
                rackClass: '.rack',
                rackGeneratorContainerClass: '.rack__generator',

                tabs: ['Sound', 'Mixer', 'Pattern', 'Song'],
                // transport: ['Play', 'Song', 'New', 'Random']
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                // channelSelects: null,
                // channelSelectsContainer: $('.channel-selects'),
                channelContainer: $('.channels'),
                racks: null,
                rackContainer: $('.racks'),
                rackTemplate: $('#template-rack'),
                // transportContainer: $('.transport'),
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
            // stepsView = null,

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
            // patterns = null,
            
            /**
             * Number of columns to display based on window width. 
             */
            responsiveCols = 0,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                var i = 0,
                    n = conf.getTrackCount(),
                    rackEl;
                    
                controls = WH.ControlsView({
                    arrangement: arrangement,
                    conf: conf,
                    file: file,
                    /* transport: transport, */
                    view: this
                });

                // stepsView = WH.StepsView({
                //     arrangement: arrangement,
                //     conf: conf
                // });

                // patterns = WH.PatternView({
                //     arrangement: arrangement,
                //     conf: conf
                // });

                // create the channel select buttons
                // elements.channelSelects = controls.addChannelSelectControls(elements.channelSelectsContainer);

                // create the plugin racks
                for (i = 0; i < n; i++) {
                    rackEl = elements.rackTemplate.children().first().clone();
                    elements.rackContainer.append(rackEl);
                }

                elements.racks = elements.rackContainer.find(settings.rackClass);

                // create tabs
                elements.tabs = controls.addTabControls(elements.tabContainer, settings.tabs);

                // create transport buttons
                // controls.addTransportControls(elements.transportContainer, settings.transport);

                self.setSelectedTab(0);
            }.bind(this),
            
            /**
             * Shortcut keys.
             */
            initDomEvents = function() {
                document.addEventListener('keydown', function(e) {
                    switch (e.keyCode) {
                        case 32:
                            transport.toggleStartStop();
                            break;
                        case 192: // 192 == '~'
                            if (e.altKey) {
                                file.createNew(true);
                                //arrangement.setSelectedPattern(9);
                                arrangement.toggleSongMode();
                                transport.rewind();
                                transport.start();
                            }
                            break;
                    }
                });
                
                window.addEventListener('resize', onResize);
            },
            
            /**
             * 
             */
            onResize = function(e) {
                var w = window.innerWidth,
                    prevResponsiveCols = responsiveCols;
                
                if (w < 640 && responsiveCols !== 1) {
                    responsiveCols = 1;
                } else if (w >= 640 && w < 960 && responsiveCols !== 2) {
                    responsiveCols = 2;
                    isChanged = true;
                } else if (w >= 960 && w < 1280 && responsiveCols !== 3) {
                    responsiveCols = 3;
                } else if (w >= 1280 && responsiveCols !== 4) {
                    responsiveCols = 4;
                }
                
                if (responsiveCols != prevResponsiveCols) {
                    document.getElementsByTagName('main')[0].dataset.cols = responsiveCols;
                }
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
                    if (step.getChannel() == channelIndex) {
                        stepsView.updateActiveStep(step.getIndex());
                    }

                    // update the channel selects
                    if (step.getVelocity() > 0) {
                        channelSelectView.animateHighlight(step.getChannel());
                    }
                }
            };

        /**
         * Initialization.
         */
        this.setup = function() {
            init();
            initDomEvents();
            onResize();
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
                start = Math.max(0, core.getNow() - step.getAbsStart()) * 1000;

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
                        stepsView.setVisible(true);
                        channelSelectView.setVisible(true);
                        elements.channelContainer.hide();
                        elements.rackContainer.show();
                        patternSelectView.setVisible(false);
                        tracksView.setVisible(false);
                        songView.setVisible(false);
                        break;
                    case 1:
                        // open mixer
                        stepsView.setVisible(true);
                        channelSelectView.setVisible(true);
                        elements.channelContainer.show();
                        elements.rackContainer.hide();
                        patternSelectView.setVisible(false);
                        tracksView.setVisible(false);
                        songView.setVisible(false);
                        break;
                    case 2:
                        // open patterns
                        stepsView.setVisible(true);
                        channelSelectView.setVisible(true);
                        elements.channelContainer.hide();
                        elements.rackContainer.hide();
                        patternSelectView.setVisible(true);
                        tracksView.setVisible(true);
                        songView.setVisible(false);
                        break;
                    case 3:
                        // open song
                        stepsView.setVisible(false);
                        channelSelectView.setVisible(false);
                        elements.channelContainer.hide();
                        elements.rackContainer.hide();
                        patternSelectView.setVisible(false);
                        tracksView.setVisible(false);
                        songView.setVisible(true);
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
        // this.setSelectedChannel = function(index) {
        //     if (index == channelIndex) {
        //         return;
        //     }
        // 
        //     channelIndex = index;
        // 
        //     elements.channelSelects.removeClass(settings.selectedClass);
        //     elements.channelSelects.get(channelIndex).className += ' ' + settings.selectedClass;
        // 
        //     elements.racks.removeClass(settings.selectedClass);
        //     elements.racks.get(channelIndex).className += ' ' + settings.selectedClass;
        // 
        //     this.setSelectedSteps();
        // };

        /**
         * Update the pattern to show selected steps.
         * Typically after switching patterns or tracks.
         * @param {Number} index Channel / track index.
         */
        // this.setSelectedSteps = function(index) {
        //     index = isNaN(index) ? channelIndex : index;
        //     stepsView.setSelected(index);
        // };

        /**
         * Set the selected pattern element.
         * @param {Number} index Index of the element to set as selected.
         */
        // this.setSelectedPattern = function(index) {
        //     patterns.setSelected(index);
        // };

        /**
         * Fill a mixer channel with mixer channel controls.
         * This happens once because the mixer is created only once.
         * @param {Object} channel Plugin Processor object.
         * @param {Number} index Channel index in which to create the channel controls.
         */
        this.setChannel = function(channel, index) {
            var pluginView,
                containerEl = elements.channelContainer;

            pluginViews[channel.getId()] = WH.PluginView(channel, containerEl, index, studio, file);
        };

        /**
         * Set the instrument controls,
         * typically after project initialisation or channel switch.
         * @param {Object} instrument Plugin Generator object.
         * @param {Number} index Rack index in which to set the instrument.
         */
        this.setInstrument = function(instrument, index) {
            var pluginView,
                rackEl = $(elements.racks[index]),
                containerEl = rackEl.find(settings.rackGeneratorContainerClass);

            pluginViews[instrument.getId()] = WH.PluginView(instrument, containerEl, index, studio, file);
        };

        /**
         * Remove the instrument from the rack and delete it
         * @param {Object} instrument Plugin Generator object.
         * @param {Number} index Rack index from which to remove the instrument.
         */
        this.clearInstrument = function(instrument, index) {
            var pluginID = instrument.getId();
            if (pluginID) {
                pluginViews[pluginID].destroy();
                delete pluginViews[pluginID];
            }
        }

        /**
         * Update a control to reflect a changed plugin parameter.
         * @param {Number} pluginId Unique ID of the plugin.
         * @param {String} paramKey The parameter to change.
         * @param {Object} param Parameter object.
         */
        this.updatePluginControl = function(pluginId, paramKey, param) {
            pluginViews[pluginId].updateControl(paramKey, param);
        };

        /**
         * Song mode entered or left.
         */
        // this.updateSongMode = function(isSongMode) {
        //     // TODO: the song button will move somewhere better
        //     $(elements.transportContainer.find(settings.ctrlClass)[1]).toggleClass(settings.selectedClass, isSongMode);
        // };  

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
     * Exports
     */
    WH.createView = function(specs) {
        return new View(specs);
    };
})(WH);
