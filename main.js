var noble = require('noble');
var nopt = require('nopt');

var opts = nopt({
    verbose: Boolean,
    listen: String
}, {
    '-v': '--verbose',
    '-l': '--listen'
});

console.log(opts);

noble.on('stateChange', function (state) {
    console.log('stateChange >>> Device went to ' + state);
    if (state === 'poweredOn') {
        console.log('stateChange >>> Device is powered on, starting scanning...')
        noble.startScanning();
    }
})
.on('discover', function (peripheral) {
    console.log('discover >>> Found device with UUID: ' + peripheral.uuid);
    console.log('discover >>> and local name: ' + peripheral.advertisement.localName);
    console.log('discover >>> advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);

    if (opts.verbose) {
        console.log('discover >>> ' + peripheral);
    }

    if (opts.listen && opts.listen === peripheral.uuid) {

        noble.stopScanning();

        // Bind callback to RSSI update
        console.info('discover >>> Listening for RSSI change');
        peripheral.on('rssiUpdate', function (rssi) {
            console.log('rssiUpdate >>> ' + peripheral.uuid + ' >>> ' + rssi);
        });

        peripheral.connect(function (err) {

            if (err) {
                console.error('connect xxx ' + err);
                return;
            }

            setInterval(function () {
                console.log('rssiUpdate >>> peripheral.updateRssi');
                peripheral.updateRssi();
            }, 1000);
        });

    }
});

