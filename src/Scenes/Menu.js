class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height,
        "menu_background").setOrigin(0).setScale(2.0);
        this.foreground = this.add.tileSprite(0, game.config.height - 72, game.config.width,
        72, "menu_foreground").setOrigin(0).setScale(4.0);

        this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        this.background.tilePositionX += 0.5;
        this.foreground.tilePositionX += 1;

        if (Phaser.Input.Keyboard.JustDown(this.startGame))
            this.scene.start("levelOneScene");
    }
}