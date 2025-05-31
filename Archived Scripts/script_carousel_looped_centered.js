
// Improved carousel-style spiral with centered highlight and looping

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

// Randomize
imagePaths.sort(() => Math.random() - 0.5);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);  // Center the spiral horizontally
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spiral config
const spiralRadius = 2;
const spiralTurns = 2;
const spacing = 0.5;
const totalSprites = imagePaths.length;

// State
let scrollOffset = 0;
let targetOffset = 0;

// Create sprites
const sprites = imagePaths.map((path) => {
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  scene.add(sprite);
  return sprite;
});

// Scroll wheel
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

  // Smooth scroll
  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  sprites.forEach((sprite, i) => {
    // Get position relative to scroll offset (looped)
    let indexOffset = ((i - scrollOffset + totalSprites + totalSprites / 2) % totalSprites) - totalSprites / 2;

    const angle = indexOffset * (Math.PI * 2) / totalSprites * spiralTurns;
    const y = indexOffset * spacing;

    const taper = 1 - Math.pow((y / (totalSprites * spacing / 2)), 2);
    const x = spiralRadius * taper * Math.cos(angle);
    const z = spiralRadius * taper * Math.sin(angle);

    sprite.position.set(x, y, z);

    if (Math.abs(indexOffset) < 0.3) {
      sprite.scale.set(1.5, 1.5, 1.5);
    } else {
      sprite.scale.set(1, 1, 1);
    }
  });

  renderer.render(scene, camera);
}

animate();
