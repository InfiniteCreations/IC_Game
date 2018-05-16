define([], function () {

    return class ScriptManager {

        constructor(pc) {
            this.pc = pc;
            this.path = 'core/scripts/';
            this.extension = '.js'
        }

        loadScript(a) {
            if (typeof a == 'string') {
                this.request(this.path + a + this.extension);
            }
        }

        loadScripts(a) {
            if (typeof a == 'object') {
                for (let i in a) {
                    this.request(this.path + a[i] + this.extension)
                }
            }
        }

        request(url) {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function (resp) {
                (new Function(['pc'], resp.target.response))(this.pc);
            }.bind(this));
            xhr.open('GET', url);
            xhr.send();
        }

    }

})