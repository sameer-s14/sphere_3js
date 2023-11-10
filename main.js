import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

const scene = new THREE.Scene(); // scene contains all the  objects

const geometry = new THREE.SphereGeometry(3, 64, 64); // shapes

const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
}) // providing color to geometry
const mesh = new THREE.Mesh(geometry, material); // combination of material and geometry
scene.add(mesh); // adding mesh to scene

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Adding light to scene
const light = new THREE.PointLight(0xffffff, 60, 120);
light.position.set(0, 8, 10);
scene.add(light); // adding light to scene

//!(angle of view how mush it show, aspect ratio ,close point , far point)
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 20
scene.add(camera);


// We need canvas tag to render scene
const canvas = document.querySelector('.webgl');


const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera)


// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false // disable zooming
controls.autoRotate = true // enable auto rotation
controls.autoRotateSpeed = 5

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
    // mesh.position.x += 0.1
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()


// Timeline 
const t1 = gsap.timeline({
    defaults: {
        duration: 1
    }
})

t1.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })

// mouse animation
let mouseDown = false;
let rgb = []
window.addEventListener('mousedown', () => mouseDown = true)
window.addEventListener('mouseup', () => mouseDown = false);

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ]
        // lets animate
        const newColor = new THREE.Color(`rgb(${rgb.join(',')})`);

        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
})