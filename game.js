var game;

var cars = [];
var carColors = [0xff0000, 0x0000ff];
var carTurnSpeed = 250;

var carGroup;
var obstacleGroup;

var obstacleSpeed = 120;
var obstacleDelay = 1500;

var cursors;
var player;
var flame ;
var fireButton;

var bg;

window.onload = function() {	
	game = new Phaser.Game(900, 600, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
	preload: function(){
        game.load.image("bg", "assets/bg.png");
          game.load.image("road", "assets/road.png");
          game.load.image("car", "assets/car.png");
          game.load.image("obstacle", "assets/obstacle.png");
          game.load.image("flame","assets/flame.png");
	},
  	create: function(){
          //game.add.image(0, 0, "road");

          game.physics.startSystem(Phaser.Physics.ARCADE);

          bg = game.add.tileSprite(0, 0, 900, 600, 'bg');
          carGroup = game.add.group();
          obstacleGroup = game.add.group();


                //  The hero!
        player = game.add.sprite(80, game.height - 40, 'car');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.tint = Math.random() * 0xffffff;



          //game.input.onDown.add(moveCar);
          game.time.events.loop(obstacleDelay, function(){
               var obstacle = new Obstacle(game);
               game.add.existing(obstacle);
               obstacleGroup.add(obstacle);
          });   

          
        //  When we shoot this little flame sprite will appear briefly at the end of the turret
        flame = this.add.sprite(0, 0, 'flame');
        flame.anchor.set(0.5);
        flame.visible = false;
          
              //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(fire);

	},
     update: function(){

        bg.tilePosition.y += 2;
        
        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;
            console.log('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            console.log('right');
        }

          /*game.physics.arcade.collide(carGroup, obstacleGroup, function(){
               game.state.start("PlayGame");     
          });*/

          game.physics.arcade.collide(player, obstacleGroup, function(){
            game.state.start("PlayGame");     
       });
     }
}

function moveCar(e){
     var carToMove = Math.floor(e.position.x / (game.width / 2));
     if(cars[carToMove].canMove){
          cars[carToMove].canMove = false;
          cars[carToMove].side = 1 - cars[carToMove].side;
          var moveTween = game.add.tween(cars[carToMove]).to({ 
               x: cars[carToMove].positions[cars[carToMove].side],
          }, carTurnSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(function(){
               cars[carToMove].canMove = true;
          })
     }
}

function fire(e){

        console.log('fire');
        //  Now work out where the END of the turret is
        var p = new Phaser.Point(player.x, player.y-40);

        //  And position the flame sprite there
        flame.x = p.x;
        flame.y = p.y;
        flame.alpha = 1;
        flame.visible = true;

        //  Boom
        game.add.tween(flame).to( { alpha: 0 }, 100, "Linear", true);
}

Obstacle = function (game) {
     var position = game.rnd.between(0, 3);
	Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "obstacle");
	game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(0.5);
     this.tint = carColors[Math.floor(position / 2)];
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height){
		this.destroy();
	}
};