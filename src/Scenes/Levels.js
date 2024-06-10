class LevelTemplate extends Phaser.Scene {
    constructor(name, mapName) {
        super(name);

        this.mapName = mapName;
    }

    init() {
        this.spawnPointX = 100;
        this.spawnPointY = 250;

        this.physics.world.gravity.y = 1500;

        this.playerKeys = 0;

        this.badEnd = false;
        this.goodEnd = false;

        this.physics.world.drawDebug = false;
    }

    preload() {
        this.load.scenePlugin("AnimatedTiles", "./lib/AnimatedTiles.js", "animatedTiles", "animatedTiles");
    }

    create() {
        // create layers
        this.map = this.add.tilemap(this.mapName, 18, 18, 125, 20);

        this.tileset = this.map.addTilesetImage("tilemap-packed", "tilemap_tiles");

        this.rockLayer = this.map.createLayer("Pillars", this.tileset).setScrollFactor(0.75).setScale(1.5);
        this.treeLayer = this.map.createLayer("Trees", this.tileset).setScrollFactor(0.75).setScale(1.5);

        this.hazardLayer = this.map.createLayer("Hazards", this.tileset);
        this.hazardLayer.forEachTile((hazard) => {
            if (hazard.index == 69)
                hazard.setSize(10, 5);
        });
        this.hazardLayer.setCollisionByProperty({ collides: true });

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset);
        this.groundLayer.setCollisionByProperty({ collides: true });

        // create objects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        })

        this.keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 27
        })

        this.barriers = this.map.createFromObjects("Objects", {
            type: "barrier",
            key: "tilemap_sheet",
            frame: 28
        })

        this.checkpoints = this.map.createFromObjects("Objects", {
            name: "checkpoint"
        })

        this.goal = this.map.createFromObjects("Objects", {
            name: "goal"
        })

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.keys);

        this.physics.world.enable(this.barriers, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.pointGroup = this.add.group(this.checkpoints);

        this.physics.world.enable(this.goal, Phaser.Physics.Arcade.STATIC_BODY);

        for (let coin of this.coins)
            coin.anims.play("spin");

        // animate tiles
        this.animatedTiles.init(this.map);

        // enable physics
        my.sprite.player = new Player(this, this.spawnPointX, this.spawnPointY, "tilemap_characters", 0);
        my.sprite.player.setFlip(true, false);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.body.setMaxVelocityX(200);
        my.sprite.player.body.setMaxVelocityY(500);

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        for (let barrier of this.barriers)
            this.physics.add.collider(my.sprite.player, barrier);
        
        this.physics.add.collider(my.sprite.player, this.hazardLayer, () => {
            this.respawn();
        });

        // object behavior
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            playerScore++;
            this.sound.play("coinPickup");
            my.sprite.player.sparkle(obj2);
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            this.playerKeys++;
            for (let barrier of this.barriers) {
                if (barrier.name == ("barrier0" + this.playerKeys))
                    barrier.destroy();
            }
            this.sound.play("keyPickup");
            my.sprite.player.sparkle(obj2);
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.pointGroup, (obj1, obj2) => {
            this.spawnPointX = obj2.x;
            this.spawnPointY = obj2.y;
            this.sound.play("spawnReset");
            my.sprite.player.bang(obj2);
            obj2.destroy();
        })

        // create keys
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.restart = this.input.keyboard.addKey("R");
        cursors = this.input.keyboard.createCursorKeys();

        // camera behavior setup
        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels - 36);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels - 36);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setZoom(3.5);

        this.scene.launch("textScene");
    }

    update() {
        this.scene.get("textScene").setScore(playerScore);
    }

    respawn() {
        this.cameras.main.shake(200, 0.005);
        if (playerScore > 0) {
            my.sprite.player.setPosition(this.spawnPointX, this.spawnPointY);
            this.sound.play("playerHurt", { rate: 2, volume: 0.5 });
        } else {
            this.scene.get("textScene").setState("game over");
            my.vfx.walking.stop();
            my.sprite.player.destroy();
            this.badEnd = true;
            this.sound.play("playerDeath");
        }

        playerScore -= 4;
        if (playerScore < 0)
            playerScore = 0;
    }
}

class LevelOne extends LevelTemplate {
    constructor() {
        super("levelOneScene", "level-one");
    }

    init() {
        super.init();
        playerScore = 0;
    }

    create() {
        super.create();

        this.physics.add.overlap(my.sprite.player, this.goal, (obj1, obj2) => {
            this.scene.get("textScene").setState("next level");
            my.sprite.player.stop();
            this.goodEnd = true;
        })

        this.continue = this.input.keyboard.addKey("N");
    }
    
    update() {
        super.update();
        if (!this.badEnd && !this.goodEnd)
            my.sprite.player.update();
        else {
            if (this.restart.isDown && this.badEnd)
                this.scene.restart(this);
            else if (this.continue.isDown && this.goodEnd)
                this.scene.start("levelTwoScene");
        }
    }
}

class LevelTwo extends LevelTemplate {
    constructor() {
        super("levelTwoScene", "level-two");
    }

    create() {
        super.create();

        //Create enemy spawns
        this.enemyPatrolSpawn = this.map.createFromObjects("Objects", {
            name: "enemyPatrolSpawn",
            key: "tilemap_characters",
            frame: 18
        })

        //Create enemyLob spawns
        this.enemyLobSpawn = this.map.createFromObjects("Objects", {
            name: "enemyLobSpawn",
            key: "tilemap_characters",
            frame: 11
        })

        //Create enemySpike spawns
        this.enemySpikeSpawn = this.map.createFromObjects("Objects", {
            name: "enemySpikeSpawn",
            key: "tilemap_characters",
            frame: 8
        })

        //Create patrolBlock objects (invisible)
        this.patrolBlock = this.map.createFromObjects("Objects", {
            name: "patrolBlock"
        })

        //Initialize patrolBlocks to have collisions
        this.physics.world.enable(this.patrolBlock, Phaser.Physics.Arcade.STATIC_BODY);
        this.patrolBlockGroup = this.add.group(this.patrolBlock);

        //Initialize arrays for enemies, projectiles, and projectile limit
        this.enemies = [];
        this.enemies2 = [];
        this.enemies3 = [];
        this.enemies2proj = [];
        this.maxProj = 4;
        
        //Initialize enemy at enemy spawns  
        for (let i = 0; i < this.enemyPatrolSpawn.length; i++)
            {
                let enemy = new Enemy(this, this.enemyPatrolSpawn[i].x, this.enemyPatrolSpawn[i].y, "tilemap_characters", 18);
                this.enemies.push(enemy);
            }

        //Initialize enemyLob at enemyLob spawns      
        for (let i = 0; i < this.enemyLobSpawn.length; i++)
            {
                let enemy2 = new EnemyLob(this, this.enemyLobSpawn[i].x, this.enemyLobSpawn[i].y, "tilemap_characters", 11);
                this.enemies2.push(enemy2);
            } 
        
        //Initialize enemySpike at enemySpike spawns    
        for (let i = 0; i < this.enemySpikeSpawn.length; i++)
            {
                let enemy3 = new EnemySpike(this, this.enemySpikeSpawn[i].x, this.enemySpikeSpawn[i].y, "tilemap_characters", 8);
                this.enemies3.push(enemy3);
            } 

        for (let enemy of this.enemies) {
            enemy.body.setSize(9, 9);
        }

        //Collider properties for enemy with barrier blocks   
        for (let barrier of this.barriers)
            this.physics.add.collider(this.enemies, barrier, (obj1, obj2) => {
                if (obj1.goLeft){
                    obj1.goLeft = false;
                    obj1.goRight = true;
                }
                else {
                    obj1.goLeft = true;
                    obj1.goRight = false;
                }
                })    
        
        //Collider properties for player with enemy           
        this.physics.add.collider(my.sprite.player, this.enemies, (obj1, obj2) => {
            if (obj1.body.touching.down && obj2.body.touching.up) {
                my.sprite.player.bang(obj2, 15);
                this.sound.play("squash");
                obj2.destroy();
            } else {
                this.respawn();
            }    
            })     

        //Collider properties for player with enemySpike        
        this.physics.add.overlap(my.sprite.player, this.enemies3, (obj1, obj2) => {
            this.respawn();  
            })    


        //Collider properties for enemy with patrolBlocks    
        this.physics.add.collider(this.enemies, this.patrolBlockGroup, (obj1, obj2) => {
            if (obj1.goLeft){
                obj1.goLeft = false;
                obj1.goRight = true;
            }
            else {
                obj1.goLeft = true;
                obj1.goRight = false;
            }
            })  
        
        //Collider properties for enemySpike with patrolBlocks    
        this.physics.add.collider(this.enemies3, this.patrolBlockGroup, (obj1, obj2) => {
            if (obj1.goLeft){
                obj1.goLeft = false;
                obj1.goRight = true;
            }
            else {
                obj1.goLeft = true;
                obj1.goRight = false;
            }
            })    


        this.physics.add.overlap(my.sprite.player, this.goal, (obj1, obj2) => {
            this.scene.get("textScene").setState("well done");
            my.sprite.player.stop();
            this.goodEnd = true;
        })
    }

    update() {
        super.update();
        
        //Constantly updates code of Enemy class
        for (let enemy of this.enemies){
            enemy.update();
        }
        //Constantly updates code of Enemy Lob class
        for (let enemy2 of this.enemies2){
            enemy2.update();
            //Checks if player is within range of EnemyLob
            if (Phaser.Math.Distance.Between(enemy2.x, enemy2.y, my.sprite.player.x, my.sprite.player.y) < 200){
                enemy2.inDistance = true;
                //Checks if EnemyLob is ready to shoot, ie. after internal timer completes
                if (enemy2.shoot)
                    {
                        //Checks if Enemies2Proj array isn't more than max amount of projectiles
                        if (this.enemies2proj.length < this.maxProj){
                            //Initialize projectile sprite and give it gravity (lob effect)
                            let enemyProj = this.physics.add.sprite(enemy2.x, enemy2.y, "tilemap_sheet", 8);
                            enemyProj.body.setAllowGravity(true);
                            //Set local variable throwRange
                            let throwRange = 200;
                            //If player.x and EnemyLob.x are <=50 to lower throwRange to 50
                            if (Math.abs(enemy2.x - my.sprite.player.x) <= 50)
                                {
                                    throwRange = 50;
                                }
                            //If player.x and EnemyLob.x are <=100 to lower throwRange to 100
                                else if (Math.abs(enemy2.x - my.sprite.player.x) <= 100)
                                {
                                    throwRange = 100;
                                }
                            //Else throwRange is default (200)
                                else
                                {
                                    throwRange = 200;
                                }    
                            //Set enemyProj velocity.y to -600 (throwHeight)
                                enemyProj.setVelocityY(-600);
                            //If player.x is same as enemyLob.x, throw directly upwards
                                if (enemy2.x == my.sprite.player.x){
                                enemyProj.setVelocityX(0);
                            }
                            //If player.x is more than enemyLob.x (past it), throw to right
                            else if (enemy2.x < my.sprite.player.x){
                                enemyProj.setVelocityX(throwRange);
                            }
                            //If player.x is less than enemyLob.x (before it), throw to left
                            else {
                                enemyProj.setVelocityX(-throwRange);
                            }
                            //Create enemyProj by pushing to array
                            this.enemies2proj.push(enemyProj);
                            //Spawn enemyProj 50 units above to give proper arc
                            enemyProj.y - 50;
                        }
                        //reset enemyLob shoot check
                        enemy2.shoot = false;
                    }
            }
            else {
                //reset enemyLob distance check
                enemy2.inDistance = false;
            }
        }

        //Removes projectiles that go off screen
        this.enemies2proj = this.enemies2proj.filter((bullet) => bullet.y > (bullet.displayHeight*3/2));

        //Collider physics between player and projectiles, respawns player
        this.physics.add.collider(my.sprite.player, this.enemies2proj, (obj1, obj2) => {
            this.respawn();  
            }) 

        //Constantly updates code of EnemySpike class
        for (let enemy3 of this.enemies3){
            enemy3.update();
        }
        if (!this.badEnd && !this.goodEnd)
            my.sprite.player.update();
        else {
            if (this.restart.isDown && this.badEnd)
                this.scene.restart(this);
            else if (this.restart.isDown && this.goodEnd) {
                this.scene.stop("textScene");
                this.scene.start("menuScene");
            }
        }
    }
}