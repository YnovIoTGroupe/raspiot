//Serial
var serialport = require("serialport");
//IotHub
var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var ConnectionString = require('azure-iot-device').ConnectionString;
var Message = require('azure-iot-device').Message;
//Azure PARAMS
var AzureConnectionString = '';
var client = Client.fromConnectionString(AzureConnectionString, Protocol);

client.open(function (err, result) {
    if (err) {
        printErrorFor('open')(err);
    } else {
        //READING MESSAGES FROM MASTER
        client.on('message', function (msg) {
            console.log('receive data: ' + msg.getData());
            var message = "" + msg.getData() + ""
            //TODO message reçut d'IOTHub
            if (message.indexOf('XXXXXXX' != -1)) {

            }
            client.complete(msg, printResultFor('completed'));
        });
        client.on('event', function (msg) {
            console.log(msg);
        });
        //ERRORS
        client.on('error', function (err) {
            printErrorFor('client')(err);
            client.close();
        });
    }
});


var sp = new serialport("/dev/ttyACM0", { parser: serialport.parsers.readline("\n") });
sp.on("data", function (data) {
    //Todo logique data
    client.sendEvent(new Message(data), printErrorFor('send event'));
});



// Helper function to print results for an operation
function printErrorFor(op) {
    return function printError(err) {
        if (err) console.log(op + ' error: ' + err.toString());
    };
}
// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

