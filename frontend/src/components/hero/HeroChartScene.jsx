import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const SceneContent = lazy(() => import('./CandlestickScene3D'));

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030508]">
      <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function HeroChartScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 6, 14], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <SceneContent />
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.2} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030508] via-[#030508]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-transparent to-[#030508]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(0,212,255,0.08)_0%,transparent_60%)] pointer-events-none" />
    </div>
  );
}
