class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, cursors) {
        super(scene, x, y, texture, frame);

        this.cursors = cursors;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.ACCELERATION = 2560;
        this.DRAG = 2560;
        this.JUMP_VELOCITY = -700;

        this.firstJump = false;
        this.secondJump = false;

        return this;
    }

    update() {
        if (cursors.left.isDown || cursors.right.isDown) {
            if (cursors.left.isDown) {
                this.body.setAccelerationX(-this.ACCELERATION);

                this.resetFlip();
                this.anims.play("walk", true);
            } else if (cursors.right.isDown) {
                this.body.setAccelerationX(this.ACCELERATION);

                this.setFlip(true, false);
                this.anims.play("walk", true);
            }
            if (this.body.blocked.down)
                my.vfx.walking.start();
            else
                my.vfx.walking.stop();
        } else {
            this.stop();
        }

        if (this.body.blocked.down) {
            this.firstJump = this.secondJump = false;
        } else {
            this.firstJump = true;
            this.anims.play("jump");
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (!this.secondJump) {
                this.body.setVelocityY(this.JUMP_VELOCITY);
                my.vfx.jumping.start();
                if (!this.firstJump)
                    this.firstJump = true;
                else
                    this.secondJump = true;
            }
        }
    }

    stop() {
        this.body.setAccelerationX(0);
        this.body.setDragX(this.DRAG);

        this.anims.play("idle");
        my.vfx.walking.stop();
    }
}