class EnemyLob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.parentScene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.timer = 0;
        this.shoot = false;

        return this;
    }

    update() {
        this.timer++;
        if (this.timer == 600 && !this.shoot) {
            
        }
    }

}