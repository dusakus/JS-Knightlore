/* global uE */
uE.D = {};

//prepare DOM
uE.D.SETUP = function () {
    uE.D.container = document.querySelector("#uWcanvasholder");
    if (!uE.D.container) return false;
    uE.D.setupCanvas();
    uE.D.setupInput();

    //return true if not failed earlier
    return true;
};

uE.D.setupCanvas = function () {
    uE.log("STARTING uWebgine1 r4");
    uE.log("Setting up game canvas:");
    uE.log("Width  : " + uE.setup.pxW);
    uE.log("Height : " + uE.setup.pxH);
    uE.log("Scale  :   " + uE.setup.pxS);
    
    uE.D.isPixelated = (!!window.chrome && !!window.chrome.webstore) || (!!window.opr && !!window.opr.addons);

    uE.D.canvas = document.createElement("canvas");
    uE.D.canvas.width = uE.setup.pxW;
    uE.D.canvas.height = uE.setup.pxH;
    
    uE.D.canvas.style.transform = "scale("+uE.setup.pxS+")";
    
    if(this.isPixelated){
        uE.log("Using 'pixelated' image rendering");
        uE.D.canvas.style.imageRendering = "pixelated";
    } else {
        uE.log("Using 'crisp-edges' image rendering");
        uE.D.canvas.style.imageRendering = "crisp-edges";
    }
    
    uE.D.container.appendChild(uE.D.canvas);
    uE.D.context = uE.D.canvas.getContext("2d");
};

uE.D.setupInput = function () {
    uE.log("setting up input");
    uE.D.IH = function (keyc, state) {
        uE.D.IS.keys[keyc] = state;
        if(state)uE.D.IS.keysCnt[keyc]++;

        //uE.log(keyc);

        uE.D.IS.notif.forEach(function (a, b, c) {
            if (typeof a === "object" && (a.id < 0 || a.id == keyc)) {
                a.h(keyc, state);
            }
        });
    }
    uE.D.IS = { keys: [], keysCnt: [], spc: {}, notif: [] };
    uE.D.IS.spc.UP = false;
    uE.D.IS.spc.DOWN = false;
    uE.D.IS.spc.LEFT = false;
    uE.D.IS.spc.RIGHT = false;
    uE.D.IS.spc.A = false;
    uE.D.IS.spc.B = false;
    uE.D.IS.spc.X = false;
    uE.D.IS.spc.Y = false;
    uE.D.IS.spc.LT = false;
    uE.D.IS.spc.RT = false;
    uE.D.IS.spc.START = false;
    uE.D.IS.spc.ESC = false;
    uE.D.IS.spc.SPACE = false;
    uE.D.IS.notif.push({
        id: -1, h: function (kID, down) {
            switch (kID) {
                case 38:
                    uE.D.IS.spc.UP = down;
                    break;
                case 40:
                    uE.D.IS.spc.DOWN = down;
                    break;
                case 37:
                    uE.D.IS.spc.LEFT = down;
                    break;
                case 39:
                    uE.D.IS.spc.RIGHT = down;
                    break;
                case 83:
                    uE.D.IS.spc.A = down;
                    break;
                case 68:
                    uE.D.IS.spc.B = down;
                    break;
                case 65:
                    uE.D.IS.spc.X = down;
                    break;
                case 70:
                    uE.D.IS.spc.Y = down;
                    break;
                case 87:
                    uE.D.IS.spc.LT = down;
                    break;
                case 69:
                    uE.D.IS.spc.RT = down;
                    break;
                case 13:
                    uE.D.IS.spc.START = down;
                    break;
                case 32:
                    uE.D.IS.spc.SPACE = down;
                    break;
            }
        }
    });
    document.addEventListener("keydown", function(e){
        uE.D.IH(e.keyCode, true);
    });
    document.addEventListener("keyup", function(e){
        uE.D.IH(e.keyCode, false);
    });
    uE.log("input ready");
}