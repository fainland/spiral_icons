
// Refined tornado spiral with non-uniform radius and vertical spacing

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

const NUM_SPRITES = 100;
const Y_RANGE = 25;
const sprites = [];
const textures = imagePaths.map(path => new THREE.TextureLoader().load(path));

// Precompute fixed spiral positions with nonlinear spacing and radius
const spiralPositions = [];
for (let i = 0; i < NUM_SPRITES; i++) {
  const t = i / (NUM_SPRITES - 1); // 0 to 1
  const y = Y_RANGE * (0.5 - Math.pow(t, 1.4)); // nonlinear vertical spread

  const radius = 1.0 + 2.5 * t; // grows from 1.0 to 3.5
  const turns = 4;
  const angle = t * Math.PI * 2 * turns;

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle) - 2;

  spiralPositions.push({ x, y, z });
}

// Create sprites
for (let i = 0; i < NUM_SPRITES; i++) {
  const material = new THREE.SpriteMaterial({ map: textures[i % textures.length] });
  const sprite = new THREE.Sprite(material);
  scene.add(sprite);
  sprites.push(sprite);
}

// Scroll input
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset += 1;
  } else {
    targetOffset -= 1;
  }
});

// Animate and map content to spiral
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

    const scale = 1.0 - Math.abs(relativeIndex) * 0.015;
    sprites[i].scale.set(scale, scale, scale);

    if (Math.abs(relativeIndex) < 0.3) {
      sprites[i].scale.set(1.8, 1.8, 1.8);
      sprites[i].material.color.set(0xffffff);
    } else {
      sprites[i].material.color.set(0xaaaaaa);
    }
  }

  renderer.render(scene, camera);
}
animate();

// Log selection
window.addEventListener('click', () => {
  const selectedIndex = Math.round(scrollOffset) % imagePaths.length;
  const image = imagePaths[((selectedIndex % imagePaths.length) + imagePaths.length) % imagePaths.length];
  console.log("Selected image:", image);
});
