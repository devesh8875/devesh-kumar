'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle creation (Software Icons)
    const particleCount = 75; // Reduced slightly since icons are bigger than tiny dots
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    const sprites: THREE.Sprite[] = [];
    const velocities: { x: number, y: number, z: number }[] = [];
    
    const iconUrls = [
      '/icons/figma-original.svg',
      '/icons/photoshop-plain.svg',
      '/icons/illustrator-plain.svg',
      '/icons/premierepro-plain.svg',
      '/icons/aftereffects-plain.svg',
    ];

    const materials = iconUrls.map(() => new THREE.SpriteMaterial({ transparent: true, opacity: 0.85 }));

    iconUrls.forEach((url, index) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 256, 256);
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          materials[index].map = texture;
          materials[index].needsUpdate = true;
        }
      };
    });

    for (let i = 0; i < particleCount; i++) {
      const material = materials[i % materials.length];
      const sprite = new THREE.Sprite(material);
      
      // Position particles randomly in a volume
      sprite.position.x = (Math.random() - 0.5) * 60;
      sprite.position.y = (Math.random() - 0.5) * 60;
      sprite.position.z = (Math.random() - 0.5) * 60;
      
      // Random scale for variety (smaller size)
      const scale = Math.random() * 0.4 + 0.2;
      sprite.scale.set(scale, scale, 1);
      
      particlesGroup.add(sprite);
      sprites.push(sprite);

      // Velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      });
    }

    // Light source
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00e6ff, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll interaction
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse lag
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Animate particles
      for (let i = 0; i < particleCount; i++) {
        const sprite = sprites[i];
        const vel = velocities[i];
        
        // Move particle by velocity
        sprite.position.x += vel.x;
        sprite.position.y += vel.y;
        sprite.position.z += vel.z;

        // Boundary bounce / reset
        if (Math.abs(sprite.position.x) > 35) vel.x *= -1;
        if (Math.abs(sprite.position.y) > 35) vel.y *= -1;
        if (Math.abs(sprite.position.z) > 35) vel.z *= -1;
      }

      // Rotate camera/scene slightly based on mouse and scroll
      particlesGroup.rotation.y = targetX * 0.1 + Date.now() * 0.0001;
      particlesGroup.rotation.x = targetY * 0.1;
      particlesGroup.position.y = -scrollY * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden"
      style={{ minHeight: '100vh' }}
    />
  );
}
