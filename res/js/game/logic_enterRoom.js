/* global state render logic uE stuff */
logic.s[8] = {
    enter: function (params) {
        state.status = 0;
        stuff.r = {};
        uE.setup.tps = 60;
        stuff.filterModT = 0.95
        stuff.filterModT2 = 0.1
        stuff.filter_upd();
    },
    tick: function (params) {
        switch(state.status){
            case 20:
                uE.log("room loaded");
                state.run.goTo(10);
                break;
                
                
            case 10:
                //initialize room content
                
                for (var i = 0; i < 34; i++){
                    uE.M.SPR[30+i].FBO = -1;
                }
                for (var i = 0; i < stuff.r.objects.length; i++){
                    var o = stuff.r.objects[i];
                    //id,w,h,FBO,sx,sy,z,x,y,coff
                    uE.M.setSpriteData(30+i,o.sw,o.sh,80,o.sX, o.sY,stuff.iso.toRZ(o.x,o.y,o.z)+o.shiZ,stuff.iso.toRX(o.x,o.y,o.z)+o.shiX,stuff.iso.toRY(o.x,o.y,o.z)+o.shiY,-20);
                }
                
                state.status++;
                break;
                
            case 7: //room small y
                stuff.r.X_max = 64;
                stuff.r.X_min = 0;
                stuff.r.Y_max = 48;
                stuff.r.Y_min = 16;
                
                uE.M.writeBuffer(52, 3, 32, -2,64,103,0,0);
                uE.M.writeBuffer(51, 3, 96, 16,128,103,0,0);
                
                
                if(stuff.r.exit[0] >= 0){
                    uE.M.setSpriteData(20,32,52,80,-128 + stuff.r.type*128,42,-10,49,24,-20);
                    uE.M.setSpriteData(21,24,36,80,-104 + stuff.r.type*128,42,-10,65,27,-20);
                }
            
                if(stuff.r.exit[2] >= 0){
                    uE.M.setSpriteData(24,32,52,80,-128 + stuff.r.type*128,42,96,178,92,-20);
                    uE.M.setSpriteData(25,24,36,80,-104 + stuff.r.type*128,42,83,194,95,-20);
                }
                
            
                state.status = 10;
                break;
            case 6: //room small x
                stuff.r.X_max = 48;
                stuff.r.X_min = 16;
                stuff.r.Y_max = 64;
                stuff.r.Y_min = 0;
                
                uE.M.writeBuffer(50, 3, 32, 16,128,103,0,0);
                uE.M.writeBuffer(53, 3, 160, 0,64,103,0,0);
            
                if(stuff.r.exit[1] >= 0){
                    uE.M.setSpriteData(22,16,35,80,-48 + stuff.r.type*128,42,23,178,32,-20);
                    uE.M.setSpriteData(23,24,55,80,-24 + stuff.r.type*128,42,36,194,29,-20);
                }
            
                if(stuff.r.exit[3] >= 0){
                    uE.M.setSpriteData(26,16,35,80,-48 + stuff.r.type*128,42,83,49,98,-20);
                    uE.M.setSpriteData(27,24,55,80,-24 + stuff.r.type*128,42,96,65,95,-20);
                }
                
                state.status = 10;
                break;
            case 5: //room: big
                stuff.r.X_max = 64;
                stuff.r.X_min = 0;
                stuff.r.Y_max = 64;
                stuff.r.Y_min = 0;
                
                uE.M.writeBuffer(50, 3, 0, 0,128,103,0,0);
                uE.M.writeBuffer(51, 3, 128, 0,128,103,0,0);
            
                //id,w,h,FBO,sx,sy,z,x,y,coff
            
                if(stuff.r.exit[0] >= 0){
                    uE.M.setSpriteData(20,32,52,80,-128 + stuff.r.type*128,42,-10,49,24,-20);
                    uE.M.setSpriteData(21,24,36,80,-104 + stuff.r.type*128,42,-10,65,27,-20);
                }
            
                if(stuff.r.exit[1] >= 0){
                    uE.M.setSpriteData(22,16,35,80,-48 + stuff.r.type*128,42,23,178,32,-20);
                    uE.M.setSpriteData(23,24,55,80,-24 + stuff.r.type*128,42,36,194,29,-20);
                }
            
                if(stuff.r.exit[2] >= 0){
                    uE.M.setSpriteData(24,32,52,80,-128 + stuff.r.type*128,42,96,178,92,-20);
                    uE.M.setSpriteData(25,24,36,80,-104 + stuff.r.type*128,42,83,194,95,-20);
                }
            
                if(stuff.r.exit[3] >= 0){
                    uE.M.setSpriteData(26,16,35,80,-48 + stuff.r.type*128,42,83,49,98,-20);
                    uE.M.setSpriteData(27,24,55,80,-24 + stuff.r.type*128,42,96,65,95,-20);
                }
                
                
                state.status = 10;
                break;
            case 4: //select room
                state.status = 5 + stuff.r.size;
                stuff.r.type = 1;
                break;
            case 2:
                stuff.r = state.world.rooms[state.world.current.id];
                if(!stuff.r) state.run.goTo(42);
                state.status++;
                break;
            case 1:
                uE.log("Initializing...");
                uE.UG.clearFB(1,3)
                for(var i=20; i < 28; i++) uE.M.setSpriteData(i,16,35,-1)
                stuff.filterModT = 0.95
                stuff.filterModT2 = 0.1
                stuff.filter_upd();
                state.status++;
                break;
            default:
                state.status++;
        }
    },
    leave: function (params) {
    }
}