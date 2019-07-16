/*****************************/
/********** HELPERS **********/
/*****************************/

/**
 * Constants of the images.
 */
var IMGS = {
    width: 80, // 101
    height: 135, // 171
    sheetWidth: 956, // 100..
    sheetHeight: 135, // 171
    vGap: 65, // 83
    hGap: 80, // 101
    indexes: {
        char1:  'images/char-boy.png',
        char2:  'images/char-cat-girl.png',
        char3:  'images/char-horn-girl.png',
        char4:  'images/char-pink-girl.png',
        char5:  'images/char-princess-girl.png',
        gem1:   'images/GemGreen.png',
        gem2:   'images/GemOrange.png',
        gem3:   'images/GemBlue.png',
        stone:  'images/stone-block.png',
        water:  'images/water-sheet.png',
        _log:   'images/Log.png',
        grass:  'images/grass-block.png',
        enemyL: 'images/enemy-bug-l.png',
        enemyR: 'images/enemy-bug-r.png',
        target: 'images/Selector.png',
        rock:   'images/Rock.png',
        star:   'images/Star.png',
        heart:  'images/Heart.png'
    }
};

/**
 * Returns the indexes object elements as array.
 */
IMGS.getIndexList = function() {
    var list = [];

    for (var key in IMGS.indexes) {
      if (IMGS.indexes.hasOwnProperty(key))
        list.push(IMGS.indexes[key]);
    }

    return list;    
};

IMGS.indexList = IMGS.getIndexList();

/**
 * This class allows to perform vector operations.
 * @param {number}
 * @param {number}
 * @constructor
 */
var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = {
    constructor: Vector,
    add: function(v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    },
    addNum: function(n) {
        this.x += n;
        this.y += n;

        return this;
    },
    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;

        return this;   
    },
    subNum: function(n) {
        this.x -= n;
        this.y -= n;

        return this;
    },
    mul: function(v) {
        this.x *= v.x;
        this.y *= v.y;

        return this;
    },
    mulNum: function(n) {
        this.x *= n;
        this.y *= n;

        return this;
    },
    div: function(v) {
        this.x /= v.x;
        this.y /= v.y;

        return this;
    },
    divFloor: function(v) {
        this.x = Math.floor(this.x / v.x);
        this.y = Math.floor(this.y / v.y);

        return this;
    },
    divNum: function(n) {
        this.x /= n;
        this.y /= n;

        return this;
    },
    divNumFloor: function(n) {
        this.x = Math.floor(this.x / n);
        this.y = Math.floor(this.y / n);

        return this;
    },
    copy: function(v) {
        if(v instanceof Vector === false)
            return this;

        this.x = v.x;
        this.y = v.y;

        return this;
    },
    set: function(x, y) {
        this.x = x;
        this.y = y;

        return this;
    },
    setNum: function(num) {
        this.x = num;
        this.y = num;

        return this;
    },
    equal: function(v) {
        return (this.x - v.x) === 0 && (this.y - v.y) === 0;
    }
};

/**
 * Methods to handle randomness and probability.
 */
var probs = {
    /**
     * Returns a random int between min and max: min <= x < max .
     * @param {number}
     * @param {number}
     * @return {number}
     */
    randInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Returns a random index of the passed array.
     * You can pass the following signs to influence the outcome: '<', '>', '=' .
     * <ul>
     * <li> The sign '<' increases the probability for higher indexes of being returned
     * <li> The sign '>' increases the probability for lower indexes of being returned
     * <li> With the sign '=', each index has the same probability of being returned
     * </ul>
     * @param {character}
     * @param {Array.<string, number, Object>}
     * @return {number} the index number
     */
    resDistr: function(sign, distr) {
        var arr = [];
        if(typeof distr === 'number'){
            for(var i=0; i<distr; i++){
                arr[i] = i;
            }
        }else{
            arr = distr;
        }

        if(sign === '='){
            return arr[this.randInt(0, arr.length)];
        }else{
            var sum = 0;
            for(var i=1; i<=arr.length; i++)
                sum += i;

            var prob = [];
            for(var i=arr.length; i>0; i--){
                var index = arr.length - i;
                var lastVal = 0;
                if(index>0){
                    lastVal = prob[index-1];
                }

                prob[index] = lastVal + (1/sum) * i;
            }

            var rand = Math.random(), index = 0;
            for(var i=0; i<arr.length; i++){
                if(i===0 && rand<prob[i]){

                    index = i;
                    break;
                }

                if(rand >= prob[i-1] && rand < prob[i]){
                    index = i;
                    break;
                }
            }

            if(sign === '<'){
                arr = arr.reverse();
            }

            return arr[index];
        }
    },
    
    /**
     * The higher is the passed value, the more is the chance that the boolean true is returned.
     * @param {number} Any number between 0 and 1
     * @return {boolean}
     */
    resChance: function(chance) {
        return Math.random() < chance;
    }
};

/**
 * An imaginary grid to simplify the positions of the game objects.
 */
grid = {

    /**
     * The size of each block. The transparency of the block images is cutted off from the measurement.
     * @type {Vector}
     */
    gap: new Vector(IMGS.width, IMGS.vGap),

    /**
     * The size of the grid relative to the canvas.
     * @type {Vector}
     */
    globalSize: new Vector(IMGS.width * 5, IMGS.vGap * 7)
};

/**
 * The local size of the grid: number of columns and rows.
 */
grid.localSize = new Vector().copy(grid.globalSize).divFloor(grid.gap);

/**
 * Computes the global size.
 * @return {Vector}
 */
grid.getGlobalSize = function() {
    var globalSize = new Vector();
    return globalSize.copy(grid.globalSize);
};

/**
 * Returns the position passed but relative to the canvas.
 * @param {Vector} the local position
 * @return {Vector} the global position
 */
grid.posToGlobal = function(localPos) {
    var globalPos = new Vector();
    return globalPos.copy(localPos).mul(grid.gap);
};

/**
 * Returns the position passed but relative to the grid.
 * @param {Vector} the global position
 * @return {Vector} the local position
 */
grid.posToLocal = function(globalPos) {
    var localPos = new Vector();
    return localPos.copy(globalPos).add(new Vector(grid.gap.x/2, grid.gap.y/2)).divFloor(grid.gap);
};

/**
 * Changes the position at the center of the closer block.
 * @param {Vector} a global position
 * @return {Vector} the closer center
 */
grid.posCenterGlobal = function(globalPos) {
    var localPos = grid.posToLocal(globalPos);
    return grid.posToGlobal(localPos);
};

/*****************************/
/******* GAME CLASSES ********/
/*****************************/

/**
 * This class is responsible for iterating through game objects and
 * invoking their own update() and render() methods.
 * @constructor
 */
var Scene = function() {
    /**
     * Timestap value used to compute the delta time.
     * @type {number}
     */
    this.lastTime = Date.now();

    /**
     * The array of objects that needs to be iterated.
     * @type {Array.<Object>}
     */
    this.entities = [];
};

Scene.prototype = {
    constructor: Scene,

    /**
     * Adds an object to the entities array
     * @param {Object} an instance of all the classes that implements the update() and render() methods
     */
    add: function(entity) {
        this.entities.push(entity);
    },

    /**
     * Removes an object from the entities array
     * @params {Object} the instance to be removed
     */
    remove: function(entity) {
        this.entities.remove(entity);
    },

    /**
     * Cuts and pastes or adds the object at the end of the entities array, 
     * so that it can be rendered on top of the other objects.
     * @param {Object} the entities element to be manipulated
     */
    bringFront: function(entity) {
        this.entities.remove(entity);
        this.add(entity);
    },

    /**
     * Iterates through the entities elements and calls their render() method
     */
    render: function() {
        this.entities.forEach(function(entity){
            entity.render();
        });
    },

    /**
     * Iterates through the entities elements and calls their update() method passing the delta time value
     */
    update: function() {
        var now = Date.now(),
            dt = (now - this.lastTime) / 1000.0;

        this.entities.forEach(function(entity){
            entity.update(dt);
        });

        this.lastTime = now;
    },

    /**
     * Empties the entities array
     */
    clean: function() {
        this.entities = [];
    }
};

/**
 * This class is responsible to detect and handle collisions between game objects (for instance player vs enemy), 
 * or between a game object and defined areas.
 * @constructor
 */
var Collider = function() {
    /**
     * List of the players currently added to the stage.
     * @type {Array.<Player>}
     */
    this.players = [];

    /**
     * List of the dangerous rows (like the water rows).
     * @type {Array.<number>}
     */
    this.dangerRows = [];

    /**
     * List of the items that prevent the movement.
     * @type {Array.<Object, Rock>}
     */
    this.blockPos = [];
};

Collider.prototype = {
    constructor: Collider,

    /**
     * Verifies if a collision happened between the passed entity and the players.
     * When it occurs, it changes properly the properties of the player, of the entity or both.
     * @param {Object} instance of an object currently displayed.
     */
    checkCollision: function(entity) {
        var collision = false;

        for(var i=0; i<this.players.length; i++){
            var player = this.players[i];

            if(!this.checkIntersection(player.pos, entity.pos)){
                if(player.hook === entity)
                    player.hook = null;

                continue;
            }

            if(entity instanceof Enemy){
                player.status.hearts--;
                player.respawn = true;
            }

            if(entity instanceof Log && player.hook !== entity)
                player.hook = entity;

            if(entity instanceof Gem){
                player.status.score += entity.bonus;
                entity.timeLife = -1;
            }

            if(entity instanceof Target){
                player.respawn = true;
                player.status.stars++;
            }
        }
    },

    /**
     * Checks if the position passed hits the water.
     * @param {Vector} the position.
     * @return {boolean}
     */
    checkWater: function(pos) {
        var locPos = grid.posToLocal(pos);

        return this.dangerRows.indexOf(locPos.y) > -1;
    },

    /**
     * Checks if the position passed hits a blocking object or the walls.
     * @param {Vector} the position.
     * @return {boolean}
     */
    checkWalls: function(newPos) {
        var locPos = new Vector();
        locPos = grid.posToLocal(newPos);

        if(locPos.y < 1){
            for(var i=0; i<this.blockPos.length; i++){
                var block = this.blockPos[i];

                if(grid.posToLocal(block.pos).equal(locPos)){
                    return true;
                }
            }

        }

        if(locPos.x < 0 || locPos.y < 0 || locPos.x > grid.localSize.x -1 || locPos.y > grid.localSize.y -1)
            return true;
        else 
            return false;
    },

    /**
     * Checks if the position passed hits a blocking object or the walls.
     * @param {Vector} the position.
     * @return {boolean}
     */
    checkIntersection: function(posA, posB) {
        var mPosX = posA.x + grid.gap.x / 2;
        var mPosY = posA.y + grid.gap.y / 2;

        if(mPosY < posB.y || mPosY > posB.y + grid.gap.y)
            return false;
        if(mPosX < posB.x || mPosX > posB.x + grid.gap.x)
            return false;

        return true;
    },

    /**
     * Clean all the list properties of the class.
     */
    clean: function() {
        this.players = [];
        this.dangerRows = [];
        this.blockPos = [];
    }
};

/**
 * Build and display the background at each frame (grass, stone, water blocks etc.)
 * @param {Array<Object, string>} list of image indexes and/or sprite sheet objects to be displayed.
 *     Sprite sheet object example: {sprite: [string], length: [number], pos: [number], time: [timestamp], speed: number}
 * @constructor
 */
var Background = function(rowImages) {
    /**
     * @type {Array<Object, string>}
     */
    this.rowImages = rowImages || [];
};

Background.prototype = {
    constructor: Background,

    /**
     * Display all the images in the correct column and row of the grid.
     */
    render: function() {
        ctx.clearRect(0,0,IMGS.width * 5, 606);

        for (var row = 0; row < grid.localSize.y; row++) {
            for (var col = 0; col < grid.localSize.x; col++) {
                if(typeof this.rowImages[row] == 'object'){
                    var img = this.rowImages[row];
                    ctx.drawImage(
                        Resources.get(img.sprite),
                        img.pos * grid.gap.x,
                        0,
                        grid.gap.x,
                        IMGS.height,
                        col * grid.gap.x,
                        row * grid.gap.y,
                        grid.gap.x,
                        IMGS.height
                    );
                }else{
                    ctx.drawImage(Resources.get(this.rowImages[row]), col * grid.gap.x, row * grid.gap.y);
                }
            }
        }

        this.rowImages.forEach(function(sprite) {
            if(typeof sprite == 'object'){
                if(Date.now() - sprite.time > sprite.speed){
                    sprite.time = Date.now();
                    sprite.pos = (sprite.pos + 1) % sprite.length;
                }
            }
        }); 
    },

    /**
     * Nothing to be updated at the moment. This void method prevents errors when the scene tries to update the background.
     */
    update: function() {

    }
};

/**
 * This class allows game objects to be rendered as sprites.
 * @constructor
 */
var Sprite = function(params) {
    var p = params || {};

    /**
     * The index of the image.
     * @type {string}
     */
    this.index  = p.index  || IMGS.indexes.stone;

    /**
     * The position relative to the inner rectangle of the image.
     * @type {Vector}
     */
    this.offset = p.offset || new Vector();

    /**
     * The size of the image.
     * @type {Vector}
     */
    this.size   = p.size   || new Vector(IMGS.width, IMGS.height);
};

Sprite.prototype = {
    constructor: Sprite,

    /**
     * Draw retrieves and draws the image.
     * @param {Vector} The position relative to the canvas.
     */
    draw: function(pos) {
        ctx.drawImage(Resources.get(this.index),
            this.offset.x,
            this.offset.y,
            this.size.x,
            this.size.y,
            pos.x,
            pos.y,
            this.size.x,
            this.size.y
        );
    }
};

/**
 * This class defines all the static game objects: rocks, bonuses etc.
 * @param {Vector} - position relative to the canvas.
 * @param {Collider} - injection of the collider instance.
 * @param {Sprite} - the sprite rapresenting the object on the canvas.
 * @constructor
 */
var StaticEntity = function(params) {
    var p = params || {};

    this.pos      = new Vector().copy(p.pos);
    this.collider = p.collider || null;
    this.sprite   = p.sprite   || new Sprite({index: IMGS.indexes.stone, offset: new Vector()});
};

StaticEntity.prototype = {
    constructor: StaticEntity,

    /**
     * Updates for collision.
     */
    update: function() {
        if(this.collider)
            this.collider.checkCollision(this);
    },

    /**
     * Draws the sprite.
     */
    render: function() {
        this.sprite.draw(this.pos);
    }
};

/**
 * This class defines all the game objects that move horizzontally: logs, enemies etc.
 * @param {Vector} - position relative to the canvas.
 * @param {Sprite} - the sprite rapresenting the object on the canvas.
 * @param {Number} - the horizontal speed
 * @param {Number} - direction of the movement: 1 from left to right, -1 from right to left.
 * @param {Number} - distance the object have to cover before to be removed.
 * @param {Collider} - injection of the collider instance.
 * @constructor
 */
var SlidingEntity = function(params) {
    var p = params || {};

    this.pos        = new Vector().copy(p.pos);
    // The origin is used as reference point to compute the covered distance.
    this.origin     = new Vector().copy(p.pos);
    this.sprite     = p.sprite     || new Sprite({index: IMGS.indexes.stone, offset: new Vector()});
    this.speed      = p.speed      || 100;
    this.direction  = p.direction  || 1;
    this.pathLength = p.pathLength || 505;
    this.collider   = p.collider   || null;
    // Distance covered. 
    this.distance   = 0;
};

SlidingEntity.prototype = {
    constructor: SlidingEntity,

    /**
     * Updates position and checks for collisions.
     * @param {number} the delta time.
     */
    update: function(dt) {
        this.pos.x += dt * this.speed * this.direction;
        this.distance = this.pos.x - this.origin.x;

        if(this.collider)
            this.collider.checkCollision(this);
    },

    /**
     * Draws the sprite.
     */
    render: function() {
        this.sprite.draw(this.pos);
    }
};

/**
 * This class defines the target to reach in order to pass a level.
 * @param {Object} - StaticEntity parameters.
 * @param {Sprite} - the sprite of the object.
 * @extends {StaticEntity}
 */
var Target = function(params) {
    var p = params || {};

    p.sprite = p.sprite || new Sprite({index: IMGS.indexes.target});
    StaticEntity.call(this, p);
};

Target.prototype = Object.create(StaticEntity.prototype);
Target.prototype.constructor = Target;

/**
 * This class defines the rock obstacles.
 * @param {Object} - StaticEntity parameters.
 * @param {Sprite} - the sprite of the object.
 * @constructor
 * @extends {StaticEntity}
 */
var Rock = function(params) {
    var p = params || {};

    p.sprite = p.sprite || new Sprite({index: IMGS.indexes.rock, offset: new Vector(0, 20)});
    StaticEntity.call(this, p);
};

Rock.prototype = Object.create(StaticEntity.prototype);
Rock.prototype.constructor = Rock;

/**
 * This class defines bonus gems.
 * @param {Object} - StaticEntity parameters.
 * @param {Sprite} - the sprite of the object.
 * @constructor
 * @extends {StaticEntity}
 */
var Gem = function(params) {
    var p = params || {};
    p.sprite = p.sprite || new Sprite({index: IMGS.indexes.gem1, offset: new Vector(), scale: new Vector(0.4, 0.4)});
    p.scale = new Vector(0.4, 0.4);
    StaticEntity.call(this, p);

    this.bonus = p.bonus || 100;
    this.timeLife = p.timeLife || 1000;
};

Gem.prototype = Object.create(StaticEntity.prototype);
Gem.prototype.constructor = Gem;

/**
 * This class defines the logs floating on the water.
 * @param {Object} - SlidingEntity parameters.
 * @param {Sprite} - the sprite of the object.
 * @constructor
 * @extends {SlidingEntity}
 */
var Log = function(params) {
    var p = params || {};

    p.sprite = p.sprite || new Sprite({index: IMGS.indexes._log, offset: new Vector(0, 33)});
    SlidingEntity.call(this, p);
};

Log.prototype = Object.create(SlidingEntity.prototype);
Log.prototype.constructor = Log;

/**
 * This class defines the bugs running on the stone.
 * @param {Object} - SlidingEntity parameters.
 * @param {Sprite} - the sprite of the object.
 * @constructor
 * @extends {SlidingEntity}
 */
var Enemy = function(params) {
    var p = params || {};

    var spriteIndex = (p.direction < 0) ? IMGS.indexes.enemyL : IMGS.indexes.enemyR;
    p.sprite = p.sprite || new Sprite({index: spriteIndex, offset: new Vector(0, 20)});
    SlidingEntity.call(this, p);
};

Enemy.prototype = Object.create(SlidingEntity.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * The player!
 * @param {StatusBar} - injection of the status bar instance.
 * @param {Collider} - injection of the collider instance.
 * @param {Sprite} - the sprite rapresenting the object on the canvas.
 * @param {Vector} - the position relative to the canvas.
 * @constructor
 */
var Player = function(params) {
    var p = params || {};

    this.status   = p.status;
    this.collider = p.collider;
    this.sprite   = p.sprite   || new Sprite();
    this.pos      = p.pos      || new Vector();

    // Link to another game object that interacts with the player.
    // For istance the log object when the player is using it.  
    this.hook     = null;
    // the player is injected in the collider.
    this.collider.players.push(this);
    // The position where the player respawns.
    this.posRespawn  = new Vector().copy(p.pos);
    // How much distance covers a jump.
    this.jumpSize    = grid.gap;
    // The position to be reached subtracted to the current position.  
    this.shift       = new Vector();
    // Store the current position.
    this.currPos     = new Vector();
    // The time position used to animate the jump.
    this.jumpStep    = -1;
    // The respawn status.
    this.respawn     = false;
};

/**
 * Updates the position and status relying on some conditions.
 * @param {number} the delta time.
 */
Player.prototype.update = function(dt) {
    if((this.jumpStep == -1 || this.jumpStep > 4) && this.collider.checkWater(this.pos) && !this.hook){
        this.status.hearts--;
        this.respawn = true;    
    }

    if(this.respawn){
        this.pos = new Vector().copy(this.posRespawn);
        this.respawn = false;
        this.jumpStep = -1;
        return;
    }

    if(this.hook){
        var x = this.pos.x + dt * this.hook.speed * this.hook.direction;
        if(!this.collider.checkWalls(new Vector(x + (this.hook.direction * (grid.gap.x/2)), this.pos.y)))
            this.pos.x = x;
    }

    if(this.jumpStep >= 0)
        this.jump();
};

/**
 * Draws the sprite rapresenting the object on the canvas.
 */
Player.prototype.render = function() {
    this.sprite.draw(this.pos);
};

/**
 * Parse the key pressed and starts the first step of the jump.
 * @param {number}
 */
Player.prototype.handleInput = function(key) {
    if(this.jumpStep >= 0)
        return;

    var directions = {
        'left'  : new Vector(-1,  0),
        'up'    : new Vector( 0, -1),
        'right' : new Vector( 1,  0),
        'down'  : new Vector( 0,  1)
    };

    this.beforeJump(directions[key]);
};

/**
 * Compute the jump and checks the conditions necessary to perform it.
 * @param {Vector} the direction of the jump.
 */
Player.prototype.beforeJump = function(dir) {
    var newPos = new Vector();

    this.shift.copy(this.jumpSize).mul(dir);
    newPos.copy(this.pos).add(this.shift);

    if(this.collider.checkWalls(newPos))
        return;

    if(!this.collider.checkWater(newPos) && this.hook){
       this.shift.x = grid.posCenterGlobal(newPos).sub(this.pos).x;
    }

    this.currPos.copy(this.pos);
    this.jump();
};

/**
 * Animates the jump with the easing equations.
 */
Player.prototype.jump = function() {
    var steps = 6;

    this.jumpStep++;

    if(this.shift.x)
        this.pos.x = easeInOutCirc(this.jumpStep, this.currPos.x, this.shift.x, steps);
    if(this.shift.y)
        this.pos.y = easeInOutCirc(this.jumpStep, this.currPos.y, this.shift.y, steps);
    
    if(this.jumpStep === steps)
        this.jumpStep = -1;
};

/**
 * Reset the player properties.
 */
Player.prototype.reset = function() {
    this.jumpStep = -1;
    this.pos = new Vector().copy(this.posRespawn);
    this.hook = null;
};

/**
 * This class is responsible for creating and removing bonuses and distributing them in the time space of a level.
 * @param {Number} - how much bonuses for each level.
 * @param {Number} - the time in which the bonuses are distributed.
 * @param {Collider} - injection of the collider instance.
 *     The underscore is added to prevent the parent class StaticEntity to use it directly.
 * @constructor
 */
var BonusFactory = function(params) {
    var p = params || {};

    this.bonusNum = p.bonusNum || 15;
    this.timeRange = p.timeRange || 40000;
    this._collider = p._collider || null;
    // @type {Array.<number>} List of istances within the time range in which a bonuses is created.
    this.timeLine = [];

    for(var i=0; i<this.bonusNum; i++){
        this.timeLine.push(probs.randInt(0, 40000));
    }

    // @type {Array.<Object>} List of bonuses created that wait to be removed.
    this.entities = [];
    // The time used as reference point to compute the time covered.
    this.timeStart = Date.now();
};

BonusFactory.prototype = {
    constructor: BonusFactory,

    /**
     * Create a bonus with some random properties.
     */
    generate: function() {
        var gemIndex = [0,1,2][probs.resDistr('>',3)];
        var spriteIndex = IMGS.indexList[gemIndex + 5];
        var bonus = [100, 200, 400][gemIndex];
        var timeLife = [150,100,50][gemIndex];
        var pos = new Vector(
            probs.randInt(0, grid.localSize.x),
            probs.randInt(0, grid.localSize.y)
        );

        this.entities.push(new Gem({
            sprite: new Sprite({index: spriteIndex, offset: new Vector(0, 20)}),
            bonus: bonus,
            timeLife: timeLife,
            pos: grid.posToGlobal(pos)
        }));
    },

    /**
     * Calls the updating methods.
     * @param {number} the delta time.
     */
    update: function(dt) {
        this.updateDestroyer(dt);
        this.updateCreator(dt);
    },

    /**
     * Checks the timeline to generate a bonus.
     * @param {number} the delta time.
     */
    updateCreator: function(dt) {
        var currTime = Date.now() - this.timeStart;

        for(var i=0; i<this.timeLine.length; i++){
            if(currTime > this.timeLine[i]){
                this.generate();
                this.timeLine.iremove(i);
            }
        }
    },

    /**
     * If a bonus is taken or its time life is negative, the bonus is removed.
     * @param {number} the delta time.
     */
    updateDestroyer: function(dt) {
        for(var i=0; i<this.entities.length; i++){
            var entity = this.entities[i];

            if(this._collider)
                this._collider.checkCollision(entity);

            entity.timeLife--;
            if(entity.timeLife < 0){
                this.entities.remove(entity);
                continue;
            }

            entity.update(dt);
        }
    },

    /**
     * Renders each bonus.
     */
    render: function() {
        this.entities.forEach(function(entity) {
            entity.render();
        });
    }
};

/**
 * This class creates and destroys sliding entities relying on certain criteria.
 * @param {Array.<SlidingEntity>} - all the entities created that wait to be removed.
 * @param {Number} - minimum frequency at which an entity is created.
 * @param {Number} - maximum frequency at which an entity is created.
 * @constructor
 */
var SlidingEntityFactory = function(params) {
    var p = params || {};

    this.entityParams = p.entityParams || {};
    this.minFreq = p.minFreq || 500;
    this.maxFreq = p.maxFreq || 1500;

    // @type {Array.<SlidingEntity>} - List of entities created that wait to be removed.
    this.entities = [];
    // The frequency at which an entity is created.
    this.spawnFrequency = probs.randInt(this.minFreq, this.maxFreq);
    // The chance that an entity has of being created.
    this.spawnChance = p.spawnChance || 1;
    // The time since the last creation.
    this.timer = (Date.now() + p.timerOffset) || Date.now();    
};

SlidingEntityFactory.prototype = {
    constructor: SlidingEntityFactory,
    /**
     * Renders each entity
     */
    render: function() {
        this.entities.forEach(function(entity) {
            entity.render();
        });
    },

    /**
     * Calls the updating methods.
     * @param {number}
     */
    update: function(dt) {
        this.updateDestroyer(dt);
        this.updateCreator(dt);
    },

    /**
     * If an entity has covered its distance is removed.
     * @param {number} the delta time.
     */
    updateDestroyer: function(dt) {
        // remove on path completed or update entity
        var entities = this.entities;
        this.entities.forEach(function(entity) {
            if(entity.distance > entity.pathLength)
                entities.remove(entity);
            else
                entity.update(dt);
        });
    },

    /**
     * Checks the conditions to generate a bonus.
     * @param {number} the delta time.
     */
    updateCreator: function(dt) {
        // spawn frequency check
        var lapse = Date.now() - this.timer;
        if(lapse < this.spawnFrequency)
            return;

        // spawn chance check
        var chance = probs.resChance(this.spawnChance);
        if(chance){
            this.addEntity();
        }

        this.timer = Date.now();
        this.spawnFrequency = probs.randInt(this.minFreq, this.maxFreq);
    },

    /**
     * Creates an entity and adds it to the list.
     */
    addEntity: function() {
        this.entities.push(new SlidingEntity(this.entityParams));
    }
};

/**
 * The factory responsible for creating and removing enemies.
 * @param {Object} - SlidingEntityFactory parameters.
 * @constructor
 * @extends {SlidingEntityFactory}
 */
var EnemyFactory = function(params) {
    SlidingEntityFactory.call(this, params);
};

EnemyFactory.prototype = Object.create(SlidingEntityFactory.prototype);
EnemyFactory.prototype.constructor = EnemyFactory;

/**
 * Creates an enemy and adds it to the list.
 */
EnemyFactory.prototype.addEntity = function() {
    this.entities.push(new Enemy(this.entityParams));
};

/**
 * The factory responsible for creating and removing logs.
 * @param {Object} - SlidingEntityFactory parameters.
 * @constructor
 * @extends {SlidingEntityFactory}
 */
var LogFactory = function(params) {
    SlidingEntityFactory.call(this, params);
};

LogFactory.prototype = Object.create(SlidingEntityFactory.prototype);
LogFactory.prototype.constructor = LogFactory;

/**
 * Creates a log and adds it to the list.
 */
LogFactory.prototype.addEntity = function() {
    this.entities.push(new Log(this.entityParams));
};

/**
 * This class manages the logic of the game.
 * @param {Scene} - injection of the scene instance.
 * @param {Collider} - injection of the collider.
 * @constructor
 */
var Game = function(scene, collider) {
    // @type {Array.<Player>} - list of the players.
    this.players = [];
    this.scene = scene;
    // The current level.
    this.level = new Level(this, scene, collider);
};

Game.prototype = {
    constructor: Game,

    /**
     * Updates the status of the players and performs the appropriate action.
     * If the time is out, changes the level.
     * @param {number} delta time
     */
    update: function(dt) {
        for(var i=0; i<this.players.length; i++){
            var player = this.players[i];

            player.status.update();
            this.level.time.update();

            if(this.level.time.isOut()){
                this.changeLevel();
                return;
            }
            var status = player.status.current;
            if(status !== 'play'){
                this.actions[status](this, player);
            }
        }
    },

    /**
     * Renders the status bar of each player.
     */
    render: function() {
        for(var i=0; i<this.players.length; i++){
            this.players[i].status.render();
            this.level.time.render();
        }
    },

    /**
     * Starts the game creating the level and adding players to it.
     * @param {boolean} if true, a second player is added.
     */
    start: function(multi) {

        this.level.createRows();
        this.level.addBonusFactory();

        this.level.addPlayer();
        if(multi)
            this.level.addPlayer();
    },

    /**
     * Prepares the players for another level and brings them on top of the other game objects.
     */
    replacePlayers: function() {
        this.players[0].reset();
        this.level.scene.bringFront(this.players[0]);
        this.level.scene.bringFront(this.players[0].status);
        this.level.collider.players.push(this.players[0]);

        if(this.players[1]){
            this.players[1].reset();
            this.level.scene.bringFront(this.players[1]);
            this.level.scene.bringFront(this.players[1].status);
            this.level.collider.players.push(this.players[1]);            
        }
    },

    /**
     * Reset the status bar of the players.
     */
    resetStatus: function() {
        this.players[0].status.reset();

        if(this.players[1])
            this.players[1].status.reset();
    },

    /**
     * Calls all the methods necessary to change level.
     */
    changeLevel: function() {
        this.level.clean();
        this.level.createRows();
        this.level.scene.add(this);

        this.level.addBonusFactory();
        this.replacePlayers();

        this.level.time.startTime = Date.now();
    },

    /**
     * Reset the game.
     */
    resetGame: function() {
        this.resetStatus();
        this.changeLevel();
    },

    /**
     * Popup the winner on the screen.
     * @param {Player} the winner is...
     */
    showWinner: function(player) {
        alert(player.status.name + ' Wins! Score: ' + player.status.score);
    },

    /**
     * Actions to perform when a player triggers an event.
     */
    actions: {
        /**
         * Popups a message and then resets the game because a player is dead.
         * @param {Game} the current game.
         * @param {Player} the player that triggered the event.
         */
        dead: function(ctx, player) {
            var i = -1;
            if(ctx.players.length > 1){
                i = ( ctx.players.indexOf(player) === 0 ) ? 1 : 0;
                ctx.showWinner(ctx.players[i]);
            }else{
                alert('You are dead!');
            }

            ctx.resetGame();
        },

        /**
         * Changes the level because a player reached the target.
         * @param {Game}
         * @param {Player}
         */
        goal: function(ctx, player) {
            var timeLength = ctx.level.time.timeLength;
            var timeLeft = ctx.level.time.timeLeft;
            player.status.score += 1000 + Math.floor(timeLeft / 50); 
            ctx.changeLevel();
        },

        /**
         * Popups a message and resets the game because a player finished the minimum number of levels.
         * @param {Game}
         * @param {Player}
         */
        finish: function(ctx, player) {
            player.status.score += 4000;
            ctx.showWinner(player);

            ctx.resetGame();
        }
    }
};

/**
 * This class is responsible for taking in account the overall status of the players 
 * in the current game session. For each player a StatusBar instance is injected.
 * @param {Vector} - the coordinates of the origin, relative to the canvas, of the status bar sprites.
 * @param {string} - the name of the player.
 * @param {boolean} - if true, the statusBar is displayed reversed.
 * @constructor
 */
var StatusBar = function(origin, name, displayReverse) {
    /**
     * The name of the player.
     * @type {string}
     */
    this.name = name || 'Player1';

    /**
     * Ths status of the player. In the Game class the status strings are used to trigger actions.
     * @type {string}
     */
    this.current = 'play';

    /**
     * Initial number of lives.
     * @type {number}
     */
    this.minHearts = 3;

    /**
     * The stars to get to complete the game.
     * @type {number}
     */
    this.maxStars = 5;

    /**
     * The current number of hearts.
     * @type {number}
     */
    this.hearts = this.minHearts;

    /**
     * The current number of stars.
     * @type {number}
     */
    this.stars = 0;

    /**
     * A support to check when the number of stars changes.
     * @type {number}
     */
    this.starsTemp = 0;

    /**
     * The current score.
     * @type {number}
     */
    this.score = 0;

    /**
     * The coordinates of the origin, relative to the canvas, of the status bar sprites.
     * @type {Vector}
     */
    this.origin = origin || new Vector();

    /**
     * Horizontal margin.
     * @type {number}
     */
    this.hGap = 20;

    /**
     * Vertical margin.
     * @type {number}
     */
    this.vGap = 30;

    /**
     * The values representing how much the sprites in the status bar are scaled.
     * @type {number}
     * @type {number}
     */
    this.scaleX = 0.4;
    this.scaleY = 0.4;

    /**
     * If true, the statusBar is displayed reversed.
     * @type {boolean}
     */
    this.displayReverse = displayReverse || false;
};

StatusBar.prototype = {
    constructor: StatusBar,

    /**
     * Updates the current status.
     */
    update: function() {
        this.current = 'play';
        
        if(this.hearts <= 0){
            this.current = 'dead';
            return;
        }

        if(this.starsTemp != this.stars){
            this.current = 'goal';

            if(this.stars == this.maxStars)
                this.current = 'finish';
        }
        
        this.starsTemp = this.stars;
    },

    /**
     * Draws the status of the player's game: hearts, stars, name and scores.
     */
    render: function() {
        ctx.save();

        if(this.displayReverse){
            ctx.translate(grid.globalSize.x,0);
            ctx.scale(-this.scaleX, this.scaleY);
        }else{
            ctx.scale(this.scaleX, this.scaleY);
        }

        for(var i=0; i<this.hearts; i++){
            var x = 1 * (this.origin.x + (this.hGap * i)) / this.scaleX;
            var y = 1 * this.origin.y / this.scaleY;

            ctx.drawImage(Resources.get(IMGS.indexes.heart), x, y);
        }
        for(var i=0; i<this.stars; i++){
            var x = 1 * (this.origin.x + this.hGap * i) / this.scaleX;
            var y = 1 * (this.origin.y + this.vGap) / this.scaleY;

            ctx.drawImage(Resources.get(IMGS.indexes.star), x, y);
        }
        ctx.restore();
        ctx.save();

        var x = this.origin.x;
        var y = this.origin.y + (3.2 * this.vGap);

        if(this.displayReverse){
            ctx.textAlign = 'right';
            x += grid.globalSize.x - this.hGap;
        }

        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.name + ': ' + this.score, x, y);

        ctx.restore();
    },

    /**
     * Resets the status of the player's game.
     */
    reset: function() {
        this.hearts = this.minHearts;
        this.stars = 0;
        this.starsTemp = 0;
    }
};

/**
 * This class defines the time for each level.
 * @constructor
 */
var TimeBar = function() {
    /**
     * The instance in which the level starts.
     * @type {number}
     */
    this.startTime = Date.now();

    /**
     * The remaining time.
     * @type {number}
     */
    this.timeLeft = 0;

    /**
     * The initial amount of time in milliseconds.
     * @type {number}
     */
    this.timeLength = 40000;

    /**
     * The width of the timebar when the level starts.
     * @type {number}
     */
    this.initWidth = grid.globalSize.x;

    /**
     * The current width of the timebar.
     * @type {number}
     */
    this.currWidth = this.initWidth;

    /**
     * How much each colors shift as time passes.
     * @type {number}
     * @type {number}
     * @type {number}
     */
    this.rGapMax = 255;
    this.gGapMax = 100;
    this.bGapMax = 180;

    /**
     * The initial value of the colors.
     * @type {number}
     * @type {number}
     * @type {number}
     */
    this.r = 0;
    this.g = 100;
    this.b = 180;
};

TimeBar.prototype = {
    constructor: TimeBar,

    /**
     * Computes the time passed, the width of the timebar and the colors of the current instance.
     * @param the delta time.
     */
    update: function(dt) {
        this.timeLeft = this.timeLength - (Date.now() - this.startTime);
        this.currWidth = (this.initWidth / this.timeLength) * this.timeLeft;
        if(this.currWidth < 3)
            this.currWidth = 3;

        this.r = Math.floor( (this.rGapMax / this.timeLength) * this.timeLeft );
        this.g = Math.floor( (this.gGapMax / this.timeLength) * this.timeLeft );
        this.b = Math.floor( (this.bGapMax / this.timeLength) * this.timeLeft );
    },

    /**
     * Draws the timebar.
     */
    render: function() {
        ctx.fillStyle = 'rgb(' + (this.rGapMax - this.r) + ',' + this.g + ',' + this.b + ')';
        ctx.fillRect(0, grid.globalSize.y + grid.gap.y/2, this.currWidth, 5);
    },

    /**
     * Reset the time.
     */
    resetTime: function() {
        this.startTime = Date.now();
    },

    /**
     * It returs true if the time is out: the width of the bar is closer to 0.
     * @return {boolean}
     */
    isOut: function() {
        return this.currWidth <= 3;
    }
};

/**
 * This class contains useful methods to randomly decorate and to populate a level.
 * It directly creates instances of the game objects and adds them to the scene.
 * @param {Game} - injection of the game instance.
 * @param {Scene} - injection of the game instance.
 * @param {Collider} - injection of the game instance.
 * @constructor
 */
var Level = function(game, scene, collider) {
    this.game     = game;
    this.scene    = scene;
    this.collider = collider;

    // The instance of the timebar.
    this.time = new TimeBar();
};

/**
 * Instantiates a random background configuration.
 * Passes the correct row numbers to some methods that create factories and populate the level.
 * For instance the enemy factories go in the stone rows and the log factories in the water ones.
 */
Level.prototype.createRows = function() {
    var pTypes = [{sprite: IMGS.indexes.water, length: 12, pos: 0, time: Date.now(), speed: 60},
                        IMGS.indexes.stone,
                        IMGS.indexes.grass],
        randomRows = [0, 1, probs.randInt(0,2), probs.randInt(0,2), probs.randInt(0,2)],
        staticRows = [],
        pArray = [];

    pArray.push(pTypes[2]); // first row
    while(randomRows.length){
        var dIndex = probs.randInt(0, randomRows.length);
        var pIndex = randomRows[dIndex];

        pArray.push(pTypes[pIndex]);
        randomRows.splice(dIndex, 1);

        staticRows.push(pIndex);
    }
    pArray.push(pTypes[2]); // last row

    var background = new Background(pArray);
    this.scene.add(background);

    this.populateFinalRow(0);

    var row = 1, that = this;
    staticRows.forEach(function(i) {
        if(i===0){
            that.addLogFactory(row);
            that.collider.dangerRows.push(row);
        }else{
            that.addEnemyFactory(row);
        }
        row++;
    });    
};

/**
 * Populates the final row, with random rocks and the target.
 */
Level.prototype.populateFinalRow = function(row) {
    var cols = [0,1,2,3,4];

    var index  = probs.randInt(0, cols.length);
    var col    = cols[index];
    var target = new Target({pos: grid.posToGlobal(new Vector(col, row)), collider: this.collider});

    this.scene.add(target);
    cols.splice(index, 1);

    var rocksNum = probs.randInt(0, 4);

    for(var i=0; i<rocksNum; i++) {
        var index  = probs.randInt(0, cols.length);
        var col    = cols[index];
        var rock   = new Rock( {pos: grid.posToGlobal(new Vector(col, row))} );

        this.collider.blockPos.push(rock);
        this.scene.add(rock);
        cols.splice(index, 1);
    }
};

/**
 * Creates and adds the bonus factory to the scene with a random number of bonuses.
 */
Level.prototype.addBonusFactory = function() {
    this.scene.add(new BonusFactory({
        bonusNum: probs.randInt(10, 20),
        timeRange: this.time.timeRange,
        _collider: this.collider
    }));
};

/**
 * Creates a randomly configured LogFactory and assigns it to the passed row number.
 * All the logs created with the factory will show up in that specific row.
 */
Level.prototype.addLogFactory = function(row) {
    var di = probs.resDistr('=', 2); // direction index
    var si = probs.resDistr('=', 2); // speed index
    
    var p = {
        direction  : [-1, 1][di],
        pos        : grid.posToGlobal(new Vector([6, -1][di], row)),
        speed      : [70, 140][si],
        pathLength : grid.getGlobalSize().x + IMGS.width,
        random     : Math.random(),
        collider   : this.collider
    };
    this.scene.add(new LogFactory({
        entityParams: p,
        minFreq     : [3000, 2000][si],
        maxFreq     : [3000, 2000][si],
        spawnChance : [0.8, 0.7][si]
    }));
};

/**
 * Creates a randomly configured EnemyFactory and assigns it to the passed row number.
 * All the enemies created with the factory will show up in that specific row.
 */
Level.prototype.addEnemyFactory = function(row) {
    var di = probs.resDistr('=', 2); // direction index
    var si = probs.resDistr('=', 3); // speed index
    
    var p = {
        direction  : [-1, 1][di],
        pos        : grid.posToGlobal(new Vector([6, -1][di], row)),
        speed      : [100, 175, 250][si],
        pathLength : grid.getGlobalSize().x + IMGS.width,
        random     : Math.random(),
        collider   : this.collider
    };
    
    this.scene.add(new EnemyFactory({
        entityParams: p,
        minFreq     : [2100, 1100, 800][si],
        maxFreq     : [2100, 2000, 2000][si],
        spawnChance : [0.6, 0.8, 1][si]
    }));
};

/**
 * Creates a player and its statusbar. Then injects it into the game and the scene objects.
 * If a player is already existing, before adding the second one, it adjusts its respawn position and resets it, 
 * then flips the rappresentation of its status on the canvas. 
 */
Level.prototype.addPlayer = function() {
    var currentPlayer = this.game.players.length;

    if(currentPlayer > 1)
        return;

    if(currentPlayer == 1){
        this.game.players[0].posRespawn = grid.posToGlobal(new Vector(3, 6));
        this.game.players[0].reset();

        this.game.players[0].status.displayReverse = true;
    }

    var gridHeight      = grid.globalSize.y;

    var statusPos       = new Vector(10, gridHeight + 25);
    var name            = (currentPlayer) ? 'Player2' : 'Player1';
    var displayReverse  = (currentPlayer) ? true : false;
    var playerPos       = [new Vector(2, 6), new Vector(1, 6)][currentPlayer];
    var playerIndex     = IMGS.indexList[ probs.resDistr('>', 5) ];

    var statusBar = new StatusBar(statusPos, name);

    var player = new Player({
        sprite: new Sprite({index: playerIndex, offset: new Vector(0, 20)}),
        pos: grid.posToGlobal(playerPos),
        collider: this.collider,
        status: statusBar
    });

    this.game.players.push(player);
    this.scene.add(player);
};

/**
 * Calls the methods needed to clean the level.
 */
Level.prototype.clean = function() {
    this.scene.clean();
    this.collider.clean();
};
