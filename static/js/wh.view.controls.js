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
                ctrlClass: '.ctrl',
                ctrlBackgroundClass: '.ctrl__background',
                ctrlHighlightClass: '.ctrl__hilight',
                ctrlGenericClass: '.ctrl--generic',
                ctrlLabelClass: '.ctrl__label',
                ctrlTextClass: '.ctrl__text',
                ctrlNameClass: '.ctrl__name',
                ctrlValueClass: '.ctrl__value',

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
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
            };

        /**
         * Add controls for all editable parameters of a plugin.
         * @param {Object} containerEl jQuery HTML element. 
         * @param {Object} plugin      WH.PlugIIn type audio plugin.
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
        this.addChannelSelectControl = function(containerEl, color, label) {
            var channelSelectEl = elements.templates.channelSelect.children().first().clone();
            channelSelectEl.find(settings.ctrlTextClass).text(label);
            channelSelectEl.find(settings.ctrlBackgroundClass).addClass(color);
            channelSelectEl.find(settings.ctrlHighlightClass).addClass(color);
            containerEl.append(channelSelectEl);
        };

        /**
         * Add the tab controls to the tab bar.
         * @param {Object} containerEl jQuery HTML element.
         * @param {Array} data Array of tab label strings.
         */
        this.addTabControls = function(containerEl, data) {
            var i = 0,
                n = data.length,
                tabEl;

            for (i; i < n; i++) {
                tabEl = elements.templates.tab.children().first().clone();
                tabEl.find(settings.ctrlTextClass).text(data[i]);
                containerEl.append(tabEl);
            }
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