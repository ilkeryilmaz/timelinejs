/*!
	Timeline - v0.0.1
	ilker Yılmaz
	https://github.com/ilkeryilmaz/timelinejs
 */

( function( $ ) {
	Timeline = {
		init: function (options, elem) {
			var self = this;

			self.$elem = $(elem);
			self.dom = $('body');
			self.wrapClass = '.' + self.$elem.attr('class').split(' ').join('.');
			self.dotsItem = self.wrapClass + " .timeline-dots li";
			self.options = $.extend({}, $.fn.Timeline.options, self.$elem.data(), options);

			self.create_timeline();
		},


		// Load Timeline
		// ----------------------------------------------------------------
		create_timeline: function () {
			var self = this;

			self.build_out();
			self.build_dots();
			self.watch_events();
		},


		// Get Total Items
		// ----------------------------------------------------------------
		get_count: function () {
			var self = this;

			var total = $('.' + self.options.itemClass, self.$elem).length;
			return total;
		},


		// Get Current Item Index
		// ----------------------------------------------------------------
		get_current: function () {
			var self = this;
			var nextItem;

			if (self.options.startItem === 'first') {
				nextItem = 0;
			} else if (self.options.startItem === 'last') {
				nextItem = self.get_count() - 1;
			} else {
				nextItem = self.options.startItem - 1;
			}

			return nextItem;
		},


		// Get Next Item Index
		// ----------------------------------------------------------------
		get_next: function () {
			var self = this;
			return self.get_current() + 1;
		},


		// Get Prev Item Index
		// ----------------------------------------------------------------
		get_prev: function () {
			var self = this;
			return self.get_current() - 1;
		},


		// Watch Timeline Events
		// ----------------------------------------------------------------
		watch_events: function () {
			var self = this;

			// Dots Click
			$(document.body).on('click', self.dotsItem, function (e) {
				self.options.startItem = $(this).index() + 1;
				$(self.dotsItem).removeClass(self.options.activeClass);
				$(this).addClass(self.options.activeClass);
				self.change_timeline(self.get_current());
			});
		},


		// Change Slide Action
		// ----------------------------------------------------------------
		change_slide: function (type) {
			var self = this;
			var itemSize,
					totalHeight;

			var currentWrapper = $(self.wrapClass + ' .timeline-list-wrap');
			var currentItem = $(self.wrapClass + ' .' + self.options.itemClass);

			if (type === 'vertical'){
				itemSize = $(self.wrapClass + ' .timeline-list').height();
				totalHeight = currentItem.outerHeight() * (self.get_count());
				currentWrapper.height(totalHeight);
			}else {
				itemSize = $(self.wrapClass + ' .timeline-list').width();
				totalHeight = currentItem.outerWidth() * (self.get_count());
				currentWrapper.width(totalHeight);
			}

			var getTranslate = -(itemSize * self.get_current());

			if (type === 'vertical'){
				currentWrapper.css({"transform": "translate3d(0px," + getTranslate + "px, 0px)"});
			}else {
				currentWrapper.css({"transform": "translate3d(" + getTranslate + "px, 0px, 0px)"});
			}

		},


		// Make Timeline Calculations
		// ----------------------------------------------------------------
		timelime_calculations: function () {
			var self = this;

			if (self.options.mode === 'vertical') {
				self.change_slide('vertical');
			} else {
				self.change_slide('horizontal');
			}
		},


		// Change Dots Action
		// ----------------------------------------------------------------
		change_dots: function (type) {
			var self = this;

			var itemSize,
				listSize;

			var listWrapper = $(self.wrapClass + ' .timeline-list');
			var currentItem = $(self.wrapClass + ' .timeline-dots li');
			var dotsWrapper = $(self.wrapClass + ' .timeline-dots');

			if (type === 'vertical'){
				itemSize = currentItem.outerHeight(true);
				listSize = listWrapper.height();
			}else {
				itemSize = currentItem.outerWidth(true);
				listSize = listWrapper.width();
			}

			var getTranslate = -(itemSize * self.get_current()) - (-listSize / 2);
			var totalSize = itemSize * (self.get_count());


			if (type === 'vertical'){
				dotsWrapper.height(totalSize);
				dotsWrapper.css({"transform": "translate3d(0px," + getTranslate + "px, 0px)"});
			}else {
				dotsWrapper.width(totalSize);
				dotsWrapper.css({"transform": "translate3d(" + getTranslate + "px, 0px, 0px)"});
			}
		},


		// Make Timeline Dots Calculations
		// ----------------------------------------------------------------
		dots_calculations: function () {
			var self = this;


			if (self.options.mode === 'vertical') {
				self.change_dots('vertical');
			} else {
				self.change_dots('horizontal');
			}

			self.dots_position();
		},


		// Dots Position
		// ----------------------------------------------------------------
		dots_position: function () {
			var self = this;
			var dotsWrap = $(self.wrapClass + ' .timeline-dots-wrap')


			if (self.options.mode === 'vertical') {
				if (self.options.dotsPosition === 'right') {
					dotsWrap.addClass('right');
				} else {
					dotsWrap.addClass('left')
				}
			} else {
				if (self.options.dotsPosition === 'top') {
					dotsWrap.addClass('top');
				} else {
					dotsWrap.addClass('bottom')
				}
			}

		},


		// Build Timeline Dom
		// ----------------------------------------------------------------
		build_out: function () {
			var self = this;

			self.$elem.addClass('timeline-' + self.options.mode + '').addClass('timeline-initialized')
			self.$elem.children().addClass(self.options.itemClass);
			self.$elem.children().wrapAll('<div class="timeline-list-wrap"/>').parent();
			self.$elem.children().wrap('<div class="timeline-list"/>').parent();

			$('.' + self.options.itemClass, self.$elem).eq(self.get_current()).addClass(self.options.activeClass);

			self.timelime_calculations();
			self.update_ui();
		},


		// Build Dots List
		// ----------------------------------------------------------------
		build_dots: function () {
			var self = this;
			var dot, itemDate;

			dot = $('<ul />').addClass('timeline-dots');


			for (i = 0; i <= (self.get_count() - 1); i += 1) {
				itemDate = $(self.wrapClass + ' .' + self.options.itemClass).eq(i).data('time');
				dot.append($('<li />').append(self.options.customPaging.call(this, self, itemDate)));
			}

			self.$dots = dot.appendTo(self.$elem);
			$(self.wrapClass + ' .timeline-dots').wrapAll('<div class="timeline-dots-wrap"/>').parent();

			self.dots_calculations();
			self.update_ui();
		},


		// Item Markup Class Update
		// ----------------------------------------------------------------
		update_ui: function () {
			var self = this;
			var timelineItem = $('.' + self.options.itemClass, self.$elem);
			var timelineDot = $(self.dotsItem);

			// Timeline Item UI
			timelineItem
				.removeClass(self.options.activeClass)
				.removeClass(self.options.prevClass)
				.removeClass(self.options.nextClass)

			timelineItem
				.eq(self.get_current())
				.addClass(self.options.activeClass);

			timelineItem
				.eq(self.get_prev())
				.addClass(self.options.prevClass);

			timelineItem
				.eq(self.get_next())
				.addClass(self.options.nextClass);


			// Timeline Dots UI
			timelineDot
				.removeClass(self.options.activeClass)
				.removeClass(self.options.prevClass)
				.removeClass(self.options.nextClass)

			timelineDot
				.eq(self.get_current())
				.addClass(self.options.activeClass);

			timelineDot
				.eq(self.get_prev())
				.addClass(self.options.prevClass);

			timelineDot
				.eq(self.get_next())
				.addClass(self.options.nextClass);
		},


		// Timeline Change
		// ----------------------------------------------------------------
		change_timeline: function () {
			var self = this;

			self.timelime_calculations();
			self.dots_calculations();
			self.update_ui();
		},
	};


	// jQuery method
	// ------------------------------------------------------------
	$.fn.Timeline = function(options) {
		return this.each(function () {
			var timeline = Object.create(Timeline);
			timeline.init(options, this);
			$.data(this, "timeline", timeline);
		});
	};


	// Default options
	// ------------------------------------------------------------
	$.fn.Timeline.options = {
		// GENERAL
		mode: 'horizontal', // vertical
		itemClass: 'timeline-item',
		dotsClass: 'timeline-dots',
		activeClass: 'slide-active',
		prevClass: 'slide-prev',
		nextClass: 'slide-next',
		startItem: 'first', // first|last|number
		dotsPosition: 'bottom', // bottom | top

		// CONTROLS
		customPaging: function(slider, date) {
			return $('<button type="button" role="button" />').text(date);
		},
	};

} ( jQuery, window, document ) );
