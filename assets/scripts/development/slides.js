var Slider = (function () {
  
  /* 	set up variables, init function  */
	function Slider ( element ) { 
		this.par = document.querySelector( '.wrap' );
		this.el = document.querySelector( element );
		this.slides = this.el.querySelectorAll( '.slide' );
		this.slideContent = this.el.querySelectorAll( '.content' );
		this.arrows = document.querySelectorAll( '.arrows svg' );
		this.w = window;
		this.baseURL = this.w.location.protocol + '//' + this.w.location.host + this.w.location.pathname;
		ARROWS = {
			LEFT: this.par.querySelector( '.left' ),
			RIGHT: this.par.querySelector( '.right' )
		};
		CLASSLIST = {
			ACTIVE: 'active'
		};
		KEY = {
		 	LEFT: 37,
		 	RIGHT: 39
		};

		this.init();
	}
  
  Slider.prototype.init = function () {
  	/* 	find window height,
  			set up empty array for slide heights  */ 
  	var winHeight = this.w.innerHeight,
  			slideHeights = [];

  	/* 	find all height of the slide's contents div  */
  	for( var i = 0; i < this.slideContent.length; i++ ) {
  		var slideHeight = this.slideContent[i].offsetHeight;
  		/* 	if the slide content height is less than the window height,
  			 	set slide height and data-height attribute equal to the window height
  			 	push to slideHeights  */
  		if( slideHeight <= winHeight ) {
  			this.slides[i].style.height = winHeight + 'px';
  			this.slides[i].setAttribute( 'data-height', winHeight );
  			slideHeights.push( winHeight );
  		/*	else set data-height attribute to the contents height,
  				push to slideHeights  */
  		} else {
  			this.slides[i].style.height = slideHeight + 'px';
  			this.slides[i].setAttribute( 'data-height', slideHeight );
  			slideHeights.push( slideHeight );
  		}

  		/*	add up the slide heights */
 			var slideOffset = 0;
  		for( var k = 0; k < slideHeights.length; k++ ) {
  			slideOffset += slideHeights[k];
  		}

  		/*	find the offset of each slide, set data-offset for each slide */
  		slideOffset = slideOffset - slideHeights[i];
  		this.slides[i].setAttribute( 'data-offset', slideOffset );
  	}

  	/* 	set the wrap height to the first slide's height  */
  	this.par.style.height = slideHeights[0] + 'px';

  	this.setSlideParam();
  };

  Slider.prototype.setSlideParam = function () {
  	/*	get slide parameter */
  	var slideParam = getParameterByName( 'slide' ),
  			currSlide;

  	/* 	if slide parameter is empty, set to 1 */
  	if( slideParam === '' ) {
  		currSlide = this.slides[ 0 ];
  		this.w.history.replaceState({}, '', this.baseURL+'?slide=1');
  		currSlide.classList.add( CLASSLIST.ACTIVE );
  	/*	else set that slide to active */
  	} else {
  		currSlide = this.slides[ slideParam - 1 ];
  		var currSlideHeight = currSlide.getAttribute( 'data-height' ),
  				currSlideOffset = currSlide.getAttribute( 'data-offset' );
  		currSlide.classList.add( 'active' );
  		this.el.style.marginTop = '-' + currSlideOffset + 'px';
  		this.par.style.height = currSlideHeight + 'px';
  	}

  	this.setArrows( currSlide );
  };

  Slider.prototype.setArrows = function ( currSlide ) {
  	/*	get current slide count */
  	var self = this,
        slideTotal = this.slides.length,
        currSlideCount = currSlide.getAttribute('data-count'),
        nextSlideCount;

  	/*	show arrows depending on what the current slide is */
  	if( currSlideCount == 1 ) {
  		ARROWS.LEFT.classList.remove( CLASSLIST.ACTIVE );
  		ARROWS.RIGHT.classList.add( CLASSLIST.ACTIVE );
  	} else if( currSlideCount == this.slides.length ) {
  		ARROWS.LEFT.classList.add( CLASSLIST.ACTIVE );
  		ARROWS.RIGHT.classList.remove( CLASSLIST.ACTIVE );
  	} else {
  		ARROWS.LEFT.classList.add( CLASSLIST.ACTIVE );
  		ARROWS.RIGHT.classList.add( CLASSLIST.ACTIVE );
  	}

	  /*  on keydown, set set nextSlideCount and call animateSlides() */
    document.onkeydown = function(e) {
      if( e.keyCode == KEY.LEFT || e.which == KEY.LEFT ) {
        if( currSlideCount > 1 ) {
          self.moveLeft( currSlideCount );
        }
      } else if( e.keyCode == KEY.RIGHT || e.which == KEY.RIGHT ) {
        if( currSlideCount < slideTotal ) {
          self.moveRight( currSlideCount );
        }
      }     
    };

    /*  arrow left click */
    ARROWS.LEFT.addEventListener( 'click', function () {
      if( currSlideCount > 1 ) {
        self.moveLeft( currSlideCount );
      }
    });

    /*  arrow right click */
    ARROWS.RIGHT.addEventListener( 'click', function () {
      if( currSlideCount < slideTotal ) {
        self.moveRight( currSlideCount );
      }
    });
  };

  Slider.prototype.moveLeft = function ( currSlideCount ) {
    /*  get nextSlideCount, animate slides left */
    nextSlideCount = parseInt(currSlideCount) - 1;
    this.slides[ currSlideCount - 1 ].classList.remove( CLASSLIST.ACTIVE );
    this.animateSlides( nextSlideCount );
  };

  Slider.prototype.moveRight = function ( currSlideCount ) {
    /*  get nextSlideCount, animate slides right */
    nextSlideCount = parseInt(currSlideCount) + 1;
    this.slides[ currSlideCount - 1 ].classList.remove( CLASSLIST.ACTIVE );
    this.animateSlides( nextSlideCount );
  };

  Slider.prototype.animateSlides = function ( nextSlideCount ) {
  	/*	get nextSlide, its offset and height */
		var nextSlide = this.slides[ nextSlideCount - 1 ],
				nextSlideOffset = nextSlide.getAttribute( 'data-offset' ),
				nextSlideHeight = nextSlide.getAttribute( 'data-height' );
		/*	move .slideshow to show the next slide */
		this.el.style.marginTop = '-' + nextSlideOffset + 'px';
		/*	set the wrap height to the next slide's height */
		this.par.style.height = nextSlideHeight + 'px';
		/*	update the URL slide parameter */
		this.w.history.replaceState({}, '', this.baseURL+'?slide=' + nextSlideCount);

		this.setArrows( nextSlide );
  };
  
  return Slider;
}());

document.addEventListener( 'DOMContentLoaded', function() {
	var slider = new Slider( '.slideshow' );
});

window.addEventListener('resize', function() {
	var slider = new Slider( '.slideshow' );
});


/*	get URL parameter */
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}