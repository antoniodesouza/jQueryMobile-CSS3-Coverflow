(function($) {
    'use strict';
    /**
     * @description coverflow plugin
     * @class gotta define this
     * @requires jQuery
     * @requires jQueryMobile (for swipe events)
     */
    $.fn.coverFlow = function(options) {

        /**
         * @name buildCoverFlow
         * @description Wrapper class used by the plugin to apply its changes over DOM
         * @param elem {Object} Element which will work as container for the plugin, and where it will be constructed
         */

        function buildCoverFlow(elem) {
            var MARGIN_DELTA = 0,
                //TODO: number taken by observation... get the origin of this
				COMPONENT_DOM = '<div class="coverFlow">'+
					'	<div>'+
					'		<div class="content">'+
					'			<ul class="leftList"></ul>'+
					'			<ul class="rightList active"></ul>'+
					'		</div>'+
					'	</div>'+
					'	<p></p>'+
					'</div>',
                ITEM_DOM = '<li><div/></li>',
                container = $(elem),
                reference, previousItems, nextItems, info, infoWidth, initialPos;

            /**
             * @name setAfterSlide
             * @description Set the position of the covers container after the DOM manipulation happened
             * @param currentSlide {Object} Current highlighted item
             */

            function setAfterSlide(currentSlide) {
                var itemWidth = currentSlide.outerWidth(true),
                    pos = initialPos + ((infoWidth - itemWidth) / 2) + MARGIN_DELTA - previousItems.width() + (itemWidth * (currentSlide.parent()[0] === previousItems[0] ? 1 : 0));

                reference.css('-webkit-transform', 'translate3d(' + pos + 'px,0px,0px)');
                info.text(currentSlide.find('img').attr('alt'));
            }

            /**
             * @name changeElement
             * @description Changes the current highlighted item
             * @param currentList {Object} Current element list, where the highlighted item will be contained
             * @param previousList {Object} Current element list, where the next-to-be highlighted item is contained
             */

            function changeElement(currentList, previousList) {
                if ((currentList.children('li').length > 1) && currentList.hasClass('active')) {
                    previousList.addClass('inactive').append(currentList.find('li:last'));
                    //force transition refresh
                    setTimeout(function() {
                        previousList.removeClass('inactive');
                    }, 0);

                    setAfterSlide(currentList.find('li:last'));
                } else if (currentList.children('li').length > 0) {
                    currentList.addClass('active');
                    previousList.removeClass('active');
                    setAfterSlide(currentList.find('li:last'));
                }
            }

            /**
             * @name setContent
             * @description Build the markup needed for the coverflow and set the initial positions and constraints
             */

            function setContent() {
                var componentDOM = $(COMPONENT_DOM),
                    itemDOM = $(ITEM_DOM);

                reference = componentDOM.find('div.content');
                previousItems = componentDOM.find('.leftList');
                nextItems = componentDOM.find('.rightList');
                info = componentDOM.find('p');

                container.find('img').each(function(index, image) {
                    nextItems.prepend(itemDOM.clone(false).children('div').html(image).end());
                });

                container.html(componentDOM);
                infoWidth = info.width();
                initialPos = Math.abs(info.position().left - (container.children('div').position().left));
            }

            /**
             * @name setBindings
             * @description Set the input behaviors
             */

            function setBindings() {
                container.bind('swipeleft swiperight', function(event) {
                    console.log(event.keyCode)
                    event.preventDefault();
                    switch (event.type) {
                    case 'swipeleft':
                        changeElement(nextItems, previousItems);
                        break;

                    case 'swiperight':
                        changeElement(previousItems, nextItems);
                        break;
                    }
                });
                $(document).keyup(function(event) {
                    switch (event.keyCode) {
                    case 37:
                        changeElement(previousItems, nextItems);
                        break;
                    case 39:
                        changeElement(nextItems, previousItems);
                        break;
                    }
                });
            }

            /**
             * @name Anonymous
             * @description Constructor
             */
            (function() {
                setContent();
                setBindings();
                setAfterSlide(nextItems.find('li:last'));
            }());
        }
        return this.each(function() {
            buildCoverFlow(this);
        });
    };
}(jQuery || $));