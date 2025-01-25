var scene, camera, renderer, controls;
colors = [
  [0xD563FF,0x9B5AE8,0x639AFF,0x9B5AE8,0x639AFF,0x5A67E8],
  [0xFF0000,0xEB7236,0xFF250D,0xFFE930,0xFF250D,0xEB7236],
  [0x5EC5FF,0x1FBEFF,0x2C53FF,0xA1FF3B,0x1FBEFF,0xA1FF3B],
  [0xFF380D,0xFF0061,0xE80CCE,0xCC0DFF,0xFF0061,0xE80CCE]
];
col = 1; // Color Palette
planeX = 300;
planeY = 2000;
planeZ = 70;
xNoiseScale = 70;
yNoiseScale = 200;
zNoiseScale = 50;
noiseSpeed = 0.00015;
cameraSpeed = 1;
colI = 2; // Light Intensity
colD = 500; // Light Distance
obj = [];

window.onresize = function(){
  var w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize( w, h );
}

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.y = -planeY/2;
camera.position.z = planeZ/2;
camera.lookAt(0,0,planeZ);

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor("#000000");
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var starsGeometry = new THREE.Geometry();
for(i=0; i<3000; i++){
	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread(3000);
	star.y = THREE.Math.randFloatSpread(3000);
	star.z = THREE.Math.randFloatSpread(3000);
	starsGeometry.vertices.push(star);
}
var starsMaterial = new THREE.PointsMaterial({color: 0xFFFFFF});
var starField = new THREE.Points(starsGeometry,starsMaterial);
scene.add(starField);

mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
geo = new THREE.PlaneBufferGeometry(planeX,planeY,planeX/2,planeY/2);
planeT = new THREE.Mesh(geo, mat);
planeB = new THREE.Mesh(geo, mat);
scene.add(planeT);
scene.add(planeB);
planeB.position.z = planeZ;

ambientLight = new THREE.AmbientLight("#333"),
scene.add(ambientLight);
var light = new THREE.PointLight(colors[col][0], colI, colD);
light.position.set(0,planeY/2,planeZ/2);
scene.add(light);
var light = new THREE.PointLight(colors[col][1], colI, colD);
light.position.set(0,-planeY/2,planeZ/2);
scene.add(light);
var light = new THREE.PointLight(colors[col][2], colI, colD);
light.position.set(0,planeY/4,planeZ/2);
scene.add(light);
var light = new THREE.PointLight(colors[col][3], colI, colD);
light.position.set(0,-planeY/4,planeZ/2);
scene.add(light);
var light = new THREE.PointLight(colors[col][4], colI, colD);
light.position.set(0,-planeY/8,planeZ/2);
scene.add(light);
var light = new THREE.PointLight(colors[col][5], colI, colD);
light.position.set(0,planeY/8,planeZ/2);
scene.add(light);

function animate() {
  gpT = planeT.geometry.attributes.position;
  gpB = planeB.geometry.attributes.position;
  nt = Date.now() * noiseSpeed;
  for (i=0; i<gpT.array.length; i+=3) {
    gpT.array[i+2] = noise.perlin3(gpT.array[i]/xNoiseScale, gpT.array[i+1]/yNoiseScale, nt)*zNoiseScale;
    gpB.array[i+2] = noise.perlin3(gpB.array[i]/xNoiseScale, gpB.array[i+1]/yNoiseScale, nt)*zNoiseScale;
  }
  gpT.needsUpdate = true;
  gpB.needsUpdate = true;
  
  camera.position.y>planeY/2?
    camera.position.y=-planeY/2:
    camera.position.y+=cameraSpeed;
}

var render = function () {
  requestAnimationFrame( render );
  renderer.render(scene, camera);
  animate();
};
render();