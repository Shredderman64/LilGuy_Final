class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, cursors) {
        super(scene, x, y, texture, frame);

        this.cursors = cursors;
        this.parentScene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // particle systems
        my.vfx.walking = scene.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: this,
            followOffset: { x: 0, y: 9 },
            frame: ["smoke_01.png"],
            frequency: 100,
            lifespan: 250,
            scale: { start: 0.03, end: 0.1 }
        })

        my.vfx.jumping = scene.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: this,
            followOffset: { x: 0, y: 5 },
            frame: ["smoke_10.png"],
            lifespan: 250,
            scale: { start: 0.03, end: 0.07 },
            stopAfter: 1
        })

        my.vfx.sparkle = scene.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            frame: ["star_06.png"],
            lifespan: 250,
            scale: { start: 0.05, end: 0.01 },
            stopAfter: 1
        })

        my.vfx.bang = scene.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            frame: ["star_08.png"],
            lifespan: 250,
            quantity: 10,
            scale: { start: 0.03, end: 0.05 },
            speed: 100,
            stopAfter: 10
        })

        // player variables
        this.ACCELERATION = 2560;
        this.DRAG = 2560;
        this.JUMP_VELOCITY = -700;

        this.firstJump = false;
        this.secondJump = false;

        return this;
    }

    update() {
        // player movement
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

        // player jumping
        if (this.body.blocked.down) {
            this.firstJump = this.secondJump = false;
        } else {
            this.firstJump = true;
            this.anims.play("jump");
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (!this.secondJump) {
                this.body.setVelocityY(this.JUMP_VELOCITY);
                this.parentScene.sound.play("bounce", { volume: 0.3 });
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

    // sparkle vfx
    sparkle(obj) {
        my.vfx.sparkle.particleX = obj.x;
        my.vfx.sparkle.particleY = obj.y;
        my.vfx.sparkle.start();
    }

    bang(obj, offset = 0) {
        my.vfx.bang.particleX = obj.x;
        my.vfx.bang.particleY = obj.y + offset;
        my.vfx.bang.start();
    }
}