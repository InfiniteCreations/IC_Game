define(['_pc', 'Core/ScriptManager', 'Core/EntityManager'], function (pc, ScriptManager, EntityManager) {

    return class InfiniteCreations {

        constructor() {
            this.canvas = document.getElementById('ic_canvas');
            this.app = new pc.Application(this.canvas, {
                mouse: new pc.Mouse(this.canvas),
                touch: !!('ontouchstart' in window) ? new pc.TouchDevice(this.canvas) : null,
                keyboard: new pc.Keyboard(window),
                gamepads: new pc.GamePads()
            });

            this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
            this.app.on('update', this.update.bind(this));

            this.map = {
                size: {x: 1000, y: 1000, z: 0}
            }

            this.objects;
            this.sockets = [];
            this.socket = null;

            this.resize();

            this.scriptManager = new ScriptManager(pc);
            this.entityManager = new EntityManager(pc);

            // register scripts
            this.scriptManager.loadScripts(['Camera', 'Player', 'FirstPersonCamera'])
            
            this.loadAssets(function () {
                this.objects = this.registerObjects();
                this.registerListeners();
                this.connect()
            }.bind(this));

        }

        connect(url) {
            this.socket = new WebSocket(url || "ws://host.legitsoulja.info:443");
            this.socket.onmessage = this.onMessage.bind(this);
            this.socket.onclose = this.onClose.bind(this);
            this.socket.onerror = this.onError.bind(this);

            // on open starts game
            this.socket.onopen = this.onOpen.bind(this);
            console.log("Connecting to server")
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
            console.log("Connected to socket")
            this.run();
        }

        registerObjects(_) {
            _ = {};

            _.player = this.entityManager.createEntity('player', null, { script: {}}, { Player: { attributes: {}}});

            _.floor = this.entityManager.createEntity('ground', 'plane', {
                model: { type: 'plane' },
                collision: {
                    type: 'box',
                    halfExtents: new pc.Vec3(this.map.size.x / 2, this.map.size.z / 2, this.map.size.y / 2)
                }
            });

            _.m4a1_s = this.entityManager.createEntity('m4a1_s', null, {
                model: {
                    type: 'asset',
                    asset: this.app.assets.find('model_m4a1_s', 'model'),
                    castShadows: true,
                    isStatic: false,
                    receiveShadows: false
                }
            })

            _.camera = this.entityManager.createEntity('debugcamera', 'camera', {},
                {
                    camera: { attributes: {} }
                });

            _.light = this.entityManager.createEntity('light', 'light', { light: null });

            // apply object properties
            _.light.setPosition(0, 50, 0);
            _.floor.setPosition(0, 0, 0);
            _.floor.setEulerAngles(0, 0, 0)
            _.floor.setLocalScale(this.map.size.x, this.map.size.z, this.map.size.y)
            _.light.setEulerAngles(45, 0, 0);
            _.m4a1_s.setLocalPosition(0, 0.2, 0);

            console.log(_.m4a1_s);

            var textures = [
                    'posx',
                    'negx',
                    'posy',
                    'negy',
                    'posz',
                    'negz',
            ]

            for (var i = 0; i < textures.length; i++) {
                let asset = this.app.assets.find('texture_d' + textures[i], 'texture');
                if (asset) {
                    textures[i] = asset.id;
                }
 
            }

            this.app.setSkybox(new pc.Asset('skybox', 'cubemap',
                null,
                {
                    anisotropy: 1,
                    magFilter: 1,
                    minFilter: 5,
                    rgbm: false,
                    textures: textures
                }
            ))


            for (var i in _) {
                this.app.root.addChild(_[i])
            }

            return _;
        }

        loadAssets(callback) {

            var files = 0;
            var filesDone = 0;
            var _ = {
                texture: [
                    'dposx:public/cubemaps/yokohama/posx.jpg',
                    'dnegx:public/cubemaps/yokohama/negx.jpg',
                    'dposy:public/cubemaps/yokohama/posy.jpg',
                    'dnegy:public/cubemaps/yokohama/negy.jpg',
                    'dposz:public/cubemaps/yokohama/posz.jpg',
                    'dnegz:public/cubemaps/yokohama/negz.jpg',
                ],
                animation: [
                    'idle:public/animations/idle/idle.json',
                    'jog:public/animations/jog/jog.json',
                    'running:public/animations/running/running.json',
                    'twist:public/animations/dance/twist.json',
                ],
                model: [
                    'player:public/models/player/player.json',
                    'm4a1_s:public/models/weapons/m4a1_s/m4a1_s.json'
                ]
            }



    
            var interval = setInterval(function () {
                let percent = ((filesDone / files) * 100);
                if (percent > 99.9) {
                    clearInterval(interval);
                    return callback();
                }
                console.log("Loading assets " + percent + "%")
            }.bind(this), 500);

            for (let i in _) {
                for (let o = 0; o < _[i].length; o++) {
                    files++;
                    let data = _[i][o].split(':')
                    console.log("Loading " + i + " > " + _[i][o]);
                    let asset = new pc.Asset(data[0], i, { url: data[1] }, { addressu: 'repeat', addressv: 'repeat' })
                    asset.name = i + "_" + data[0];
                    asset.on('load', function () {
                        filesDone++
                    });

                    asset.on('error', function () {
                        files--;
                        throw new Error("Failed to load " + _[i][o]);
                    })

                    this.app.assets.add(asset);
                    this.app.assets.load(asset);
                }

            }

            return;

        }


        run() {
            this.resize();
            this.app.start();
        }

        registerListeners() {
            window.addEventListener('resize', this.resize.bind(this));
        }

        resize() {
            this.app.resizeCanvas()
        }

        update(dT) {

        }


    }


})