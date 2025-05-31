
// Tornado-shaped spiral with central highlight and seamless infinite scroll effect

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

imagePaths.sort(() => Math.random() - 0.5);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let scrollOffset = 0;
let targetOffset = 0;
const sprites = [];

imagePaths.forEach((path, i) => {
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.name = "sprite_" + i;
  sprite.scale.set(1, 1, 1);
  scene.add(sprite);
  sprites.push(sprite);
});

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset += 1;
  } else {
    targetOffset -= 1;
  }
});

function easeZ(index) {
  return -4 + 4 / (1 + Math.exp(-0.6 * index));
}

function animate() {
  requestAnimationFrame(animate);
  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  const spacingY = 0.6;
  const spiralTurns = 3;
  const total = sprites.length;

  sprites.forEach((sprite, i) => {
    const trueIndex = i;
    const relativeIndex = trueIndex - scrollOffset;

    const y = -relativeIndex * spacingY;

    // Tornado radius: tighter at bottom, wider at top
    const radius = 1.5 + 0.6 * Math.tanh(y / 5);

    const angle = relativeIndex * (Math.PI * 2) / total * spiralTurns;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle) + easeZ(relativeIndex);

    sprite.position.set(x, y, z);

    // Highlight and scale the central sprite
    if (Math.abs(relativeIndex) < 0.3) {
      sprite.scale.set(1.8, 1.8, 1.8);
      sprite.material.color.set(0xffffff);
    } else {
      const scale = 1.0 - Math.abs(relativeIndex) * 0.03;
      sprite.scale.set(scale, scale, scale);
      sprite.material.color.set(0xaaaaaa);
    }
  });

  renderer.render(scene, camera);
}

animate();

// Add interactivity to select the central sprite
window.addEventListener('click', () => {
  const selectedIndex = Math.round(scrollOffset) % sprites.length;
  const sprite = sprites[((selectedIndex % sprites.length) + sprites.length) % sprites.length];
  console.log("Selected:", sprite.name);
});
