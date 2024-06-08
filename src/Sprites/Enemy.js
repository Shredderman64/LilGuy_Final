class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.VELOCITY = 500;

        this.goLeft = true;
        this.goRight = false;

        return this;
    }

    update() {
        /*
        this.body.setVelocityX(-this.VELOCITY);
        if (this.body.velocity.x == 0 && this.goLeft == true) {
            this.body.setVelocityX(this.VELOCITY);
            this.setFlip(true, false);
            this.anims.play("enemyWalk", true);
            this.goLeft = false;
            this.goRight = true;
        }
        else if (this.body.velocity.x == 0 && this.goRight == true){
            this.body.setVelocityX(-this.VELOCITY);
            this.resetFlip();
            this.anims.play("enemyWalk", true);
            this.goLeft = true;
            this.goRight = false;
        }    
        */
    }

}