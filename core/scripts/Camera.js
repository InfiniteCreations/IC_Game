var Camera = pc.createScript('camera');

Camera.prototype.initialize = function () {
    this.entity.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1)
    })
    this.entity.setPosition(0, 0, 5);
}

Camera.prototype.postInitialize = function () {

}

Camera.prototype.update = function () {

}

Camera.prototype.postUpdate = function () {

}

Camera.prototype.swap = function () {

}
