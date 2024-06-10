class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.VELOCITY = 50;

        this.goLeft = false;
        this.goRight = true;

        return this;
    }

    update() {
        // basic enemy functionality - walk back and forth
        if (this.body) {
            this.body.setVelocityX(-this.VELOCITY);
            this.anims.play("enemyWalk", true);
            if (this.goLeft == true) {
                this.body.setVelocityX(this.VELOCITY);
                this.setFlip(true, false);
            }
            else if (this.goRight == true){
                this.body.setVelocityX(-this.VELOCITY);
                this.resetFlip();
            }    
        }
    }

    // function for switching directions
    switch() {
        if (this.goLeft){
            this.goLeft = false;
            this.goRight = true;
        }
        else {
            this.goLeft = true;
            this.goRight = false;
        }
    }
}