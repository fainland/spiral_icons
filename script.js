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
  'png/icon21.png',
 ];

// Randomize order
imagePaths.sort(() => Math.random() - 0.5);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiralCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Spiral parameters
const spiralRadius = 2;
const spiralTurns = 2;
const spacing = 0.5;

imagePaths.forEach((path, i) => {
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  const angle = i * (Math.PI * 2) / imagePaths.length * spiralTurns;
   const y = (i - imagePaths.length / 2) * spacing;
// Taper factor based on vertical position (y)
// Produces a narrower spiral at top and bottom
const taper = 1 - Math.pow((y / (imagePaths.length * spacing / 2)), 2);

const x = spiralRadius * taper * Math.cos(angle);
const z = spiralRadius * taper * Math.sin(angle);

  

  sprite.position.set(x, y, z);
  sprite.scale.set(1, 1, 1); // Uniform size
  scene.add(sprite);
});

// Rotate scene on mouse wheel
let rotationY = 0;
window.addEventListener('wheel', (e) => {
  rotationY += e.deltaY * 0.001;
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y = rotationY;
  renderer.render(scene, camera);

let closestSprite = null;
let closestZ = Infinity;

// Reset all icons to default scale
scene.children.forEach(sprite => {
  sprite.scale.set(1, 1, 1); // default
});

// Find the sprite closest to center (camera.z = 5)
scene.children.forEach(sprite => {
  const spriteZ = sprite.getWorldPosition(new THREE.Vector3()).z;
  const distanceToCenter = Math.abs(camera.position.z - spriteZ);
  if (distanceToCenter < closestZ) {
    closestZ = distanceToCenter;
    closestSprite = sprite;
  }
});

// Enlarge and brighten the closest one
if (closestSprite) {
  closestSprite.scale.set(1.5, 1.5, 1.5); // visually distinct
}


}
animate();
