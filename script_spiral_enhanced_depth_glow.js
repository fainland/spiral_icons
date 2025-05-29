
// Enhanced carousel spiral with depth, glow, and variable spacing

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

// Randomize
imagePaths.sort(() => Math.random() - 0.5);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spiral parameters
const spiralRadius = 3;
const spiralTurns = 2;
const baseSpacing = 0.3;
const totalSprites = imagePaths.length;

let scrollOffset = 0;
let targetOffset = 0;

// Load and create sprites
const sprites = imagePaths.map(path => {
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  scene.add(sprite);
  return sprite;
});

// Scroll interaction
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset = (targetOffset + 1) % totalSprites;
  } else {
    targetOffset = (targetOffset - 1 + totalSprites) % totalSprites;
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  sprites.forEach((sprite, i) => {
    let relativeIndex = ((i - scrollOffset + totalSprites + totalSprites / 2) % totalSprites) - totalSprites / 2;

    const distanceFactor = Math.abs(relativeIndex);
    const dynamicSpacing = baseSpacing + 0.07 * distanceFactor;
    const y = -relativeIndex * dynamicSpacing;
    const xSpread = 0.6 + 0.2 * distanceFactor;
    const x = spiralRadius * xSpread * Math.cos(relativeIndex * 0.5);
    const z = spiralRadius * xSpread * Math.sin(relativeIndex * 0.5) - 4;

    sprite.position.set(x, y, z);

    if (Math.abs(relativeIndex) < 0.3) {
      sprite.scale.set(2.2, 2.2, 2.2);
      sprite.material.opacity = 1.0;
      sprite.material.color.set(0xffffff);
    } else {
      const scale = 1.0 - 0.02 * distanceFactor;
      sprite.scale.set(scale, scale, scale);
      sprite.material.opacity = 0.7;
      sprite.material.color.set(0xaaaaaa);
    }
  });

  renderer.render(scene, camera);
}

animate();
