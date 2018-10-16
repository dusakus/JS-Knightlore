/* global uE asap binaryHttpRequest */
var state = { mode: 1, status: 1, run:{}, data:{} };
var logic = { s: [] };
var stuff = { p: {} };

state.run.goTo = function(id){
    if(state.mode == id){
        uE.log("resetting mode " + id);
        logic.s[id].leave();
        logic.s[id].enter();
    } else {
        uE.log("entering mode " + id);
        logic.s[state.mode].leave();
        logic.s[id].enter();
        state.mode = id;
    }
}

uE.clientLoop = function() {
    logic.s[state.mode].tick();
}

stuff.playSongA = function(){
    uE.log("starting song \"TITLE\"");
    
    binaryHttpRequest('res/msx.sap', asap.playA);
    
    asap.onPlaybackEnd=function(){
        stuff.playSongA();
        uE.log("with seek(200)");
        asap.onLoad=function(){
            window.asap.asap.seek(200);
        }
    }
}
stuff.playSongB = function(){
    uE.log("starting song \"GAME\"");
    binaryHttpRequest('res/msx.sap', asap.play);
    asap.onPlaybackEnd=function(){
        stuff.playSongB();
        uE.log("with seek(23000)");
        asap.onLoad=function(){
            window.asap.asap.seek(23000);
        }
    }
}
stuff.playSongC = function(){
    uE.log("starting song \"THREE\"");
    binaryHttpRequest('res/msx.sap', asap.playC);
    asap.onPlaybackEnd=function(){
        stuff.playSongC();
    }
}