class Form {

  constructor() {
    this.input = createInput("Name");
    this.button = createButton('Play');
    this.info = createElement('h2');
    this.welcome = createElement("h3");
  }
  hide(){
    this.info.hide();
    this.button.hide();
    this.input.hide();
    this.welcome.hide();
  }

  display(){
    var title = createElement('h2')
    title.html("Trex_ Game");
    title.position(displayWidth/2-30, 0);
     

    this.welcome.html("WELCOME To Trex Runner Game");
    this.welcome.position(50,displayHeight-200);


    this.input.position(displayWidth/2 - 40 , displayHeight/2 - 80);
    this.button.position(displayWidth/2 + 30, displayHeight/2);

    this.button.mousePressed(()=>{
      this.input.hide();
      this.button.hide();

      player.name = this.input.value();
      
      playerCount+=1;
      player.index = playerCount;
      player.update();
      player.updateCount(playerCount);
      this.info.html("Wait -- Game Will Start When 1 More Player Will Join " + player.name)
      this.info.position(displayWidth/2 - 300, displayHeight/4);
    });

  }
}
