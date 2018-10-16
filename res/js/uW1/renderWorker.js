

onmessage = function(e) {
    this.w = e.data.w;
    this.h = e.data.h;
    this.c = e.data.c;
    this.l = e.data.l;
    console.log("[render worker] got setup");
    
    onmessage = function(e){
        var msg = e.data;
        if(msg.cpall){
            console.log("[render worker] got color palete update")
            this.carr = msg.a;
            return;
        }
        console.log("[render worker] got render task");
        
        for (var sY = 0; sY < this.h; sY++){
            for (var sX = 0; sX < this.w; sX++){
                for(var i = this.c; i>0; i--){
                    var z = 128 - ((i-1) * this.l);
                    var color = getColor(msg.FBO[i].data[sY][sX]);
                    if(msg.spriteZBuffer[sX*this.w + sY] > z){
                        color = getColor(msg.FBO[this.c+1].data[sY][sX]);
                    }
                    if(!color.a) {
                        msg.FBO[0].data[sY][sX] = color;
                        break;
                    }
                }
            }
        }
        postMessage(msg.FBO[0]);
    }
}

function getColor(c){
    if(typeof cid != "number") return c;
    if(this.carr[c]) return this.carr[c];
    else return this.carr[0];
}
    console.log("[render worker] initialized");