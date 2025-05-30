
// Minimal working example: match spiral behavior with a single visible sprite

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load one texture exactly as in spiral script
const texture = new THREE.TextureLoader().load('png/icon1.png');
const material = new THREE.SpriteMaterial({ map: texture });
const sprite = new THREE.Sprite(material);

sprite.scale.set(1.5, 1.5, 1.5);
sprite.position.set(0, 0, 0);
scene.add(sprite);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
