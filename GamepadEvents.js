class GamepadEvents extends EventSystem {
    #loopId;
    #loopDelay;
    #id;
    #axes = [];
    #buttons = [];

    constructor(data) {
        super();
        if (typeof data !== "object")
            throw new Error('data is\'nt object');

        let {gamepad, loopDelay} = data;
        loopDelay = loopDelay || 1;

        if (loopDelay < 1 || loopDelay > 200 || !Number.isInteger(loopDelay))
            throw new Error();

        if (data instanceof Gamepad)
            gamepad = data;
        else if (!(gamepad instanceof Gamepad))
            throw new Error('gamepad is\'nt instanceof Gamepad');

        let {id} = gamepad,
            axes = this.#axes,
            buttons = this.#buttons;

        gamepad.axes.forEach((ax, i) => {
            axes[i] = ax;
        });
        gamepad.buttons.forEach((but, i) => {
            buttons[i] = !!but.value;
        });

        this.#loopDelay = loopDelay;
        this.#id = id;
        this.id = id;
        this.index = gamepad.index;

        this.listen();
    }

    listen() {
        this.#loopId = setInterval(() => {
            let gp = this.getMyGamepad(),
                axes = this.#axes,
                buttons = this.#buttons;

            gp.axes.forEach((ax, i) => {
                if (ax !== axes[i]) {
                    this.emit('axe move', i, axes[i], ax);
                    this.emit('axe ' + i + ' move', axes[i], ax);
                    axes[i] = ax;
                }
            });

            gp.buttons.forEach((but, i) => {
                but = !!but.value;
                if (but !== buttons[i]) {
                    buttons[i] = but;
                    but = but ? 'down' : 'up';

                    this.emit('button ' + but, i);
                    this.emit('button ' + i + ' ' + but);
                }
            });


        }, this.#loopDelay);
    }

    stop() {
        clearInterval(this.#loopId);
    }

    getMyGamepad() {
        let list = navigator.getGamepads();
        for (let key in list) {
            let gp = list[key];
            if (gp.id === this.#id)
                return gp;
        }
    }
}