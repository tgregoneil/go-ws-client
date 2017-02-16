// wsClientTst.js

module.exports = (function () {

    var ws = require ('go-ws-client');
    var key1 = require ('go-util').key1;

    var wsClient = new ws ('localhost', 8000, (msgOb) => {

        console.log ('msgOb: ' + JSON.stringify (msgOb) + '\n');
        
        var cmd = key1 (msgOb);
        var msg = msgOb [cmd];
    
        switch (cmd) {
    
            case 'ready':
    
                wsClient.toSrvr ({tstCmd:1});
                break;
    
            case 'srvMsg':
    
                document.write (msg)
                break;
    
        } // end switch (cmd)

    }, {verbose: true});

}());
