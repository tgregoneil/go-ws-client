(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// index.js

module.exports = (function () {

    // PRIVATE Properties/Methods
var _ = {

    key1: require ('key1')

};  // end PRIVATE properties

_.init = () => {
};

    // PUBLIC Properties/Methods
var P = {};

//---------------------
P.pCheck = (p, pDefault) => {
    // ditches any parameters supplied in p that aren't present in pDefault
    // if a param is necessary to a routine, then it should be defined in pDefault
    
    var res = {};

    p = P.isOb (p) ? p : {};
    
    for (var key in pDefault) {

        res [key] = p.hasOwnProperty (key) ? p [key] : pDefault [key];
    }

    return res;

}; // end P.pCheck 


//---------------------
P.isOb = (ob) => {
    // returns true if ob is defined, not null, not an Array and of type object
    
    var res = typeof ob !== undefined &&
              ob !== null &&
              !Array.isArray (ob) &&
              typeof ob === 'object';

    return res;

}; // end P.isOb 

P.key1 = _.key1;

    // end PUBLIC section

_.init ();

return P;

}());




},{"key1":4}],2:[function(require,module,exports){
// go-ws-client/index.js

module.exports = function (ip, port, client, options) {

// PRIVATE Properties/Methods
var _ = {
    
    ip: ip,
    port: port,
    secureConnection: null,
    verbose: null,

    ut: require ('go-util'),
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




},{"go-util":1}],3:[function(require,module,exports){
// wsClientTst.js

module.exports = (function () {

    var ws = require ('go-ws-client');
    var key1 = require ('go-util').key1;

    $(document).ready (function () {

        var wsClient = new ws ('localhost', 8000, (msgOb) => {
    
            console.log ('msgOb: ' + JSON.stringify (msgOb) + '\n');
            
            var cmd = key1 (msgOb);
            var msg = msgOb [cmd];
        
            switch (cmd) {
        
                case 'ready':
        
                    wsClient.toSrvr ({tstCmd:1});
                    break;
        
                case 'srvMsg':
        
                    $('body')
                    .append (msg);

                    break;
        
            } // end switch (cmd)
    
        }, {verbose: true});
    });

}());

},{"go-util":1,"go-ws-client":2}],4:[function(require,module,exports){
// key1.js

// key1 extracts the single key from an object 
// containing only one key/value pair
// and returns the string value for the key
// anything else passed to key1 returns null

module.exports = (function () {

//---------------------
var key1 = (ob) => {

    key = null;

    var uniqueKeyExists = typeof ob !== 'undefined' &&
                          ob !== null &&
                          !Array.isArray(ob) &&
                          typeof ob === 'object' &&
                          Object.keys(ob).length === 1;
    
    if (uniqueKeyExists) {
    
        var keys = Object.keys(ob);
        key = keys[0];
    
    } // end if (uniqueKeyExists)
    
    return key;
    
}; // end key1 

return key1;

}());

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9nby11dGlsL2luZGV4LmpzIiwiaW5kZXguanMiLCJ3c0NsaWVudFRzdC5qcyIsIi4uL2tleTEvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gaW5kZXguanNcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gUFJJVkFURSBQcm9wZXJ0aWVzL01ldGhvZHNcbnZhciBfID0ge1xuXG4gICAga2V5MTogcmVxdWlyZSAoJ2tleTEnKVxuXG59OyAgLy8gZW5kIFBSSVZBVEUgcHJvcGVydGllc1xuXG5fLmluaXQgPSAoKSA9PiB7XG59O1xuXG4gICAgLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAucENoZWNrID0gKHAsIHBEZWZhdWx0KSA9PiB7XG4gICAgLy8gZGl0Y2hlcyBhbnkgcGFyYW1ldGVycyBzdXBwbGllZCBpbiBwIHRoYXQgYXJlbid0IHByZXNlbnQgaW4gcERlZmF1bHRcbiAgICAvLyBpZiBhIHBhcmFtIGlzIG5lY2Vzc2FyeSB0byBhIHJvdXRpbmUsIHRoZW4gaXQgc2hvdWxkIGJlIGRlZmluZWQgaW4gcERlZmF1bHRcbiAgICBcbiAgICB2YXIgcmVzID0ge307XG5cbiAgICBwID0gUC5pc09iIChwKSA/IHAgOiB7fTtcbiAgICBcbiAgICBmb3IgKHZhciBrZXkgaW4gcERlZmF1bHQpIHtcblxuICAgICAgICByZXMgW2tleV0gPSBwLmhhc093blByb3BlcnR5IChrZXkpID8gcCBba2V5XSA6IHBEZWZhdWx0IFtrZXldO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG5cbn07IC8vIGVuZCBQLnBDaGVjayBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5pc09iID0gKG9iKSA9PiB7XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIG9iIGlzIGRlZmluZWQsIG5vdCBudWxsLCBub3QgYW4gQXJyYXkgYW5kIG9mIHR5cGUgb2JqZWN0XG4gICAgXG4gICAgdmFyIHJlcyA9IHR5cGVvZiBvYiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgIG9iICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICFBcnJheS5pc0FycmF5IChvYikgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIG9iID09PSAnb2JqZWN0JztcblxuICAgIHJldHVybiByZXM7XG5cbn07IC8vIGVuZCBQLmlzT2IgXG5cblAua2V5MSA9IF8ua2V5MTtcblxuICAgIC8vIGVuZCBQVUJMSUMgc2VjdGlvblxuXG5fLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59KCkpO1xuXG5cblxuIiwiLy8gZ28td3MtY2xpZW50L2luZGV4LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlwLCBwb3J0LCBjbGllbnQsIG9wdGlvbnMpIHtcblxuLy8gUFJJVkFURSBQcm9wZXJ0aWVzL01ldGhvZHNcbnZhciBfID0ge1xuICAgIFxuICAgIGlwOiBpcCxcbiAgICBwb3J0OiBwb3J0LFxuICAgIHNlY3VyZUNvbm5lY3Rpb246IG51bGwsXG4gICAgdmVyYm9zZTogbnVsbCxcblxuICAgIHV0OiByZXF1aXJlICgnZ28tdXRpbCcpLFxuICAgIHBjaGVjazogbnVsbCxcbiAgICBrZXkxOiBudWxsLFxuXG4gICAgd3NTZXJ2ZXI6IG51bGxcblxufTsgLy8gZW5kIFBSSVZBVEUgcHJvcGVydGllc1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5pbml0ID0gKCkgPT4ge1xuXG4gICAgXy5wY2hlY2sgPSBfLnV0LnBDaGVjaztcbiAgICBfLmtleTEgPSBfLnV0LmtleTE7XG5cbiAgICB2YXIgcGFyYW1zID0gXy5wY2hlY2sgKG9wdGlvbnMsIHtzZWN1cmVDb25uZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgdmVyYm9zZTogZmFsc2V9KTtcblxuICAgIF8uc2VjdXJlQ29ubmVjdGlvbiA9IHBhcmFtcy5zZWN1cmVDb25uZWN0aW9uO1xuICAgIF8udmVyYm9zZSA9IHBhcmFtcy52ZXJib3NlO1xuXG4gICAgaWYgKF8udmVyYm9zZSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nICgnd3NDbGllbnQgcGFyYW1zOiAnICsgSlNPTi5zdHJpbmdpZnkgKHBhcmFtcykgKyAnXFxuJyk7XG5cbiAgICB9IC8vIGVuZCBpZiAoXy52ZXJib3NlKVxuICAgIFxuICAgIF8udHN0Q21kcyA9ICB7cGluZzogXy50c3RDbWRQaW5nUmVzcH07XG4gICAgXy5jbGllbnQgPSBjbGllbnQgPyBjbGllbnQgOiBfLnJlcG9ydE1zZ09iO1xuXG4gICAgdmFyIHdzUHJlZml4ID0gXy5zZWN1cmVDb25uZWN0aW9uID8gJ3dzcycgOiAnd3MnO1xuICAgIHZhciB3c1VybCA9IHdzUHJlZml4ICsgJzovLycgKyBfLmlwICsgJzonICsgXy5wb3J0O1xuXG4gICAgXy53c1NlcnZlciA9IG5ldyBXZWJTb2NrZXQgKHdzVXJsKTtcblxuICAgIF8ud3NTZXJ2ZXIub25tZXNzYWdlID0gXy5mcm9tU3J2cjtcbiAgICBfLndzU2VydmVyLm9uY2xvc2UgPSBfLm1zZ0Nsb3NlO1xuICAgIF8ud3NTZXJ2ZXIub25lcnJvciA9IF8ubXNnRXJyb3I7XG5cbn07IC8vIGVuZCBfLmluaXQgXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl8uZG9DbWQgPSAodU1zZ09iKSA9PiB7XG5cbiAgICB2YXIgZnJvbVNydnIgPSBKU09OLnN0cmluZ2lmeSAodU1zZ09iKTtcblxuICAgIGlmIChfLnZlcmJvc2UpIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nICgnICA9PT4gd3NDbGllbnQuZnJvbVNydnI6ICcgKyBmcm9tU3J2cik7XG5cbiAgICB9IC8vIGVuZCBpZiAoXy52ZXJib3NlKVxuICAgIFxuICAgIHVNc2dPYiA9IEFycmF5LmlzQXJyYXkgKHVNc2dPYikgPyB1TXNnT2IgOiBbdU1zZ09iXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdU1zZ09iLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIG1zZ09iID0gdU1zZ09iIFtpXTtcblxuICAgICAgICB2YXIgY21kID0gXy5rZXkxIChtc2dPYik7XG4gICAgXG4gICAgICAgIGlmIChfLnRzdENtZHMuaGFzT3duUHJvcGVydHkgKGNtZCkpIHtcbiAgICBcbiAgICAgICAgICAgIF8udHN0Q21kcyBbY21kXSAobXNnT2IgW2NtZF0pO1xuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgXy5jbGllbnQgKG1zZ09iKTtcbiAgICBcbiAgICAgICAgfSAvLyBlbmQgaWYgKF8udHN0Q21kcy5oYXNPd25Qcm9wZXJ0eSAoY21kKSlcbiAgICBcbiAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IHVNc2dPYi5sZW5ndGg7IGkrKylcblxufTsgLy8gZW5kIF8uZG9DbWQgXG5cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5kb1NlbmQgPSAobXNnKSA9PiB7XG5cbiAgICBpZiAoXy52ZXJib3NlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2cgKCdfLmRvU2VuZC5tc2c6ICcgKyBtc2cgKyAnXFxuJyk7XG5cbiAgICB9IC8vIGVuZCBpZiAoXy52ZXJib3NlKVxuICAgIFxuICAgIF8ud3NTZXJ2ZXIuc2VuZCAobXNnKTtcblxufTsgLy8gZW5kIF8uZG9TZW5kIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmZyb21TcnZyID0gKGV2ZW50KSA9PiB7XG4gICAgXG4gICAgdmFyIG1zZyA9IGV2ZW50LmRhdGE7XG5cbiAgICBpZiAoXy52ZXJib3NlKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyAoJ18uZnJvbVNydnIuZXZlbnQuZGF0YTogJyArIG1zZyk7XG5cbiAgICB9IC8vIGVuZCBpZiAoXy52ZXJib3NlKVxuICAgIFxuICAgIF8uZG9DbWQgKEpTT04ucGFyc2UgKG1zZykubSk7XG5cbn07IC8vIGVuZCBfLmZyb21TcnZyIFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5tc2dDbG9zZSA9IChldmVudCkgPT4ge1xuICAgIFxuICAgIGNvbnNvbGUubG9nICgnY2xvc2UgZXZlbnQ6ICcgKyBldmVudC5kYXRhKTtcblxufTsgLy8gZW5kIF8ubXNnQ2xvc2UgXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl8ubXNnRXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICBcbiAgICB2YXIgZXZlbnRNc2cgPSBldmVudC5kYXRhID8gJyBldmVudC5kYXRhOiAnICsgZXZlbnQuZGF0YSA6IFwiXCI7XG4gICAgXG4gICAgdmFyIGVyck1zZyA9ICd3c0NsaWVudCBtc2dFcnJvciAoU2VydmVyIGlzIERvd24/KScgKyBldmVudE1zZztcbiAgICBjb25zb2xlLmxvZyAoZXJyTXNnKTtcblxuICAgICQoJ2JvZHknKS5wcmVwZW5kIChlcnJNc2cpO1xuXG59OyAvLyBlbmQgXy5tc2dDbG9zZSBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5yZXBvcnRNc2dPYiA9IChtc2dPYikgPT4ge1xuICAgIFxuICAgIGNvbnNvbGUubG9nICgnXy5yZXBvcnRNc2dPYi5tc2dPYjogJyArIG1zZ09iICsgJ1xcbicpO1xuXG59OyAvLyBlbmQgXy5yZXBvcnRNc2dPYiBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy50c3RDbWRQaW5nUmVzcCA9IChwaW5nTXNnKSA9PiB7XG4gICAgXG4gICAgY29uc29sZS5sb2cgKCdwaW5nOiAnICsgcGluZ01zZyk7XG4gICAgcmV0dXJuO1xuXG59OyAvLyBlbmQgXy50c3RDbWRQaW5nUmVzcCBcblxuXy5pbml0ICgpO1xuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIHAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnAudG9TcnZyID0gKG1zZ09iKSA9PiB7XG4gICAgXG4gICAgdmFyIG1zZ09iUyA9IEpTT04uc3RyaW5naWZ5ICh7bTptc2dPYn0pO1xuXG4gICAgaWYgKF8udmVyYm9zZSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nICgncC50b1NydnIubXNnT2JTIDogJyArIG1zZ09iUyArICdcXG4nKTtcblxuICAgIH0gLy8gZW5kIGlmIChfLnZlcmJvc2UpXG4gICAgXG4gICAgXy5kb1NlbmQgKG1zZ09iUyk7XG5cbn07IC8vIGVuZCBfLnRvU3J2ciBcblxuXG5yZXR1cm4gcDtcblxufTtcblxuXG5cbiIsIi8vIHdzQ2xpZW50VHN0LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciB3cyA9IHJlcXVpcmUgKCdnby13cy1jbGllbnQnKTtcbiAgICB2YXIga2V5MSA9IHJlcXVpcmUgKCdnby11dGlsJykua2V5MTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHdzQ2xpZW50ID0gbmV3IHdzICgnbG9jYWxob3N0JywgODAwMCwgKG1zZ09iKSA9PiB7XG4gICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAoJ21zZ09iOiAnICsgSlNPTi5zdHJpbmdpZnkgKG1zZ09iKSArICdcXG4nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNtZCA9IGtleTEgKG1zZ09iKTtcbiAgICAgICAgICAgIHZhciBtc2cgPSBtc2dPYiBbY21kXTtcbiAgICAgICAgXG4gICAgICAgICAgICBzd2l0Y2ggKGNtZCkge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICdyZWFkeSc6XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB3c0NsaWVudC50b1NydnIgKHt0c3RDbWQ6MX0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY2FzZSAnc3J2TXNnJzpcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kIChtc2cpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgICAgIH0gLy8gZW5kIHN3aXRjaCAoY21kKVxuICAgIFxuICAgICAgICB9LCB7dmVyYm9zZTogdHJ1ZX0pO1xuICAgIH0pO1xuXG59KCkpO1xuIiwiLy8ga2V5MS5qc1xuXG4vLyBrZXkxIGV4dHJhY3RzIHRoZSBzaW5nbGUga2V5IGZyb20gYW4gb2JqZWN0IFxuLy8gY29udGFpbmluZyBvbmx5IG9uZSBrZXkvdmFsdWUgcGFpclxuLy8gYW5kIHJldHVybnMgdGhlIHN0cmluZyB2YWx1ZSBmb3IgdGhlIGtleVxuLy8gYW55dGhpbmcgZWxzZSBwYXNzZWQgdG8ga2V5MSByZXR1cm5zIG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGtleTEgPSAob2IpID0+IHtcblxuICAgIGtleSA9IG51bGw7XG5cbiAgICB2YXIgdW5pcXVlS2V5RXhpc3RzID0gdHlwZW9mIG9iICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvYiAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAhQXJyYXkuaXNBcnJheShvYikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9iID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhvYikubGVuZ3RoID09PSAxO1xuICAgIFxuICAgIGlmICh1bmlxdWVLZXlFeGlzdHMpIHtcbiAgICBcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYik7XG4gICAgICAgIGtleSA9IGtleXNbMF07XG4gICAgXG4gICAgfSAvLyBlbmQgaWYgKHVuaXF1ZUtleUV4aXN0cylcbiAgICBcbiAgICByZXR1cm4ga2V5O1xuICAgIFxufTsgLy8gZW5kIGtleTEgXG5cbnJldHVybiBrZXkxO1xuXG59KCkpO1xuIl19
