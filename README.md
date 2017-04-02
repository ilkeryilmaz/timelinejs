# jQuery Timeline Plugin
jQuery timeline plugin, easily creates a timeline.


Configuration:
-------

Include the jQuery library and plugin:

```html
<script src="js/jquery.min.js"></script> <!-- >=1.11.2 -->
<script src="js/timeline.min.js"></script>
```

Include the plugin css file:

```html
<link rel="stylesheet" href="css/timeline.css">
```


Html markup:

```html
<div class="timeline-container timeline-theme-1">
  <div class="timeline timeline-1">
    <div data-time="1">1</div>
    <div data-time="2">2</div>
    <div data-time="3">3</div>
    <div data-time="4">4</div>
  </div>
</div><!-- /.timeline-container -->
```


Start plugin:

```js
$(function(){
  $('.timeline-1').Timeline();
});
```


Options:

```js
$('.timeline-1').Timeline({
  mode: 'horizontal',
  // value: horizontal | vertical, default to horizontal
	itemClass: 'timeline-item',
  // value: item class
	dotsClass: 'timeline-dots',
  // value: dots item class
	activeClass: 'slide-active',
  // value: item and dots active class
	prevClass: 'slide-prev',
  // value: item and dots prev class
	nextClass: 'slide-next',
  // value: item and dots next class
	startItem: 'first', // first|last|number
  // value: first | last | number , default to first
	dotsPosition: 'bottom',
  // value: bottom | top, default to bottom
});
```


Demo:
-------

https://ilkeryilmaz.github.io/timeline/
