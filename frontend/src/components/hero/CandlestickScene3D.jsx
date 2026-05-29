import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

const CANDLE_COUNT = 28;

function generateCandles() {
  let price = 100;
  return Array.from({ length: CANDLE_COUNT }, (_, i) => {
    const open = price;
    const close = open + (Math.random() - 0.42) * 6;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    price = close;
    return { open, close, high, low, x: i * 1.35 - (CANDLE_COUNT * 1.35) / 2 };
  });
}

function Candle({ data, index, timeRef }) {
  const groupRef = useRef();
  const bullish = data.close >= data.open;
  const bodyHeight = Math.max(Math.abs(data.close - data.open), 0.4);
  const bodyY = (Math.min(data.open, data.close) + Math.max(data.open, data.close)) / 2;
  const wickLow = data.low;
  const wickHigh = data.high;

  const color = bullish ? '#00e676' : '#ff5252';
  const emissive = bullish ? '#00e676' : '#ff5252';

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 2 + index * 0.4) * 0.03;
    groupRef.current.scale.y = pulse;
    groupRef.current.position.y = Math.sin(t * 0.8 + index * 0.2) * 0.08;
  });

  const wickHeight = wickHigh - wickLow;
  const wickY = (wickHigh + wickLow) / 2;

  return (
    <group ref={groupRef} position={[data.x, 0, 0]}>
      {/* Glow halo */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[0.55, bodyHeight + 0.2, 0.55]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      {/* Body */}
      <mesh position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[0.42, bodyHeight, 0.42]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Wick */}
      <mesh position={[0, wickY, 0]}>
        <boxGeometry args={[0.06, wickHeight, 0.06]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Candlesticks({ timeRef }) {
  const candles = useMemo(() => generateCandles(), []);
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {candles.map((c, i) => (
        <Candle key={i} data={c} index={i} timeRef={timeRef} />
      ))}
    </group>
  );
}

function NeonGrid() {
  return (
    <>
      <Grid
        position={[0, 0, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#0e4a5e"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#00d4ff"
        fadeDistance={35}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#030508" metalness={0.95} roughness={0.05} />
      </mesh>
    </>
  );
}

function Cityscape() {
  const buildings = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        x: (i - 12) * 2.2,
        z: -12 - Math.random() * 8,
        h: 3 + Math.random() * 10,
        w: 0.6 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial
            color="#0a1520"
            emissive="#00d4ff"
            emissiveIntensity={0.05 + (i % 3) * 0.03}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataParticles({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 15 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(clock.getElapsedTime() + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00d4ff" transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function NetworkLines() {
  const ref = useRef();
  const lines = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 12; i++) {
      pts.push(new THREE.Vector3((Math.random() - 0.5) * 25, Math.random() * 8 + 2, (Math.random() - 0.5) * 15));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(lines);
    return geo;
  }, [lines]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.opacity = 0.15 + Math.sin(clock.getElapsedTime()) * 0.08;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.2} />
    </line>
  );
}

function HolographicRings() {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
      ring1.current.rotation.z = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 3;
      ring2.current.rotation.y = t * 0.15;
    }
  });

  return (
    <>
      <mesh ref={ring1} position={[8, 5, -4]}>
        <torusGeometry args={[3, 0.02, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2} position={[-7, 4, -3]}>
        <torusGeometry args={[2, 0.015, 8, 48]} />
        <meshBasicMaterial color="#00e676" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

function SceneContent() {
  const timeRef = useRef(0);

  useFrame(({ clock, camera }) => {
    timeRef.current = clock.getElapsedTime();
    const t = timeRef.current;
    camera.position.x = Math.sin(t * 0.12) * 2;
    camera.position.y = 6 + Math.sin(t * 0.2) * 0.5;
    camera.position.z = 14 + Math.cos(t * 0.1) * 0.5;
    camera.lookAt(0, 2, 0);
  });

  return (
    <>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 12, 40]} />

      <ambientLight intensity={0.12} />
      <pointLight position={[10, 12, 8]} intensity={1.4} color="#00d4ff" />
      <pointLight position={[-8, 8, -5]} intensity={0.9} color="#00e676" />
      <spotLight position={[0, 18, 0]} angle={0.5} penumbra={1} intensity={0.7} color="#0099cc" castShadow />

      <Cityscape />
      <NeonGrid />
      <Candlesticks timeRef={timeRef} />
      <DataParticles />
      <NetworkLines />
      <HolographicRings />
    </>
  );
}

export default SceneContent;
