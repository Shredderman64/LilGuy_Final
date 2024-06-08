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

        this.enemies = this.map.createFromObjects("Objects", {
            name: "enemyPatrol",
            key: "tilemap_characters",
            frame: 18
        })

        this.projectiles = this.map.createFromObjects("Objects", {
            name: "enemyLob",
            key: "tilemap_characters",
            frame: 11
        })

        this.patrolBlock = this.map.createFromObjects("Objects", {
            name: "patrolBlock"
        })

        this.enemySpawn = this.map.createFromObjects("Objects", {
            name: "enemySpawn"
        })

        this.physics.world.enable(this.patrolBlock, Phaser.Physics.Arcade.STATIC_BODY);
        this.patrolBlockGroup = this.add.group(this.patrolBlock);

        this.enemy = new Enemy(this, this.enemySpawn[0].x, this.enemySpawn[0].y, "tilemap_characters", 18);
        
        this.physics.add.overlap(my.sprite.player, this.goal, (obj1, obj2) => {
            this.scene.get("textScene").setState("well done");
            my.sprite.player.stop();
            this.goodEnd = true;
        })
    }

    update() {
        super.update();
        if (!this.badEnd && !this.goodEnd)
            my.sprite.player.update();
        else {
            if (this.restart.isDown) {
                this.scene.start("menuScene");
                this.scene.stop("textScene");
            }
        }
    }
}