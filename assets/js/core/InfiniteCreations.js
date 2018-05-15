define(['pc', 'Core/EventManager'], function (pc, EventManager) {

    return class InfiniteCreations {

        constructor() {


            this.gamestate = -1; // -1 idle, 0 disconnected, 1 connected to socket
            this.events = EventManager.registerEvent();
            this.renderer = new pc.Application(document.getElementById('ic_canvas'), {});

            this.renderer.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            this.renderer.setCanvasResolution(pc.RESOLUTION_AUTO);
            this.renderer.on('update', this.update.bind(this));



            this.resize();

            // register game objects
            this.objects = this.registerObjects();

            // assign events 

            // register listeners
            this.registerListeners();

            // start socket
            this.sockets = [];
            this.socket = new WebSocket("ws://localhost:443");

            this.socket.onmessage = this.onMessage.bind(this);
            this.socket.onclose = this.onClose.bind(this);
            this.socket.onerror = this.onError.bind(this);

            // on open starts game
            this.socket.onopen = this.onOpen.bind(this);

        }

        onMessage() {
            console.log("Message " + e.data);
        }

        onClose() {
            this.gamestate = 0;
            alert("Socket closed");
        }

        onError(e) {
            alert("Failed to connect to socket > " + e)
        }

        onOpen() {
            this.gamestate = 1;
            this.run();
        }

        registerObjects(_) {
            // add game objects
            _ = {};

            _.cube = new pc.Entity('cube');
            _.camera = new pc.Entity('camera');
            _.light = new pc.Entity('light');

            // apply object properties

            _.cube.addComponent('model', {
                type: 'box'
            })

            _.cube.update = function () {
                this.rotate(0.1, 0.1, 0.1);
            }

            _.camera.addComponent('camera', {
                clearColor: new pc.Color(0.1, 0.1, 0.1)
            })
            _.camera.setPosition(0, 0, 5);

            _.light.addComponent('light');
            _.light.setEulerAngles(45, 0, 0);

            

            // add all objects to scene and return objects
            for (var i in _) {
                if (_[i].update != undefined) {
                    // bind update event to objects with update function
                    this.events.on('update', _[i].update.bind(_[i]))
                }
                // add script component to all objects
                _[i].addComponent('script');
                this.renderer.root.addChild(_[i]);
            }
            return _;
        }


        run() {
            this.resize();
            this.renderer.start();

            this.update();
        }

        registerListeners() {
            window.addEventListener('resize', this.resize.bind(this));
        }

        resize() {
            this.renderer.resizeCanvas()
            this.events.call('resize', [window.innerWidth, window.innerHeight]);
        }

        update(dT) {
            if (this.gamestate != 1) return;
            this.events.call('update', [dT]);
        }


    }

})