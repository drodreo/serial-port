const SerialPort = require('serialport');

function showUsage() {
    process.stdout.write('USAGE: node index.js <device> <baud_rate> <data_bits?> <stop_bits?> <parity?> <flow_control?>');
}

const arguments = process.argv.splice(2);
const device = arguments[0];
const baud_rate = arguments[1];
let data_bits = arguments[2];
let stop_bits = arguments[3];
let parity = arguments[4];
let flow_control = arguments[5];

if (arguments.length < 2 || !!!device || !!!baud_rate) { showUsage(); return ; }
if (!!!data_bits) { data_bits = 8; }
if (!!!stop_bits) { stop_bits = 8; }
if (!!!parity) { parity = null; }
if (!!!flow_control) { flow_control = null; }

process.stdout.write('Port is initializing ....');

/**
 * 构造一个串口连接，构造函数支持的参数列表参考 {@link SerialPort}
 * 串口参数数据结构参考 {@link SerialPort.OpenOptions}
 * 
 * 下面是示例代码：
 *  const uart = new SerialPort(device, {
 *      autoOpen: true,
 *      baudRate: 9600,
 *      dataBits: 8,
 *      highWaterMark: number,
 *      lock: false,
 *      stopBits: 1,
 *      parity: 'none',
 *      rtscts: false,
 *      xon: false,
 *      xoff: false,
 *      xany: false,
 *      binding: BaseBinding,
 *      bindingOptions: {
 *          vmin: 0,
 *          vtime: 0
 *      }
 *  }
 */
const uart = new SerialPort(device, {
    baudRate: 9600
    // dataBits: 8,
    // lock: false,
    // stopBits: 1,
    // parity: 'none'
});

// 串口打开时会发起 open 回调，可以在 open 内执行串口开启后需要立即执行的操作
uart.on('open', (err) => {
    if (err) { return console.log('FAILED TO OPEN DEVICE! PLEASE TRY TO RESTART PROGRAM!'); }
    process.stdout.write('Device is connected, wait for command ...');
});
// 串口收到数据后会发起 readable 回调
uart.on('readable', () => {
    process.stdout.write('Receive data:', uart.read());
});
//
uart.on('data', (data) => {
    process.stdout.write('Receive data:', data);
});

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        uart.write(chunk, err => {
            if (err) { process.stdout.write(`Failed to send data: ${chunk}`); }
            process.stdout.write(`Sending data: ${chunk}`);
        });
    }
});

