const winSound = new Audio('music/win2.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let inputDir = {x:0,y:0};
let tankArr = {x: 36, y: 9};
let tankCounter=tankArr.y;//to define initial position of tank
let tankDirection=1;
let speed=10;//defines speed of tank
let player = {x: 6, y: 7};
let bulletArr = [];//list to store x,y co-ordinates of bullets using dictionary
let brickArr = [];//list to store x,y co-ordinates of bricks using dictionary
let brickCount = 10;
let lastPaintTime = 0;//used with predefined variable ctime of requestAnimationFrame() to reduce rendering speed
let rec = 0;
let zombieArr = [];//list to store x,y co-ordinates of zombies using dictionary
let zombieCount = 1;
let zombieSpeed = 10;//more the value, slow the speed of zombie unlike speed variable
let zombieCounter = 0;//used to controll speed of zombie
let bgCount = 0; 

let a = 3;
let b = 16;
let c = 33;
let d = 18;
for (let j=0; j<brickCount;j++){
    brickArr.unshift({x: Math.round(a + (c-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())});
}
for (let j=0; j<zombieCount;j++){
    zombieArr.unshift({x: Math.round(0 + a*Math.random()), y: Math.round(0 + d*Math.random())});
}

//to check if any bullet has hit on player-block or zombie reached player-block
function isCollide() {
    for (let i = 0; i < bulletArr.length; i++) {
        if(bulletArr[i].x === player.x && bulletArr[i].y === player.y){
            return true;
        }
    }
    for (let i = 0; i < zombieArr.length; i++) {
        if(zombieArr[i].x === player.x && zombieArr[i].y === player.y){
            return true;
        }
    }
    return false;
}

// up:0 down:1 left:2 right:3
//to check whether brick is infront of player-block in which direction it want to move
function isBrickRestiction(rec){
    for(let l=0;l<brickArr.length;l++){
        switch(rec){
            case 0:
                if(brickArr[l].y==(player.y-1)&&brickArr[l].x==(player.x)){
                    return true;
                }
                break;
            
            case 1:
                if(brickArr[l].y==(player.y+1)&&brickArr[l].x==(player.x)){
                    return true;
                }
                break;
            
            case 2:
                if(brickArr[l].x==(player.x-1)&&brickArr[l].y==(player.y)){
                    return true;
                }
                break;
            
            case 3:
                if(brickArr[l].x==(player.x+1)&&brickArr[l].y==(player.y)){
                    return true;
                }
                break;
            
        }
    }
    return false;
}

//check the position of player-block and zombie takes one step toward player-block current position
function zombieMoving(){
    for ( let i=0; i<zombieArr.length;i++){
        if(player.x>zombieArr[i].x){
            zombieArr[i].x+=1;//moving right
        }
        else if(player.y>zombieArr[i].y){
            zombieArr[i].y+=1;//moving down           
        }
        else if(player.x<zombieArr[i].x){
            zombieArr[i].x-=1;//moving left
        }
        else if(player.y<zombieArr[i].y){
            zombieArr[i].y-=1;//moving up          
        }
        else{
            gameOverSound.play();
            musicSound.pause();
            inputDir =  {x: 0, y: 0}; 
            alert("Game Over. Press any key to play again!");
            bgCount+=1;
            changeBg();
            tankArr = {x: 36, y: 9};
            bulletArr= [];
            zombieArr= [];
            for (let j=0; j<zombieCount;j++){
                zombieArr.unshift({x: Math.round(0 + a*Math.random()), y: Math.round(0 + d*Math.random())});
            }
            zombieCounter=0;
            player = {x: 6, y: 7};
            musicSound.play();
        }
    }
}

function changeBg(){
    if(bgCount%2==0){
        document.getElementById('board').style.backgroundImage="url(image/background2)";
    }
    else{
        document.getElementById('board').style.backgroundImage="url(image/background3)";
    }
}

//main program starts here
musicSound.play();

board.innerHTML="";
tankElement=document.createElement('div');
tankElement.style.gridRowStart=tankArr.y;
tankElement.style.gridColumnStart=tankArr.x;
tankElement.classList.add('tank');
board.appendChild(tankElement);

function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < (1/speed)){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function gameEngine(){
    //to check winning condition i.e. player-block has reached right end
    if (player.x==36){
        winSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("You won the game. Press any key to play again!");
        bgCount+=1;
        changeBg();
        tankArr = {x: 36, y: 9};
        bulletArr= [];
        zombieArr= [];
        for (let j=0; j<zombieCount;j++){
            zombieArr.unshift({x: Math.round(0 + a*Math.random()), y: Math.round(0 + d*Math.random())});
        }
        zombieCounter=0;
        player = {x: 6, y: 7};
        musicSound.play();
    }
    //if tank reaches to top or bottom reverse its direction
    if ((tankCounter+tankDirection)%18==0){
        tankDirection=-1;
    }
    else if((tankCounter+tankDirection)%18==1){
        tankDirection=1;
    }
    tankCounter=tankCounter+tankDirection;
    board.innerHTML="";
    tankElement=document.createElement('div');
    tankElement.style.gridRowStart=tankCounter;
    tankElement.style.gridColumnStart=tankArr.x;
    tankElement.classList.add('tank');
    board.appendChild(tankElement);
    
    playerElement=document.createElement('div');
    playerElement.style.gridRowStart=player.y;
    playerElement.style.gridColumnStart=player.x;
    playerElement.classList.add('player');
    board.appendChild(playerElement);
    
    //to insert position of each newly fired bullet by tank in bulletArr
    bulletArr.unshift({x: tankArr.x , y: tankCounter });
    
    //moves the bullet to left by one step
    for ( let i=0; i<bulletArr.length;i++){
        bulletArr[i].x -= 1;
    }
    bulletArr.forEach((e, index)=>{
        //check if bullet has hit on player-block
        if(isCollide()){
            gameOverSound.play();
            musicSound.pause();
            inputDir =  {x: 0, y: 0}; 
            alert("Game Over. Press any key to play again!");
            bgCount+=1;
            changeBg();
            tankArr = {x: 36, y: 9};
            bulletArr= [];
            zombieArr= [];
            for (let j=0; j<zombieCount;j++){
                zombieArr.unshift({x: Math.round(0 + a*Math.random()), y: Math.round(0 + d*Math.random())});
            }
            zombieCounter=0;
            player = {x: 6, y: 7};
            musicSound.play();
            // score = 0; 
        }
        //to remove bullets that hit on any brick from bulletArr
        for(let k=0; k<brickArr.length;k++){
            if(brickArr[k].x==e.x && brickArr[k].y==e.y){
                bulletArr.splice(index,1);
            }
        }
        //to remove bullets that reached left end from bulletArr else to display bullet
        if(e.x==0||(e in bulletArr)){
            bulletArr.splice(index,1);
        }
        else{
            bulletElement = document.createElement('div');
            bulletElement.style.gridRowStart = e.y;
            bulletElement.style.gridColumnStart = e.x;
            bulletElement.classList.add('bullet');
            board.appendChild(bulletElement);
        }
    });
    //to display bricks
    brickArr.forEach((brick)=>{
        brickElement = document.createElement('div');
        brickElement.style.gridRowStart = brick.y;
        brickElement.style.gridColumnStart = brick.x;
        brickElement.classList.add('brick');
        board.appendChild(brickElement);
    });
    zombieCounter+=1;
    if(zombieCounter%zombieSpeed==0){
        zombieMoving();
    }
    //to display zombies
    zombieArr.forEach((zombie)=>{
        zombieElement = document.createElement('div');
        zombieElement.style.gridRowStart = zombie.y;
        zombieElement.style.gridColumnStart = zombie.x;
        zombieElement.classList.add('zombie');
        board.appendChild(zombieElement);
    });
}

window.requestAnimationFrame(main);

window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1} //Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            if (player.y!=1 && !isBrickRestiction(0)){
                player.x=player.x+inputDir.x;
                player.y=player.y+inputDir.y;
            }
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            if (player.y!=18 && !isBrickRestiction(1)){
                player.x=player.x+inputDir.x;
                player.y=player.y+inputDir.y;
            }
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            if (player.x!=1 && !isBrickRestiction(2)){
                player.x=player.x+inputDir.x;
                player.y=player.y+inputDir.y;
            }
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            if (player.x!=36 && !isBrickRestiction(3)){
                player.x=player.x+inputDir.x;
                player.y=player.y+inputDir.y;
            }
            break;
        default:
            break;
    }
});

