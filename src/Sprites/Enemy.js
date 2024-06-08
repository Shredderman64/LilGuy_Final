class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        
        scene.add.existing(this);
        //scene.physics.add.existing(this);

        this.ACCELERATION = 500;
        this.DRAG = 500;

        

        return this;
    }

    update() {
        //this.body.setAccelerationX(-this.ACCELERATION);

                //this.resetFlip();
                this.anims.play("enemyWalk", true);

    }
/*
    stop() {
        this.body.setAccelerationX(0);
        this.body.setDragX(this.DRAG);
    }
    */
}