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
                rackClass: '.rack',
                rackGeneratorContainerClass: '.rack__generator'
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                channelContainer: $('.channels'),
                racks: null,
                rackContainer: $('.racks'),
                rackTemplate: $('#template-rack'),
            },

            /**
             * WH.PluginView plugin view objects.
             * Instruments, channels, all together by ID.
             * @type {Object}
             */
            pluginViews = {},

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                var i = 0,
                    n = conf.getTrackCount(),
                    rackEl;
                    
                // create the plugin racks
                for (i = 0; i < n; i++) {
                    rackEl = elements.rackTemplate.children().first().clone();
                    elements.rackContainer.append(rackEl);
                }

                elements.racks = elements.rackContainer.find(settings.rackClass);
            };

        /**
         * Initialization.
         */
        this.setup = function() {
            init();
        };

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
