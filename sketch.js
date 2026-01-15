let socket;
let canal = "canal8";

function setup() {
  createCanvas(400, 400);

  socket = io('http://206.189.168.40:3000', {
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log("✅ Emisor conectado:", socket.id);
    socket.emit('join-channel', canal);
  });
}

function draw() {
  background(220);
  text("Mueve el mouse horizontalmente", 10, 20);

  let valor = floor(map(mouseX, 0, width, 0, 180));

  if (mouseX > 0 && mouseX < width) {
    socket.emit('send-value', {
      channel: canal,
      value: valor
    });
  }

  // visual
  ellipse(mouseX, height / 2, 20);
}