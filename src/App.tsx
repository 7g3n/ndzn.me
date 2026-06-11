import { useEffect, useRef } from "react";
import * as THREE from "three";
import blackBoxArt from "../assets/black-box.jpg";
import logoUrl from "../assets/logo.png";
import dirtyCrazyzArt from "../assets/my-name-is-dirty-crazyz.jpg";

type PixelSample = {
  width: number;
  height: number;
  step: number;
  litPixels: number;
  brightest: number;
  bounds: null | {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

type SceneDebugState = {
  canvas: {
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;
  };
  group: {
    children: number;
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    height: number;
    aspect: number;
  };
  pointer: {
    active: boolean;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    cursorX: number;
    cursorY: number;
  };
};

declare global {
  interface Window {
    __logoScene?: {
      samplePixels: (step?: number) => PixelSample;
      state: () => SceneDebugState;
    };
  }
}

const trailCount = 7;

const musicWorks = [
  {
    href: "https://open.spotify.com/album/5k0qssjmKe4ZkEic1TrkuE",
    image: blackBoxArt,
    alt: "Black Box album artwork",
    title: "Neural Palette",
    detail: "(Techcore crew - Black Box Tr.04)",
  },
  {
    href: "https://open.spotify.com/album/3P3iBzOUBgxYDU3Iobt5M8?si=R4FIoX25RKWjJGSUb7kphg",
    image: dirtyCrazyzArt,
    alt: "My Name Is DirtyCrazyZ album artwork",
    title: "ear break",
    detail: "(DirtyCrazyZ - My Name Is DirtyCrazyZ Tr.02)",
    detailClassName: "music-work-caption-detail-compact",
  },
];

function App() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useRevealAnimations();
  useThreeLogoScene(sceneRef, cursorRef, trailRefs);

  return (
    <>
      <main ref={sceneRef} id="app" aria-label="3D logo scene" />
      <div className="page-copy" aria-label="Profile content">
        <section className="hero-copy" aria-labelledby="profile-name">
          <h1 id="profile-name">Nagisa Dozono</h1>
          <p>Frontend developer / Composer / focused on audio visualization and creator tools</p>
        </section>

        <section className="copy-section copy-section-about" aria-labelledby="about-title">
          <h2 id="about-title">About me</h2>
          <p>
            Nagisa Dozonoは、2005年3月26日生まれの音楽家 / フロントエンドエンジニア。<br />
            幼少期からPCや音楽に触れ、N高等学校に入学。<br />
            卒業後は、楽曲制作とWeb開発を並行して学びながら、
            アーティストコレクティブレーベル「TRAJECTORIES」を設立。<br />
            現在は、React、Three.js、 Web Audio API、WebGLなどを用いたWebアプリケーション制作や、
            音の可視化・生成ツール、 インタラクティブな表現を中心に制作している。
          </p>
        </section>

        <section className="copy-section copy-section-music" aria-labelledby="music-title">
          <h2 id="music-title">Music Works</h2>
          <div className="music-works" aria-label="Music works">
            {musicWorks.map((work) => (
              <article className="music-work" key={work.href}>
                <a
                  className="music-art-link"
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Listen to ${work.title} ${work.detail}`}
                >
                  <img src={work.image} alt={work.alt} loading="lazy" />
                </a>
                <p className="music-work-caption">
                  <span>{work.title}</span>
                  <span className={`music-work-caption-detail ${work.detailClassName ?? ""}`}>{work.detail}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="copy-section copy-section-list copy-section-skillset" aria-labelledby="skillset-title">
          <h2 id="skillset-title">Skillset</h2>
          <ul>
            <li>HTML/CSS(2018~)</li>
            <li>React</li>
            <li>Three.js(2026~)</li>
            <li>Web Audio API(2026~)</li>
            <li>WebGL(2026~)</li>
          </ul>
        </section>

        <section className="copy-section copy-section-list copy-section-supporting" aria-labelledby="supporting-title">
          <h2 id="supporting-title">Supporting Skills</h2>
          <ul>
            <li>GitHub Copilot</li>
            <li>OpenAI Codex</li>
            <li>Cursor</li>
          </ul>
        </section>

        <section className="copy-section copy-section-list copy-section-social" aria-labelledby="social-title">
          <h2 id="social-title">Social Media</h2>
          <ul className="social-links">
            <li>
              <svg className="social-icon" viewBox="0 0 24 24" role="img" aria-label="X">
                <path d="M13.8 10.4 21.1 2h-1.7l-6.3 7.2L8.1 2H2.2l7.7 11.1L2.2 22h1.7l6.7-7.7 5.4 7.7h5.9l-8.1-11.6Zm-2.4 2.8-.8-1.1L4.4 3.3h2.9l5 7.1.8 1.1 6.5 9.3h-2.9l-5.3-7.6Z" />
              </svg>
              <a href="https://x.com/nagisa7g" target="_blank" rel="noopener noreferrer">
                @nagisa7g
              </a>
            </li>
            <li>
              <svg className="social-icon social-icon-youtube" viewBox="0 0 24 24" role="img" aria-label="YouTube">
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31.3 31.3 0 0 0 1.9 12a31.3 31.3 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1 31.3 31.3 0 0 0 .5-4.8 31.3 31.3 0 0 0-.5-4.8ZM9.9 15.4V8.6l5.9 3.4-5.9 3.4Z" />
              </svg>
              <a href="https://www.youtube.com/@NagisaDozono" target="_blank" rel="noopener noreferrer">
                @NagisaDozono
              </a>
            </li>
            <li>
              <svg className="social-icon" viewBox="0 0 24 24" role="img" aria-label="GitHub">
                <path d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.6 0-1.2.4-2.2 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2A11 11 0 0 1 12 6a11 11 0 0 1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .8.9 1.2 1.9 1.2 3.1 0 4.3-2.8 5.3-5.4 5.6.4.4.8 1.1.8 2.2V22c0 .4.2.8.8.6A11.2 11.2 0 0 0 12 .8Z" />
              </svg>
              <a href="https://github.com/7g3n" target="_blank" rel="noopener noreferrer">
                7g3n
              </a>
            </li>
          </ul>
        </section>

        <section className="copy-section copy-section-contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact me</h2>
          <p>
            <a href="mailto:im@ndzn.me">im@ndzn.me</a>
          </p>
        </section>
      </div>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      {Array.from({ length: trailCount }, (_, index) => (
        <span
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className="cursor-trail"
          style={
            {
              "--trail-index": index,
              "--trail-opacity": Math.max(0.06, 0.24 - index * 0.026).toFixed(3),
            } as React.CSSProperties
          }
          aria-hidden="true"
          key={index}
        />
      ))}
    </>
  );
}

function useRevealAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(".hero-copy, .copy-section"))
      .flatMap((section) => Array.from(section.children) as HTMLElement[]);

    revealTargets.forEach((element, index) => {
      const delay = element.parentElement?.classList.contains("hero-copy") ? index * 120 : index * 90;
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return () => {
        revealTargets.forEach((element) => element.classList.remove("reveal-item", "is-visible"));
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.12,
      },
    );

    revealTargets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      revealTargets.forEach((element) => {
        element.classList.remove("reveal-item", "is-visible");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, []);
}

function useThreeLogoScene(
  sceneRef: React.RefObject<HTMLElement | null>,
  cursorRef: React.RefObject<HTMLDivElement | null>,
  trailRefs: React.RefObject<Array<HTMLSpanElement | null>>,
) {
  useEffect(() => {
    const sceneElement = sceneRef.current;
    const cursor = cursorRef.current;

    if (!sceneElement || !cursor) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    sceneElement.appendChild(renderer.domElement);

    const logoGroup = new THREE.Group();
    logoGroup.position.z = 0;
    scene.add(logoGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keyLight.position.set(2.5, 3.2, 5.4);
    scene.add(keyLight);

    const cursorLight = new THREE.PointLight(0xffffff, 9.5, 10, 1.65);
    cursorLight.position.set(0, 0, 3.4);
    scene.add(cursorLight);

    const pointer = new THREE.Vector2(0, 0);
    const previousPointer = new THREE.Vector2(0, 0);
    const pointerVelocity = new THREE.Vector2(0, 0);
    const cursorPixel = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const trailPoints = trailRefs.current.map(() => cursorPixel.clone());
    const targetPosition = new THREE.Vector3(0, 0, 0);
    const targetLightPosition = new THREE.Vector3(0, 0, 3.4);
    const startTime = performance.now();
    const debugEnabled = new URLSearchParams(window.location.search).has("debug")
      || window.localStorage.getItem("logoDebug") === "1";

    let disposed = false;
    let hasPointer = false;
    let cursorInitialized = false;
    let logoAspect = 1;
    let logoHeight = 1;
    let lastDebugSample = 0;
    let logoTexture: THREE.CanvasTexture | null = null;

    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

    const buildWhiteAlphaCanvas = (image: HTMLImageElement) => {
      const source = document.createElement("canvas");
      const sourceContext = source.getContext("2d", { willReadFrequently: true });

      if (!sourceContext) {
        throw new Error("Could not create source canvas context.");
      }

      source.width = image.naturalWidth || image.width;
      source.height = image.naturalHeight || image.height;
      sourceContext.drawImage(image, 0, 0);

      const sourceData = sourceContext.getImageData(0, 0, source.width, source.height);
      let minX = source.width;
      let minY = source.height;
      let maxX = -1;
      let maxY = -1;

      for (let i = 3; i < sourceData.data.length; i += 4) {
        if (sourceData.data[i] <= 8) {
          continue;
        }

        const pixelIndex = (i - 3) / 4;
        const x = pixelIndex % source.width;
        const y = Math.floor(pixelIndex / source.width);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      if (maxX < minX || maxY < minY) {
        minX = 0;
        minY = 0;
        maxX = source.width - 1;
        maxY = source.height - 1;
      }

      const trimPadding = Math.round(Math.max(maxX - minX, maxY - minY) * 0.025);
      minX = Math.max(0, minX - trimPadding);
      minY = Math.max(0, minY - trimPadding);
      maxX = Math.min(source.width - 1, maxX + trimPadding);
      maxY = Math.min(source.height - 1, maxY + trimPadding);

      const output = document.createElement("canvas");
      const outputContext = output.getContext("2d", { willReadFrequently: true });

      if (!outputContext) {
        throw new Error("Could not create output canvas context.");
      }

      output.width = maxX - minX + 1;
      output.height = maxY - minY + 1;

      const cropped = sourceContext.getImageData(minX, minY, output.width, output.height);
      for (let i = 0; i < cropped.data.length; i += 4) {
        const alpha = cropped.data[i + 3];
        cropped.data[i] = 255;
        cropped.data[i + 1] = 255;
        cropped.data[i + 2] = 255;
        cropped.data[i + 3] = alpha > 3 ? alpha : 0;
      }

      outputContext.putImageData(cropped, 0, 0);
      return output;
    };

    const buildLayeredLogo = (texture: THREE.CanvasTexture) => {
      const layerCount = 34;
      const depth = 0.48;
      const geometry = new THREE.PlaneGeometry(logoAspect, 1);

      for (let i = layerCount - 1; i >= 0; i -= 1) {
        const depthRatio = i / (layerCount - 1);
        const shade = 0.5 + (1 - depthRatio) * 0.5;
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(shade, shade, shade),
          emissive: new THREE.Color(0x060606),
          map: texture,
          alphaTest: 0.045,
          transparent: true,
          opacity: 0.18,
          roughness: 0.22,
          metalness: 0.04,
          side: THREE.DoubleSide,
        });

        const layer = new THREE.Mesh(geometry, material);
        layer.position.z = -depthRatio * depth;
        layer.scale.setScalar(1 + depthRatio * 0.018);
        layer.renderOrder = i;
        logoGroup.add(layer);
      }

      const highlight = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff,
          transparent: true,
          opacity: 0.055,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      highlight.position.z = 0.025;
      highlight.scale.setScalar(1.012);
      highlight.renderOrder = layerCount + 1;
      logoGroup.add(highlight);
    };

    const visibleSizeAtZ = (z = 0) => {
      const distance = Math.abs(camera.position.z - z);
      const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
      return {
        width: height * camera.aspect,
        height,
      };
    };

    const updateTargetFromPointer = () => {
      const view = visibleSizeAtZ(logoGroup.position.z);
      const logoAnchorY = window.innerHeight > window.innerWidth ? -view.height * 0.08 : -view.height * 0.27;

      targetPosition.set(0, logoAnchorY, 0);
      targetLightPosition.set(pointer.x * view.width * 0.28, pointer.y * view.height * 0.28, 3.4);
    };

    const fitLogoToViewport = () => {
      if (!logoAspect) {
        return;
      }

      const view = visibleSizeAtZ(logoGroup.position.z);
      const isTall = window.innerHeight > window.innerWidth;
      const widthRatio = isTall ? 0.68 : 0.24;
      const heightRatio = isTall ? 0.3 : 0.3;
      logoHeight = Math.min((view.width * widthRatio) / logoAspect, view.height * heightRatio);
      logoGroup.scale.setScalar(logoHeight);
    };

    const updateLogoRotation = (elapsed: number, rotationStrength: number) => {
      const rotationKickX = THREE.MathUtils.clamp(pointerVelocity.y * 3.2, -0.55, 0.55);
      const rotationKickY = THREE.MathUtils.clamp(-pointerVelocity.x * 3.6, -0.65, 0.65);
      const rotationKickZ = THREE.MathUtils.clamp(pointerVelocity.x * 1.8, -0.36, 0.36);

      const targetRotationX = hasPointer
        ? THREE.MathUtils.clamp(pointer.y * 0.86 + rotationKickX, -1.08, 1.08)
        : Math.sin(elapsed * 0.44) * 0.11;
      const targetRotationY = hasPointer
        ? THREE.MathUtils.clamp(-pointer.x * 1.08 + rotationKickY, -1.18, 1.18)
        : Math.cos(elapsed * 0.36) * 0.14;
      const targetRotationZ = hasPointer
        ? THREE.MathUtils.clamp(pointer.x * 0.18 + pointer.y * 0.08 + rotationKickZ, -0.42, 0.42)
        : Math.sin(elapsed * 0.26) * 0.035;

      logoGroup.rotation.x = THREE.MathUtils.lerp(logoGroup.rotation.x, targetRotationX, rotationStrength);
      logoGroup.rotation.y = THREE.MathUtils.lerp(logoGroup.rotation.y, targetRotationY, rotationStrength);
      logoGroup.rotation.z = THREE.MathUtils.lerp(logoGroup.rotation.z, targetRotationZ, rotationStrength * 0.87);
    };

    const updateCursorTrail = () => {
      if (!cursorInitialized) {
        return;
      }

      trailRefs.current.forEach((dot, index) => {
        if (!dot || !trailPoints[index]) {
          return;
        }

        const leader = index === 0 ? cursorPixel : trailPoints[index - 1];
        const point = trailPoints[index];
        const strength = Math.max(0.08, 0.28 - index * 0.025);

        point.lerp(leader, strength);
        dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
      });
    };

    const getSceneState = (): SceneDebugState => ({
      canvas: {
        width: renderer.domElement.width,
        height: renderer.domElement.height,
        clientWidth: renderer.domElement.clientWidth,
        clientHeight: renderer.domElement.clientHeight,
      },
      group: {
        children: logoGroup.children.length,
        x: Number(logoGroup.position.x.toFixed(4)),
        y: Number(logoGroup.position.y.toFixed(4)),
        z: Number(logoGroup.position.z.toFixed(4)),
        rotationX: Number(logoGroup.rotation.x.toFixed(4)),
        rotationY: Number(logoGroup.rotation.y.toFixed(4)),
        rotationZ: Number(logoGroup.rotation.z.toFixed(4)),
        height: Number(logoHeight.toFixed(4)),
        aspect: Number(logoAspect.toFixed(4)),
      },
      pointer: {
        active: hasPointer,
        x: Number(pointer.x.toFixed(4)),
        y: Number(pointer.y.toFixed(4)),
        velocityX: Number(pointerVelocity.x.toFixed(4)),
        velocityY: Number(pointerVelocity.y.toFixed(4)),
        cursorX: Number(cursorPixel.x.toFixed(1)),
        cursorY: Number(cursorPixel.y.toFixed(1)),
      },
    });

    const writeDebugState = () => {
      if (!debugEnabled) {
        return;
      }

      sceneElement.setAttribute("data-logo-state", JSON.stringify(getSceneState()));
    };

    const samplePixels = (step = 3): PixelSample => {
      const gl = renderer.getContext();
      const width = renderer.domElement.width;
      const height = renderer.domElement.height;
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      let litPixels = 0;
      let brightest = 0;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const brightness = pixels[index] + pixels[index + 1] + pixels[index + 2];
          brightest = Math.max(brightest, brightness);

          if (brightness <= 42) {
            continue;
          }

          litPixels += 1;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      return {
        width,
        height,
        step,
        litPixels,
        brightest,
        bounds: litPixels
          ? {
              minX,
              minY,
              maxX,
              maxY,
            }
          : null,
      };
    };

    const render = () => {
      if (disposed) {
        return;
      }

      const elapsed = (performance.now() - startTime) / 1000;

      if (!hasPointer) {
        pointer.x = Math.sin(elapsed * 0.38) * 0.15;
        pointer.y = Math.cos(elapsed * 0.31) * 0.12;
        updateTargetFromPointer();
      }

      const followStrength = hasPointer ? 0.085 : 0.055;
      logoGroup.position.lerp(targetPosition, followStrength);

      updateLogoRotation(elapsed, 0.15);
      pointerVelocity.multiplyScalar(0.82);
      cursorLight.position.lerp(targetLightPosition, 0.18);
      updateCursorTrail();

      renderer.render(scene, camera);

      if (debugEnabled && elapsed - lastDebugSample > 0.45) {
        lastDebugSample = elapsed;
        writeDebugState();

        try {
          sceneElement.setAttribute("data-logo-pixels", JSON.stringify(samplePixels(5)));
          sceneElement.removeAttribute("data-logo-pixels-error");
        } catch (error) {
          sceneElement.setAttribute("data-logo-pixels-error", error instanceof Error ? error.message : String(error));
        }
      }
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      fitLogoToViewport();
      updateTargetFromPointer();
    };

    const onPointerMove = (event: PointerEvent) => {
      hasPointer = true;
      document.body.classList.add("has-pointer");

      const nextPointerX = (event.clientX / window.innerWidth) * 2 - 1;
      const nextPointerY = -(event.clientY / window.innerHeight) * 2 + 1;

      previousPointer.copy(pointer);
      pointer.set(nextPointerX, nextPointerY);
      pointerVelocity.subVectors(pointer, previousPointer);
      cursorPixel.set(event.clientX, event.clientY);

      if (!cursorInitialized) {
        cursorInitialized = true;
        trailPoints.forEach((point) => point.copy(cursorPixel));
      }

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
      updateTargetFromPointer();
      logoGroup.position.lerp(targetPosition, 0.13);
      updateLogoRotation((performance.now() - startTime) / 1000, 0.42);
      cursorLight.position.lerp(targetLightPosition, 0.35);
      updateCursorTrail();
      renderer.render(scene, camera);
      writeDebugState();
    };

    window.__logoScene = {
      samplePixels,
      state: getSceneState,
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);

    void loadImage(logoUrl).then((image) => {
      if (disposed) {
        return;
      }

      const logoCanvas = buildWhiteAlphaCanvas(image);
      logoTexture = new THREE.CanvasTexture(logoCanvas);
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
      logoTexture.generateMipmaps = true;
      logoTexture.needsUpdate = true;

      logoAspect = logoCanvas.width / logoCanvas.height;
      buildLayeredLogo(logoTexture);
      resize();
      renderer.setAnimationLoop(render);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("has-pointer");
      cursor.style.opacity = "";
      delete window.__logoScene;

      logoGroup.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();
        const material = object.material;

        if (Array.isArray(material)) {
          material.forEach((entry) => entry.dispose());
        } else {
          material.dispose();
        }
      });

      logoTexture?.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === sceneElement) {
        sceneElement.removeChild(renderer.domElement);
      }
    };
  }, [cursorRef, sceneRef, trailRefs]);
}

export default App;
