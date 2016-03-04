var Slider = (function() {

  /*  set up variables, init function  */
  function Slider( element ) {
    this.el = document.querySelector(element);
    this.slides = this.el.querySelectorAll('.slide');
    this.w = window;
    this.winHeight = this.w.innerHeight;
    this.baseURL = this.w.location.protocol + '//' + this.w.location.host + this.w.location.pathname;
    this.activeCount = 0;

    this.ARROWS = {
      LEFT:   document.querySelector('.left'),
      RIGHT:  document.querySelector('.right')
    };

    this.CLASSLIST = {
      ACTIVE:     'active',
      LOADED:     'loaded',
      TRANSITION: 'transition'
    };

    this.KEY = {
      LEFT:   37,
      RIGHT:  39
    };

    this.init();
  }

  Slider.prototype.init = function() {
    var slidesLength = this.slides.length;
    this.el.style.width = slidesLength + '00%'; 

    this.sizeSlides();

    // add gradient to slideshow
    this.el.classList.add( this.CLASSLIST.LOADED );

    // set the slide URL parameter
    this.setSlideParam();
  };

  Slider.prototype.sizeSlides = function() {
    // get window height
    this.winHeight = this.w.innerHeight;

    // loop through slides
    // and set styling on them
    for( var i = 0; i < this.slides.length; i++ ) {
      var slide = this.slides[i],
          slideOffset = i + '00%',
          content = slide.querySelector('.content');

      slide.style.transform = 'translateX(' + slideOffset + ')';
      slide.style.display = 'block';

      // get the height of the content div
      var contentHeight = content.offsetHeight;

      // if the height of the content 
      // is greater than the window height
      // scale it down to fit
      if( contentHeight > this.winHeight ) {
        var ratio = this.winHeight / contentHeight;
        content.style.transform = 'translateX(-50%) translateY(-50%) scale(' + ratio + ')';
      }
    }
  };

  Slider.prototype.setSlideParam = function() {
    // get slide parameter from url
    var slideParam = getParameterByName('slide'),
        activeSlide, activeCount;

    // if slide parameter is empty
    // or greater than the total number of slides
    // set to 1
    if( slideParam === '' || slideParam > this.slides.length ) {
      activeSlide = this.slides[0];
      this.activeCount = 1;
      this.w.history.replaceState( {}, '', this.baseURL+'?slide=1' );
      activeSlide.classList.add( this.CLASSLIST.ACTIVE );
    }
    // else set that slide to active
    else {
      activeSlide = this.slides[ slideParam - 1 ];
      this.activeCount = parseInt(slideParam);
      activeSlide.classList.add( this.CLASSLIST.ACTIVE );
      this.el.style.transform = 'translateX(-' + parseInt(slideParam - 1) + '00vw)';
    }

    this.setArrows();
  };

  Slider.prototype.setArrows = function() {
    var self = this;

    // show and hide arrows depending
    // on what the current slide count is
    if( this.activeCount === 1 ) {
      this.ARROWS.RIGHT.classList.add( this.CLASSLIST.ACTIVE );
      this.ARROWS.LEFT.classList.remove( this.CLASSLIST.ACTIVE );
    } else if( this.activeCount === this.slides.length ) {
      this.ARROWS.LEFT.classList.add( this.CLASSLIST.ACTIVE );
      this.ARROWS.RIGHT.classList.remove( this.CLASSLIST.ACTIVE );
    } else {
      this.ARROWS.LEFT.classList.add( this.CLASSLIST.ACTIVE );
      this.ARROWS.RIGHT.classList.add( this.CLASSLIST.ACTIVE );
    }

    // on keydown, get the direction
    // and call moveSlides()
    document.onkeydown = function(e) {
      if( e.keyCode == self.KEY.LEFT || e.which == self.KEY.LEFT ) {
        if( self.ARROWS.LEFT.classList.contains( self.CLASSLIST.ACTIVE ) ) {
          self.moveSlides('left');
        }
      } else if( e.keyCode == self.KEY.RIGHT || e.which == self.KEY.RIGHT ) {
        if( self.ARROWS.RIGHT.classList.contains( self.CLASSLIST.ACTIVE ) ) {
          self.moveSlides('right');
        }
      }
    };

    this.ARROWS.LEFT.onclick = function() {
      if( this.classList.contains( self.CLASSLIST.ACTIVE ) ) {
        self.moveSlides('left');
      }
    };

    this.ARROWS.RIGHT.onclick = function() {
      if( this.classList.contains( self.CLASSLIST.ACTIVE ) ) {
        self.moveSlides('right');
      }
    };
  };

  Slider.prototype.moveSlides = function( direction ) {
    // remove active class from the active slide
    this.slides[ this.activeCount - 1 ].classList.remove( this.CLASSLIST.ACTIVE );

    // increment the activeCount
    // depending on the arrow direction
    if( direction === 'left' ) {
      this.activeCount--;
    } else {
      this.activeCount++;
    }

    // add active class to the new active slide
    this.slides[ this.activeCount - 1 ].classList.add( this.CLASSLIST.ACTIVE );

    // if the history API exists
    // update the slide URL parameter
    if( history.pushState ) {
      this.w.history.pushState( {}, '', this.baseURL+'?slide=' + this.activeCount );
    }

    // move the slideshow element 
    this.el.style.transform = 'translateX(-' + parseInt(this.activeCount - 1) + '00vw)';

    // update the arrows
    this.setArrows();
  };

  return Slider;
})();

var slider;

window.onload = function() {
  slider = new Slider('.slideshow');
};

window.onpopstate = function() {
  slider.setSlideParam();
};

window.onresize = function() {
  slider.sizeSlides();
};

/*  get URL parameter */
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}