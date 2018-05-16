define(['pc', 'Core/ScriptManager'], function (pc, ScriptManager) {

    return class InfiniteCreations {

        constructor() {

            this.renderer = new pc.Application(document.getElementById('ic_canvas'), {});

            this.renderer.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            this.renderer.setCanvasResolution(pc.RESOLUTION_AUTO);
            this.renderer.on('update', this.update.bind(this));

            this.resize();

            // register game objects
            this.objects = this.registerObjects();

            // register scripts
            this.scriptManager = new ScriptManager(pc);
            this.scriptManager.loadScripts(['Camera', 'Controller']);

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
            alert("Socket closed");
        }

        onError(e) {
            alert("Failed to connect to socket > " + e)
        }

        onOpen() {
            this.run();
        }

        registerObjects(_) {
            // add game objects
            _ = {};

            _.camera = new pc.Entity('camera');
            _.light = new pc.Entity('light');

            // apply object properties


            _.camera.addComponent('script');
            _.camera.script.create('camera', { attributes: {} });


            _.light.addComponent('light');
            _.light.setEulerAngles(45, 0, 0);

            

            // add all objects to scene and return objects
            for (var i in _) {
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
        }

        update(dT) {

        }


    }


})