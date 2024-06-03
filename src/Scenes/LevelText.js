class LevelText extends Phaser.Scene {
    constructor() {
        super("textScene");
    }

    init() {
        this.score = 0;
        this.gameOver = false;
        this.nextLevel = false;
        this.wellDone = false;
    }

    create() {
        this.scoreText = this.add.bitmapText(1430, 35, "retro", "Life: " + this.score, 32)
        .setOrigin(1).setBlendMode(Phaser.BlendModes.ADD);
    }

    update() {
        this.scoreText.setText("Life: " + this.score);
        if (this.gameOver || this.nextLevel || this.wellDone) {
            if (this.gameOver) {
                this.add.bitmapText(game.config.width / 2, game.config.height / 2, "retro",
                "GAME OVER", 50).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
                this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 40, "retro",
                "Press R to restart", 32).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
            } else if (this.nextLevel) {
                this.add.bitmapText(game.config.width / 2, game.config.height / 2, "retro",
                "LEVEL COMPLETE", 50).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
                this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 40, "retro",
                "Press N to continue", 32).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
            } else if (this.wellDone) {
                this.add.bitmapText(game.config.width / 2, game.config.height / 2, "retro",
                "WELL DONE", 50).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
                this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 40, "retro",
                "Press R to return to menu", 32).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);
            }
            this.scene.pause(this);
        }
    }

    setScore(playerScore) {
        this.score = playerScore;
    }

    setState(data) {
        if (data === "game over")
            this.gameOver = true;
        if (data === "next level")
            this.nextLevel = true;
        if (data === "well done")
            this.wellDone = true;
    }
}