class LevelTemplate extends Phaser.Scene {
    constructor(name, mapName) {
        super(name);

        this.mapName = mapName;
    }

    init() {
        this.physics.world.gravity.y = 1500;

        this.playerKeys = 0;

        this.spawnPointX = 100;
        this.spawnPointY = 250;

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
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            this.playerKeys++;
            for (let barrier of this.barriers) {
                if (barrier.name == ("barrier0" + this.playerKeys))
                    barrier.destroy();
            }
            this.sound.play("keyPickup");
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

        cursors = this.input.keyboard.createCursorKeys();

        // particle systems
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: my.sprite.player,
            followOffset: { x: 0, y: 9 },
            frame: ["smoke_01.png"],
            frequency: 100,
            lifespan: 250,
            scale: { start: 0.03, end: 0.1 }
        })

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: my.sprite.player,
            followOffset: { x: 0, y: 5 },
            frame: ["smoke_10.png"],
            lifespan: 250,
            scale: { start: 0.03, end: 0.07 },
            stopAfter: 1
        })

        // camera behavior setup
        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setZoom(3.5);
    }

    update() {
        this.scene.get("textScene").setScore(playerScore);
    }

    respawn() {
        if (playerScore > 0)
            my.sprite.player.setPosition(this.spawnPointX, this.spawnPointY);
        else {
            this.scene.get("textScene").setState("game over");
            my.vfx.walking.stop();
            my.sprite.player.destroy();
            this.badEnd = true;
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
            this.scene.get("textScene").setState("well done");
            my.sprite.player.stop();
            this.goodEnd = true;
        })

        this.restart = this.input.keyboard.addKey("R");
        this.scene.launch("textScene");
    }
    
    update() {
        super.update();
        if (!this.badEnd && !this.goodEnd)
            my.sprite.player.update();
        else {
            if (this.restart.isDown)
                this.scene.restart(this);
        }
    }
}