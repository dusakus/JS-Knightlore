/* global uE */
uE.R = {};

//prepare renderer
uE.R.SETUP = function(){
    if(!uE.D.canvas) return false;
    
    for(var i = 0; i <= uE.setup.layerCount+1; i++) uE.M.FBO[i] = uE.M.buildBuffer(uE.setup.pxW, uE.setup.pxH);
    
    uE.R.fbdata = uE.D.context.createImageData(uE.setup.pxW,uE.setup.pxH);
    
    uE.R.modifCheck = [];
    
    uE.log("Prepared framebuffer");
    uE.fps = 0;
    uE.R.nextframe = Date.now()+1000;
    uE.R.lTime = Date.now();
    uE.R.layerLvls = Math.floor(256/uE.setup.layerCount);
    return true;
}

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
            if(!cs.a && (uE.R.modifCheck[pos] != cs)){
                var t = pos*4;
                c.data[t] = cs.r;
                c.data[t + 1] = cs.g;
                c.data[t + 2] = cs.b;
                c.data[t + 3] = uE.setup.drawAlpha;
                uE.R.modifCheck[pos] = cs;
                pd++;
            }
        }
    }
    
    if(pd > 0){
        //uE.log("updated " + pd + " pixels");
        uE.D.context.putImageData(c,0,0);
    }
}

uE.R.spritesToBuffer = function(target){
    
    if(!target) target = uE.M.FBO[uE.setup.layerCount+1];
    
    var zBuffer = [];
    for(var i = 0; i < uE.setup.pxW * uE.setup.pxH; i++){
        zBuffer[i] = -255;
    }
    
    for(var s = 0; s < uE.setup.spriteCount; s++){
        var spr = uE.M.SPR[s];
        if(spr && spr.FBO > 0){
            var reg = (spr.reg) ? uE.M.SMEM[reg] : spr;
            if(!reg) reg = spr;
            
            var FBSrc = (reg.FBO) ? reg.FBO : spr.FBO;
            var coff  = (reg.coff) ? reg.coff : spr.coff;
            
            if(uE.M.FBO[FBSrc]){
                FBSrc = uE.M.FBO[FBSrc].data;
                
                var pxc = 0;
                
                for(var i = 0; i < reg.h; i++ ){ //y
                    for(var j = 0; j < reg.w; j++){ //x
                        
                        var col = FBSrc[reg.sy + i][reg.sx + j];
                        
                        if(typeof col == "number") col += coff;
                        
                        if(zBuffer[(spr.y+i) * uE.setup.pxW + j + spr.x] < spr.z && !uE.M.getColor(col).a){
                            
                            zBuffer[(spr.y+i) * uE.setup.pxW + j + spr.x] = spr.z;
                            if(target.data[spr.y + i])target.data[spr.y + i][spr.x + j] = col;
                            
                            pxc++;
                            
                        }
                        
                    }
                }
                
                //uE.log("drew " + pxc + " pixels of sprite " + s +" from FB" + spr.FBO + " to FB" + (uE.setup.layerCount+1) +" at " + spr.x + ":" + spr.y);
                
            }
        }
        
        
    } 
    
    uE.M.spriteZBuffer = zBuffer;
    
}