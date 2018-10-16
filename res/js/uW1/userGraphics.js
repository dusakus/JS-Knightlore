/* global uE */

uE.UG = {};
uE.UG.clearFB = function(color, fboid){
    if(!fboid) var fboid = 1;
    try{
        for (var x = 0;x < uE.setup.pxW; x++) {
            for (var y = 0;y < uE.setup.pxH; y++) {
                uE.M.FBO[fboid].data[y][x] = color;
            }
        }
        return uE.setup.pxW*uE.setup.pxH;
    }catch(E){ uE.log("[UG.clearFB] fill failed")}
}

uE.UG.clearArea = function(color, fboid, X, Y, w, h){
    if(!fboid) var fboid = 2;
    try{
        for (var x = X;x < X+w; x++) {
            for (var y = Y;y < Y+h; y++) {
                uE.M.FBO[fboid].data[y][x] = color;
            }
        }
        return w*h;
    }catch(E){ uE.log("[UG.clearArea] fill failed")}
}

uE.UG.makeText = function(lines, fboid, fontSrc, cW, cH){
    if(typeof lines == "string"){
        lines = [lines];
    }
    
    if(typeof lines[0] != "string"){
        uE.log("[UG.makeText] invalid input")
        return false;
    }
    
    var h = lines.length;
    var w = 0;
    for (var i = 0; i < lines.length; i++) {
        if(lines[i].length > w) w = lines[i].length;
    }
    
    var out = uE.M.buildBuffer(w*cW,h*cH);
    uE.M.FBO[fboid] = out;
    
    for (var i = 0; i < lines.length; i ++){
        for(var j = 0; j < lines[i].length; j++){
            var char = lines[i][j].charCodeAt(0);
            if(lines[i][j] == " ") continue;
            var chY = parseInt(char/16);
            var chX = char % 16;
            uE.M.writeBuffer(fontSrc, fboid, j*cW, i*cH, cW, cH, chX*cW, chY*cH);
        }
    }
}
