class EnemyLob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
   
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.timer = 0;
        this.shoot = false;

        //this.proj = this.sprite.

        return this;
    }

    update() {
        this.timer++;
        //this.anims.play("enemyProjIdle", true);
        if (this.timer == 600 && !this.shoot) {
            this.anims.play("enemyProjShoot", true);
            this.shoot = true;
            this.timer = 0;
            //spawn projectile idk
        }
    }

}