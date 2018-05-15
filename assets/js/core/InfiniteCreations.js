define(['THREE'], function (THREE) {

    return class InfiniteCreations {

        constructor() {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer();

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
            alert("Socket closed");
        }

        onError() {
            alert("Failed to connect to socket > " + e)
        }

        onOpen() {
            this.run();
        }

        registerObjects(_) {
            _.skybox = new THREE.Mesh(new THREE.CubeGeometry(1e5, 1e5, 1e5, 1, 1, 1, null, true), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
            _.floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }))


            // add all objects to scene and return objects
            for (var i in _) {
                this.scene.add(_[i]);
            }
            return _;
        }


        run() {
            document.body.appendChild(this.renderer.domElement);
            this.resize();
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
            window.requestAnimationFrame(this.update.bind(this));
            this.renderer.render(this.scene, this.camera);
        }

    }

})