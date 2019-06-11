const buts = [];

class But {
    #el = document.createElement('div');

    constructor() {
        let i = buts.length,
            el = this.#el;

        buts.push(this);

        el.className = 'but up';
        el.innerText = i;
        document.body.appendChild(el);
    }

    up() {
        this.#el.className = 'but up';
    }

    down() {
        this.#el.className = 'but down';
    }
}

let butAmount = 12;
while (butAmount--)
    new But();

document.body.appendChild(document.createElement('br'));

class Axe {
    #el = document.createElement('div');
    #point = document.createElement('div');

    constructor() {
        let el = this.#el,
            point = this.#point;

        el.className = 'axe-box';
        point.className = 'point';

        el.appendChild(point);
        document.body.appendChild(el);
    }

    moveH(val) {
        this.#point.style.left = 4.25 + 4*val+'em';
    }
    moveW(val) {
        this.#point.style.top = 4.25 + 4*val+'em';
    }

}

let axe1 = new Axe(),
    axe2 = new Axe();

window.addEventListener("gamepadconnected", function (e) {
    let gamepadEvents = new GamepadEvents(e.gamepad);

    gamepadEvents.on('button down', function (i) {
        // console.log('button ' + i + ' is down')

        buts[i].down();
    });
    gamepadEvents.on('button up', function (i) {

        buts[i].up();

        // console.log('button ' + i + ' is up')
    });
    gamepadEvents.on('axe move', function (i, was, now) {
        switch (i) {
            case 0:
                axe1.moveH(now);
                break;
            case 1:
                axe1.moveW(now);
                break;
            case 2:
                axe2.moveH(now);
                break;
            case 5:
                axe2.moveW(now);
                break;
        }
        // console.log('axe ' + i + ' move to ' + now)
    });

});