
// Carousel-style spiral icon layout

const imagePaths = [
  'png/icon1.png',
  'png/icon2.png',
  'png/icon3.png',
  'png/icon4.png',
  'png/icon5.png',
  'png/icon6.png',
  'png/icon7.png',
  'png/icon8.png',
  'png/icon9.png',
  'png/icon10.png',
  'png/icon11.png',
  'png/icon12.png', 
  'png/icon13.png',
  'png/icon14.png',
  'png/icon15.png',
  'png/icon16.png',
  'png/icon17.png',
  'png/icon18.png', 
  'png/icon19.png',
  'png/icon20.png',
  'png/icon21.png'

];

// Sort randomly
imagePaths.sort(() => Math.random() - 0.5);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Spiral shape config
const spiralRadius = 2;
const spiralTurns = 2;
const spacing = 0.5;

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

// Scroll wheel changes target offset
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetOffset = Math.min(targetOffset + 1, imagePaths.length - 1);
  } else {
    targetOffset = Math.max(targetOffset - 1, 0);
  }
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Smooth scroll offset
  scrollOffset += (targetOffset - scrollOffset) * 0.1;

  sprites.forEach((sprite, i) => {
    const indexOffset = i - scrollOffset;

    // Position along spiral
    const angle = indexOffset * (Math.PI * 2) / imagePaths.length * spiralTurns;
    const y = indexOffset * spacing;

    const taper = 1 - Math.pow((y / (imagePaths.length * spacing / 2)), 2);
    const x = spiralRadius * taper * Math.cos(angle);
    const z = spiralRadius * taper * Math.sin(angle);

    sprite.position.set(x, y, z);

    // Highlight center sprite (closest to scrollOffset)
    if (Math.abs(indexOffset) < 0.3) {
      sprite.scale.set(1.5, 1.5, 1.5);
    } else {
      sprite.scale.set(1, 1, 1);
    }
  });

  renderer.render(scene, camera);
}

animate();
