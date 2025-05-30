
// Vertical spiral with depth illusion: central sprite appears in foreground, spiral axis is recessed

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

const sprites = imagePaths.map(path => {
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  scene.add(sprite);
  return sprite;
});

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset = (targetOffset + 1) % sprites.length;
  } else {
    targetOffset = (targetOffset - 1 + sprites.length) % sprites.length;
  }
});

function animate() {
  requestAnimationFrame(animate);
  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  const spacingY = 0.6;
  const spiralTurns = 2;
  const total = sprites.length;
  const spiralDepth = -4; // The depth of the vertical spiral axis

  sprites.forEach((sprite, i) => {
    const relativeIndex = ((i - scrollOffset + total + total / 2) % total) - total / 2;

    const y = -relativeIndex * spacingY;
    const angle = relativeIndex * (Math.PI * 2) / total * spiralTurns;

    const radius = 2.2;

    // Spiral around vertical axis recessed into Z
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle) + spiralDepth;

    // Pull the front-most sprite forward to z = 0
    if (Math.abs(relativeIndex) < 0.3) {
      sprite.position.set(0, 0, 0);
      sprite.scale.set(1.8, 1.8, 1.8);
    } else {
      sprite.position.set(x, y, z);
      sprite.scale.set(1, 1, 1);
    }
  });

  renderer.render(scene, camera);
}
animate();
