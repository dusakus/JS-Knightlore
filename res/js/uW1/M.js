/* global uE LZString */
uE.M = {};

//prepare memory
uE.M.SETUP = function(){
    uE.M.FBO = [];
    uE.M.SMEM = [];
    uE.M.SPR = [];
    uE.M.COL = [{r:0,g:0,b:0,a:true}];
    
    for(var i = 0; i < uE.setup.spriteCount; i++) uE.M.SPR[i] = {FBO:-1,x:0,y:0,z:128,w:16,h:16,sx:0,sy:0,coff:0,reg:false}
    return true;
};

uE.M.buildBuffer = function (width, height){
    var a = [height];
    for (var i = 0; i < height; i++){
        a[i] = [width];
        for (var j = 0; j < width; j++){
            a[i][j] = {a:true};
        }
    }
    var out = {data: a, width:width, height:height, x:0, y:0};
    return out;
};

uE.M.writeBuffer = function (bufferin, bufferout, xout, yout, win, hin, xin, yin){
    var xOffset = xout-xin;
    var yOffset = yout-yin;
    if(uE.M.FBO[bufferin] && uE.M.FBO[bufferout])
    for(var x = xin; x < xin+win; x++){
        for(var y = yin; y < yin+hin; y++){
            if(x+xOffset < 0 || y+yOffset < 0 || x < 0 || y < 0 || x > uE.M.FBO[bufferin].width || y > uE.M.FBO[bufferin].height || x+xOffset > uE.M.FBO[bufferout].width || y+yOffset > uE.M.FBO[bufferout].height) continue;
            try{
                var u = uE.M.FBO[bufferin].data[y][x];
                if(u !== undefined && typeof u === "object" | typeof u === "number")
                uE.M.FBO[bufferout].data[y+yOffset][x+xOffset] = u;
            } catch(E) {}
            //console.log(y + ":" + x + " --> " + (y+yOffset) + ":" + (x+xOffset) + " = " + uE.M.FBO[bufferout].data[y+yOffset][x+xOffset]);
        }
    }
};

uE.M.getColor = function (cid){
    if(typeof cid != "number") return cid;
    if(uE.M.COL[cid]) return uE.M.COL[cid];
    else return uE.M.COL[0];
};

uE.M.setColor = function (cid, color, swap){
    uE.M.paleteUpdate = true;
    if(typeof color == "object" && ((typeof color.r == "number" && typeof color.g == "number" && typeof color.b == "number") || typeof color.a == "boolean")){
        //if(uE.M.COL[cid])console.log("uE.M: overwriting color " + cid + ", from " + JSON.stringify(uE.M.COL[cid]) + " to " + JSON.stringify(color));
        uE.M.COL[cid] = color;
    } else if (typeof color == "number" && !!uE.M.COL[color]) {
        if(swap) var cl2 = uE.M.COL[cid];
        uE.M.COL[cid] = uE.M.COL[color];
        if (swap) uE.M.COL[color] = cl2;
    } else {
        console.log("uE.M: invalid color write request for " + cid + " : " + color);
    }
};

uE.M.setSpriteData = function(id,w,h,FBO,sx,sy,z,x,y,coff){
    if(!uE.M.SPR[id]) uE.M.SPR[id] = {FBO:-1,x:0,y:0,z:128,w:16,h:16,sx:0,sy:0,coff:0,reg:false};
    if(typeof w == "number") uE.M.SPR[id].w = w;
    if(typeof h == "number") uE.M.SPR[id].h = h;
    if(typeof x == "number") uE.M.SPR[id].x = x;
    if(typeof y == "number") uE.M.SPR[id].y = y;
    if(typeof z == "number") uE.M.SPR[id].z = z;
    if(typeof sx == "number") uE.M.SPR[id].sx = sx;
    if(typeof sy == "number") uE.M.SPR[id].sy = sy;
    if(typeof FBO == "number") uE.M.SPR[id].FBO = FBO;
    if(typeof coff == "number") uE.M.SPR[id].coff = coff;
};

uE.M.loadImageAsBuffer = function(src, id, pixelconv){
    if(typeof pixelconv != "function") pixelconv = function(array){
        var a = (array[3] > 200) ? false : false;
        return  {r:array[0],g:array[1],b:array[2],a:a};
    }
    
    //uE.log("Trying to read base64 encoded image form " + src + " to FBO["+id+"]");//with color converter:");
    //console.log(pixelconv);
    
    var request = new XMLHttpRequest();

    request.open('GET', src, false);
    request.send(null);

    if (request.status === 200) {
        if(request.responseText.startsWith("JBI")){
            var t = "";
            var data = request.responseText.substring(3);
            if(data.startsWith("COMP")){
                data = data.substr(4);
                //get w
                var w = data.indexOf("|");
                t = data.substr(0,w);
                data = data.substr(w+1);
                w = parseInt(t);
                //get h
                var h = data.indexOf("|");
                t = data.substr(0,h);
                data = data.substr(h+1);
                h = parseInt(t);
                uE.log("parsing compressed binary JBI data, " + data.length + " bytes")
                data = LZString.decompressFromUTF16(data);
            } else {
                var w = data.indexOf("|");
                //get w
                t = data.substr(0,w);
                data = data.substr(w+1);
                w = parseInt(t);
                //get h
                var h = data.indexOf("|");
                t = data.substr(0,h);
                data = data.substr(h+1);
                h = parseInt(t);
                uE.log("parsing binary JBI data, " + data.length + " bytes")
            }
            
            //build array
            var buf = new ArrayBuffer(data.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=data.length; i<strLen; i++) {
                bufView[i] = data.charCodeAt(i);
            }
            var bufView = new Uint8ClampedArray(buf);
            //read Data
            data = {width: w, height:h, data:[]};
            for(var y = 0; y < h; y++){
                var t = [];
                for(var x = 0; x < w; x++){
                    var ind = (y*w+x)*4;
                    var c = [];
                    c[0] = bufView[ind];
                    c[1] = bufView[ind+1];
                    c[2] = bufView[ind+2];
                    c[3] = bufView[ind+3];
                    t[x] = c;
                }
                data.data[y] = t;
            }
        } else {
            var img = document.createElement('img');
            img.src= request.responseText.trim();
        }
    } else {
        uE.log("Failed to fetch image");
        return false;
    }
    
    request.abort()
    
    if(data){
        this.FBO[id] = this.buildBuffer(data.width, data.height);
    
        for(var y = 0; y < data.height; y++){
            for(var x = 0; x < data.width; x++){
                this.FBO[id].data[y][x] = pixelconv(data.data[y][x]);
            }
        }
    } else {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        
        this.FBO[id] = this.buildBuffer(canvas.width,canvas.height);
    
        for(var x = 0; x < canvas.width; x++){
            for(var y = 0; y < canvas.height; y++){
                this.FBO[id].data[y][x] = pixelconv(canvas.getContext('2d').getImageData(x, y, 1, 1).data);
            }
        }
    }
    return true;
};