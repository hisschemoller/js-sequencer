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
                ctrlGenericClass: '.ctrl--generic',
                ctrlBooleanClass: '.ctrl--boolean',
                ctrlItemizedClass: '.ctrl--itemized',

                overlayName: '.overlay-ctrl__name',
                overlayValue: '.overlay-ctrl__value',
                overlayMin: '.overlay-ctrl__min',
                overlayMax: '.overlay-ctrl__max',
                overlaySlider: '.overlay-ctrl__slider',
                overlaySliderThumb: '.overlay-ctrl__slider-thumb',

                ctrlChannelSelectClass: '.ctrl--channel-select',
                tabClass: '.ctrl--tab',
                transportClass: '.ctrl--transport',

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
                overlayCtrlGeneric: $('#overlay-ctrl-generic'),

                templates: {
                    ctrlGeneric: $('#template-ctrl-generic'),
                    ctrlBoolean: $('#template-ctrl-boolean'),
                    ctrlItemized: $('#template-ctrl-itemized'),
                    transport: $('#template-ctrl-transport'),
                    // step: $('#template-step'),
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
            },

            /**
             * Boolean control clicked on a plugin.
             * @param {Event} e Touch end or mouse click event.
             */
            onBooleanControlClick = function(e) {
                var controlEl = $(e.currentTarget),
                    paramKey = controlEl.data(settings.data.paramKey),
                    paramValue = !controlEl.hasClass(settings.selectedClass);

                WH.Studio.setParameter(e.data.plugin.getId(), paramKey, paramValue);
            },

            /**
             * Generic control pressed on a plugin.
             * @param {Event} e Touchstart or mousedoen event.
             */
            onGenericControlTouchStart = function(e) {
                e.preventDefault();
                // get parameter from plugin
                var slider = elements.overlayCtrlGeneric.find(settings.overlaySlider),
                    thumb = elements.overlayCtrlGeneric.find(settings.overlaySliderThumb),
                    paramKey = $(e.currentTarget).data(settings.data.paramKey),
                    param = e.data.plugin.getParameterValues(paramKey),
                    normalValue = (param.value - param.min) / (param.max - param.min),
                    eventData = {
                        pluginId: e.data.plugin.getId(),
                        paramKey: paramKey,
                        param: param
                    };

                elements.overlayCtrlGeneric.show();
                elements.overlayCtrlGeneric.find(settings.overlayName).text(param.name);
                elements.overlayCtrlGeneric.find(settings.overlayValue).text(param.value.toFixed(2));
                elements.overlayCtrlGeneric.find(settings.overlayMin).text(param.min.toFixed(1));
                elements.overlayCtrlGeneric.find(settings.overlayMax).text(param.max.toFixed(1));
                elements.app.on(self.eventType.move, eventData, onGenericOverlayTouchMove);
                elements.app.on(self.eventType.end, eventData, onGenericOverlayTouchEnd);

                thumb.height(slider.height() * normalValue);
            },

            /**
             * Generic control overlay touchend or mouseup.
             * @param {Event} e Touch or mouse end event.
             */
            onGenericOverlayTouchEnd = function(e) {
                elements.overlayCtrlGeneric.hide();
                elements.app.off(self.eventType.move, onGenericOverlayTouchMove);
                elements.app.off(self.eventType.end, onGenericOverlayTouchEnd);
            },

            /**
             * Generic control overlay touchend or mouseup.
             * @param {Event} e Touch or mouse move event.
             */
            onGenericOverlayTouchMove = function(e) {
                var slider = elements.overlayCtrlGeneric.find(settings.overlaySlider),
                    y = self.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY;
                    normalValue = Math.max(0, 1 - Math.min(((y - slider.offset().top) / slider.height()), 1));
                    // value = e.data.param.min + ((e.data.param.max - e.data.param.min) * normalValue);
                WH.Studio.setParameter(e.data.pluginId, e.data.paramKey, normalValue);
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

            // data to send to the DOM event handlers
            var eventData = {
                plugin: plugin
            };

            // DOM event handlers
            containerEl.find(settings.ctrlBooleanClass).on(this.eventType.click, eventData, onBooleanControlClick);
            containerEl.find(settings.ctrlGenericClass).on(this.eventType.start, eventData, onGenericControlTouchStart);
        };

        /**
         * Update a control to reflect a changed plugin parameter.
         * @param  {Number} pluginId Unique ID of the plugin.
         * @param  {String} paramKey The parameter to change.
         * @param  {Number|String|Boolean} paramValue The new value for the parameter.
         * @param {Number|Boolean} paramValueNormalized Value converted for use by view.
         */
        this.updateControl = function(pluginEl, paramKey, paramValue, paramValueNormalized) {
            var ctrlEl = pluginEl.find(settings.ctrlClass + '[data-' + settings.data.paramKey + '="' + paramKey + '"]'),
                ctrlType = ctrlEl.data(settings.data.paramType);

            switch (ctrlType) {
                case settings.ctrlTypes.generic:
                    var slider = elements.overlayCtrlGeneric.find(settings.overlaySlider);
                    ctrlEl.find(settings.ctrlValueClass).text(paramValue.toFixed(2));
                    elements.overlayCtrlGeneric.find(settings.overlayValue).text(paramValue.toFixed(2));
                    elements.overlayCtrlGeneric.find(settings.overlaySliderThumb).height(slider.height() * paramValueNormalized);
                    break;
                case settings.ctrlTypes.itemized:
                    break;
                case settings.ctrlTypes.boolean:
                    ctrlEl.toggleClass(settings.selectedClass, paramValue);
                    break;
            }
        };

        /**
         * Add the controls that selects a channel in the mixer.
         * @param {Object} containerEls jQuery HTML element.
         * @param {Array} colorClasses Array of CSS colour class names.
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
            channelSelectEls.on(self.eventType.click, function(e) {
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
                        var isRunning = WH.TimeBase.togglePlayStop();
                        $(e.currentTarget).toggleClass(settings.activeClass, isRunning);
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
