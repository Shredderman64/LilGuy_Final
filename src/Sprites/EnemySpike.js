class EnemySpike extends Enemy {
    update() {
        if (this.body) {
            this.anims.play("enemySpikeWalk", true);
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

}