var canvas, backgroundImage;

var gameState = 0;
var playerCount;
var allPlayers;
var distance = 0;
var database;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

var form, player, game;
var trexs; 
var lifeCount,life;
var life0,life1,life2,life3,life4,life5;

function preload(){

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  life0= loadImage("life 0.png");
  life1= loadImage("life 1.png");
  life2= loadImage("life 2.png");
  life3= loadImage("life 3.png");
  life4= loadImage("life 4.png");
  life5= loadImage("life 5.png");

}

function setup(){
  canvas = createCanvas(displayWidth -20,displayHeight-150);

  database = firebase.database();

  trex = createSprite(100,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(0,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2+20,displayHeight/5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2+20,displayHeight/4);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
//   trex.debug = true;
  
  score = 0;
  lifeCount = 20;

  game = new Game();
  game.getState();
  game.start();

  trexs= [trex];

  life= createSprite(400,35);
  life.addImage(life5);
  life.scale= 0.5;

}


function draw(){

  background(205);

  

  if(playerCount === 1){
    game.update(1);
    
  }

  if(gameState === 0){

    trex.visible= false;
    ground.visible= false;
    gameOver.visible = false;
    restart.visible = false;
    life.visible = false;

  }

   

  if(gameState === 1){


    trex.visible= true;
    ground.visible= true;
    gameOver.visible = true;
    restart.visible = true;
    life.visible = true;

    clear();

    game.play();

    fill("Yellow");
    stroke("black");
    strokeWeight(2);
    textSize(15);
    text(player.name + " : Score: "  + score, displayWidth/1-300,50);
    noFill();
    noStroke();

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)

    //scoring
    score = score + Math.round( getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 1.2
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        // trex.velocityY = -12;

        jumpSound.play();
        
        dieSound.play()
        
        player.updateCount(2);

        ground.velocityX = 0;
    // trex.velocityY = 0

    lifeCount= lifeCount-1; 

    }

    if(lifeCount === 18){
      life.addImage(life4);
    }
    else if(lifeCount === 14){
      life.addImage(life3);
    }
    else if(lifeCount === 8){
      life.addImage(life2);
    }
    else if(lifeCount === 3){
      life.addImage(life1);
    }
    else if(lifeCount === 0){
      life.addImage(life0);
       game.update(2);

    }
    
  

  }

  else if (gameState === 2) {
    gameOver.visible = true;
    restart.visible = true;
    
   //change the trex animation
    trex.changeAnimation("collided", trex_collided);
   
    fill("Yellow");
    stroke("black");
    strokeWeight(2);
    textSize(40);
  
    text(player.name + " : Score: "  + score, displayWidth/2-100,400);
    noFill();
    noStroke();

     fill("black");
     textSize(10);
    text("Dear : " + player.name +  "  After Clicking The Reset Icon Refresh The Page To Replay", displayWidth/2- 130, 500);
    
   
    ground.velocityX = 0;
    trex.velocityY = 0;
    
   
    //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
   
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);    
 }

  
 //stop trex from falling down
 trex.collide(invisibleGround);
 if(mousePressedOver(restart)) {
  reset();
}

  drawSprites();

}

function reset(){
  
  game.update(0);
  player.updateCount(0);
  player.distance= 0;
  player.update();

  obstaclesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  cloudsGroup.destroyEach();
  score=0;
  lifeCount= 20;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);

  //  obstacle.setCollider("circle",0,0, 50);
//    obstacle.debug = true;

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
