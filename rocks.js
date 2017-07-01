    // this object will hold our Game classes and methods
var Game = {};
var rocks = [];

(function(){
    // Bullet class
    function Bullet(x, y, speed, angle,  width, height, colors){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
        this.width = width;
        this.height = height;
        this.colors = colors;       
        this.frameCounter = 0;
    }
    
    Bullet.prototype.update = function(){        
        // (!) here we calculate the vector (vx, vy) that represents the velocity
        var vx = this.speed * Math.cos(this.angle-(Math.PI/2));
        var vy = this.speed * Math.sin(this.angle-(Math.PI/2));
        
        // move the bullet 
        this.x += vx;
        this.y += vy;       
    }

    Bullet.prototype.check_collision = function(rock){
        
            if( this.x >= rock.x )
            {
                if( this.x <= rock.x+rock.width )
                {
                    if( this.y >= rock.y )
                    {
                        if( this.y <= rock.y+rock.height )
                        {
                            return true;
                        }
                    }       
                }
            }
            return false;
    }
    
    Bullet.prototype.draw = function(context, xScroll,  yScroll){       
        context.save(); 
        
        if(this.angle != 0) {
            // translate to the orign of system
            context.translate(this.x-xScroll, this.y-yScroll);  
            // rotate
            context.rotate(this.angle); 
            // translate back to actual position
            context.translate(xScroll-this.x, yScroll-this.y); 
        }
        // animate the bullets (changing colors)
        context.fillStyle = this.colors[this.frameCounter % this.colors.length];    
        this.frameCounter++;
        
        // draw the bullet
        context.fillRect((this.x-this.width/2) - xScroll, (this.y-this.height/2) - yScroll, this.width, this.height);
        
        context.restore();          
    }
    
    Game.Bullet = Bullet; // add this class to the Game object
})();

var move_value = 4 ;
var angle = 0 ;
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
        


(function(){
    // Boss class
    Boss = function(x, y, width, height,name){
        this.x = x;
        this.y = y;
        this.name = name
        this.width = width;
        this.height = height;
        this.border= 25;
        this.health= 100;
        console.log(this.name);
        this.mov = 0;
        this.angle = 0;       
        this.bullets = [];
        this.bulletsColors = ["red", "white", "blue"];

        
    }
    
    //CHECKING %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        Boss.prototype.check_collision = function( rock ){
            
            var x_inter = false;
            var y_inter = false;

            console.log(this.name);

            if( (this.x-30 < rock.x) && (this.x+30 > rock.x) )
            {
                x_inter = true;
            }
            if( (this.x-30 < rock.x+rock.width) && (this.x+30 > rock.x+rock.width) )
            {
                x_inter = true;
            }
            if( (this.y-30 < rock.y) && (this.y+30 > rock.y) )
            {
                y_inter = true;
            }
            if( (this.y-30 < rock.y+rock.height) && (this.y+30 > rock.y+rock.height) )
            {
                y_inter = true;
            }

            if( x_inter && y_inter )
            {
                this.health = this.health-10;
                return true;
            }

            for(var i=0; i<this.bullets.length; i++){
                if(this.bullets[i].check_collision(rock))
                {
                    this.bullets.splice( i , 1 );
                    return true;
                }
            }
            return false;
        }
        //CHECKING %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //DIRECTIONS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

        Boss.prototype.right = function(){
            // move our boss
            this.x += move_value;
        }

        Boss.prototype.left = function(){
            // move our boss
            this.x -= move_value;
        }

        Boss.prototype.up = function(){
            // move our boss
            this.y -= move_value;
        }

        Boss.prototype.down = function(){
            // move our boss
            // console.log("inside boss.down");
            this.y += move_value;
        }

        //DIRECTIONS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
        Boss.prototype.angle_inc = function(){
            this.angle = this.angle + 10;
            if( this.angle > 360 )
            {
                this.angle = this.angle%360;      
            }
        }
        
        Boss.prototype.angle_dec = function(){
            this.angle = this.angle - 10;
            if( angle < 0 )
            {
                this.angle = this.angle+360;      
            }
        }

    Boss.prototype.update = function(){
        // move our boss
        
        // update boss bullets
        for(var i=0; i<this.bullets.length; i++){
            this.bullets[i].update();
        }
    }

    
    
    Boss.prototype.draw = function(context, xScroll, yScroll){      
        
        // draw boss shape
        // console.log("drawing 1");
        context.save();     
        context.fillStyle = "black";            
        context.fillRect((this.x-this.width/2) - xScroll, (this.y-this.height/2) - yScroll, this.width, this.height);
        context.restore();
        
        var s_img = document.getElementById("s1");
        context.drawImage( s_img , this.x-20 , this.y-20 , 40 , 40 );      
        

        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, ((this.health*2)/100) * Math.PI);
        ctx.fillStyle = "#fce4ec";
        // ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#f50057";
        ctx.stroke();

        theta = (this.angle * Math.PI)/180;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 28 * Math.cos(theta), this.y + 28 * Math.sin(theta));
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = "#880e4f";
        ctx.stroke();
    
        
        // draw boss bullets
        for(var i=0; i<this.bullets.length; i++){
            this.bullets[i].draw(context, xScroll, yScroll);
        }
    }
    
    

    // fire some bullets
    Boss.prototype.fire = function(){
        
        var nBullets = 1; // number of bullets to fire
        for(var x = 0; x < nBullets; ++x){  
            
            // create a new bullet
            this.bullets.push(new Game.Bullet(this.x, this.y, 10, ((this.angle+90) * Math.PI)/180 , 2, 15, this.bulletsColors));
        }        
    }
    
    Game.Boss = Boss; // add this class to the Game object
})();

var b_img = document.getElementById("g1");
var can = document.getElementById("gameCanvas");
var current_w=0;
var current_h=0;

// Game Script (just a scratch)
(function(){
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#212121";
    // context.fill();
    

    var FPS = 30;
    var MILITIME = 1000/FPS;
    var xScroll = 0;
    var yScroll = 0;
    var boss = new Game.Boss(60,window.innerHeight-100, 5, 5 , "first");

    var boss_temp = new Game.Boss(660, window.innerHeight-300 , 5 , 5 , "second" );
    
    var update = function(){
        boss.update();
        boss_temp.update();
    }
        
    var draw = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(b_img, 0, 0 , canvas.width , canvas.height);
        context.rect(0, 0, canvas.width, canvas.height);
        // context.fillStyle = "#212121";
        // context.fill();
        boss.draw(context, xScroll, yScroll);
        boss_temp.draw(context, xScroll, yScroll);       
    }
    
    var gameLoop = function(){              
        update();
        draw();
    }   
    
    Game.play = function(){
        Game.id = setInterval(function(){
            gameLoop();
        }, MILITIME);
    }

    Game.canvas_width = function(){
        setInterval(function(){
            // console.log(window.innerWidth);
            if( window.innerWidth != current_w )
            {
                current_w = window.innerWidth;
                can.width = window.innerWidth-10;
            }
            if( window.innerHeight != current_h )
            {
                current_h = window.innerHeight;
                can.height = window.innerHeight-10;
            }
        }, MILITIME*20);
    }
    
    Game.pause = function(){
        clearInterval(Game.id);
    }
    
    Game.instance = {
        boss_temp: boss_temp ,
        boss : boss  
    };
    
})();

window.onload = function(){    
    Game.play();
    Game.canvas_width();
}

// mouse click to fire
window.addEventListener("mousedown", function(){
    Game.instance.boss.fire();
}, false)


var firing = false;
var firing_2 = false;

function myFunction(e) {

        var e = e || window.event;

        if (e.keyCode == '38') {
            // console.log("up Key Pressed");
            Game.instance.boss_temp.up();
        }
        else if (e.keyCode == '40') {
            // console.log("down Key Pressed");
            Game.instance.boss_temp.down();
        }
        else if (e.keyCode == '39') {
            Game.instance.boss_temp.right();
        }
        else if (e.keyCode == '37') {
            Game.instance.boss_temp.left();
        }
        else if (e.keyCode == '34') {
            Game.instance.boss_temp.angle_dec();
        }
        else if (e.keyCode == '33') {
            Game.instance.boss_temp.angle_inc();
        }
        else if (e.keyCode == '16')
        {
            if( !firing )
            {
                Game.instance.boss.fire();
                firing=true;    
            }
            // console.log("different Key Pressed");
        }
        else if (e.keyCode == '17')
        {
            if( !firing_2 )
            {
                Game.instance.boss_temp.fire();
                firing_2=true;    
            }
            // console.log("different Key Pressed");
        }
        //SEcond player
        if (e.keyCode == '73') {
            // console.log("up Key Pressed");
            Game.instance.boss.up();
        }
        else if (e.keyCode == '75') {
            // console.log("down Key Pressed");
            Game.instance.boss.down();
        }
        else if (e.keyCode == '76') {
            Game.instance.boss.right();
        }
        else if (e.keyCode == '74') {
            Game.instance.boss.left();
        }
        else if (e.keyCode == '65') {
            Game.instance.boss.angle_dec();
        }
        else if (e.keyCode == '68') {
            Game.instance.boss.angle_inc();
        }
        
        //second player
    
    }

function nullify(e) {

        var e = e || window.event;
        firing = false ;
        firing_2 = false ;
    
}   





//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// game variables
var startingScore = 50;
var continueAnimating = false;
var score;

// rock variables
var rockWidth = 40;
var rockHeight = 40;
var totalRocks = 11;
for (var i = 0; i < totalRocks; i++) {
    addRock();
}

function addRock() {
    var rock = {
        width: rockWidth,
        height: rockHeight
    }
    resetRock(rock);
    rocks.push(rock);
}

// move the rock to a random position near the top-of-canvas
// assign the rock a random speed
function resetRock(rock) {
    rock.x = Math.random() * (canvas.width - rockWidth);
    rock.y = -60 + Math.random() * 30;
    rock.speed = 0.2 + Math.random() * 1.5;
}

function animate() {

    // request another animation frame

    if (continueAnimating) {
        requestAnimationFrame(animate);
    }

    // for each rock
    // (1) check for collisions
    // (2) advance the rock
    // (3) if the rock falls below the canvas, reset that rock

    for (var i = 0; i < rocks.length; i++) {

        var rock = rocks[i];

        // test for rock-block collision
        if (Game.instance.boss_temp.check_collision(rock) || Game.instance.boss.check_collision(rock) ) {
            score -= 10;
            resetRock(rock);
        }

        // advance the rocks
        rock.y += rock.speed;

        // if the rock is below the canvas,
        if (rock.y > canvas.height) {
            resetRock(rock);
        }

    }

    // redraw everything
    drawAll();

}

// function isColliding(a, b) {
//     return !(
//     b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
// }

function drawAll() {

    for (var i = 0; i < rocks.length; i++) {
        var rock = rocks[i];
        var rocksImg;
        if( i%3==0 )
        {
            rocksImg = document.getElementById("1");
        }
        else if( i%3==1 )
        {
            rocksImg = document.getElementById("2");
        }
        else if( i%3==2 )
        {
            rocksImg = document.getElementById("0");
        }
        
        ctx.drawImage(rocksImg,rock.x,rock.y,40,40);
        // ctx.fillStyle = "gray";
        // ctx.fillRect(rock.x, rock.y, rock.width, rock.height);
    }
}

// button to start the game


function starting_point() 
{
    score = startingScore
    // block.x = 0;
    for (var i = 0; i < rocks.length; i++) {
        resetRock(rocks[i]);
    }
    console.log("started");
    if (!continueAnimating) {
        continueAnimating = true;
        animate();
    };
}
starting_point();