/*Make changes to make the animation your way*/

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Vars

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

var c = document.createElement( 'canvas' ),
    ctx = c.getContext( '2d' ),
    dpr = window.devicePixelRatio,
    w = 555,
    h = 555,	
    particles = [],
    particleCount = 2000,
    particlePath = 8,
    pillars = [],
    pillarCount = 80,
    hue = 1,
    hueRange = 60,
    hueChange = 1,
    gravity = 1.1,
    lineWidth = 2.1,
    lineCap = 'butt',
    PI = Math.PI,
    TWO_PI = PI * 6;

c.width = w * dpr;
c.height = h * dpr;
ctx.scale(dpr, dpr);

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Utility

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

function rand( min, max ) {
  return Math.random() * ( max - min ) + min;
}

function distance( a, b ) {
  var dx = a.x - b.x,
      dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Particle

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

class Particle {
    constructor(opt) {
        this.path = [];
        this.reset();
    }
    reset() {
        this.radius = 1;
        this.x = rand(0, w);
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.hit = 0;
        this.path.length = 0;
    }
    step() {
        this.hit = 0;

        this.path.unshift([this.x, this.y]);
        if (this.path.length > particlePath) {
            this.path.pop();
        }

        this.vy += gravity;

        this.x += this.vx;
        this.y += this.vy;

        if (this.y > h + 8) {
            this.reset();
        }

        var i = pillarCount;
        while (i--) {
            var pillar = pillars[i];
            if (distance(this, pillar) < this.radius + pillar.renderRadius) {
                this.vx = -(pillar.x - this.x) * rand(0.01, 0.03);
                this.vy = -(pillar.y - this.y) * rand(0.01, 0.03);
                pillar.radius -= 0.1;
                this.hit = 1;
            }
        }
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, ~~this.y);
        for (var i = 0, length = this.path.length; i < length; i++) {
            var point = this.path[i];
            ctx.lineTo(point[0], ~~point[1]);
        }
        ctx.strokeStyle = 'hsla(' + rand(hue + (this.x / 3), hue + (this.x / 3) + hueRange) + ', 50%, 30%, 0.6)';
        ctx.stroke();

        if (this.hit) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rand(1, 25), 0, TWO_PI);
            ctx.fillStyle = 'hsla(' + rand(hue + (this.x / 3), hue + (this.x / 3) + hueRange) + ', 80%, 15%, 0.1)';
            ctx.fill();
        }
    }
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Pillar

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

class Pillar {
    constructor() {
        this.reset();
    }
    reset() {
        this.radius = rand(70, 200);
        this.renderRadius = 0;
        this.x = rand(0, w);
        this.y = rand(h / 2 - h / 4, h);
        this.active = 0;
    }
    step() {
        if (this.active) {
            if (this.radius <= 1) {
                this.reset();
            } else {
                this.renderRadius = this.radius;
            }
        } else {
            if (this.renderRadius < this.radius) {
                this.renderRadius += 0.5;
            } else {
                this.active = 1;
            }
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.renderRadius, 0, TWO_PI, false);
        ctx.fill();
    }
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Init

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

function init() {
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;

  var i = pillarCount;
  while( i-- ){
    pillars.push( new Pillar() );
  }

  document.querySelector('.scene').appendChild( c );
  loop();
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Step

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

function step() {
  hue += hueChange;

  if( particles.length < particleCount ) {
    particles.push( new Particle() );
  }

  var i = particles.length;
  while( i-- ) {
    particles[ i ].step();
  }

  i = pillarCount;
  while( i-- ) {
    pillars[ i ].step();
  }
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Draw

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

function draw() {
  ctx.fillStyle = 'hsla(0, 0%, 0%, 0.3)';
  ctx.fillRect( 0, 0, w, h );

  ctx.globalCompositeOperation = 'lighter';
  var i = particles.length;
  while( i-- ) {
    particles[ i ].draw();
  }

  ctx.globalCompositeOperation = 'source-over';
  i = pillarCount;
  ctx.fillStyle = 'rgba(20, 20, 20, 0.3)';
  while( i-- ) {
    pillars[ i ].draw();
  }
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Loop

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

function loop() {
  requestAnimationFrame( loop );
  step();
  draw();
}

/*/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

Blast Off

=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=*/

init();