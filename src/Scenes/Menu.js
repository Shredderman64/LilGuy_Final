class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

        this.switchPage = false;
    }

    create() {
        // scrolling background
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height,
        "menu_background").setOrigin(0).setScale(2.0);
        this.foreground = this.add.tileSprite(0, game.config.height - 72, game.config.width,
        72, "menu_foreground").setOrigin(0).setScale(4.0);

        // title
        this.title = this.add.bitmapText(game.config.width / 2, game.config.height / 2, "retro",
        "LIL GUY", 100).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);

        // options
        this.options = [];
        this.options.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 60, "retro",
            "Press ENTER to start game", 25).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        );
        this.options.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 90, "retro",
            "Press C to view credits", 25).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        );

        // credits
        this.credits = [];
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) - 60, "retro",
            "A Game By", 40).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        );
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) - 30, "retro",
            "Kellum Inglin & Garrett Yu", 25).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        )
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2), "retro",
            "Audio and Art Assets", 40).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        )
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 30, "retro",
            "Kenney Assets", 25).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        )
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 60, "retro",
            "Retro Gaming Font", 40).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        )
        this.credits.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 90, "retro",
            "https://www.dafont.com/retro-gaming.font", 25).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        )

        // hide credits
        for (let credit of this.credits)
            credit.setVisible(false);

        this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.viewCredits = this.input.keyboard.addKey("C");
    }

    update() {
        this.background.tilePositionX += 0.5;
        this.foreground.tilePositionX += 1;

        if (Phaser.Input.Keyboard.JustDown(this.startGame))
            this.scene.start("levelOneScene");

        // show credits on key press
        if (Phaser.Input.Keyboard.JustDown(this.viewCredits)) {
            if (!this.switchPage) {
                this.title.setVisible(false);
                for (let option of this.options)
                    option.setVisible(false);
                for (let credit of this.credits)
                    credit.setVisible(true);
                this.switchPage = true;
            } else {
                this.title.setVisible(true);
                for (let option of this.options)
                    option.setVisible(true);
                for (let credit of this.credits)
                    credit.setVisible(false);
                this.switchPage = false;
            }
        }
    }
}