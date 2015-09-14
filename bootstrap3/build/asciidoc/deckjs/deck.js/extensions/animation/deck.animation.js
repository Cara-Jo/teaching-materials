

var Animation = {
  'canvas': {},
  'canvasBySlide': {},
  'canvasWidth': 1200,
  'canvasHeight': 600,

  /**
   * function registerCanvas(canvasID)
   *
   * Call this function once for each slide canvas you create.
   */
  'registerCanvas': function(canvasID) {

    // Assume that the first parent of the canvas node that has the CSS .slide
    // class is the <section> element representing this slide. This seems to
    // work.
    var slideID = $('#' + canvasID).parents('.slide').attr('id');

    this.canvas[canvasID] = {
      'viewbox': SVG(canvasID).viewbox(0,
                                       0,
                                       this.canvasWidth,
                                       this.canvasHeight),
      'svg': {},
      'animation': [],
      'animationIndex': 0,
      'slide': slideID
    };

    this.canvasBySlide[slideID] = this.canvas[canvasID];
  },

  /**
   *  function registerSVG(canvasID,
   *                       filename,
   *                        width, height,
   *                       x, y,
   *                        initiallyVisible)
   *
   *   canvasID:         the selector ID of the canvas in the slide of interest
   *   filename:         the path to the SVG file to be displayed
   *   width, height:    desired size of the SVG in pixels
   *   x, y:             desired initial position of the SVG
   *   initiallyVisible: a self-explanatory boolean
   *
   * Returns an object that looks like this:
   *  {
   *    'image':         // the svg.js image object
   *    'initPosition':  // a function that initializes the position of
   *                     // the image
   *  }
   */
  'registerSVG': function(canvasID,
                          filename,
                          width, height,
                          x, y,
                          initiallyVisible) {
    if(typeof initiallyVisible === "undefined" || initiallyVisible === null) {
      initiallyVisible = true;
    }

    var canvas = this.canvas[canvasID];
    canvas.svg[filename] = {
      'image': canvas.viewbox.image(filename, width, height),
      'initPosition': function() {
        if(initiallyVisible) {
          canvas.svg[filename].image.show();
        }
        else {
          canvas.svg[filename].image.hide();
        }
        this['image'].move(x, y)
      }
    };

    canvas.svg[filename].initPosition();

    return canvas.svg[filename];
  },

  /**
   * function addAnimation(canvasID, steps)
   *
   *  canvasID: the selector ID of the canvas
   *  steps: a function or an array of functions containing svg.js animation
   *         calls
   *
   */
  'addAnimation': function(canvasID, steps) {
    this.canvas[canvasID].animation = this.canvas[canvasID].animation.concat(steps);
  },


  //
  // What follows is a bunch of JS DSL machinery. It's cool, and provides for
  // a slightly less awful API, but the individual pieces are not terribly
  // important to document. Just use animate() as directed, and nobody gets
  // hurt.
  //
  prepareFunctionBody: function(fn) {
    return '(' + fn.toString().replace(/\s+$/, '') + ')()';
  },

  withThis: function(callback) {
    var body = this.prepareFunctionBody(callback),
        that = this;
    return function() { return eval('with(that) { ' + body + ' } '); };
  },

	/**
   * function animate(body)
   *
   * The function users invoke to set up animation steps, with immediate
   * access to the API methods of the Animation object.
   *
   * Example:
   *  Animation.animate(function () {
   *    registerCanvas('drawing');
   *    var sf = registerSVG('drawing', 'images/population-test-sf.svg', 403, 98, 210, 17);
   *    var burbank = registerSVG('drawing', 'images/population-test-burbank.svg', 403, 98, 630,17);
   *    addAnimation('drawing', function() {
   *      sf.image.animate(1000, '<>', 100).move(630, 17);
   *      burbank.image.animate(1000, '<>', 100).move(210, 17);
   *    });
   *  });
   */
  animate: function(definition) {
		$(document).bind('deck.init', this.withThis(definition));
  },
}


/**
 * Bind to the event that fires before a slide changes.
 *  - Look for attempts to transition to the next slide
 *  - If we are on a slide with a registered canvas, hold off on advancing to
 *    to the next slide until we have executed all the registered animations
 *  - When leaving the slide, roll back the animations so they will replay
 *    the next time we enter the slide
 *  - When entering a slide that has animations (whether going forward into it
 *    or backing up to it), re-initialize the positions of all the regisstered
 *    images in the slide
 */
$(document).bind('deck.beforeChange', function(event, from, to) {
  var canvas;
  var toSlideID = $.deck('getSlide', to).attr('id');
  canvas = Animation.canvasBySlide[toSlideID];

  // Entering a slide with animations
  if(canvas != undefined) {
    console.log('entering a slide with animations');
    // reposition all the things
    for(key in canvas.svg) {
      canvas.svg[key].initPosition();
    }
    canvas.animationIndex = 0;
  }

  console.log("to="+to+"; from="+from);
  // Only play animations on right arrow
  if(to > from) {
    var fromSlideID = $.deck('getSlide', from).attr('id');
    canvas = Animation.canvasBySlide[fromSlideID];

    // Attempting to leave a slide with animations
    if(canvas != undefined) {
      console.log("index="+canvas.animationIndex+"; length="+canvas.animation.length);
      if(canvas.animationIndex < canvas.animation.length) {
        canvas.animation[canvas.animationIndex++]();
        event.preventDefault();
      }
      else {
        console.log("animation steps are done");
        canvas.animationIndex = 0;
      }
    }
  }
});
