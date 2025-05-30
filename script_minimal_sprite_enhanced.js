
// Minimal test: Display one hardcoded PNG with visual enhancement (glow simulation)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load one test texture
const loader = new THREE.TextureLoader();
loader.load('png/icon1.png', function(texture) {
  const material = new THREE.SpriteMaterial({ map: texture });
  material.center.set(0.5, 0.5); // center alignment
  material.opacity = 1.0;
  material.color.set(0xffffff); // bright white to simulate glow
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 2, 2);
  sprite.position.set(0, 0, 0);
  scene.add(sprite);
}, undefined, function(error) {
  console.error('Texture loading failed:', error);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
