let socket;
let canal = "canal-mouse-horizotal";
let sonido;
let centroX = 200;
let centroY = 200;
let umbral = 40; // distancia para que suene

function preload() {
  sonido = loadSound("sonido.mp3"); // pon tu audio aquí
}

function setup() {
  createCanvas(400, 400);

  socket = io('http://206.189.168.40:3000', { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log("✅ Conectado al servidor con ID:", socket.id);
    socket.emit('join-channel', canal);
  });
}

function draw() {
  background(220);
  text("Acerca el mouse al centro para que suene", 10, 20);

  // Dibujamos el punto central
  fill(255, 0, 0);
  circle(centroX, centroY, 10);

  // Distancia del mouse al centro (simula dedos)
  let d = dist(mouseX, mouseY, centroX, centroY);

  // Si los "dedos" se acercan
  if (d < umbral) {
    if (!sonido.isPlaying()) {
      sonido.play();
    }
  }

  // Envío de datos por socket
  let valor = floor(map(mouseX, 0, width, 0, 180));
  if (mouseX > 0 && mouseX < width) {
    socket.emit('send-value', { channel: canal, value: valor });
  }
}
