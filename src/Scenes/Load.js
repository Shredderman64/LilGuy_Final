class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    
    preload() {
        this.load.setPath("./assets/");

        this.load.spritesheet("tilemap_characters", "tilemap-characters_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        })

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("level-one", "level-one.tmj");

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        
        this.load.audio("spawnReset", "audio/powerUp1.ogg");
        this.load.audio("coinPickup", "audio/powerUp2.ogg");
        this.load.audio("keyPickup", "audio/powerUp5.ogg");

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

        this.scene.start("levelOneScene");
    }
}