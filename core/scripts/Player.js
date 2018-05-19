var Player = pc.createScript('Player');

Player.prototype.initialize = function () {

    this.entity.addComponent('model', {
        type: 'asset',
        asset: this.app.assets.find('model_player', 'model')
    })

    this.entity.addComponent('animation', {
        assets: [
            this.app.assets.find('animation_idle', 'animation'),
            this.app.assets.find('animation_jog', 'animation'),
            this.app.assets.find('animation_running', 'animation'),
            this.app.assets.find('animation_twist', 'animation')
        ]
    })

    this.entity.setLocalScale(3, 3, 3)

    this.playerSpeed = 1.385;
    this.jumpVelocity = 500.5;

    this.animations = {
        /*
        example: {
            name: 'walk.json',
            reverse: false,
            loop: true,
            blend: 0.2,
        }
        */
    };

    this.state = {
        jumping: false,
        walking: false,
        running: false,
        crouch: false,
        prone: false,
        flying: false,
        falling: false,
        invisible: false,
        invinsible: false,
    }

    this.app.keyboard.on(pc.EVENT_KEYDOWN, function (e) { }, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, function (e) { }, this);
    this.app.keyboard.on(pc.EVENT_MOUSEDOWN, function (e) { }, this);
    this.app.keyboard.on(pc.EVENT_MOUSEMOVE, function (e) { }, this);

}


Player.prototype.postInitialize = function () {

}

Player.prototype.update = function (dT) {

}

Player.prototype.postUpdate = function () {

}

Player.prototype.swap = function () {

}