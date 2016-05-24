/**
 * ControlsView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function ControlsView() {

        // private variables
        var settings = {
                ctrlChannelSelectClass: '.ctrl--channel-select',
                tabClass: '.ctrl--tab',
                transportClass: '.ctrl--transport',
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                templates: {
                    transport: $('#template-ctrl-transport'),
                    channelSelect: $('#template-channel-select'),
                    tab: $('#template-tab')
                }
            },

            /**
             * Reference to this once function has closed.
             * @type {Object}
             */
            self = this,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                // prevent scroll and iOS bounce effect
                if (this.isTouchDevice) {
                    document.ontouchmove = function(e) {
                        e.preventDefault();
                    }
                }
            };

        /**
         * Add the controls that selects a channel in the mixer.
         * @param {Object} containerEls jQuery HTML element.
         */
        this.addChannelSelectControls = function(containerEl) {
            var i = 0,
                n = WH.Conf.getTrackCount(),
                channelSelectEl,
                channelSelectEls;

            for (i; i < n; i++) {
                var channelSelectEl = elements.templates.channelSelect.children().first().clone();
                channelSelectEl.find(settings.ctrlTextClass).text(String.fromCharCode(65 + i));
                channelSelectEl.find(settings.ctrlBackgroundClass).addClass(settings.channelColorClasses[i]);
                channelSelectEl.find(settings.ctrlHighlightClass).addClass(settings.channelColorClasses[i]);
                $(containerEl).append(channelSelectEl);
            }

            channelSelectEls = containerEl.find(settings.ctrlChannelSelectClass);
            channelSelectEls.on(self.eventType.click, function(e) {
                var index = channelSelectEls.index(e.currentTarget);
                WH.View.setSelectedChannel(index);
            });

            return channelSelectEls;
        };

        /**
         * Add the tab controls to the tab bar.
         * @param {Object} containerEl jQuery HTML element.
         * @param {Array} data Array of tab label strings.
         * @return {Object} jQuery selector of the tab DOM elements.
         */
        this.addTabControls = function(containerEl, data) {
            var i = 0,
                n = data.length,
                tabEl,
                tabEls;

            for (i; i < n; i++) {
                tabEl = elements.templates.tab.children().first().clone();
                tabEl.find(settings.ctrlTextClass).text(data[i]);
                containerEl.append(tabEl);
            }

            tabEls = containerEl.find(settings.tabClass);
            tabEls.on(self.eventType.click, function(e) {
                var index = tabEls.index(e.currentTarget);
                WH.View.setSelectedTab(index);
            });

            return tabEls;
        };

        /**
         * Add the controls to the transport bar.
         * @param {Object} containerEl jQuery HTML element.
         * @param {Array} data Array of tab label strings.
         */
        this.addTransportControls = function(containerEl, data) {
            var i = 0,
                n = data.length,
                ctrlEl,
                ctrlEls;

            for (i; i < n; i++) {
                ctrlEl = elements.templates.transport.children().first().clone();
                ctrlEl.find(settings.ctrlTextClass).text(data[i]);
                containerEl.append(ctrlEl);
            }

            ctrlEls = containerEl.find(settings.transportClass);
            ctrlEls.on(self.eventType.click, function(e) {
                var index = ctrlEls.index(e.currentTarget);
                switch (index) {
                    case 0:
                        // play
                        WH.TimeBase.togglePlayStop();
                        break;
                    case 1:
                        // song
                        WH.arrangement.toggleSongMode();
                        break;
                    case 2:
                        // new
                        WH.TimeBase.pause();
                        WH.DialogView({
                            headerText: 'New Project',
                            bodyText: 'Are you sure? If you create a new project, the current project will be lost.',
                            primaryCallback: function() {
                                WH.File.createNew();
                            }
                        });
                        break;
                    case 3:
                        // random
                        WH.TimeBase.pause();
                        WH.DialogView({
                            headerText: 'Random Project',
                            bodyText: 'Are you sure? If you create a new random project, the current project will be lost.',
                            primaryCallback: function() {
                                WH.File.createNew(true);
                            }
                        });
                        break;
                }
            });
        };

        // extend AbstractView
        WH.AbstractView.call(this, settings);

        // initialise
        init();
    }

    /**
     * Exports
     */
    WH.ControlsView = function() {
        return new ControlsView();
    };

})(WH);
