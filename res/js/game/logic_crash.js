/* global state render logic uE */
logic.s[42] = {
    enter: function (params) {
        this.failedMode = state.mode;
        this.failedStatus = state.status;
        state.status = 0;
        stuff.filter_mem();
        stuff.filterModB2 = 10;
        stuff.filterModT = 0.5;
        uE.setup.tps = 4;
    },
    tick: function (params) {
        switch(state.status){
            case 4:
                uE.M.setColor(0,1,true);
                try{asap.asap.seek(this.s1*1000);}catch(E){}
                state.status = 3;
                break;
            case 3:
                uE.M.setColor(0,1,true);
                try{asap.asap.seek(this.s2*1000);}catch(E){}
                state.status = 4;
                break;
            case 2:
                uE.UG.makeText(["    CRITICAL    ","RUNTIME  FAILURE","IN MODE " + this.failedMode,"  STATE " + this.failedStatus],100,32,8,8);
                uE.UG.makeText(["PLEASE PRESS F5"],101,32,8,8);
                uE.UG.clearFB({a:true},6);
                uE.UG.clearFB({a:true},5);
                uE.UG.clearFB({a:true},4);
                uE.M.writeBuffer(100,uE.setup.layerCount,64,32,128,64,0,0);
                uE.M.writeBuffer(101,uE.setup.layerCount,16,180,120,64,0,0);
                uE.M.writeBuffer(69 ,4, 0, 0, 256, 192, 0, 0);
                uE.M.writeBuffer(70 ,5, 0, 120, 256, 39, 0, 0);
                uE.setup.tps = 24;
                state.status++;
                break;
            case 1:
                uE.M.setColor(1, {r:0,g:0,b:0});
                uE.M.setColor(0, {r:192,g:32,b:32});
                this.s1 = Math.floor(Math.random()*20);
                this.s2 = Math.floor(Math.random()*20);
                uE.M.SPR = [];
                uE.log("CRITICAL: failure occured in mode " + this.failedMode + " running status " + this.failedStatus);
            default:
                state.status++;
        }
        for(var i = 360; i < 367; i++){
            uE.M.setColor(i, i+1, true);
        }
        for(var i = 0; i < 19; i++){
            for(var j = 6; j >=0; j--){
                uE.M.setColor(400 + j*20 + i, 400 + j*20 + i +1, true);
            }
        }
        
        
    },
    leave: function (params) {

    }
}

stuff.baserend = uE.R.renderFrame;

stuff.filter_restore = function(){
    uE.R.renderFrame = stuff.baserend;
    uE.R.redrawAll = true;
}

stuff.filter_fridi = function(){
    stuff.filterModB2 = 2;
    
    //alert("WŁÓŻ OKULARY 3D");
    
uE.R.renderFrame = function(){
    uE.R.spritesToBuffer();
    var c = uE.R.fbdata;
    var bShift = Math.floor(Math.random()*stuff.filterModB2);
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            if(!cs.a){
                var t = pos*4;
                c.data[t] = cs.r;
                c.data[t + 2] = cs.b;
                c.data[t + 3] = uE.setup.drawAlpha;
                try{c.data[t + 2] = c.data[t + 2 + bShift*4];} catch(e){}
                try{c.data[t] = c.data[t - (bShift-1)*4];} catch(e){}
            }
        }
    }
        uE.D.context.putImageData(c,0,0);
}}

stuff.filter_nojs = function(){
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.R.fbdata;
    var pd = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a /*&& uE.R.modifCheck[pos] != cs*/){
                var t = pos*4;
                c.data[t] = cs.r;
                c.data[t + 1] = cs.g;
                c.data[t + 2] = cs.b;
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
                var t = (pos)*4;
                c.data[t + 1] += -40 + Math.floor(Math.random()*20);
                c.data[t + 2] += -40 + Math.floor(Math.random()*20);
                c.data[t] += -40 + Math.floor(Math.random()*20);
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_scan = function(){
    
    uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.D.context.createImageData(uE.setup.pxW,uE.setup.pxH);
    var pd = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a /*&& uE.R.modifCheck[pos] != cs*/){
                var t = pos*4;
                c.data[t + 4] = cs.r - (((sY + 1) % 3) * 5) + (-12 + Math.floor(Math.random()*6));
                c.data[t + 1] = cs.g - (((sY + 1) % 3) * 5) + (-12 + Math.floor(Math.random()*6));
                try{c.data[t - 2 - (uE.setup.pxW*4)] = cs.b + (-12 + Math.floor(Math.random()*6))}catch(E){}
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_scan2 = function(){
    
    uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.D.context.createImageData(uE.setup.pxW,uE.setup.pxH);
    var pd = 0;
    var shfR = Math.random()*7 - 3;
    var shfG = Math.random()*7 - 3;
    var shfB = Math.random()*7 - 3;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a /*&& uE.R.modifCheck[pos] != cs*/){
                var t = pos*4;
                try{c.data[t + 4 + Math.round(sY%shfR*4)] = cs.r - (((sY + 1) % 3) * 5) + (-12 + Math.floor(Math.random()*6));}catch(E){}
                try{c.data[t + 1 + Math.round(sY%shfG*4)] = cs.g - (((sY + 1) % 3) * 5) + (-12 + Math.floor(Math.random()*6));}catch(E){}
                try{c.data[t - 2 - (uE.setup.pxW*4) + Math.round(sY%shfB*4)] = cs.b + (-12 + Math.floor(Math.random()*6))}catch(E){}
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_scan3 = function(){
    
    uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.D.context.createImageData(uE.setup.pxW,uE.setup.pxH);
    var pd = 0;
    var shfR = Math.random()*3 - 1;
    var shfG = Math.random()*3 - 1;
    var shfB = Math.random()*3 - 1;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        var u1 = Math.round(sY%shfR*4);
        var u2 = Math.round(sY%shfG*4);
        var u3 = Math.round(sY%shfB*4);
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a /*&& uE.R.modifCheck[pos] != cs*/){
                var t = pos*4;
                try{c.data[t + u1] = cs.r}catch(E){}
                try{c.data[t + 1 + u2] = cs.g}catch(E){}
                try{c.data[t + 2 + u3] = cs.b}catch(E){}
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_shift = function(){
    
//uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.D.context.createImageData(uE.setup.pxW,uE.setup.pxH);
    var pd = 0;
    var u1 = 0;
    var u2 = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        if(Math.random() > stuff.filterModT2)u1 += Math.round(Math.random()*8 -4);
        if(u1 > 3) u1 --;
        if(u1 < -3) u1 ++;
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            if(Math.random() > stuff.filterModT)u2 += Math.round(Math.random()*2 -1);
        if(u2 > 1) u2 --;
        if(u2 < -1) u2 ++;
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a /*&& uE.R.modifCheck[pos] != cs*/){
                var t = pos*4;
                try{c.data[t + u1 + u2] = cs.r}catch(E){}
                try{c.data[t + 1 + u1 + u2] = cs.g}catch(E){}
                try{c.data[t + 2 + u1 + u2] = cs.b}catch(E){}
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_mem = function(){
    
//uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.R.fbdata;
    var pd = 0;
    var u1 = 0;
    var u2 = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            if(Math.random() > stuff.filterModT) uE.R.modifCheck[pos] = -1;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a && uE.R.modifCheck[pos] != cs){
                var t = pos*4;
                c.data[t] *= 0.75+Math.random()*0.12;
                c.data[t+1] *= 0.85+Math.random()*0.04;
                c.data[t+2] *= 0.85+Math.random()*0.04;
                
                c.data[t] += cs.r*(0.25+Math.random()*0.04);
                c.data[t+1] += cs.g*(0.15+Math.random()*0.08);
                c.data[t+2] += cs.b*(0.25+Math.random()*0.04);
                
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_upd = function(){
    
//uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.R.fbdata;
    var pd = 0;
    var u1 = 0;
    var u2 = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a && uE.R.modifCheck[pos] != cs){
                var t = pos*4;
                
                c.data[t] += cs.r
                c.data[t+1] += cs.g
                c.data[t+2] += cs.b
                
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            } else {
                var t = pos*4;
                
                c.data[t] *= stuff.filterModT
                c.data[t+1] *= stuff.filterModT - stuff.filterModT2
                c.data[t+2] *= stuff.filterModT - stuff.filterModT2
                
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
                
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filter_updOnly = function(){
    
//uE.D.canvas.style.imageRendering = "unset";
uE.R.renderFrame = function(){
    
    //render sprites to FB($lc + 1)
    uE.R.spritesToBuffer();
    
   
    //render
    var c = uE.R.fbdata;
    var pd = 0;
    var u1 = 0;
    var u2 = 0;
    for (var sY = 0; sY < uE.setup.pxH; sY++){
        for (var sX = 0; sX < uE.setup.pxW; sX++){
            //calculate coord
            var pos = sY*uE.setup.pxW + sX;
            var cs = {a:true};
            //update FBO[0]
            for(var i = uE.setup.layerCount; i>0; i--){
                var z = -128 + ((i-1) * uE.R.layerLvls);
                var color = uE.M.getColor(uE.M.FBO[i].data[sY][sX]);
                if(uE.M.spriteZBuffer[pos] > z){
                    color = uE.M.getColor(uE.M.FBO[uE.setup.layerCount+1].data[sY][sX]);
                }
                if(!color.a) {
                    var cs = uE.M.FBO[0].data[sY][sX] = color;
                    break;
                }
            }
            //write color to imgdata
            if(!cs.a && uE.R.modifCheck[pos] != cs){
                var t = pos*4;
                
                c.data[t] += cs.r
                c.data[t+1] += cs.g
                c.data[t+2] += cs.b
                
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            } else {
                var t = pos*4;
                
                c.data[t] =0
                c.data[t+1] =0
                c.data[t+2] =0
                
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
                
            }
        }
    }
    
    //if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    //}
}}

stuff.filterModT = 0.8;
stuff.filterModT2 = 0.2;
stuff.filterModB = 2;
stuff.filterModB2 = 5;
