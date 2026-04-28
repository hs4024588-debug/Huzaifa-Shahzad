import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  MeshDistortMaterial, 
  Text, 
  RoundedBox,
  PresentationControls,
  ContactShadows,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Cpu, 
  Workflow, 
  Zap, 
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 3D Components ---

const iPhoneColors = {
  natural: '#A7A196',
  black: '#252526',
  white: '#F5F5F0',
  desert: '#E4D5C5'
};

function IPhoneModel({ color = iPhoneColors.natural, ...props }: any) {
  const meshRef = useRef<THREE.Group>(null);

  return (
    <group ref={meshRef} {...props}>
      {/* Body */}
      <RoundedBox args={[1.5, 3.1, 0.15]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.4, 3.0]} />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Dynamic Island */}
      <mesh position={[0, 1.35, 0.085]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Camera Module */}
      <group position={[0.4, 1.1, -0.08]}>
        <RoundedBox args={[0.6, 0.6, 0.05]} radius={0.05}>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <mesh position={[0.15, 0.15, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.15, 0.15, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.15, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
}

function MacBookModel({ ...props }: any) {
  const [open, setOpen] = useState(false);
  const hingeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (hingeRef.current) {
      const targetRotation = open ? -Math.PI / 2.5 : 0;
      hingeRef.current.rotation.x = THREE.MathUtils.lerp(
        hingeRef.current.rotation.x,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <group {...props} onClick={() => setOpen(!open)} onPointerOver={() => setOpen(true)} onPointerOut={() => setOpen(false)}>
      {/* Bottom Chassis */}
      <RoundedBox args={[4, 0.1, 2.8]} radius={0.05} position={[0, -0.05, 1.4]}>
        <meshStandardMaterial color="#B0B0B0" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      {/* Trackpad */}
      <mesh position={[0, 0.01, 2.3]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Hinge & Screen */}
      <group ref={hingeRef} position={[0, 0, 0]}>
        <RoundedBox args={[4, 0.08, 2.8]} radius={0.05} position={[0, 0.04, 1.4]}>
          <meshStandardMaterial color="#B0B0B0" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        {/* Screen Content */}
        <mesh position={[0, 0.085, 1.4]}>
          <planeGeometry args={[3.8, 2.6]} />
          <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Apple Logo (Simulated) */}
        <mesh position={[0, -0.01, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function AirPodsModel({ ...props }: any) {
  return (
    <group {...props}>
      {/* Case Body */}
      <RoundedBox args={[1, 1.2, 0.5]} radius={0.3} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fff" metalness={0.1} roughness={0.1} />
      </RoundedBox>
      {/* Top Lid */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[1, 0.4, 0.5]} radius={0.3}>
          <meshStandardMaterial color="#eee" metalness={0.1} roughness={0.2} />
        </RoundedBox>
      </group>
      {/* Status LED */}
      <mesh position={[0, 0.1, 0.26]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function EcosystemParticles() {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
      const radius = 5 + Math.random() * 2;
      const phi = Math.acos(-1 + (2 * i) / 50);
      const theta = Math.sqrt(50 * Math.PI) * phi;
      p.push(new THREE.Vector3().setFromSphericalCoords(radius, phi, theta));
    }
    return p;
  }, []);

  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#55aaff" emissive="#55aaff" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

const ProductCard = ({ title, description, icon: Icon, features, active, onClick }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className={cn(
      "p-8 glass-card transition-all duration-700 cursor-pointer",
      active 
        ? "border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.05)] scale-105" 
        : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
    )}
    onClick={onClick}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={cn(
        "p-4 rounded-2xl flex items-center justify-center transition-colors duration-500",
        active ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"
      )}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-apple-white tracking-tight">{title}</h3>
        <p className="text-[10px] uppercase tracking-[0.2em] text-apple-gray font-bold mt-1">Latest Tech</p>
      </div>
    </div>
    <p className="text-apple-gray text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{description}</p>
    <div className="space-y-3">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-center gap-3 text-xs text-apple-gray/80 font-medium">
          <div className="w-1 h-1 rounded-full bg-blue-500" />
          <span>{f}</span>
        </div>
      ))}
    </div>
    <div className="mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
      Learn More →
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [activeProduct, setActiveProduct] = useState('iphone');
  const [menuOpen, setMenuOpen] = useState(false);

  const products = [
    {
      id: 'iphone',
      title: 'iPhone 16 Pro',
      description: 'The ultimate tool for creators. Built for Apple Intelligence.',
      icon: Smartphone,
      features: ['A18 Pro Chip', '48MP Fusion Camera', 'Grade 5 Titanium', 'Apple Intelligence'],
      color: '#A7A196'
    },
    {
      id: 'macbook',
      title: 'MacBook Pro',
      description: 'The most advanced chips for personal computers. Mind-blowing performance.',
      icon: Laptop,
      features: ['M4 Max Chip', 'Liquid Retina XDR', 'Extreme Dynamic Range', '24h Battery Life'],
      color: '#B0B0B0'
    },
    {
      id: 'airpods',
      title: 'AirPods Max',
      description: 'Incredible high-fidelity audio. The perfect balance of exhilaration.',
      icon: Headphones,
      features: ['Active Noise Cancellation', 'Transparency Mode', 'Spatial Audio', 'USB-C Charging'],
      color: '#F5F5F0'
    }
  ];

  return (
    <div className="h-screen w-full bg-apple-black text-apple-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Decorative Light Leaks */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] -ml-64 -mb-64 pointer-events-none z-0" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-12 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702z"/>
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-xl">Apple Ecosystem</span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-medium text-apple-gray">
          <a href="#" className="hover:text-apple-white transition-colors">Overview</a>
          <a href="#" className="hover:text-apple-white transition-colors">Mac</a>
          <a href="#" className="hover:text-apple-white transition-colors">iPhone</a>
          <a href="#" className="hover:text-apple-white transition-colors">AirPods</a>
          <a href="#" className="hover:text-apple-white transition-colors">Support</a>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Canvas */}
      <div className="relative h-full w-full perspective-container">
        <div className="absolute inset-0 z-0 glow-bg opacity-50">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#55aaff" />
            
            <Suspense fallback={null}>
              <PresentationControls
                global
                snap
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <group position={[0, -1, 0]}>
                  {/* Central Glow */}
                  <Sphere args={[2, 32, 32]} scale={0.5}>
                    <MeshDistortMaterial
                      color="#3388ff"
                      speed={3}
                      distort={0.4}
                      radius={1}
                      emissive="#3388ff"
                      emissiveIntensity={0.5}
                    />
                  </Sphere>
                  
                  {/* Rotating Ecosystem Elements */}
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <group position={[-6, 1, 0]} rotation={[0, 0.4, 0]}>
                      <MacBookModel scale={0.8} />
                      <Text
                        position={[0, -1.8, 0]}
                        fontSize={0.3}
                        color="white"
                        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                      >
                        MacBook Pro
                      </Text>
                    </group>
                  </Float>

                  <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                    <group position={[0, 3, 0]}>
                      <IPhoneModel scale={0.8} color={iPhoneColors.natural} />
                      <Text
                        position={[0, -2, 0]}
                        fontSize={0.3}
                        color="white"
                        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                      >
                        iPhone 16 Pro
                      </Text>
                    </group>
                  </Float>

                  <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
                    <group position={[6, 0.5, 0]}>
                      <AirPodsModel scale={1.2} />
                      <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.3}
                        color="white"
                        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                      >
                        AirPods Max
                      </Text>
                    </group>
                  </Float>

                  <EcosystemParticles />
                </group>
              </PresentationControls>
              <Environment preset="city" />
              <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* UI Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="container mx-auto h-full flex flex-col justify-between p-8 pt-24">
            
            {/* Top Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="max-w-2xl text-center mx-auto"
            >
              <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-gradient leading-[0.85] py-4">
                Continuity.
              </h1>
              <p className="text-xl text-apple-gray mt-6 max-w-lg mx-auto leading-relaxed pointer-events-auto font-medium">
                Your devices. All for one, and one for all. <br />
                Engineered with Apple Silicon for a seamless experience.
              </p>
            </motion.div>

            {/* Bottom Controls / Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pointer-events-auto pb-16">
              <AnimatePresence mode="popLayout">
                {products.map((p) => (
                  <ProductCard 
                    key={p.id}
                    title={p.title}
                    description={p.description}
                    icon={p.icon}
                    features={p.features}
                    active={activeProduct === p.id}
                    onClick={() => setActiveProduct(p.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Mini Dashboard (Desktop Only) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-20">
          <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 w-64">
            <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Latest Inventions</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">M4 Pro / Max</div>
                  <div className="text-xs text-white/40">New Generation Silicon</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Apple Intelligence</div>
                  <div className="text-xs text-white/40">AI-Native Features</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Workflow size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Continuity</div>
                  <div className="text-xs text-white/40">Seamless Interaction</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-semibold transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-full py-8 px-12 flex justify-between items-center border-t border-white/5 bg-transparent z-50 backdrop-blur-sm">
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-apple-gray mb-1 font-bold">Unified Memory</span>
            <span className="text-lg font-medium text-apple-white">Up to 128GB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-apple-gray mb-1 font-bold">Ecosystem Sync</span>
            <span className="text-lg font-medium text-apple-white underline underline-offset-8 decoration-blue-500 decoration-2">Active</span>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-[10px] uppercase tracking-[0.2em] text-apple-gray mb-1 font-bold">Privacy</span>
            <span className="text-lg font-medium text-apple-white">Built-in</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end mr-4 hidden lg:flex">
            <span className="text-[10px] text-apple-gray tracking-widest font-medium">EST. 1976</span>
            <span className="text-[10px] text-apple-gray/40 tracking-widest leading-none">CUPERTINO, CA</span>
          </div>
          <button className="px-8 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Build Your Set
          </button>
        </div>
      </footer>
    </div>
  );
}
