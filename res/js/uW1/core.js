var uE = {
    state: 0,
    render: true,
    setup: {
        pxW: 256,
        pxH: 192,
        pxS: 3,
        tps: 12,
        layerCount: 6,
        spriteCount: 64,
        drawAlpha: 255,
        printFPS: false
    },
    clientLoop: function () {/*replace with game*/ },
    loglevel: 100
};

uE.start = function () {

    if (!uE.D.SETUP() || !uE.M.SETUP() || !uE.R.SETUP()) {
        uE.log("ERROR: unable to prepare canvas context, is there an element with id 'uWcanvasholder'?");
        return "FAIL";
    }

    if (uE.clientInit) uE.clientInit();
    setTimeout(uE.gameLoop, 10);
};

uE.gameLoop = function () {
    if (uE.setup.printFPS) var time = Date.now();
    uE.R.nextframe = Date.now() + 1000 / uE.setup.tps;
    setTimeout(uE.gameLoop, uE.R.nextframe - Date.now());;

    try{
        uE.clientLoop();
    }catch(e){
        var exmsg = "Game script failed: ";
        if (e.message) {
            exmsg += e.message;
        }
        if (e.stack) {
            exmsg += ' | stack: ' + e.stack;
        }
        console.log(exmsg);
        
        // not UE
            state.run.goTo(42);
        // not UE /END
    }
    if(uE.R.redrawAll){
        uE.R.modifCheck = [];
        uE.R.redrawAll = false;
    }
    if(uE.render) uE.R.renderFrame();
    if (uE.setup.printFPS) {
        if (Date.now() - 1000 > uE.R.lTime) {
            uE.log("Current FPS: " + (uE.fps-1) +", with average time " + (uE.workTime/uE.fps) +"ms");
            uE.R.lTime = Date.now();
            uE.fps = 0;
            uE.workTime = 0;
        }
        uE.workTime += Date.now() - time;
        uE.fps++;
    }

};