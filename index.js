// go-ws-client/index.js

module.exports = function (ip, port, client, options) {

// PRIVATE Properties/Methods
var _ = {
    
    ip: ip,
    port: port,
    secureConnection: null,
    verbose: null,

    _.ut: require ('go-util'),
    pcheck: null,
    key1: null,

    wsServer: null

}; // end PRIVATE properties

//---------------------
_.init = () => {

    _.pcheck = _.ut.pCheck;
    _.key1 = _.ut.key1;

    var params = _.pcheck (options, {secureConnection: false,
        verbose: false});

    _.secureConnection = params.secureConnection;
    _.verbose = params.verbose;

    if (_.verbose) {

        console.log ('wsClient params: ' + JSON.stringify (params) + '\n');

    } // end if (_.verbose)
    
    _.tstCmds =  {ping: _.tstCmdPingResp};
    _.client = client ? client : _.reportMsgOb;

    var wsPrefix = _.secureConnection ? 'wss' : 'ws';
    var wsUrl = wsPrefix + '://' + _.ip + ':' + _.port;

    _.wsServer = new WebSocket (wsUrl);

    _.wsServer.onmessage = _.fromSrvr;
    _.wsServer.onclose = _.msgClose;
    _.wsServer.onerror = _.msgError;

}; // end _.init 


//---------------------
_.doCmd = (uMsgOb) => {

    var fromSrvr = JSON.stringify (uMsgOb);

    if (_.verbose) {
        
        console.log ('  ==> wsClient.fromSrvr: ' + fromSrvr);

    } // end if (_.verbose)
    
    uMsgOb = Array.isArray (uMsgOb) ? uMsgOb : [uMsgOb];

    for (var i = 0; i < uMsgOb.length; i++) {

        var msgOb = uMsgOb [i];

        var cmd = _.key1 (msgOb);
    
        if (_.tstCmds.hasOwnProperty (cmd)) {
    
            _.tstCmds [cmd] (msgOb [cmd]);
    
        } else {
    
            _.client (msgOb);
    
        } // end if (_.tstCmds.hasOwnProperty (cmd))
    
    } // end for (var i = 0; i < uMsgOb.length; i++)

}; // end _.doCmd 



//---------------------
_.doSend = (msg) => {

    if (_.verbose) {

        console.log ('_.doSend.msg: ' + msg + '\n');

    } // end if (_.verbose)
    
    _.wsServer.send (msg);

}; // end _.doSend 


//---------------------
_.fromSrvr = (event) => {
    
    var msg = event.data;

    if (_.verbose) {
        
        console.log ('_.fromSrvr.event.data: ' + msg);

    } // end if (_.verbose)
    
    _.doCmd (JSON.parse (msg).m);

}; // end _.fromSrvr 

//---------------------
_.msgClose = (event) => {
    
    console.log ('close event: ' + event.data);

}; // end _.msgClose 


//---------------------
_.msgError = (event) => {
    
    var eventMsg = event.data ? ' event.data: ' + event.data : "";
    
    var errMsg = 'wsClient msgError (Server is Down?)' + eventMsg;
    console.log (errMsg);

    $('body').prepend (errMsg);

}; // end _.msgClose 


//---------------------
_.reportMsgOb = (msgOb) => {
    
    console.log ('_.reportMsgOb.msgOb: ' + msgOb + '\n');

}; // end _.reportMsgOb 


//---------------------
_.tstCmdPingResp = (pingMsg) => {
    
    console.log ('ping: ' + pingMsg);
    return;

}; // end _.tstCmdPingResp 

_.init ();



// PUBLIC Properties/Methods
var p = {};

//---------------------
p.toSrvr = (msgOb) => {
    
    var msgObS = JSON.stringify ({m:msgOb});

    if (_.verbose) {

        console.log ('p.toSrvr.msgObS : ' + msgObS + '\n');

    } // end if (_.verbose)
    
    _.doSend (msgObS);

}; // end _.toSrvr 


return p;

};



