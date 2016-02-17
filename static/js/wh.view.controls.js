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
                activeClass: 'is-active',
                selectedClass: 'is-selected',

                ctrlClass: '.ctrl',
                ctrlGenericClass: '.ctrl--generic',
                ctrlBooleanClass: '.ctrl--boolean',
                ctrlItemizedClass: '.ctrl--itemized',
                ctrlBackgroundClass: '.ctrl__background',
                ctrlHighlightClass: '.ctrl__hilight',
                ctrlLabelClass: '.ctrl__label',
                ctrlTextClass: '.ctrl__text',
                ctrlNameClass: '.ctrl__name',
                ctrlValueClass: '.ctrl__value',

                ctrlChannelSelectClass: '.ctrl--channel-select',
                tabClass: '.ctrl--tab',

                data: {
                    paramKey:  'param_key',
                    paramType: 'param_type'
                },

                ctrlTypes: {
                    generic: 'generic',
                    itemized: 'itemized',
                    boolean: 'boolean'
                }
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                app: $('#app'),
                templates: {
                    ctrlGeneric: $('#template-ctrl-generic'),
                    ctrlBoolean: $('#template-ctrl-boolean'),
                    ctrlItemized: $('#template-ctrl-itemized'),
                    transport: $('#template-ctrl-transport'),
                    step: $('#template-step'),
                    channelSelect: $('#template-channel-select'),
                    tab: $('#template-tab')
                }
            },

            /**
             * True if a touch screen is detected.
             * @type {Boolean}
             */
            isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints,

            /**
             * Type of events to use, touch or mouse
             * @type {String}
             */
            eventType = {
                start: isTouchDevice ? 'touchstart' : 'mousedown',
                end: isTouchDevice ? 'touchend' : 'mouseup',
                click: isTouchDevice ? 'touchend' : 'click',
                move: isTouchDevice ? 'touchmove' : 'mousemove',
            },

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {

                // prevent scroll and iOS bounce effect
                if (isTouchDevice) {
                    document.ontouchmove = function(e) {
                        e.preventDefault();
                    }
                }
            };

        /**
         * Add controls for all editable parameters of a plugin.
         * @param {Object} containerEl jQuery HTML element. 
         * @param {Object} plugin WH.PlugIn type audio plugin.
         */
        this.addControls = function(containerEl, plugin) {

            var paramKey,
                param,
                paramValue,
                paramType,
                controlEl,
                hasEditableCheck = typeof plugin.isEditableParam == 'function';
            
            // add controls
            for (paramKey in plugin.params) {

                // only render parameters that are allowed to by the plugin
                if (hasEditableCheck && !plugin.isEditableParam(paramKey) ) {
                    continue;
                }

                param = plugin.params[paramKey];
                paramValue = param.value;

                switch (param.type) {
                    case 'Generic':
                        paramValue = paramValue.toFixed(1);
                        controlEl = elements.templates.ctrlGeneric.children().first().clone();
                        controlEl.find(settings.ctrlNameClass).text(param.name);
                        controlEl.find(settings.ctrlValueClass).text(paramValue);
                        paramType = settings.ctrlTypes.generic;
                        break;
                    case 'Itemized':
                        paramValue = WX.findKeyByValue(param.getModel(), paramValue);
                        controlEl = elements.templates.ctrlItemized.children().first().clone();
                        controlEl.find(settings.ctrlNameClass).text(param.name);
                        controlEl.find(settings.ctrlValueClass).text(paramValue);
                        paramType = settings.ctrlTypes.itemized;
                        break;
                    case 'Boolean':
                        controlEl = elements.templates.ctrlBoolean.children().first().clone();
                        controlEl.find(settings.ctrlTextClass).text(param.name);
                        if (paramValue) {
                            controlEl.addClass(settings.selectedClass);
                        }
                        paramType = settings.ctrlTypes.boolean;
                        break;
                }
                
                controlEl.attr('data-' + settings.data.paramKey, paramKey);
                controlEl.attr('data-' + settings.data.paramType, paramType);
                containerEl.append(controlEl);
            }

            controlEls = containerEl.find(settings.ctrlClass);

            // Boolean control click
            containerEl.find(settings.ctrlBooleanClass).on(eventType.click, function(e) {
                var controlEl = $(e.currentTarget),
                    paramKey = controlEl.data(settings.data.paramKey),
                    paramValue = !controlEl.hasClass(settings.selectedClass);

                WH.Studio.setParameter(plugin.getId(), paramKey, paramValue);
            });

            // Generic control touchstart
            containerEl.find(settings.ctrlGenericClass).on(eventType.start, function(e) {
                console.log('gen');
            });
        };

        /**
         * Update a control to reflect a changed plugin parameter.
         * @param  {Number} pluginId Unique ID of the plugin.
         * @param  {String} paramKey The parameter to change.
         * @param  {Number, String or Boolean} paramValue The new value for the parameter.
         */
        this.updateControl = function(pluginEl, paramKey, paramValue) {
            var ctrlEl = pluginEl.find(settings.ctrlClass + '[data-' + settings.data.paramKey + '="' + paramKey + '"]')
                ctrlType = ctrlEl.data(settings.data.paramType);

            switch (ctrlType) {
                case settings.ctrlTypes.generic:
                    break;
                case settings.ctrlTypes.itemized:
                    break;
                case settings.ctrlTypes.boolean:
                    ctrlEl.toggleClass(settings.selectedClass, paramValue);
                    break;
            }
        };

        /**
         * Add controls for all steps in a pattern track.
         * @param {Object} containerEl jQuery HTML element.
         * @param {Number} amount      Number of steps to add.
         */
        this.addStepControls = function(containerEl, amount) {
            var i = 0,
                stepEl;
            for (i; i < amount; i++) {
                stepEl = elements.templates.step.children().first().clone();
                stepEl.find(settings.ctrlTextClass).text(i + 1);
                containerEl.append(stepEl);
            }
        };

        /**
         * Add the controls that selects a channel in the mixer.
         * @param {Object} containerEl jQuery HTML element.
         * @param {Number} color       Hex number for the colour of the channel.
         * @param {String} label       Label to display on the channel.
         */
        this.addChannelSelectControls = function(containerEls, colorClasses) {
            var i = 0,
                n = containerEls.length,
                channelSelectEl,
                channelSelectEls;

            for (i; i < n; i++) {
                var channelSelectEl = elements.templates.channelSelect.children().first().clone();
                channelSelectEl.find(settings.ctrlTextClass).text(String.fromCharCode(65 + i));
                channelSelectEl.find(settings.ctrlBackgroundClass).addClass(colorClasses[i]);
                channelSelectEl.find(settings.ctrlHighlightClass).addClass(colorClasses[i]);
                $(containerEls[i]).append(channelSelectEl);
            }

            channelSelectEls = containerEls.find(settings.ctrlChannelSelectClass);
            channelSelectEls.on(eventType.click, function(e) {
                var index = channelSelectEls.index(e.currentTarget);
                WH.View.setSelectedChannel(index);
            });
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
            tabEls.on(eventType.click, function(e) {
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
                ctrlEl;

            for (i; i < n; i++) {
                ctrlEl = elements.templates.transport.children().first().clone();
                ctrlEl.find(settings.ctrlTextClass).text(data[i]);
                containerEl.append(ctrlEl);
            }
        };

        /**
         * Set the color of a selection of controls.
         * @param {Object} controls jQuery selection of elements.
         * @param {String} colorClass Class to add that contains the color CSS.
         */
        this.setColor = function(controls, colorClass) {
            controls.find(settings.ctrlBackgroundClass).addClass(colorClass);
            controls.find(settings.ctrlHighlightClass).addClass(colorClass);
        };

        /**
         * Clear the colors of a selection of controls.
         * @param {Object} controls jQuery selection of elements.
         * @param  {Array} colorClasses CSS classes to remove from the controls.
         */
        this.clearColors = function(controls, colorClasses) {
            var i = 0,
                n = colorClasses.length;
            for (i; i < n; i++) {
                controls.find(settings.ctrlBackgroundClass).removeClass(colorClasses[i]);
                controls.find(settings.ctrlHighlightClass).removeClass(colorClasses[i]);
            }
        };

        /**
         * Play the light up animation of a control.
         * @param {Object} controls jQuery selection of elements.
         */
        this.animateHighlight = function(controls) {
            controls.find(settings.ctrlHighlightClass)
                .show()
                .stop()
                .fadeIn(0)
                .fadeOut(300);
        }

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