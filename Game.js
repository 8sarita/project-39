class Game {
  constructor(){}

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      
      player = new Player();

      var playerCountRef = await database.ref('playerCount').once("value");
      
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    
 

   

  }

  play(){
    form.hide();

    // textSize(30);
    // text("Game Start", 120, 100);

    Player.getPlayerInfo();

    if(allPlayers !== undefined){
      // var display_position = 130;

        //index of the array
        var index = 0;

        //x and y position of the cars
        var x = 0 ;
       
        

      for(var plr in allPlayers){
        if (plr === "player" + player.index)
          fill("red")
        else
          fill("black");
  
            //add 1 to the index for every loop
                index = index + 1 ;

    //position the cars a little away from each other in x direction
  //  x = x + 200;
   //use data form the database to display the cars in y direction
   x = displayWidth - allPlayers[plr].distance;
  //  trexs[index-1].x = x;
  


   if (index === player.index){
    

    camera.position.x = displayWidth/2;
    // camera.position.x = trexs[index-1].x

   }

        // display_position+=20;
        // textSize(15);
        // text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }
    }

   
    if(gameState === 1 && player.index !== null){
      player.distance  = player.distance + Math.round( getFrameRate()/60);
      player.update();
    }
  }
}
