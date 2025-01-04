let names = [],
  colors = [],
  sliceDeg,
  speed = 0,
  slowDownRand = 0,
  ctx,
  width,
  center,
  deg,
  isStopped = false,
  lock = false,
  winner,
  namesContainer = document.getElementById("names");

let shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

let checkTextArea = () => {
  names = namesContainer.value
    .replace(/\n/g, ",") // convert line breaks to commas
    .replace(/,\s*$/, "") // remove last comma
    .split(",")
    .map(function (item) {
      return item.trim();
    });
  document.getElementById("counter").innerText = names.length + " names";
  sliceDeg = 360 / names.length;
};

let fillColors = () => {
  let color;
  while (colors.length < names.length) {
    do {
      color = Math.floor(Math.random() * 16777215);
    } while (colors.indexOf(color) >= 0);
    colors.push("#" + ("000000" + color.toString(16)).slice(-6));
  }
};

let rand = (min, max) => {
  return Math.random() * (max - min) + min;
};
deg = rand(0, 360);

let deg2rad = (deg) => {
  return (deg * Math.PI) / 180;
};

let drawSlice = (deg, color) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(center, center);
  ctx.arc(center, center, width / 2, deg2rad(deg), deg2rad(deg + sliceDeg));
  ctx.lineTo(center, center);
  ctx.fill();
};

let drawText = (deg, text) => {
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(deg2rad(deg));
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px 'Open Sans', sans-serif";
  ctx.fillText(text, center - 20, center / (names.length * 2));
  ctx.restore();
};

let drawImg = () => {
  width =
    (names.length + 2) * 30 > 300 ? (names.length + 2) * 30 : 300;
  canvas = document.createElement("canvas");
  document.getElementById("wheel").innerHTML = "";
  document.getElementById("wheel").appendChild(canvas);
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = width;
  center = width / 2;
  fillColors();
  ctx.clearRect(0, 0, width, width);
  for (let i = 0; i < names.length; i++) {
    drawSlice(deg, colors[i]);
    drawText(deg + sliceDeg / 2, names[i]);
    deg += sliceDeg;
  }
};

let spinWheel = () => {
  deg += speed;
  deg %= 360;

  // Increment speed
  if (!isStopped && speed < 3) {
    speed = speed + 1 * 0.1;
  }
  // Decrement Speed
  if (isStopped) {
    if (!lock) {
      lock = true;
      slowDownRand = rand(0.2, 0.9);
    }
    speed = speed > 0.2 ? (speed *= slowDownRand) : 0;
  }
  // if stopped
  if (lock && !speed) {
    let ai = Math.floor(((360 - deg - 90) % 360) / sliceDeg);
    ai = (names.length + ai) % names.length; // Fixing any negative index
    winner = ai;
    return alert("You got:\n" + names[ai]);
  }
  drawImg();
  window.requestAnimationFrame(spinWheel);
};

let reset = () => {
  shuffle(names);
  sliceDeg = 360 / names.length;
  drawImg();
};

document.getElementById("spin").addEventListener(
  "mousedown",
  () => {
    spinWheel();
    setTimeout(function () {
      isStopped = true;
    }, 1900);

    setTimeout(function () {
      speed = 0;
      slowDownRand = 0;
      isStopped = false;
      lock = false;
    }, 3000);
  },
  false
);

namesContainer.addEventListener(
  "input",
  () => {
    checkTextArea();
    reset();
  },
  false
);

document.getElementById("remove").addEventListener(
  "mousedown",
  () => {
    names.splice(winner, 1);
    reset();
  },
  false
);

checkTextArea();
drawImg();


const funs = new Funs();
funs.signature();
