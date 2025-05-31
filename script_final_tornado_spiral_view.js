
// Tornado spiral with vertical compression and progressive sprite scaling/spacing

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

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

const NUM_SPRITES = 120;
const Y_RANGE = 12; // smaller range for more vertical compression
const sprites = [];
const textures = imagePaths.map(path => new THREE.TextureLoader().load(path));

// Shape profile with more compression at the bottom and more spacing + scale at the top
const spiralPositions = [];
for (let i = 0; i < NUM_SPRITES; i++) {
  const t = i / (NUM_SPRITES - 1); // 0 to 1
  const easedT = Math.pow(t, 1.5); // more tightly packed lower part

  const y = Y_RANGE * (0.5 - easedT); // compressed vertical layout

  const radius = 1.0 + 3.2 * Math.exp(-Math.pow((t - 0.4) / 0.25, 2)); // large bulge around center

  const turns = 5;
  const angle = t * Math.PI * 2 * turns;

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle) - 2;

  spiralPositions.push({ x, y, z });
}

// Create sprite objects
for (let i = 0; i < NUM_SPRITES; i++) {
  const material = new THREE.SpriteMaterial({ map: textures[i % textures.length] });
  const sprite = new THREE.Sprite(material);
  scene.add(sprite);
  sprites.push(sprite);
}

// Scroll wheel interaction
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset += 1;
  } else {
    targetOffset -= 1;
  }
});

// Animate spiral position and scaling
function animate() {
  requestAnimationFrame(animate);
  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  for (let i = 0; i < NUM_SPRITES; i++) {
    const relativeIndex = i - NUM_SPRITES / 2;
    const virtualIndex = scrollOffset + relativeIndex;

    const texIndex = ((Math.round(virtualIndex) % textures.length) + textures.length) % textures.length;
    sprites[i].material.map = textures[texIndex];

    const pos = spiralPositions[i];
    sprites[i].position.set(pos.x, pos.y, pos.z);

    const t = i / (NUM_SPRITES - 1);
    const scaleBase = 0.7 + 1.5 * Math.pow(t, 2); // gradually increase sprite size from bottom to top
    const scale = scaleBase - Math.abs(relativeIndex) * 0.01;
    sprites[i].scale.set(scale, scale, scale);

    if (Math.abs(relativeIndex) < 0.3) {
      sprites[i].scale.set(scale * 1.4, scale * 1.4, scale * 1.4);
      sprites[i].material.color.set(0xffffff);
    } else {
      sprites[i].material.color.set(0x888888);
    }
  }

  renderer.render(scene, camera);
}
animate();

// Log selection on click
window.addEventListener('click', () => {
  const selectedIndex = Math.round(scrollOffset) % imagePaths.length;
  const image = imagePaths[((selectedIndex % imagePaths.length) + imagePaths.length) % imagePaths.length];
  console.log("Selected image:", image);
});
