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

    

    function animate() {
        window.requestAnimationFrame(animate);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();
    }

    animate();

    window.addEventListener('keyup', (event) => {
        switch(event.key) {
            case 'w': 
            player.velocity.y = 0;
            break;
            case 'd': 
            player.velocity.x = 0;
            break;
            case 'a': 
            player.velocity.x = 0;
            break;
        }
    })

    window.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'w': 
            player.velocity.y = -5;
            break;
            case 'd': 
            player.velocity.x = 1;
            break;
            case 'a': 
            player.velocity.x = -1;
            break;
        }
    })



    return (
        <>
            <canvas></canvas>
            <button>Start!</button>
        </>
    )
}