
// Seamless tornado spiral with many clones and virtual infinite scroll illusion

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

const NUM_VISIBLE = 100;
const sprites = [];
const textures = imagePaths.map(path => new THREE.TextureLoader().load(path));

// Create a large spiral of sprites
for (let i = 0; i < NUM_VISIBLE; i++) {
  const material = new THREE.SpriteMaterial({ map: textures[i % textures.length] });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  scene.add(sprite);
  sprites.push(sprite);
}

// Smooth scroll interaction
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
  const spiralTurns = 4;
  const radiusBase = 1.8;

  sprites.forEach((sprite, i) => {
    const relativeIndex = i - NUM_VISIBLE / 2;
    const actualIndex = scrollOffset + relativeIndex;
    const y = -relativeIndex * spacingY;

    const radius = radiusBase + 0.6 * Math.tanh(y / 5);
    const angle = actualIndex * (Math.PI * 2) / imagePaths.length * spiralTurns;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle) + easeZ(relativeIndex);

    sprite.position.set(x, y, z);

    const imgIndex = ((Math.round(actualIndex) % imagePaths.length) + imagePaths.length) % imagePaths.length;
    sprite.material.map = textures[imgIndex];

    const scale = 1.0 - Math.abs(relativeIndex) * 0.015;
    sprite.scale.set(scale, scale, scale);

    if (Math.abs(relativeIndex) < 0.3) {
      sprite.scale.set(1.8, 1.8, 1.8);
      sprite.material.color.set(0xffffff);
    } else {
      sprite.material.color.set(0xaaaaaa);
    }
  });

  renderer.render(scene, camera);
}

animate();

// Click to select current center sprite
window.addEventListener('click', () => {
  const selectedIndex = Math.round(scrollOffset) % imagePaths.length;
  const image = imagePaths[((selectedIndex % imagePaths.length) + imagePaths.length) % imagePaths.length];
  console.log("Selected image:", image);
});
