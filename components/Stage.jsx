import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial, BakeShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { easing } from "maath";
import { Instances, Screen } from "./WWTF";

import styles from "../styles/stage.module.scss";

function Video() {
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/steveKen_noBG_VP9.webm";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  // fade video in after 5 seconds
  const ref = useRef();

  const delay = 3.5;
  const x = -4;
  const z = -1.2;

  useEffect(() => {
    setTimeout(() => {
      // reset video to beginning
      video.currentTime = 0;
      video.play();
    }, delay * 1000);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // fade in after delay
    const fadeDuration = 1;
    if (time > delay && time - delay <= fadeDuration) {
      ref.current.material.opacity = easeOutCubic(
        (time - delay) / fadeDuration
      );
    } else if (time - delay > fadeDuration) {
      ref.current.material.opacity = 1;
    }

    // move to center after delay
    const moveDuration = 5;
    if (time > delay && time - delay <= moveDuration) {
      ref.current.position.x =
        x + easeOutCubic((time - delay) / moveDuration) * Math.abs(x);
      ref.current.position.z = z + easeOutCubic((time - delay) / moveDuration);
    } else if (time - delay > moveDuration) {
      ref.current.position.x = 0;
    }

    easing.damp3(
      ref.current.rotation,
      [0, (0.5 + state.pointer.x) / 2, 0],
      0.9,
      delta
    );
  });

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  return (
    <mesh
      ref={ref}
      emissive="white"
      rotation={[0, 0.3, 0]}
      position={[-10, 0.7, z]}
      alphaTest={0}
      scale={[1.2, 1.2, 1.2]}
      transparent={true}
    >
      <planeGeometry args={[2, 1.6]} />
      <meshStandardMaterial
        emissive={"grey"}
        side={THREE.DoubleSide}
        transparent={true}
      >
        <videoTexture attach="map" args={[video]} transparent={true} />
        <videoTexture attach="emissiveMap" args={[video]} transparent={true} />
      </meshStandardMaterial>
    </mesh>
  );
}

function Stage() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [-1.5, 1, 5.5], fov: 90, near: 1, far: 20 }}
      eventSource={document.getElementById("root")}
      eventPrefix="client"
    >
      {/* Lights */}
      <color attach="background" args={["black"]} />
      <hemisphereLight intensity={0.1} groundColor="black" />
      <spotLight
        position={[10, 20, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      {/* Main scene */}
      <group position={[-0, -1.2, 0]}>
        {/* Auto-instanced sketchfab model */}
        <Instances>
          <Screen scale={0.7} />
        </Instances>
        {/* Plane reflections + distance blur */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 300]}
            resolution={1024}
            mixBlur={3}
            mixStrength={80}
            roughness={0.5}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#202020"
            metalness={1}
          />
        </mesh>

        <pointLight
          distance={1.5}
          intensity={1}
          position={[-0.15, 0.2, 0]}
          color="orange"
        />

        <Video />
      </group>
      {/* Postprocessing */}
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.6}
          mipmapBlur
          luminanceSmoothing={0.0}
          intensity={1.4}
        />
        <DepthOfField
          target={[0, 1, 3]}
          focalLength={2.2}
          bokehScale={25}
          height={700}
        />
      </EffectComposer>
      {/* Camera movements */}
      <CameraRig />
      {/* Small helper that freezes the shadows for better performance */}
      <BakeShadows />
    </Canvas>
  );
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        (state.pointer.x * state.viewport.width) / 20,
        (0.5 + state.pointer.y) / 3,
        1.5,
      ],
      0.9,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
}

export default function _() {
  const [set, getSet] = useState(false);
  useEffect(() => {
    if (!set) {
      getSet(true);
    }
  }, [set]);

  return <div className={styles.main}>{set && <Stage />}</div>;
}
