
// Centered sprite display with proper async texture loading

const imagePaths = [
  'png/icon1.png', 'png/icon2.png', 'png/icon3.png', 'png/icon4.png',
  'png/icon5.png', 'png/icon6.png', 'png/icon7.png', 'png/icon8.png',
  'png/icon9.png', 'png/icon10.png', 'png/icon11.png', 'png/icon12.png'
];

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let currentIndex = 0;
let sprite = null;
let textures = [];

// Load textures with LoadingManager
const loadingManager = new THREE.LoadingManager(() => {
  displaySprite(currentIndex);
});

const loader = new THREE.TextureLoader(loadingManager);
imagePaths.forEach(path => {
  textures.push(loader.load(path));
});

function displaySprite(index) {
  if (sprite) scene.remove(sprite);
  const material = new THREE.SpriteMaterial({ map: textures[index] });
  material.center.set(0.5, 0.5); // center alignment
  sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 2, 2);
  sprite.position.set(0, 0, 0);
  scene.add(sprite);
}

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    currentIndex = (currentIndex + 1) % textures.length;
  } else {
    currentIndex = (currentIndex - 1 + textures.length) % textures.length;
  }
  displaySprite(currentIndex);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
