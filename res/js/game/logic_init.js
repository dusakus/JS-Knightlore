/* global state render logic djs uE */
logic.s[1] = {
    enter: function (params) {
        state.status = 0;
        uE.setup.tps = 100;
        uE.render = true;
    },
    tick: function (params) {
        switch(state.status){
            case 9:
                uE.log("writing color palete");
                state.status++;
                break;
            case 10:
                // uE.log("0:Clear = {r:255, g:0, b:255}");
                uE.M.setColor(0,{r:255, g:0, b:255, a:true});
                // uE.log("1:Transparent = {a:true}");
                uE.M.setColor(1,{a:true});
                // uE.log("4:White = {r:255, g:255, b:255}");
                uE.M.setColor(4,{r:255, g:255, b:255});
                // uE.log("5:Black = {r:0, g:0, b:0}");
                uE.M.setColor(5,{r:0, g:0, b:0});
                // uE.log("7:TitleBright = {r:169, g:233, b:246}");
                uE.M.setColor(7,{r:169, g:233, b:246});
                // uE.log("8:TitleDark = {r:0, g:63, b:77}");
                uE.M.setColor(8,{r:0, g:63, b:77});
                // uE.log("9:HUDBright = {r:201, g:134, b:120}");
                uE.M.setColor(9,{r:210, g:134, b:120});
                // uE.log("10:HUDDark = {r:95, g:27, b:14}");
                uE.M.setColor(10,{r:95, g:27, b:14});
                // uE.log("11:HUDCBright = {r:137, g:93, b:35}");
                uE.M.setColor(11,{r:137, g:93, b:35});
                // uE.log("12:HUDCDark = {r:84, g:39, b:0}");
                uE.M.setColor(12,{r:84, g:39, b:0});
                // uE.log("13:GAMENightB = {r:215, g:215, b:215}");
                uE.M.setColor(13,{r:215, g:215, b:215});
                // uE.log("14:GAMENightD = {r:46, g:46, b:46}");
                uE.M.setColor(14,{r:46, g:46, b:46});
                
                uE.M.setColor(360,{r:128, g:0,   b:0});
                uE.M.setColor(361,{r:96, g:32,  b:0});
                uE.M.setColor(362,{r:32 , g:96, b:0});
                uE.M.setColor(363,{r:0 ,  g:128, b:0});
                uE.M.setColor(364,{r:0,   g:96, b:32});
                uE.M.setColor(365,{r:0,   g:32,  b:96});
                uE.M.setColor(366,{r:0,   g:0,   b:128});
                uE.M.setColor(367,{r:64, g:0,   b:64});
                
                for(var i = 0; i < 6; i++){
                    uE.M.COL[400 + i] = {r:205,g:255,b:205};
                    uE.M.COL[420 + i] = {r:173,g:244,b:184};
                    uE.M.COL[440 + i] = {r:10,g:213,b:49};
                    uE.M.COL[460 + i] = {r:36,g:218,b:70};
                    uE.M.COL[480 + i] = {r:60,g:223,b:89};
                    uE.M.COL[500 + i] = {r:71,g:227,b:97};
                    uE.M.COL[520 + i] = {r:92,g:234,b:109};
                }
                for(var i = 6; i < 20; i++){
                    uE.M.COL[400 + i] = {r:239,g:239,b:239};
                    uE.M.COL[420 + i] = {r:222,g:222,b:222};
                    uE.M.COL[440 + i] = {r:206,g:206,b:206};
                    uE.M.COL[460 + i] = {r:213,g:213,b:213};
                    uE.M.COL[480 + i] = {r:219,g:219,b:219};
                    uE.M.COL[500 + i] = {r:223,g:223,b:223};
                    uE.M.COL[520 + i] = {r:240,g:240,b:240};
                }
                
                state.status++;
                break;
            case 11:
                uE.log("Trying to load game data");
                this.loadRooms();
                state.status++;
                break;
            case 12:
                uE.log("Trying to load additional planes");
                var conv = function(tab){
                    if(tab[3] != 255) return {a:true};
                    if(tab[1] == 255) return 20;
                    if(tab[1] == 0) return 21;
                    return {a:true};
                };
                uE.M.loadImageAsBuffer("res/gfx/wall/LL.jbic",50,conv);
                uE.M.loadImageAsBuffer("res/gfx/wall/LR.jbic",51,conv);
                uE.M.loadImageAsBuffer("res/gfx/wall/SL.jbic",52,conv);
                uE.M.loadImageAsBuffer("res/gfx/wall/SR.jbic",53,conv);
                uE.M.loadImageAsBuffer("res/gfx/dnc.jbic",60,function(tab) {
                    if(tab[1] == 255) return 11;
                    else return 12;
                });
                uE.M.loadImageAsBuffer("res/gfx/gfx.jbic",80,function(tab) {
                    if(tab[1] == 255) return 32;
                    if(tab[1] == 0) return 31;
                    if(tab[1] == 128) return {a:true};
                    return null;
                });
                uE.M.FBO[61] = uE.M.buildBuffer(72,22);
                uE.M.writeBuffer(60,61,0,0,72,22,46,0);
                state.status++;
                break;
            case 13:
                uE.log("Trying to load player sprites");
                var conv = function(tab){
                    if(tab[3] != 255) return {a:true};
                    if(tab[1] == 255) return 20;
                    if(tab[1] == 0) return 21;
                    return {a:true};
                };
                uE.M.loadImageAsBuffer("res/gfx/player/DBL.jbic",40,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/DBR.jbic",41,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/DFR.jbic",42,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/DFL.jbic",43,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/NBL.jbic",45,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/NBR.jbic",46,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/NFR.jbic",47,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/NFL.jbic",48,conv);
                uE.M.loadImageAsBuffer("res/gfx/player/trans.jbic",49,conv);
                uE.M.loadImageAsBuffer("res/gfx/honk.jbic",69,function(tab) {
                    if(tab[0] < 9) return 360;
                    if(tab[0] < 33) return 361;
                    if(tab[0] < 66) return 362;
                    if(tab[0] < 91) return 363;
                    if(tab[0] < 140) return 364;
                    if(tab[0] < 181) return 365;
                    if(tab[0] < 207) return 366;
                    if(tab[0] < 231) return 367;
                });
                uE.M.loadImageAsBuffer("res/gfx/win.jbic",70,function(tab) {
                    if(tab[0] = 255 && tab[2] < 20) return 400 + tab[1] * 20 + tab[2];
                    else return {r:tab[0],g:tab[1],b:tab[2]};
                });
                state.status++;
                break;
            case 15:
                uE.log("Initialization completed, going to home screen");
                state.status++;
                break;
            case 16:
                state.run.goTo(2);
                state.status++;
                break;
            case 3:
                uE.log("clearing renderlayers");
                uE.UG.clearFB(1, 3);
                uE.UG.clearFB(1, 2);
                uE.UG.clearFB(5, 1);
                state.status = 9;
                break;
                
            case 2:
                uE.log("Trying to load font source file");
                uE.M.loadImageAsBuffer("res/gfx/font8x8.jbic",32,function(tab){
                    if(tab[2] == 255) return 0;
                    if(tab[2] == 0) return {a:true};
                    return {r:tab[0], g:tab[1], b:tab[2]};
                });
                state.status++;
                break;
            case 1:
                
                uE.log("Initializing...");
                state.data = window.mapdata.data;
                state.status++;
                uE.setup.tps = 100;
                break;
            default:
                state.status++;
        }
        
                uE.UG.clearFB(state.status, 1);
    },
    leave: function (params) {
        uE.setup.tps = 12;
        uE.render = true;
    },
    loadRooms:function(){
        //load mapdata to world object
        
        state.world = {
            rooms:[],
            objects:[],
            current:{
                shape:0,
                id:parseInt(state.data.rooms.startuprooms.startuproomid[Math.floor(Math.random()*4)])
            }        
        }
        
        for (var i = 0; i < state.data.rooms.room.length; i++){
            var rs = state.data.rooms.room[i];
            console.log(rs);
            var r = {};
            r.id = parseInt(rs.roomid);
            r.size = parseInt(rs.size);
            r.type = 1;
            r.door = [];
            r.exit = [parseInt(rs.links.linkwest),parseInt(rs.links.linknorth),parseInt(rs.links.linkeast),parseInt(rs.links.linksouth)];
            for(var j = 0; j < rs.backgrounds.backgroundobject.length; j++){
                var o = parseInt(rs.backgrounds.backgroundobject[j]);
                if(o == 15 || o == 16 || o == 17) r.type = 2;
                o = state.data.template.backgroundtypes.backgrounditem[o];
                var pos = -1;
                if(o.bgtype == "DOOR" && ((pos = "WNES".indexOf(o.causesexit)) >= 0)){
                    r.door[pos] = {h:false, s:pos, t:Math.floor(parseInt(o.id)/4)};
                    if(parseInt(o.id) > 19){ r.door[pos].h = true; r.door[pos].h -= 3}
                }
            }
            r.objects = [];
            if(rs.objects.roomblocks.roomblock)
            for(var j = 0; j < rs.objects.roomblocks.roomblock.length; j++){
                var o = rs.objects.roomblocks.roomblock[j];
                o.x = parseInt(o.x);
                o.y = parseInt(o.y);
                o.z = parseInt(o.z);
                this.setData(o);
                r.objects.push(o);
            }
            state.world.rooms[r.id] = r;
        }
    },
    setData: function(obj){
        switch (parseInt(obj.objecttypeid)) {
            case 0:
                obj.x *= 8;
                obj.y *= 8;
                obj.z *= 8;
                obj.sX = 0;
                obj.sY = 0;
                obj.sw = 32;
                obj.sh = 28;
                obj.iW = 8;
                obj.iD = 8;
                obj.iH = 4;
                obj.shiX = -16;
                obj.shiY = -2;
                obj.shiZ = 16;
                obj.contact = 1;
                obj.behavior = 10;
                obj.state = 0;
                break;
            default:
                // code
        }
    }
};
