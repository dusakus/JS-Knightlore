/* global uE */

//logger, to be extended
uE.log = function (text,level) {
    if(!level || level >= uE.logLevel) console.log(text);
}