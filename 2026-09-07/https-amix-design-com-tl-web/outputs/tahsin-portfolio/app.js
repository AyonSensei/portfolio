import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const gateway = document.querySelector('#gateway');
const enter = document.querySelector('#enterButton');
const site = document.querySelector('#site');
const resume = document.querySelector('#resumeDialog');

enter.addEventListener('click', () => {
  document.body.classList.add('entered');
  site.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => gateway.remove(), 1650);
});
document.querySelector('#resumeTrigger').addEventListener('click', () => resume.showModal());
document.querySelector('#closeResume').addEventListener('click', () => resume.close());
resume.addEventListener('click', e => { if (e.target === resume) resume.close(); });

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#world'), antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 2.3, 8.5);
const root = new THREE.Group(); scene.add(root);

const grid = new THREE.GridHelper(46, 46, 0x273d91, 0x172052);
grid.position.y = -2.3; root.add(grid);
const stars = new THREE.BufferGeometry();
const count = 780, positions = new Float32Array(count * 3);
for(let i=0;i<count;i++){const r=6+Math.random()*24,a=Math.random()*Math.PI*2;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=(Math.random()-.32)*13;positions[i*3+2]=Math.sin(a)*r-7;}
stars.setAttribute('position',new THREE.BufferAttribute(positions,3));
root.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0x90c8ff,size:.026,transparent:true,opacity:.8})));
const ringGeo = new THREE.TorusGeometry(2.8,.012,4,128);
for(let i=0;i<3;i++){const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:i===1?0x7a65ff:0x50d7ff,transparent:true,opacity:.22}));ring.rotation.set(i*.9,i*.5,i*.2);ring.position.set(i-1,1,-3-i*1.4);ring.scale.setScalar(1+i*.42);root.add(ring);}
const loader = new THREE.TextureLoader();
function kiosk(image, title, x, z, color) {
  const group = new THREE.Group();
  group.position.set(x, .2, z);
  group.rotation.y = x > 0 ? -.13 : .13;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.35, 2.05), new THREE.MeshBasicMaterial({map: loader.load(image), transparent: true, opacity: .83}));
  screen.position.z = .04; group.add(screen);
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.65, 2.35, .14)), new THREE.LineBasicMaterial({color, transparent:true, opacity:.92}));
  group.add(frame);
  const mast = new THREE.Mesh(new THREE.BoxGeometry(.045, 3.9, .045), new THREE.MeshBasicMaterial({color}));
  mast.position.set(-1.82, -1.15, 0); group.add(mast);
  const label = document.createElement('canvas'); label.width=1024; label.height=128;
  const ctx = label.getContext('2d'); ctx.fillStyle='#dff4ff';ctx.font='bold 48px monospace';ctx.fillText(title,28,76);
  const labelTexture = new THREE.CanvasTexture(label);
  const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2,.4),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true}));
  labelMesh.position.set(0,1.58,.08); group.add(labelMesh);
  root.add(group);
}
kiosk('assets/gojo-domain.png', 'PLAYER PROFILE', -3.6, -4, 0x77dfff);
kiosk('assets/frontier-of-ash.png', 'OPEN WORLD', 3.3, -13, 0x826dff);
kiosk('assets/the-quiet-wing.png', 'STORY SYSTEMS', -3.4, -22, 0xff638a);
kiosk('assets/frontier-of-ash.png', 'NEXT MISSION', 3.3, -31, 0x77dfff);
let mouseX=0,mouseY=0; addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
let scrollProgress = 0;
addEventListener('scroll',()=>{const limit=Math.max(1,document.documentElement.scrollHeight-innerHeight);scrollProgress=scrollY/limit},{passive:true});
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function animate(t){requestAnimationFrame(animate);const targetZ=8.5-scrollProgress*42;camera.position.z+=((targetZ-camera.position.z)*.055);camera.position.x+=(mouseX*.7-camera.position.x)*.035;camera.position.y+=(2.3+mouseY*.35-camera.position.y)*.035;root.rotation.y=mouseX*.045;root.rotation.x=mouseY*.018;grid.position.z=(t*.0015)%1;renderer.render(scene,camera)}animate(0);

const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
