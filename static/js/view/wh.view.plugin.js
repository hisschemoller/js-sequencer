/**
 * Mixer view that contains the channel plugin views.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createPluginView(specs) {

        // private variables
        var that = specs.that = {},
            pubSub = specs.pubSub,
            plugin = specs.plugin,
            pluginId,
            parameterEditView = specs.parameterEditView,
            rootEl,
            colorClass,
            
            selectors = {
                plugin: '.plugin',
                header: '.plugin__header',
                name: '.plugin__name-label',
                controls: '.plugin__controls',
                page: '.plugin__page',
                pagePrev: '.plugin__page-prev',
                pageNext: '.plugin__page-next',
                pageNumber: '.plugin__page-number'
            },

            templates = {
                header: $('#template-plugin-header'),
                ctrlGeneric: $('#template-ctrl-generic'),
                ctrlBoolean: $('#template-ctrl-boolean'),
                ctrlItemized: $('#template-ctrl-itemized'),
                overlayControlItem: $('#template-overlay-ctrl-item')
            },

            dataAttr = {
                pluginId: 'plugin_id',
                paramKey:  'param_key',
                paramType: 'param_type'
            },

            ctrlTypes = {
                generic: 'generic',
                itemized: 'itemized',
                boolean: 'boolean'
            },
            
            init = function() {
                var pluginTemplate;
                
                pluginTemplate = $('#template-plugin-' + plugin.getName());
                rootEl = pluginTemplate.children().first().clone();
                rootEl.appendTo(specs.parentEl);
                addHeader();
                addControls();
                changePage(0, 0);
                
                // set color of the channel
                colorClass = my.classes.colors[specs.index];
                rootEl.find(my.selectors.ctrlBackground).addClass(colorClass);
                rootEl.find(my.selectors.ctrlHighlight).addClass(colorClass);
                
                // add listener for changed plugin parameter values
                pluginId = plugin.getId();
                pubSub.on(pluginId, onParameterChange);
            },

            /**
             * Add a header to the plugin if a header container element is
             * present in the plugin template.
             */
            addHeader = function() {
                var headerContainer = rootEl.find(selectors.header);
                if (!headerContainer.length) {
                    return;
                }

                // add the header to the plugin
                var headerEl = templates.header.children().clone();
                headerEl.appendTo(headerContainer);
                headerContainer.find(selectors.name).text(plugin.getTitle());
                
                // add pagination if there's mupltiple control pages
                var pageEls = rootEl.find(selectors.page),
                    prevEl = headerContainer.find(selectors.pagePrev),
                    nextEl = headerContainer.find(selectors.pageNext);
                if (pageEls.length > 1) {
                    prevEl.on(my.eventType.click, {dir:-1}, onPagingClick);
                    nextEl.on(my.eventType.click, {dir: 1}, onPagingClick);
                } else {
                    prevEl.addClass(my.classes.disabled);
                    nextEl.addClass(my.classes.disabled);
                }
            },

            /**
             * Add controls to the plugin based on the plugin's parameters and the template's control container elements.
             */
            addControls = function() {
                var paramKey,
                    paramValue,
                    param,
                    controlContainer,
                    pluginParams = plugin.getParams();
                
                for (paramKey in pluginParams) {
                    controlContainer = rootEl.find('.' + paramKey);

                    if (controlContainer.length) {
                        param = pluginParams[paramKey];
                        paramValue = param.getValue();

                        switch (param.getType()) {
                            case 'generic':
                                paramValue = paramValue.toFixed(1);
                                controlEl = templates.ctrlGeneric.children().first().clone();
                                controlEl.find(my.selectors.ctrlName).text(param.getName());
                                controlEl.find(my.selectors.ctrlValue).text(paramValue);
                                break;
                            case 'itemized':
                                controlEl = templates.ctrlItemized.children().first().clone();
                                controlEl.find(my.selectors.ctrlName).text(param.getName());
                                controlEl.find(my.selectors.ctrlValue).text(param.getLabel());
                                break;
                            case 'boolean':
                                controlEl = templates.ctrlBoolean.children().first().clone();
                                controlEl.find(my.selectors.ctrlText).text(param.getName());
                                if (paramValue) {
                                    controlEl.addClass(my.classes.selected);
                                }
                                break;
                            default:
                                console.error('Parameter type ', param.getType(), ' is not supported.');
                        }

                        controlEl.attr('data-' + dataAttr.paramKey, paramKey);
                        controlEl.attr('data-' + dataAttr.paramType, param.getType());
                        controlContainer.append(controlEl);
                    }
                }

                // data to send to the DOM event handlers
                // var eventData = {
                //     plugin: plugin
                // };

                // DOM event handlers
                rootEl.find(selectors.controls).on(my.eventType.click, onControlClick);
                rootEl.find(selectors.controls).on(my.eventType.start, onControlTouchStart);
                // pluginEl.find(settings.ctrlBooleanClass).on(my.eventType.click, eventData, onBooleanControlClick);
                // pluginEl.find(settings.ctrlGenericClass).on(my.eventType.start, eventData, onGenericControlTouchStart);
                // pluginEl.find(settings.ctrlItemizedClass).on(my.eventType.start, eventData, onItemizedControlTouchStart);
            },
            
            /**
             * Click on the plugin controls area.
             * @param {Event} Click or touch event.
             */
            onControlClick = function(e) {
                var ctrlEl, param, paramKey, paramValue;
                // click is only used for boolean controls
                ctrlEl = $(e.target).closest(my.selectors.ctrl);
                if (ctrlEl.length && ctrlEl.attr('data-' + dataAttr.paramType)) {
                    if (ctrlEl.attr('data-' + dataAttr.paramType) === ctrlTypes.boolean) {
                        paramKey = ctrlEl.attr('data-' + dataAttr.paramKey);
                        paramValue = !ctrlEl.hasClass(my.classes.selected);
                        param = plugin.getParam(paramKey);
                        param.setValue(paramValue);
                    }
                }
            },
            
            /**
             * Touchstart or mousedown on the plugin controls area.
             * @param {Event} Click or touch event.
             */
            onControlTouchStart = function(e) {
                var ctrlEl, paramType, paramKey, param;
                ctrlEl = $(e.target).closest(my.selectors.ctrl);
                if (ctrlEl.length) {
                    paramType = ctrlEl.attr('data-' + dataAttr.paramType);
                    paramKey = ctrlEl.attr('data-' + dataAttr.paramKey);
                    if (paramType === ctrlTypes.generic || paramType === ctrlTypes.itemized) {
                        param = plugin.getParam(paramKey);
                        parameterEditView.showParam(param);
                    }
                }
            },

            /**
             * Click on the previous or next page buttons.
             * @param {Event} Click or touch event.
             */
            onPagingClick = function(e) {
                changePage(e.data.dir);
            },

            /**
             * Change to another page of contols.
             * @param {Number} relativeChange New page index relative to the current.
             * @param {Number} relativeChange
             */
            changePage = function(relativeChange, absoluteChange) {
                var pageEls = rootEl.find(selectors.page),
                    prevEl = rootEl.find(selectors.pagePrev),
                    nextEl = rootEl.find(selectors.pageNext),
                    numberEl = rootEl.find(selectors.pageNumber),
                    currentPageEl = pageEls.filter('.' + my.classes.selected),
                    currentIndex = pageEls.index(currentPageEl),
                    newIndex,
                    lastIndex = pageEls.length - 1;

                // get the new page index
                if (!isNaN(relativeChange) && relativeChange != 0) {
                    newIndex = currentIndex + relativeChange;
                } else {
                    if (!isNaN(absoluteChange)) {
                        newIndex = absoluteChange;
                    }
                }

                // integers and clamp to existing page indexes
                newIndex = Math.floor(newIndex);
                newIndex = Math.max(0, Math.min(newIndex, lastIndex));

                // disable or enable page buttons
                prevEl.toggleClass(my.classes.disabled, newIndex == 0);
                nextEl.toggleClass(my.classes.disabled, newIndex == lastIndex);
                
                // set paging info text
                numberEl.find(my.selectors.ctrlText).text((newIndex + 1) + '/' + pageEls.length);

                // update selected page
                pageEls.removeClass(my.classes.selected);
                $(pageEls[newIndex]).addClass(my.classes.selected);
            },
            
            /**
             * Remove event listeners and plugin HTML.
             */
            destroy = function() {
                pubSub.off(pluginId, onParameterChange);
                rootEl.find(selectors.pagePrev).off(my.eventType.click);
                rootEl.find(selectors.pageNext).off(my.eventType.click);
                rootEl.find(selectors.ctrlBoolean).off(my.eventType.click);
                rootEl.find(selectors.ctrlGeneric).off(my.eventType.start);
                rootEl.find(selectors.ctrlItemized).off(my.eventType.start);
                rootEl.remove();
            },

            /**
             * Update a control to reflect a changed plugin parameter.
             * @param {Number} pluginId Unique ID of the plugin.
             * @param {object} data Changed parameter data object.
             * @param {String} data.paramKey The parameter to change.
             * @param {Object} data.param Parameter object.
             */
             onParameterChange = function(data) {
                var paramKey = data.key,
                    param = data.param,
                    ctrlEl = rootEl.find(my.selectors.ctrl + '[data-' + dataAttr.paramKey + '="' + paramKey + '"]'),
                    ctrlType = ctrlEl.data(dataAttr.paramType);

                switch (ctrlType) {
                    case ctrlTypes.generic:
                        var slider = elements.overlayCtrlGeneric.find(settings.overlaySlider),
                            normalValue = (param.getValue() - param.getMin()) / (param.getMax() - param.getMin());
                        ctrlEl.find(my.selectors.ctrlValue).text(param.getValue().toFixed(2));
                        elements.overlayCtrlGeneric.find(settings.overlayValue).text(param.getValue().toFixed(2));
                        elements.overlayCtrlGeneric.find(settings.overlaySliderThumb).height(slider.height() * normalValue);
                        break;
                    case ctrlTypes.itemized:
                        ctrlEl.find(my.selectors.ctrlValue).text(param.getLabel());
                        break;
                    case ctrlTypes.boolean:
                        ctrlEl.toggleClass(my.classes.selected, param.getValue());
                        break;
                }
            };
    
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();

        return that;
    }

    WH.createPluginView = createPluginView;
    
})(WH);
