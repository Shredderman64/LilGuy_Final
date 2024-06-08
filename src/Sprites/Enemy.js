class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.VELOCITY = 50;

        this.goLeft = true;
        this.goRight = false;

        return this;
    }

    update() {
        if (this.body) {
            this.body.setVelocityX(-this.VELOCITY);
            this.anims.play("enemyWalk", true);
            if (this.body.velocity.x == 0 && this.goLeft == true) {
                this.body.setVelocityX(this.VELOCITY);
                this.setFlip(true, false);
            }
            else if (this.body.velocity.x == 0 && this.goRight == true){
                this.body.setVelocityX(-this.VELOCITY);
                this.resetFlip();
            }    
        }
    }

}