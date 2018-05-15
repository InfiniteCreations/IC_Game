define(['THREE', 'Core/EventManager'], function (THREE, EventManager) {

    return class InfiniteCreations {

        constructor() {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById('ic_canvas')});
            this.gamestate = -1; // -1 idle, 0 disconnected, 1 connected to socket
            this.events = EventManager.registerEvent();


            this.resize();

            // register game objects
            this.objects = this.registerObjects({});

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

        onError() {
            alert("Failed to connect to socket > " + e)
        }

        onOpen() {
            this.gamestate = 1;
            this.run();
        }

        registerObjects(_) {
            // add game objects
            _.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));


            // apply object properties
            _.floor.rotateX(-Math.PI / 2);
            // add all objects to scene and return objects
            for (var i in _) {
                if (_[i].update != undefined) {
                    // bind update event to objects with update function
                    this.events.on('update', _[i].update.bind(_[i]))
                }
                this.scene.add(_[i]);
            }
            return _;
        }


        run() {
            this.resize();

            this.camera.rotation.z = 5;

            this.update();
        }

        registerListeners() {
            window.addEventListener('resize', this.resize.bind(this));
        }

        resize(x, y) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix(); // important
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        update() {
            if (this.gamestate != 1) return;
            window.requestAnimationFrame(this.update.bind(this));
            this.renderer.render(this.scene, this.camera);
            this.events.call('update', this)
        }


    }

})