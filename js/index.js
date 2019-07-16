/*****************************/
/*********** MAIN ************/
/*****************************/

var multi = false;
var scene = new Scene();
var game  = new Game(scene, new Collider());

game.start();
scene.add(game);

function restartGame() {
    scene = new Scene();
    game  = new Game(scene, new Collider());

    game.start(multi);
    scene.add(game);
}

/**
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys1 = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    var allowedKeys2 = {
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    var key1 = allowedKeys1[e.keyCode];
    var key2 = allowedKeys2[e.keyCode];

    var player1 = game.players[0];
    var player2 = game.players[1];

    if(key1 && player1)
        player1.handleInput(key1);

    if(key2 && player2)
        player2.handleInput(key2);
});
document.addEventListener('keydown', function(e) {
    e.preventDefault();
});

/**
 * Starts the game in single player mode.
 */
document.getElementById('single-btn').addEventListener('click', function(e) {
    multi = false;
    restartGame();
});

/**
 * Starts the game with two players.
 */
document.getElementById('multi-btn').addEventListener('click', function(e) {
   multi = true;
   restartGame();
});

/**
 * Resets the game.
 */
document.getElementById('reset').addEventListener('click', function(e) {
   restartGame();
}); 
