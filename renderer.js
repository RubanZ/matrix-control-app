// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// const SerialPort = require('serialport');
//     const Readline = require('@serialport/parser-readline');

// 	const writeDelay = 2000; // reducing this value stops it working
// 	const path = 'COM3';
// 	const port = new SerialPort(path, {
// 		lock: false,
// 		baudRate: 115200,
// 	});

// 	port.on('open', () => {
// 		setTimeout(function () {
// 			console.log('sending: info');
// 			port.write('info');
// 		}, writeDelay);
// 	});

// 	const parser = new Readline({ delimiter: '\r\n' });

// 	port.pipe(parser);

// 	parser.on('data', function (data) {
// 		console.log('from arduino:', data);
// 	});


const serialport = require('serialport')
let l_device;

function connect(device) {
  const Readline = serialport.parsers.Readline;

  //initialize serialport with 115200 baudrate.
  l_device = new serialport(device, {
    lock: false,
    baudRate: 115200,
  });

  //parse incoming data line-by-line from serial port.
  const parser = l_device.pipe(new Readline({ delimiter: '\r\n' }));
  parser.on('data', getData);
}

function disconnect() {
  l_device.close();
}

function getData(event) {
  // UIkit.notification({ message: event, status: 'success', pos: 'top-right' });
  console.log(event);
  // Vue.prototype.$log += "\n" + event;
  // let textarea = document.getElementById("incomingData");
  // textarea.value += "\n" + event;
  // textarea.scrollTop = textarea.scrollHeight;
}

function sendData() {
  let command = document.getElementById("inputCommand");
  l_device.write(command.value, function (err) {
    if (err) {
      return UIkit.notification({ message: err.message, status: 'danger', pos: 'top-right' });
    }
    UIkit.notification({ message: "Отправленно", status: 'success', pos: 'top-right' });
  });
  // device.flush()
  command.value = "";
}





