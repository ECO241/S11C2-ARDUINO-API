const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');

const app = express();
app.use(cors("*"));

// Create a port
const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600,
});

// Create a parser
const parser = new ReadlineParser({ delimiter: '\r\n' });
port.pipe(parser);
// Creating the parser and piping can be shortened to:
// const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

// Write data to the port
parser.write("START\n");
parser.once('data', (data) => {
    console.log('start message:', data.toString());
});

app.get('/', (req, res) => {
    res.json({ message: 'Server running' });
});

app.get('/photo', (req, res) => {    
    // const { message } = req.body;
    // Enviar mensaje serial a Arduino
    port.write("GET_PHOTO_STATUS\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    // Esperar respuesta de Arduino
    parser.once('data', (data) => {
        console.log('Respuesta al mensaje:', data);            
        res.json({ response: data});
    });
});

app.get('/temp', (req, res) => {    
    // const { message } = req.body;
    // Enviar mensaje serial a Arduino
    port.write("GET_TEMP_STATUS\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    // Esperar respuesta de Arduino
    parser.once('data', (data) => {
        console.log('Respuesta al mensaje:', data);            
        res.json({ response: data});
    });
});

app.get('/rgb', (req, res) => {    
    ///const { message } = req.body;
    // Enviar mensaje serial a Arduino
    port.write("SET_RGB\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    port.write("255,0,0\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    // Esperar respuesta de Arduino
    parser.once('data', (data) => {
        console.log('Respuesta al mensaje:', data);            
        res.json({ response: data});
    });
});

app.get('/led', (req, res) => {    
    ///const { message } = req.body;
    // Enviar mensaje serial a Arduino
    port.write("SET_LED_STATUS\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    port.write("ON\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    // Esperar respuesta de Arduino
    parser.once('data', (data) => {
        console.log('Respuesta al mensaje:', data);            
        res.json({ response: data});
    });
});

// detect errors
port.on('error', (err) => {
    console.log('Error: ', err.message);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});