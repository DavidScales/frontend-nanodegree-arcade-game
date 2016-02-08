var TILE_HEIGHT = 83; // height of tile's visible surface (depends on graphic assets size)
var TILE_WIDTH = 101; // width of tile (depends on graphic assets size)
var NUM_TILES_WIDTH = 5; // how many tiles wide the game map is (depends on engine.js)
var NUM_TILES_HEIGHT = 6; // how many tiles tall the game map is (depends on engine.js)

var BUG_OFFSET = 25; // compensation for bug graphic "floating" within png file (depends on graphic assets size)
var PLAYER_OFFSET = 25; // compensation for player graphic "floating" within pgn file (depends on graphic assets size)
var GEM_OFFSET = 25; // compensation for gem graphic "floating" within pgn file (depends on graphic assets size)

var BUG_ROWS_START = 1; // the row where bugs can start spawning
var BUG_ROWS = 3; // the number of rows the bugs can spawn on
var NUM_BUGS = 4; // how many bugs spawn
var BUG_BASE_SPEED = 101; // pixels/second base speed of bugs (depends on graphic assets size)
var BUG_SPEED_MODIFIER = 3; // max speed multiplier for bugs

// Define function for checking all collisions, called in engine.js
function checkCollisions() {

    var playerLeft = player.leftSide();
    var playerRight = player.rightSide();

    allEnemies.forEach(function(enemy) {
        if (player.y + PLAYER_OFFSET == enemy.y + BUG_OFFSET) {
            if (playerLeft < enemy.rightSide() && playerLeft > enemy.leftSide()) {
                player.reset();
            }
            else if (playerRight > enemy.leftSide() && playerRight < enemy.rightSide()) {
                player.reset();
            }
        }
    })

    gems.forEach(function(gem) {
        if (player.y + PLAYER_OFFSET === gem.y + GEM_OFFSET) {
            if (player.x === gem.x) {
                gem.remove();
            }
        }
    });
}

// Gems the player must acquire
var Gem = function(color) {
    // Set sprite based on color, defaults to blue
    if (color === 'orange') {
        this.sprite = 'images/Gem Orange.png';
    }
    else if (color === 'green') {
        this.sprite = 'images/Gem Green.png';
    }
    else {
        this.sprite = 'images/Gem Blue.png';
    }
    // Set random positions (set within bug occupied rows only)
    this.x = Math.floor(Math.random() * NUM_TILES_WIDTH) * TILE_WIDTH;
    this.y = Math.floor(Math.random() * BUG_ROWS + BUG_ROWS_START) * TILE_HEIGHT - GEM_OFFSET;
}

// Update gem, required method for game
Gem.prototype.update = function() {
    ;
};

// Draw gem
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Remove gems when collected by player
Gem.prototype.remove = function() {
    index = gems.indexOf(this);
    if (index > -1) {
        gems.splice(index,1);
    }
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Set starting position and speed (semi-random)
    this.x = 0;
    this.y = Math.floor(Math.random() * BUG_ROWS + BUG_ROWS_START) * TILE_HEIGHT - BUG_OFFSET;
    this.speed = Math.floor(Math.random() * BUG_SPEED_MODIFIER + 1) * BUG_BASE_SPEED + (Math.random() * BUG_BASE_SPEED / 2);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // move right
    this.x += dt * this.speed;
    // Reset position and speed on screen edge
    if (this.x > TILE_WIDTH * NUM_TILES_WIDTH) {
        this.x = -TILE_WIDTH;
        this.y = Math.floor(Math.random() * BUG_ROWS + BUG_ROWS_START) * TILE_HEIGHT - BUG_OFFSET;
        this.speed = Math.floor(Math.random() * BUG_SPEED_MODIFIER + 1) * BUG_BASE_SPEED + (Math.random() * BUG_BASE_SPEED / 2);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Calculate enemy "sides", where the graphic actually exists within the png file. For use with checkCollisions()
Enemy.prototype.leftSide = function() {
    return this.x;
};
Enemy.prototype.rightSide = function() {
    return this.x + 97;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // set sprite
    this.sprite = 'images/char-boy.png';
    // set initial position
    this.xOrigin = Math.floor(NUM_TILES_WIDTH / 2) * TILE_WIDTH;
    this.yOrigin = TILE_HEIGHT * (NUM_TILES_HEIGHT - 1) - PLAYER_OFFSET;
    // set current position to initial position
    this.x = this.xOrigin;
    this.y = this.yOrigin;
};

// Update player, required method for game (updating currently handled by Player.prototype.handleInput)
Player.prototype.update = function(dt) {
    ;
};

// Reset player position and reset gems
Player.prototype.reset = function() {
    this.x = this.xOrigin;
    this.y = this.yOrigin;
    populateGems();
};

// Handle user input to control player
Player.prototype.handleInput = function(input) {
    // For each each direction key, move player corresponding direction if new location is still on the map
    if (input == 'up') {
        if (this.y - TILE_HEIGHT > 0) {
            this.y -= TILE_HEIGHT;
        }
        // Reset game if player jumps into water at top of map
        else {
            this.reset();
        }
    }
    else if (input == 'down' && this.y + TILE_HEIGHT < (NUM_TILES_HEIGHT - 1) * TILE_HEIGHT ) {
        this.y += TILE_HEIGHT;
    }
    else if (input == 'right' && this.x + TILE_WIDTH < NUM_TILES_WIDTH * TILE_WIDTH) {
        this.x += TILE_WIDTH;
    }
    else if (input == 'left' && this.x - TILE_WIDTH > -TILE_WIDTH) {
        this.x -= TILE_WIDTH;
    }
};

// Draw player
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Calculate player "sides", where the graphic actually exists within the png file. For use with checkCollisions()
Player.prototype.leftSide = function() {
    return this.x + 20;
};
Player.prototype.rightSide = function() {
    return this.x + 84;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = new Array();
for (var i = 0; i < NUM_BUGS; i++) {
    enemy = new Enemy();
    allEnemies.push(enemy);
}
// Place the player object in a variable called player
player = new Player();
// Place gem objects in array called gems
var gems = new Array();
// populate gems
function populateGems() {
    gems = [];
    colors = ['orange', 'green', 'blue'];
    colors.forEach(function(color) {
        gem = new Gem(color);
        gems.push(gem);
    });
}
populateGems();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
