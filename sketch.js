let socket;
let canal = "canal8";

let handPose;
let video;
let hands = [];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  socket = io("http://206.189.168.40:3000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Emisor conectado:", socket.id);
    socket.emit("join-channel", canal);
  });
}

function draw() {
  image(video, 0, 0, width, height);

  if (hands.length >= 2) {
    let p1 = hands[0].middle_finger_mcp;
    let p2 = hands[1].middle_finger_mcp;

    let energy = dist(p1.x, p1.y, p2.x, p2.y);
    energy = constrain(energy, 50, 420);

    let freq = map(energy, 50, 420, 120, 3000);
    let vol  = map(energy, 50, 420, 0.05, 0.6);

    // 👇 USAMOS EL EVENTO QUE TU SERVIDOR YA MANEJA
    socket.emit("send-value", {
      channel: canal,
      value: {
        freq: freq,
        vol: vol
      }
    });
  }
}

function gotHands(results) {
  hands = results;
}