document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8,
      STAR_SIZE = 3,
      STAR_MIN_SCALE = 0.2,
      OVERFLOW_THRESHOLD = 50;

const canvas = document.querySelector('#starfield canvas'),
      context = canvas.getContext('2d');

    
      document.querySelector("#starfield-title").onmousemove = function(e) {
        e.stopPropagation();
        onMouseMove(e);
      };
      
      

let scale = 1,
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;
canvas.onmousemove = onMouseMove;
canvas.ontouchmove = onTouchMove;
canvas.ontouchend = onMouseLeave;
document.onmouseleave = onMouseLeave;

function generate() {

   for( let i = 0; i < STAR_COUNT; i++ ) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
    });
   }

}

function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar( star ) {

  let direction = 'z';

  let vx = Math.abs( velocity.tx ),
	    vy = Math.abs( velocity.ty );

  if( vx > 1 && vy > 1 ) {
    let axis;

    if( vx > vy ) {
      axis = Math.random() < Math.abs( velocity.x ) / ( vx + vy ) ? 'h' : 'v';
    }
    else {
      axis = Math.random() < Math.abs( velocity.y ) / ( vx + vy ) ? 'v' : 'h';
    }

    if( axis === 'h' ) {
      direction = velocity.x > 0 ? 'l' : 'r';
    }
    else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }
  
  star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

  if( direction === 'z' ) {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }
  else if( direction === 'l' ) {
    star.x = -STAR_SIZE;
    star.y = height * Math.random();
  }
  else if( direction === 'r' ) {
    star.x = width + STAR_SIZE;
    star.y = height * Math.random();
  }
  else if( direction === 't' ) {
    star.x = width * Math.random();
    star.y = -STAR_SIZE;
  }
  else if( direction === 'b' ) {
    star.x = width * Math.random();
    star.y = height + STAR_SIZE;
  }

}

function resize() {
    scale = window.devicePixelRatio || 1;

    width = canvas.parentNode.offsetWidth * scale;
    height = canvas.parentNode.offsetHeight * scale;

    canvas.width = width;
    canvas.height = height;

    stars.forEach(placeStar);
}


function step() {

  context.clearRect( 0, 0, width, height );

  update();
  render();

  requestAnimationFrame( step );

}

function update() {

  velocity.tx *= 0.95;
  velocity.ty *= 0.95;

  velocity.x += ( velocity.tx - velocity.x ) * 0.7;
  velocity.y += ( velocity.ty - velocity.y ) * 0.7;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z;
    star.y += ( star.y - height/2 ) * velocity.z * star.z;
    star.z += velocity.z;
  
    if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
      recycleStar( star );
    }

  } );

}

function render() {

  stars.forEach( ( star ) => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.strokeStyle = 'rgba(255,255,255,'+(0.5 + 0.5*Math.random())+')';

    context.beginPath();
    context.moveTo( star.x, star.y );

    var tailX = velocity.x * 2,
        tailY = velocity.y * 2;

    if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
    if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

    context.lineTo( star.x + tailX, star.y + tailY );

    context.stroke();

  } );

}

function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.x + ( ox / 8*scale ) * ( touchInput ? -1 : 1 );
    velocity.ty = velocity.y + ( oy / 8*scale ) * ( touchInput ? -1 : 1 );

  }

  pointerX = x;
  pointerY = y;

}

function onMouseMove( event ) {

  touchInput = false;

  movePointer( event.clientX, event.clientY );

}

function onTouchMove( event ) {

  touchInput = true;

  movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

  event.preventDefault();

}

function onMouseLeave() {

  pointerX = null;
  pointerY = null;

}


window.addEventListener('scroll', function() {
  var element = document.getElementById('about');
  var position = element.getBoundingClientRect();


  if(position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('active');
  }
});

window.addEventListener('scroll', function() {
  var element = document.getElementById('skills');
  var position = element.getBoundingClientRect();


  if(position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('active');
  }
});

window.addEventListener('scroll', function() {
  var element = document.getElementById('projects');
  var position = element.getBoundingClientRect();


  if(position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('active');
  }
});

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If the birthday hasn't occurred yet this year, subtract 1 from age
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
  }

  return age;
}


const birthDate = new Date(1997, 3, 10); 

// Update the age element
window.onload = function() {
  const ageElement = document.getElementById('age');
  ageElement.textContent = calculateAge(birthDate);
};

function copyEmail() {
  // Copy the email to the clipboard
  const email = "alexccharnock50@hotmail.com";
  navigator.clipboard.writeText(email).then(() => {
      // Show confirmation message
      const message = document.getElementById("copyMessage");
      message.style.display = "block";
      
      // Hide message after 2 seconds
      setTimeout(() => {
          message.style.display = "none";
      }, 2000);
  }).catch(err => {
      console.error('Could not copy email: ', err);
  });
}