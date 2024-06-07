class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    
    preload() {
        this.load.setPath("./assets/");

        this.load.image("menu_background", "lilguy_background.png");
        this.load.image("menu_foreground", "ground_tile.png");

        this.load.spritesheet("tilemap_characters", "tilemap-characters_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        })

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("level-one", "level01/level-one.tmj");
        this.load.tilemapTiledJSON("level-two", "level02/level-two.tmj");

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        
        this.load.audio("spawnReset", "audio/powerUp1.ogg");
        this.load.audio("coinPickup", "audio/powerUp2.ogg");
        this.load.audio("keyPickup", "audio/powerUp5.ogg");

        this.load.audio("playerHurt", "audio/explosionCrunch_000.ogg");
        this.load.audio("playerDeath", "audio/explosionCrunch_004.ogg");

        this.load.audio("bounce", "audio/phaseJump1.ogg");

        this.load.bitmapFont("retro", "fonts/retro_0.png", "fonts/retro.fnt");
    }

    create() {
        this.anims.create({
            key: "walk",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 0 },
                { frame: 1 }
            ],
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: "idle",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 0 }
            ],
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 1 }
            ],
            repeat: -1
        })
        
        this.anims.create({
            key: "spin",
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 151 }, { frame: 152 }
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "enemyWalk",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 18 }, { frame: 19 }
            ],
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: "enemyIdle",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 19 }
            ],
            repeat: -1
        })

        this.anims.create({
            key: "enemyProjIdle",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 11 }
            ],
            repeat: -1
        })

        this.anims.create({
            key: "enemyProjShoot",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 12 }
            ],
            frameRate: 15,
            repeat: -1
        })

        this.scene.start("menuScene");
    }
}