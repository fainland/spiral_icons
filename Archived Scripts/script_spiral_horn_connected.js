
// Horn-shaped spiral where the central sprite is part of the spiral path

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

imagePaths.sort(() => Math.random() - 0.5);

const scene = new THREE.Scene();

// Tilt camera downward, looking into the spiral
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);
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

  const baseSpacing = 0.5;
  const spiralTurns = 2;

  sprites.forEach((sprite, i) => {
    const total = sprites.length;
    let relativeIndex = ((i - scrollOffset + total + total / 2) % total) - total / 2;

    // Use center-aligned spiral with real perspective and Z-depth
    const y = -relativeIndex * baseSpacing;

    // Horn taper curve
    const hornFactor = 1.5 - 1.0 * Math.tanh(y / 4); // wider at top, narrow at bottom
    const angle = relativeIndex * (Math.PI * 2) / total * spiralTurns;
    const radius = hornFactor * 2.5;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle) - 2;

    // True center is part of spiral
    sprite.position.set(x, y, z);

    // Optional: scale at center
    if (Math.abs(relativeIndex) < 0.3) {
      sprite.scale.set(1.8, 1.8, 1.8);
    } else {
      sprite.scale.set(1, 1, 1);
    }
  });

  renderer.render(scene, camera);
}
animate();
