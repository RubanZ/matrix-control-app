const serialport = require('serialport')
const Readline = serialport.parsers.Readline;
const Delimiter = require('@serialport/parser-delimiter')

const serial = {
    device: serialport,
    parser: serialport.parsers.Readline,
    path: "",
    data: "",
    debbug: false,

    connect(value) {
        this.path = value;
        this.device = new serialport(this.path, {
            hupcl: false,
            lock: false,
            baudRate: 115200,
        });
        this.parser = this.device.pipe(new Delimiter({ delimiter: '\n' }));
        this.parser.on('data', this.get);

        if (this.debbug) {
            console.log("connected");
        }
    },
    disconnect() {
        this.device.close();
        this.parser.data = "";
        if (this.debbug) {
            console.log("disconnect");
        }
    },
    list() {
        return new Promise((resolve, reject) => {
            serialport.list().then((ports, err) => {
                if (this.debbug) {
                    console.log(ports, err);
                }
                let error = "";
                if (err) {
                    error = err.message;
                    resolve(ports, error);
                }
                if (ports.length === 0) {
                    error = "Подключите устройство";
                }
                resolve(ports, error);
            });
        });
    },
    get(event) {
        this.data += "\n" + event;
        // console.log(event);
    },
    write(command) {
        this.device.write(command, function (err) {
            if (err) {
                return UIkit.notification({ message: err.message, status: 'danger', pos: 'top-right' });
            }
            UIkit.notification({ message: "Отправленно", status: 'success', pos: 'top-right' });
        });
        if (this.debbug) {
            console.log("send");
        }
    },
    clear(){
        this.parser.data = "";
    }
}