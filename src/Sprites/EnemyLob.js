class EnemyLob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
   
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.timer = 0;
        this.inDistance = false;
        this.shoot = false;
        this.aimX = 0;
        this.aimY = 0;

        //this.proj = this.sprite.

        return this;
    }

    update() {
        if (this.inDistance)
        {
            this.anims.play("enemyProjShoot", true);
            this.timer++;
            if (this.timer == 150 && !this.shoot) {
                this.shoot = true;
                this.timer = 0;
            }
        }
        else{
            this.anims.play("enemyProjIdle", true);
        }
    }

}