// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Persistent Hover Summary
const profileTrigger = document.getElementById('profile-trigger');
if (profileTrigger) {
    profileTrigger.addEventListener('mouseenter', () => {
        profileTrigger.classList.add('sticky-summary');
    }, { once: true });
}

// 2. Scroll Reveal Animations
// Hide sections initially via JS so they don't stay hidden if JS fails
gsap.set(".section", { opacity: 0, y: 50 });

const revealSections = document.querySelectorAll('.section');
revealSections.forEach((section) => {
    gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

// Staggered reveal for Project & Achievement cards
gsap.from(".proj-reveal, .ach-reveal", {
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: "#projects",
        start: "top 80%"
    }
});

// 3. 3D Background Engine (Three.js)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const starGeo = new THREE.BufferGeometry();
const starCount = 5000;
const posArray = new Float32Array(starCount * 3);
for(let i=0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.03, color: 0x3b82f6 }));
scene.add(stars);

const shape = new THREE.Mesh(
    new THREE.IcosahedronGeometry(15, 1),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.1 })
);
scene.add(shape);
scene.add(new THREE.PointLight(0xffffff, 1), new THREE.AmbientLight(0xffffff, 0.4));
camera.position.z = 50;

function animate() {
    requestAnimationFrame(animate);
    shape.rotation.y += 0.001;
    stars.rotation.y += 0.0004;
    renderer.render(scene, camera);
}
animate();

// Parallax Effect
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    gsap.to(camera.position, { x: x * 10, y: -y * 10, duration: 2 });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Refresh ScrollTrigger after everything loads
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});