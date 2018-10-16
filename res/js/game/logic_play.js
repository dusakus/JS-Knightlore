/* global state render logic uE stuff */
logic.s[10] = {
    enter: function (params) {
        state.status = 0;
    },
    tick: function (params) {
        switch(state.status){
            case 250:
                state.run.goTo(42);
                break;
            case 210:
                state.run.goTo(8);
                break;
            case 185: //end night mode transition
                uE.setup.tps = 12;
                uE.M.SPR[8].h = 25;
                state.status = 10;
                break;
            case 183: 
                uE.M.SPR[8].sx = 0;  
                state.status++;
                break;
            case 182: 
                uE.M.SPR[8].sx = 25;  
                state.status++;
                break;
            case 181: 
                uE.M.SPR[8].sx = 50;  
                state.status++;
                break;
            case 180: //night mode transition
                uE.setup.tps = 6;
                //colors
                uE.M.setColor(20, 13);
                uE.M.setColor(21, 14);
                uE.M.setColor(0, 14);
                stuff.night = 1;
                uE.M.SPR[8].coff += 6;
                uE.M.SPR[9].coff += 6;
                
                uE.M.SPR[8].FBO = 49;
                uE.M.SPR[8].h = 35;
                uE.M.SPR[8].sx = 75;
                uE.M.SPR[8].sy = 0;
                uE.M.SPR[9].FBO = -1;
                uE.M.SPR[9].sy = 30;
                
                
                state.status++;
                break;
            
            case 174: //end day mode transition
                uE.M.SPR[8].h = 25;
                uE.setup.tps = 12;
            
                state.status = 10;
                break;
            case 173: 
                uE.M.SPR[8].sx = 75;  
                state.status++;
                break;
            case 172: 
                uE.M.SPR[8].sx = 50;  
                state.status++;
                break;
            case 171: 
                uE.M.SPR[8].sx = 25;  
                state.status++;
                break;
            case 170: //day mode transition
                uE.setup.tps = 6;
                //colors
                uE.M.setColor(20, 7);
                uE.M.setColor(21, 8);
                uE.M.setColor(0, 8);
                stuff.night = 0;
                uE.M.SPR[8].coff -= 6;
                uE.M.SPR[9].coff -= 6;
                
                uE.M.SPR[8].FBO = 49;
                uE.M.SPR[8].h = 35;
                uE.M.SPR[8].sx = 0;
                uE.M.SPR[8].sy = 0;
                uE.M.SPR[9].FBO = -1;
                uE.M.SPR[9].sy = 25;
                
                
                
                state.status++;
                break;
                
            case 49:
                stuff.p.frame++;
                this.p.tryMoveJ(stuff.p.dir, -4);
                state.status = 10;
                break;
            case 47:
            case 48:
                stuff.p.frame++;
                this.p.tryMoveJ(stuff.p.dir, -4);
                state.status++;
                break;
                
            case 46:
            case 45:
            case 44:
            case 43:
                stuff.p.frame++;
                this.p.tryMoveJ(stuff.p.dir, -2);
                state.status++;
                break;
            case 42:
            case 41:
                stuff.p.frame++;
                this.p.tryMoveJ(stuff.p.dir, -1);
                state.status++;
                break;
                
            case 38: //jump
                stuff.p.frame++;
                this.p.tryMoveJ(stuff.p.dir, 1)
                state.status = 41;
                break;
            case 37: //jump
                stuff.p.frame++;
                if(uE.D.IS.spc.SPACE && this.p.tryMoveJ(stuff.p.dir, 1)){
                    state.status++;
                } else state.status = 42;
                break;
            case 36: //jump
                stuff.p.frame++;
                if(uE.D.IS.spc.SPACE && this.p.tryMoveJ(stuff.p.dir, 2)){
                    state.status++;
                } else state.status = 43;
                break;
            case 35: //jump
                stuff.p.frame++;
                if(uE.D.IS.spc.SPACE && this.p.tryMoveJ(stuff.p.dir, 2)){
                    state.status++;
                } else state.status = 44;
                break;
            case 34: //jump
                stuff.p.frame++;
                if(uE.D.IS.spc.SPACE && this.p.tryMoveJ(stuff.p.dir, 2)){
                    state.status++;
                } else state.status = 45;
                break;
            case 33: //jump
                stuff.p.frame++;
                if(this.p.tryMoveJ(stuff.p.dir, 2)){
                    state.status++;
                } else state.status = 46;
                break;
            case 32: //jump
                stuff.p.frame++;
                if(this.p.tryMoveJ(stuff.p.dir, 3)){
                    state.status++;
                } else state.status = 47;
                break;
            case 31: //jump
                stuff.p.frame++;
                if(this.p.tryMoveJ(stuff.p.dir, 3)){
                    state.status++;
                } else state.status = 48;
                break;
            case 30: //jump
                stuff.p.frame++;
                if(this.p.tryMoveJ(stuff.p.dir, 4)){
                    state.status++;
                } else state.status = 49;
                break;
                
            case 10: //standard frame
                this.tickTime();
                break;
            case 9:
                uE.log("Setting up player sprites...");
                
                uE.M.SPR[8].z = 55;
                uE.M.SPR[9].z = 54;
                uE.M.SPR[8].w = 25;
                uE.M.SPR[9].w = 25;
                uE.M.SPR[8].h = 25;
                uE.M.SPR[9].h = 25;
                
                uE.M.SPR[8].coff = -13;
                uE.M.SPR[9].coff = -13;
                
                uE.M.SPR[9].sy = 25;
                
                uE.render = true;
                uE.setup.tps = 12;
                
                state.status++;
                break;
            case 2:
                this.setNum(stuff.lives, 12);
                this.setNum(stuff.charms, 16);
                state.status++;
                break;
            case 1:
                
                stuff.filter_scan();
                uE.M.setColor(20, 7);
                uE.M.setColor(21, 8);
                uE.log("Initializing...");
                state.status++;
                break;
            default:
                state.status++;
        }
        
        if(state.status < 10) return;
        //world render
        
        
        
        if(state.status > 100) return;
        //player move
        var pmX = 0
        var pmY = 0
        switch(stuff.p.dir){
            case 0: pmX = -3; break;
            case 1: pmY = -3; break;
            case 2: pmX =  3; break;
            case 3: pmY =  3; break;
        }
        if(state.status < 30){
            if(uE.D.IS.spc.UP) this.p.tryMove(pmX, pmY);
            else if(!uE.D.IS.spc.SPACE) stuff.p.frame = 2;
            if(uE.D.IS.spc.LEFT && !this.rDel) {stuff.p.dir+=3;this.rDel = 3}
            if(uE.D.IS.spc.RIGHT && !this.rDel) {stuff.p.dir++;this.rDel = 3}
            if(stuff.p.z > 32) stuff.p.z--;
            stuff.p.dir = stuff.p.dir%4;
            if(uE.D.IS.spc.SPACE && !this.rDel) {state.status = 30}
            
            if(this.rDel) this.rDel--;
            else {
                if(uE.D.IS.spc.LEFT) {stuff.p.dir+=3;this.rDel = 3}
                if(uE.D.IS.spc.RIGHT) {stuff.p.dir++;this.rDel = 3}
                stuff.p.dir = stuff.p.dir%4;
            }
            
            if(stuff.p.z > 32) stuff.p.z--;
        }
        
        
        
        
        //player render
        //      player sprites:     8 [TORSO]
        //                          9 [LEGS]
        //console.log("player at isometric " + stuff.p.x + ":" + stuff.p.y);
        var pX = Math.round(stuff.iso.toRX(stuff.p.x,stuff.p.y));
        var pY = Math.round(stuff.iso.toRY(stuff.p.x,stuff.p.y,stuff.p.z));
        //console.log("player at real " + pX + ":" + pY);
        uE.M.SPR[8].x = pX - 12;
        uE.M.SPR[8].y = pY + 6 - 19 - stuff.night*2;
        uE.M.SPR[9].x = pX - 12;
        uE.M.SPR[9].y = pY + 6 //- stuff.night*5 ;
        
        
        
        uE.M.SPR[8].sx = 25*stuff.p.frame;
        uE.M.SPR[9].sx = 25*stuff.p.frame;
        
        uE.M.SPR[8].FBO = 40 + stuff.p.dir + stuff.night*5;
        uE.M.SPR[9].FBO = 40 + stuff.p.dir + stuff.night*5;
        
        
        
        uE.M.SPR[8].z = stuff.iso.toRZ(stuff.p.x,stuff.p.y,stuff.p.z);
        uE.M.SPR[9].z = uE.M.SPR[8].z;
        
        
    },
    leave: function (params) {

    },
    p:{
        tryMoveJ: function(dir, zMod){
            
            var pmX = 0
            var pmY = 0
            switch(stuff.p.dir){
                case 0: pmX = -2; break;
                case 1: pmY = -2; break;
                case 2: pmX =  2; break;
                case 3: pmY =  2; break;
            }
            this.tryMove(pmX, pmY);
            
            //TODO: top collision
            
            if(stuff.p.z+zMod >= 32)
                stuff.p.z += zMod
            else stuff.p.z = 32;
            return true;
            
        },
        tryMove: function(mX,mY){
            
            //TODO: collision
            if(stuff.p.x + mX >= stuff.r.X_min)
                if(stuff.p.x + mX <= stuff.r.X_max) stuff.p.x += mX;
                else stuff.p.x = stuff.r.X_max;
            else stuff.p.x = stuff.r.X_min;
            if(stuff.p.y + mY >= stuff.r.Y_min)
                if(stuff.p.y + mY <= stuff.r.Y_max) stuff.p.y += mY; 
                else stuff.p.y = stuff.r.Y_max;
            else stuff.p.y = stuff.r.Y_min;
            
            //door
            if(stuff.p.z==32 && state.status == 10){
            if(stuff.p.x == stuff.r.X_min && Math.abs(stuff.p.y-32) < 3 && stuff.r.exit[0] > -1){
                state.world.current.id = stuff.r.exit[0];
                state.status = 210;
                stuff.p.x = 63
            } else
            if(stuff.p.x == stuff.r.X_max && Math.abs(stuff.p.y-32) < 3 && stuff.r.exit[2] > -1){
                state.world.current.id = stuff.r.exit[2];
                state.status = 210;
                stuff.p.x = 1
            } else
            if(stuff.p.y == stuff.r.Y_max && Math.abs(stuff.p.x-32) < 3 && stuff.r.exit[3] > -1){
                state.world.current.id = stuff.r.exit[3];
                state.status = 210;
                stuff.p.y = 1
            } else
            if(stuff.p.y == stuff.r.Y_min && Math.abs(stuff.p.x-32) < 3 && stuff.r.exit[1] > -1){
                state.world.current.id = stuff.r.exit[1];
                state.status = 210;
                stuff.p.y = 63
            } 
            }
            
            stuff.p.frame++;
            if(stuff.p.frame > 5){
                stuff.p.frame = 0;
            }
            
        uE.M.SPR[8].z = stuff.iso.toRZ(stuff.p.x,stuff.p.y,stuff.p.z);
        uE.M.SPR[9].z = uE.M.SPR[8].z;
        }   
    },
    tickTime: function(){
        stuff.timeDel--;
        if(stuff.timeDel <= 0){
            stuff.time--;
            if(stuff.time >= 40 || stuff.time <= 11){
                stuff.timeDel = 5
            } else {
                stuff.timeDel = 15;
            }
            
            if(stuff.time < 5){
                stuff.time = 46;
                state.status = 180 - (stuff.night*10);
                stuff.day += stuff.night;
                this.setNum(stuff.day, 14);
            }
            
            uE.M.SPR[19].FBO = 60 + stuff.night;
            uE.M.SPR[19].sx = stuff.time;
        }
    },
    setNum: function(num, trg){
        var un = Math.floor(num/10);
        var ln = num%10;
        
        uE.M.SPR[trg].sx = 8*un;
        uE.M.SPR[trg+1].sx = 8*ln;
    }
}