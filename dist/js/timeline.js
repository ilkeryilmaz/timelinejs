/*!
	Timeline - v0.0.1
	ilker Yılmaz
	https://github.com/ilkeryilmaz/timeline
 */

( function( $ ) {
	var Timeline = {
		init : function(options, elem) {
			var self = this;

			self.$elem = $(elem);
			self.dom = $('body');
			self.wrapClass = '.'+self.$elem.attr('class').split(' ').join('.');
			self.options = $.extend({}, $.fn.Timeline.options, self.$elem.data(), options);

			self.create_timeline();
		},

		// Load Timeline
		// ----------------------------------------------------------------
		create_timeline : function(){
			var self = this;

			self.build_out();
			self.build_dots();
			self.watch_events();
		},


		// Get Total Items
		// ----------------------------------------------------------------
		get_count : function(){
			var self = this;

			var total = $('.' + self.options.itemClass, self.$elem).length;
			return total;
		},

		// Get Next Item Index
		// ----------------------------------------------------------------
		get_next : function(){
			var self = this;
			var nextItem;

			if (self.options.startItem == 'first') {
				nextItem = 0;
			} else if (self.options.startItem == 'last') {
				nextItem = self.get_count() - 1;
			} else {
				nextItem = self.options.startItem - 1;
			}

			return nextItem;
		},




		// Watch Timeline Events
		// ----------------------------------------------------------------
		watch_events : function(){
			var self = this;
			var dotsItem = self.wrapClass + " .timeline-dots li";

			// Dots Click
			$(document.body).on('click',dotsItem, function(e){
				self.options.startItem = $(this).index() + 1;
				$(dotsItem).removeClass(self.options.activeClass);
				$(this).addClass(self.options.activeClass);
				self.change_timeline(self.get_next());
			});
		},


		// Make Timeline Calculations
		// ----------------------------------------------------------------
		timelime_calculations : function(){
			var self = this;

			var width = $(self.wrapClass + ' .timeline-list').width();
			var totalWidth = $(self.wrapClass + ' .' +self.options.itemClass).width() * (self.get_count());
			$(self.wrapClass + ' .timeline-list-wrap').width(totalWidth);

			if (self.options.mode == 'horizontal') {
				var leftTotal = -(width * self.get_next());
				$(self.wrapClass + ' .timeline-list-wrap').css({"transform": "translate3d(" + leftTotal + "px, 0px, 0px)"});
			}
		},


		// Make Timeline Dots Calculations
		// ----------------------------------------------------------------
		dots_calculations : function(){
			var self = this;
			var width = $(self.wrapClass + ' .timeline-dots li').width();
			var itemWidth = $(self.wrapClass + ' .timeline-list').width();

			var totalWidth = width * (self.get_count());
			$(self.wrapClass + ' .timeline-dots').width(totalWidth);

			if (self.options.mode == 'horizontal') {
				var leftTotal = -(width * self.get_next()) - (-itemWidth / 3);
				$(self.wrapClass + ' .timeline-dots').css({"transform": "translate3d(" + leftTotal + "px, 0px, 0px)"});
			}

		},


		// Build Timeline Dom
		// ----------------------------------------------------------------
		build_ui : function(){
			var self = this;
			var timelineItem = $('.' + self.options.itemClass, self.$elem);

			// Timeline AddClass
			timelineItem.removeClass(self.options.activeClass,self.options.nextClass,self.options.prevClass);
			timelineItem.eq(self.get_next()).addClass(self.options.activeClass);
			timelineItem.eq(self.get_next() - 1).addClass(self.options.prevClass);
			timelineItem.eq(self.get_next() + 1).addClass(self.options.nextClass);
		},


		// Build Timeline Dom
		// ----------------------------------------------------------------
		build_out : function(){
			var self = this;

			self.$elem.addClass('timeline-initialized');
			self.$elem.children().addClass(self.options.itemClass);
			self.$elem.children().wrapAll('<div class="timeline-list-wrap"/>').parent();
			self.$elem.children().wrap('<div class="timeline-list"/>').parent();

			$('.' + self.options.itemClass, self.$elem).eq(self.get_next()).addClass(self.options.activeClass);

			self.timelime_calculations();
			self.build_ui();
		},


		// Timeline Change
		// ----------------------------------------------------------------
		change_timeline : function(){
			var self = this;

			self.timelime_calculations();
			self.dots_calculations();
			self.build_ui();
		},


		// Build Dots List
		// ----------------------------------------------------------------
		build_dots : function(){
			var self = this;
			var dot,itemDate;

			dot = $('<ul />').addClass('timeline-dots');


			for (i = 0; i <= (self.get_count() - 1); i += 1) {
				 itemDate = $(self.wrapClass + ' .' + self.options.itemClass).eq(i).data('time');
				 dot.append($('<li />').append(self.options.customPaging.call(this, self, itemDate)));
			}

			self.$dots = dot.appendTo(self.$elem);
			self.$dots.find('li').eq(self.get_next()).addClass(self.options.activeClass);
			$(self.wrapClass + ' .timeline-dots').wrapAll('<div class="timeline-dots-wrap"/>').parent();

			self.dots_calculations();
			console.log(self.get_next());
		},
	}

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

		// CONTROLS
		customPaging: function(slider, date) {
      return $('<button type="button" data-role="none" role="button" />').text(date);
    },
	};

} ( jQuery, window, document ) );
