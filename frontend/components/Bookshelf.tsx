"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function Bookshelf() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Pure white background

    // Orthographic Camera for flat, illustration-like view
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 6;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting - brighter for clearer colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Create bookshelf structure (dark gray/black)
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      roughness: 0.3,
      metalness: 0.1,
    });

    // Shelf dimensions
    const shelfWidth = 3.3; // Shortened shelf
    const shelfDepth = 1.5;
    const shelfThickness = 0.1;
    const shelfHeight = 0.2; // Make shelves thicker/more prominent
    const numShelves = 2; // Only 2 rows
    const verticalSpacing = 1.5;

    // Create floating shelves (just horizontal planks)
    const shelfGeometry = new THREE.BoxGeometry(
      shelfWidth,
      shelfHeight,
      shelfDepth
    );

    for (let i = 0; i < numShelves; i++) {
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(0, i * verticalSpacing + shelfHeight, 0);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      scene.add(shelf);
    }

    // Book colors - matching reference image palette
    const bookColors = [
      0xd77a61, // Coral Red
      0xe8b45e, // Golden Yellow
      0xf4c953, // Bright Yellow
      0x5c8a94, // Teal Blue-Gray
      0x708b92, // Blue Gray
      0xf2f2f2, // Off-White
      0x4a4947, // Dark Charcoal
      0x5f5854, // Dark Brown
      0xe67e5c, // Orange Coral
      0xd4895e, // Light Brown
      0x84a8ae, // Light Teal
      0xebb563, // Orange Yellow
      0xa0896d, // Tan
      0x6b8e95, // Dusty Teal
      0xc16b4f, // Rust
    ];

    // Function to create a book
    function createBook(
      width: number,
      height: number,
      depth: number,
      color: number,
      position: THREE.Vector3,
      rotation: number = 0
    ) {
      const bookGeometry = new THREE.BoxGeometry(width, height, depth);
      const bookMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.9,
        metalness: 0.0,
      });

      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      book.position.copy(position);
      book.rotation.y = rotation;
      book.castShadow = true;
      book.receiveShadow = true;

      // Add spine detail
      const spineGeometry = new THREE.BoxGeometry(
        width + 0.01,
        height * 0.9,
        depth * 0.1
      );
      const spineMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).multiplyScalar(0.8),
        roughness: 0.8,
      });
      const spine = new THREE.Mesh(spineGeometry, spineMaterial);
      spine.position.z = -depth / 2 + 0.02;
      book.add(spine);

      return book;
    }

    // Place books on shelves
    const bookHeights = [0.8, 1.0, 1.2, 0.9, 1.1, 0.85, 1.15];
    const bookWidths = [0.15, 0.2, 0.18, 0.16, 0.14, 0.19, 0.17];
    const bookDepth = 1.0;
    let interactiveBook: THREE.Mesh | null = null;

    for (let shelfIndex = 0; shelfIndex < numShelves; shelfIndex++) {
      const shelfY = shelfIndex * verticalSpacing + shelfHeight;
      const numBooks = Math.floor(Math.random() * 6) + 16; // 16-21 books per shelf (more packed)
      let currentX = -shelfWidth / 2 + 0.15;

      // For bottom shelf, reserve space for interactive book on the right
      const isBottomShelf = shelfIndex === 0;
      const maxX = isBottomShelf ? shelfWidth / 2 - 0.5 : shelfWidth / 2 - 0.15;

      for (let bookIndex = 0; bookIndex < numBooks; bookIndex++) {
        const bookWidth =
          bookWidths[Math.floor(Math.random() * bookWidths.length)];

        // Check if adding this book would exceed shelf bounds
        if (currentX + bookWidth > maxX) break;

        const bookHeight =
          bookHeights[Math.floor(Math.random() * bookHeights.length)];
        const bookColor =
          bookColors[Math.floor(Math.random() * bookColors.length)];

        // Small random tilt for natural look
        const tilt = (Math.random() - 0.5) * 0.08;

        const bookPosition = new THREE.Vector3(
          currentX + bookWidth / 2,
          shelfY + bookHeight / 2 + 0.03,
          0.1
        );

        const book = createBook(
          bookWidth,
          bookHeight,
          bookDepth,
          bookColor,
          bookPosition,
          tilt
        );
        scene.add(book);

        currentX += bookWidth + 0.01 + Math.random() * 0.02; // Tighter spacing for packed look
      }
    }

    // Add special interactive book on the bottom right
    const interactiveBookWidth = 0.2;
    const interactiveBookHeight = 1.0;
    const interactiveBookColor = 0xe67e5c; // Orange Coral - stands out
    const bottomShelfY = shelfHeight;
    const interactiveBookPosition = new THREE.Vector3(
      shelfWidth / 2 - 0.3,
      bottomShelfY + interactiveBookHeight / 2 + 0.03,
      0.1
    );

    interactiveBook = createBook(
      interactiveBookWidth,
      interactiveBookHeight,
      bookDepth,
      interactiveBookColor,
      interactiveBookPosition,
      0
    );
    interactiveBook.userData.isInteractive = true;
    interactiveBook.userData.originalZ = 0.1;
    scene.add(interactiveBook);

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse move handler for hover effect
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      // Reset all books
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.isInteractive) {
          child.position.z = child.userData.originalZ;
          child.position.y = bottomShelfY + interactiveBookHeight / 2 + 0.03;
        }
      });

      // Check if hovering over interactive book
      for (const intersect of intersects) {
        if (
          intersect.object instanceof THREE.Mesh &&
          intersect.object.userData.isInteractive
        ) {
          // Much more obvious pop-out effect
          intersect.object.position.z =
            intersect.object.userData.originalZ + 0.8;
          // Add slight upward movement for extra emphasis
          intersect.object.position.y =
            bottomShelfY + interactiveBookHeight / 2 + 0.13;
          document.body.style.cursor = "pointer";
          renderer.render(scene, camera);
          return;
        }
      }
      document.body.style.cursor = "default";
      renderer.render(scene, camera);
    };

    // Click handler to navigate to manga book page
    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (const intersect of intersects) {
        if (
          intersect.object instanceof THREE.Mesh &&
          intersect.object.userData.isInteractive
        ) {
          router.push("/manga");
          return;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Handle window resize
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 6;

      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Initial render
    renderer.render(scene, camera);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      document.body.style.cursor = "default";
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
}
