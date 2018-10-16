/* global state render logic uE stuff */
logic.s[2] = {
    enter: function (params) {
        state.status = 0;
        this.textPos=0;
    },
    tick: function (params) {
        switch(state.status){
            case 99:
                uE.UG.clearFB(0,0);
                uE.UG.clearFB(0,1);
                uE.UG.clearFB(1,2);
                uE.UG.clearFB(1,3);
                uE.UG.clearFB(1,4);
                uE.UG.clearFB(1,5);
                //uE.UG.clearFB(1,6);
                state.run.goTo(8);
                stuff.filter_scan();
                uE.R.redrawAll = true;
                break;
            case 98:
                uE.log("Here we go!");
                stuff.playSongB();
                uE.setup.tps = 12;
                state.status++;
                break;
            case 97:
                uE.log("setting up game");
                
                
                stuff.p.x = 32;
                stuff.p.y = 32;
                stuff.p.z = 32;
                stuff.p.dir = 1;
                stuff.p.frame = 1;
                stuff.iso = {};
                stuff.iso.toRX = function(x,y){
                    return Math.round((x-y) * 1.8) + 128;
                }
                stuff.iso.toRY = function(x,y,z){
                    var sy = z ? (z-32) * -1 : 0
                    return Math.round(((x+y)/2) * 1.8) + sy + 30;
                }
                stuff.iso.toRZ = function(x,y,z){
                    return Math.round(((x+y)/2) * 1.8);
                }
                
                stuff.night = 0;
                stuff.day = 0;
                stuff.timeDel = 0;
                stuff.time = 48;
                stuff.lives = 7;
                stuff.charms = 14;
                
                state.status++;
                break;
            case 11:

                //text animation
                if(this.textPos > 79) this.textPos = 0;
                uE.UG.clearArea(0,2,31,111,194,10);
                uE.M.writeBuffer(20,2,32,111,192,10,(this.textPos*8)-192,0);
                this.textPos++;
                
                if(uE.D.IS.spc.SPACE){
                    state.status = 90;
                    uE.setup.tps = 100;
                    stuff.filter_shift();
                    stuff.filterModT = 0
                    stuff.filterModT2 = 0
                }
                uE.D.IS.spc.SPACE = false;
                break;
            case 10:
                uE.log("Title2!");
                uE.M.writeBuffer(17,2,27,11,202,114,0,0);
                uE.M.writeBuffer(18,6,0,128,256,64,0,0);
                uE.setup.tps = 5;
                state.status++;
                uE.log("waiting for input...");
                uE.D.IS.keysCnt[32] = 0;
                
                stuff.playSongA();
                stuff.filter_scan();
                uE.R.redrawAll = true;
                
                break;
            case 6:
                if(uE.D.IS.spc.SPACE){
                    stuff.filter_shift();
                    stuff.filterModT = 0
                    stuff.filterModT2 = 0
                    state.status++;}
                uE.D.IS.spc.SPACE = false;
                break;
            case 8:
                //set ui elements
                for(var i = 12; i < 18; i++){
                    uE.M.setSpriteData(i,8,8,32,0,24,254,0,0,9);
                }
                uE.M.SPR[12].x = 31
                uE.M.SPR[12].y = 153
                uE.M.SPR[13].x = 38
                uE.M.SPR[13].y = 153
                
                uE.M.SPR[14].x = 120
                uE.M.SPR[14].y = 185
                uE.M.SPR[15].x = 127
                uE.M.SPR[15].y = 185
                
                uE.M.SPR[16].x = 160
                uE.M.SPR[16].y = 177
                uE.M.SPR[17].x = 167
                uE.M.SPR[17].y = 177
                
                uE.M.setSpriteData(19,24,20,60,0,0,-10,200,158);
                
                
                state.status++;
                break;
            case 5:
                uE.log("Title1!");
                uE.M.writeBuffer(16,3,0,0,256,168,0,0);
                state.status++;
                uE.log("waiting for input...");
                stuff.filter_scan();
                stuff.playSongC();
                break;
            case 9:
                uE.log("Setting clear color");
                uE.M.setColor(0,8);
                uE.UG.clearFB(0,1);
                uE.UG.clearFB(1,2);
                uE.UG.clearFB(1,3);
                uE.UG.clearFB(1,4);
                uE.UG.clearFB(1,5);
                uE.UG.clearFB(1,6);
                uE.M.writeBuffer(60,1,200,158,24,20,0,0);
                state.status++;
                break;
            case 3:
                uE.log("Loading Titles...");
                uE.M.loadImageAsBuffer("res/gfx/title.jbic",16);
                uE.M.loadImageAsBuffer("res/gfx/hud1.jbic",18,function(tab){
                    if(tab[2] == 0) return 10;
                    if(tab[2] == 255) return 9;
                    return 1;
                });
                uE.M.loadImageAsBuffer("res/gfx/title2.jbic",17,function(tab){
                    if(tab[2] == 255) return 7;
                    return 0;
                });
                uE.M.loadImageAsBuffer("res/gfx/titleText.jbic",20,function(tab){
                    if(tab[2] == 255) return 7;
                    return 0;
                });
                state.status++;
                break;
            case 1:
                uE.log("Reached Homescreen...");
                state.status++;
                break;
            default:
                state.status++;
        }
    },
    leave: function (params) {

    }
}
