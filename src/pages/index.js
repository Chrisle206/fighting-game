import React from 'react';
export default function Battle() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 576;

    context.fillRect(0, 0, 1024, 576);

    const gravity = 0.2;

    class Sprite {
        constructor({ position, velocity }) {
            this.position = position;
            this.velocity = velocity;
            this.height = 150;
            this.lastKey = "";
        }

        draw() {
            context.fillStyle = 'red';
            context.fillRect(this.position.x, this.position.y, 50, this.height);
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if(this.position.y + this.height + this.velocity.y >= canvas.height) {
                this.velocity.y = 0;
            } else {
                this.velocity.y += gravity;
            }
        }
    }

    const player = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        }
    });


    const enemy = new Sprite({
        position: {
            x: 900,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        }
    });

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        }
    }

    let lastKey;

    function animate() {
        window.requestAnimationFrame(animate);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();

        player.velocity.x = 0;

        if(keys.a.pressed && lastKey === 'a') {
            player.velocity.x = -1;
        } else if(keys.d.pressed && lastKey === 'd') {
            player.velocity.x = 1;
        } else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -1;
        } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 1;
        }
    }

    animate();

    window.addEventListener('keyup', (event) => {
        switch(event.key) {
            case 'w': 
            player.velocity.y = 0;
            break;
            case 'd': 
            keys.d.pressed = false;
            break;
            case 'a': 
            keys.a.pressed = false;
            break;

            case 'ArrowUp': 
            enemy.velocity.y = 0
            break;
            case 'ArrowRight': 
            keys.ArrowRight.pressed = false;
            break;
            case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false;
            break;
            default: 
            break;
        }
    })

    window.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'w': 
            player.velocity.y = -5
            break;
            case 'd': 
            keys.d.pressed = true;
            lastKey = 'd';
            break;
            case 'a': 
            keys.a.pressed = true;
            lastKey = 'a';
            break;

            case 'ArrowUp': 
            enemy.velocity.y = -5
            break;
            case 'ArrowRight': 
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
            case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
            default: 
            break;
        }
    })



    return (
        <>
            <canvas></canvas>
        </>
    )
}