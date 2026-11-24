"use client";

import { useEffect, useRef } from "react";

/**
 * Hero visual: a slowly rotating wireframe system with a particle field.
 * Three.js is imported at runtime so it never lands in the server bundle or
 * the first paint; the CSS gradient behind the canvas is the WebGL fallback.
 */
export function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let cancelled = false;
    let stop = () => {};

    void (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        return; // no WebGL: the CSS backdrop stays
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.3, 6.2);

      const green = new THREE.Color("#3ddc97");
      const cyan = new THREE.Color("#38bdf8");

      const group = new THREE.Group();
      scene.add(group);

      const shellGeo = new THREE.IcosahedronGeometry(1.55, 1);
      group.add(
        new THREE.LineSegments(
          new THREE.WireframeGeometry(shellGeo),
          new THREE.LineBasicMaterial({
            color: green,
            transparent: true,
            opacity: 0.5,
          }),
        ),
      );

      const coreGeo = new THREE.IcosahedronGeometry(0.9, 0);
      group.add(
        new THREE.Mesh(
          coreGeo,
          new THREE.MeshBasicMaterial({
            color: cyan,
            wireframe: true,
            transparent: true,
            opacity: 0.32,
          }),
        ),
      );

      const ringGeo = new THREE.TorusGeometry(2.3, 0.006, 6, 160);
      const ringMat = new THREE.MeshBasicMaterial({
        color: green,
        transparent: true,
        opacity: 0.26,
      });
      const ringA = new THREE.Mesh(ringGeo, ringMat);
      ringA.rotation.set(Math.PI / 2.4, 0.2, 0);
      const ringB = new THREE.Mesh(ringGeo, ringMat);
      ringB.rotation.set(Math.PI / 1.7, -0.6, 0.9);
      group.add(ringA, ringB);

      const count = 620;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 2.6 + Math.random() * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(
        pointsGeo,
        new THREE.PointsMaterial({
          color: cyan,
          size: 0.022,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      scene.add(points);

      const pointer = { x: 0, y: 0 };
      let renderStatic = () => {};
      const onPointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      el.addEventListener("pointermove", onPointerMove);

      const resize = () => {
        const width = el.clientWidth || 1;
        const height = el.clientHeight || 1;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderStatic();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(el);
      resize();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const startedAt = performance.now();

      const frame = () => {
        const time = (performance.now() - startedAt) / 1000;
        group.rotation.y = time * 0.16 + pointer.x * 0.25;
        group.rotation.x = -0.12 + pointer.y * 0.18;
        points.rotation.y = -time * 0.05;
        ringA.rotation.z = time * 0.1;
        ringB.rotation.z = -time * 0.14;
        renderer.render(scene, camera);
      };

      if (reduced) {
        renderStatic = frame;
        frame();
      } else {
        renderer.setAnimationLoop(frame);
      }

      // Stop drawing when the hero scrolls away or the tab is hidden.
      const visibility = new IntersectionObserver(
        ([entry]) => {
          if (reduced) return;
          renderer.setAnimationLoop(entry?.isIntersecting ? frame : null);
        },
        { threshold: 0.01 },
      );
      visibility.observe(el);

      stop = () => {
        visibility.disconnect();
        observer.disconnect();
        el.removeEventListener("pointermove", onPointerMove);
        renderer.setAnimationLoop(null);
        shellGeo.dispose();
        coreGeo.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        pointsGeo.dispose();
        scene.traverse((object) => {
          const item = object as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void };
          };
          item.geometry?.dispose();
          item.material?.dispose();
        });
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(61,220,151,0.14),transparent_62%)]"
      />
      <div ref={host} aria-hidden="true" className="absolute inset-0" />
    </div>
  );
}
