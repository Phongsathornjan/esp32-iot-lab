import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';

export type LedColor = 'red' | 'yellow' | 'green';

type SelectableProps = {
  onSelect?: () => void;
  selected?: boolean;
  label?: string;
  onHover?: (label: string | null) => void;
};

type SelectableGroupProps = SelectableProps & {
  children: ReactNode;
};

const LED_COLORS: Record<LedColor, string> = {
  red: '#ff2738',
  yellow: '#ffd52a',
  green: '#35ef75',
};

const ESP_PIN_OFFSETS = Array.from({ length: 15 }, (_, index) => (index - 7) * 0.18);
const RELAY_TERMINALS = [-0.43, 0, 0.43] as const;
const SENSOR_VENTS = [-0.18, -0.09, 0, 0.09, 0.18] as const;
const RESISTOR_BANDS = [
  { x: -0.42, width: 0.09, color: '#c9342c' },
  { x: -0.17, width: 0.09, color: '#c9342c' },
  { x: 0.08, width: 0.09, color: '#6f321b' },
  { x: 0.36, width: 0.11, color: '#d7ad43' },
] as const;

function SelectableGroup({ children, onSelect, selected = false, label, onHover }: SelectableGroupProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group
      scale={selected ? 1.035 : hovered ? 1.018 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        onHover?.(label ?? null);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
        onHover?.(null);
      }}
    >
      {children}
    </group>
  );
}

type PinHeaderProps = {
  count: number;
  position: [number, number, number];
  spacing?: number;
  axis?: 'x' | 'z';
  pinHeight?: number;
};

function PinHeader({
  count,
  position,
  spacing = 0.18,
  axis = 'x',
  pinHeight = 0.3,
}: PinHeaderProps) {
  const offsets = Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * spacing);
  const length = Math.max(spacing, count * spacing);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={axis === 'x' ? [length, 0.13, 0.2] : [0.2, 0.13, length]} />
        <meshStandardMaterial color="#151719" roughness={0.72} />
      </mesh>
      {offsets.map((offset) => (
        <mesh
          key={offset}
          position={axis === 'x' ? [offset, pinHeight / 2 + 0.035, 0] : [0, pinHeight / 2 + 0.035, offset]}
          castShadow
        >
          <boxGeometry args={[0.075, pinHeight, 0.075]} />
          <meshStandardMaterial color="#d8ae46" metalness={0.88} roughness={0.24} />
        </mesh>
      ))}
    </group>
  );
}

function MountingHole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.057, 20]} />
        <meshBasicMaterial color="#101214" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.069, 0.014, 8, 24]} />
        <meshStandardMaterial color="#c89b3c" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}

export function ESP32Board({ onSelect, selected = false, label, onHover }: SelectableProps) {
  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      <RoundedBox args={[2.05, 0.12, 3.35]} radius={0.065} smoothness={4} position={[0, 0.08, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#11181b"
          roughness={0.58}
          metalness={0.22}
          emissive={selected ? '#075e70' : '#000000'}
          emissiveIntensity={selected ? 0.55 : 0}
        />
      </RoundedBox>

      <PinHeader count={15} position={[-0.87, 0.2, 0.02]} axis="z" pinHeight={0.32} />
      <PinHeader count={15} position={[0.87, 0.2, 0.02]} axis="z" pinHeight={0.32} />

      <RoundedBox args={[1.44, 0.24, 1.08]} radius={0.045} smoothness={3} position={[0, 0.28, 1.03]} castShadow receiveShadow>
        <meshStandardMaterial color="#b9c0c4" metalness={0.9} roughness={0.27} />
      </RoundedBox>
      <mesh position={[0, 0.407, 1.03]} receiveShadow>
        <boxGeometry args={[1.18, 0.012, 0.82]} />
        <meshStandardMaterial color="#d5dadd" metalness={0.82} roughness={0.34} />
      </mesh>
      {[-0.28, 0, 0.28].map((z) => (
        <mesh key={z} position={[0, 0.417, 1.03 + z]}>
          <boxGeometry args={[0.68, 0.008, 0.018]} />
          <meshBasicMaterial color="#858e92" />
        </mesh>
      ))}

      <RoundedBox args={[0.7, 0.17, 0.7]} radius={0.035} smoothness={3} position={[0, 0.235, -0.05]} castShadow>
        <meshStandardMaterial color="#aeb6bb" metalness={0.86} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.326, -0.05]}>
        <boxGeometry args={[0.46, 0.012, 0.46]} />
        <meshStandardMaterial color="#323a3e" metalness={0.5} roughness={0.46} />
      </mesh>
      {[-0.12, 0, 0.12].map((z) => (
        <mesh key={z} position={[0, 0.335, -0.05 + z]}>
          <boxGeometry args={[0.28, 0.006, 0.012]} />
          <meshBasicMaterial color="#aeb8ba" />
        </mesh>
      ))}

      <RoundedBox args={[0.76, 0.3, 0.54]} radius={0.035} smoothness={3} position={[0, 0.23, -1.78]} castShadow receiveShadow>
        <meshStandardMaterial color="#b9c1c5" metalness={0.94} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.23, -2.056]}>
        <boxGeometry args={[0.57, 0.15, 0.018]} />
        <meshStandardMaterial color="#111517" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.21, -2.068]}>
        <boxGeometry args={[0.35, 0.035, 0.012]} />
        <meshStandardMaterial color="#b28b36" metalness={0.75} roughness={0.3} />
      </mesh>

      {[-0.53, 0.53].map((x) => (
        <group key={x} position={[x, 0.19, -1.28]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.12, 0.32]} />
            <meshStandardMaterial color="#272c2e" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.085, 0]} castShadow>
            <boxGeometry args={[0.17, 0.06, 0.22]} />
            <meshStandardMaterial color="#626b6f" metalness={0.4} roughness={0.42} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[0.48, 0.13, 0.25]} radius={0.025} smoothness={2} position={[0.42, 0.205, -0.63]} castShadow>
        <meshStandardMaterial color="#c2c8ca" metalness={0.88} roughness={0.27} />
      </RoundedBox>
      {[
        [-0.43, -0.54],
        [-0.48, -0.25],
        [0.46, 0.37],
        [0.5, 0.58],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.175, z]} castShadow>
          <boxGeometry args={[0.2, 0.07, 0.1]} />
          <meshStandardMaterial color="#313638" roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[-0.48, 0.185, -0.83]}>
        <boxGeometry args={[0.11, 0.075, 0.16]} />
        <meshStandardMaterial color="#e43b35" emissive="#ff382e" emissiveIntensity={0.8} roughness={0.35} />
      </mesh>

      {ESP_PIN_OFFSETS.filter((_, index) => index % 3 === 0).map((z) => (
        <mesh key={z} position={[-0.69, 0.146, z]}>
          <boxGeometry args={[0.014, 0.008, 0.09]} />
          <meshBasicMaterial color="#d3d8ce" />
        </mesh>
      ))}
      <MountingHole position={[-0.67, 0.146, 1.47]} />
      <MountingHole position={[0.67, 0.146, 1.47]} />
    </SelectableGroup>
  );
}

export function LED({ color, on, onSelect, selected = false, label, onHover }: { color: LedColor; on: boolean } & SelectableProps) {
  const lightColor = LED_COLORS[color];

  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      <mesh position={[-0.12, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.46, 12]} />
        <meshStandardMaterial color="#c2c8c9" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0.12, 0.19, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
        <meshStandardMaterial color="#c2c8c9" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[-0.1, 0.66, 0]}>
        <boxGeometry args={[0.035, 0.37, 0.035]} />
        <meshStandardMaterial color="#aeb7b9" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.62, 0]}>
        <boxGeometry args={[0.035, 0.3, 0.035]} />
        <meshStandardMaterial color="#aeb7b9" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.09, 0.79, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.12, 0.14, 20, 1, true]} />
        <meshStandardMaterial color="#d4d9d9" metalness={0.75} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.075, 32]} />
        <meshPhysicalMaterial
          color={lightColor}
          transparent
          opacity={on ? 0.82 : 0.58}
          transmission={0.18}
          thickness={0.25}
          roughness={0.2}
          clearcoat={1}
          emissive={lightColor}
          emissiveIntensity={on ? 2.4 : selected ? 0.35 : 0.025}
        />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.48, 32]} />
        <meshPhysicalMaterial
          color={lightColor}
          transparent
          opacity={on ? 0.76 : 0.5}
          transmission={0.22}
          thickness={0.45}
          roughness={0.16}
          clearcoat={1}
          ior={1.45}
          emissive={lightColor}
          emissiveIntensity={on ? 3 : selected ? 0.4 : 0.025}
        />
      </mesh>
      <mesh position={[0, 0.96, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={lightColor}
          transparent
          opacity={on ? 0.78 : 0.52}
          transmission={0.2}
          thickness={0.4}
          roughness={0.14}
          clearcoat={1}
          emissive={lightColor}
          emissiveIntensity={on ? 3.2 : selected ? 0.4 : 0.025}
        />
      </mesh>
      {on && (
        <>
          <mesh position={[0, 0.84, 0]}>
            <sphereGeometry args={[0.13, 20, 12]} />
            <meshBasicMaterial color={lightColor} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.88, 0]} scale={1.08}>
            <sphereGeometry args={[0.3, 24, 16]} />
            <meshBasicMaterial
              color={lightColor}
              transparent
              opacity={0.1}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, 0.98, 0]} color={lightColor} intensity={3} distance={4} decay={2} />
        </>
      )}
    </SelectableGroup>
  );
}

export function Resistor({ onSelect, selected = false, label, onHover }: SelectableProps) {
  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.08, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.8, 12]} />
          <meshStandardMaterial color="#bdc4c3" metalness={0.9} roughness={0.26} />
        </mesh>
      ))}
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.225, 0.225, 1.22, 32]} />
        <meshStandardMaterial
          color="#c9a978"
          roughness={0.52}
          emissive={selected ? '#0e7490' : '#000000'}
          emissiveIntensity={selected ? 0.55 : 0}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.63, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.19, 0.225, 0.14, 32]} />
          <meshStandardMaterial color="#b79a70" roughness={0.55} />
        </mesh>
      ))}
      {RESISTOR_BANDS.map((band) => (
        <mesh key={band.x} position={[band.x, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.229, 0.229, band.width, 32]} />
          <meshStandardMaterial color={band.color} metalness={band.color === '#d7ad43' ? 0.55 : 0.05} roughness={0.42} />
        </mesh>
      ))}
    </SelectableGroup>
  );
}

export function RelayModule({ on, onSelect, selected = false, label, onHover }: { on: boolean } & SelectableProps) {
  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      <RoundedBox args={[2.5, 0.12, 1.75]} radius={0.06} smoothness={4} position={[0, 0.08, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#175ca8"
          roughness={0.52}
          metalness={0.16}
          emissive={selected ? '#0284c7' : '#000000'}
          emissiveIntensity={selected ? 0.5 : 0}
        />
      </RoundedBox>

      <RoundedBox args={[1.25, 0.82, 1.18]} radius={0.055} smoothness={3} position={[-0.35, 0.55, 0.08]} castShadow receiveShadow>
        <meshStandardMaterial color="#191d21" roughness={0.57} />
      </RoundedBox>
      <mesh position={[-0.35, 0.967, 0.08]}>
        <boxGeometry args={[0.92, 0.014, 0.72]} />
        <meshStandardMaterial color="#d5d7d2" roughness={0.72} />
      </mesh>
      {[-0.18, 0, 0.18].map((z) => (
        <mesh key={z} position={[-0.35, 0.978, 0.08 + z]}>
          <boxGeometry args={[0.58, 0.006, 0.025]} />
          <meshBasicMaterial color="#747b7b" />
        </mesh>
      ))}

      <RoundedBox args={[0.5, 0.48, 1.35]} radius={0.035} smoothness={3} position={[0.91, 0.38, 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#27846d" roughness={0.58} />
      </RoundedBox>
      {RELAY_TERMINALS.map((z) => (
        <group key={z}>
          <mesh position={[0.91, 0.637, z + 0.05]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.045, 24]} />
            <meshStandardMaterial color="#bfc7c7" metalness={0.88} roughness={0.25} />
          </mesh>
          <mesh position={[0.91, 0.663, z + 0.05]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.17, 0.012, 0.026]} />
            <meshBasicMaterial color="#4a5151" />
          </mesh>
          <mesh position={[1.166, 0.34, z + 0.05]}>
            <boxGeometry args={[0.015, 0.19, 0.24]} />
            <meshStandardMaterial color="#102c27" roughness={0.75} />
          </mesh>
        </group>
      ))}

      <PinHeader count={3} position={[-0.72, 0.19, -0.7]} spacing={0.22} pinHeight={0.28} />
      <mesh position={[0.5, 0.185, -0.63]}>
        <boxGeometry args={[0.13, 0.09, 0.18]} />
        <meshStandardMaterial
          color={on ? '#ff4538' : '#762f2c'}
          emissive="#ff3028"
          emissiveIntensity={on ? 2.2 : 0}
          roughness={0.32}
        />
      </mesh>
      {on && <pointLight position={[0.5, 0.35, -0.63]} color="#ff392f" intensity={0.35} distance={1.2} />}
      <MountingHole position={[-1.08, 0.146, 0.69]} />
      <MountingHole position={[1.08, 0.146, -0.69]} />
    </SelectableGroup>
  );
}

export function SHT31Sensor({ onSelect, selected = false, label, onHover }: SelectableProps) {
  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      <RoundedBox args={[1.15, 0.1, 1.05]} radius={0.055} smoothness={4} position={[0, 0.07, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#57338d"
          roughness={0.52}
          metalness={0.15}
          emissive={selected ? '#7e22ce' : '#000000'}
          emissiveIntensity={selected ? 0.55 : 0}
        />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.18, 0.55]} radius={0.025} smoothness={3} position={[0, 0.22, 0.1]} castShadow receiveShadow>
        <meshStandardMaterial color="#c4cbcd" metalness={0.86} roughness={0.3} />
      </RoundedBox>
      {SENSOR_VENTS.map((x) => (
        <mesh key={x} position={[x, 0.316, 0.1]}>
          <boxGeometry args={[0.035, 0.012, 0.36]} />
          <meshStandardMaterial color="#535d60" metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
      <PinHeader count={4} position={[0, 0.16, -0.42]} spacing={0.19} pinHeight={0.27} />
      {[-0.285, -0.095, 0.095, 0.285].map((x) => (
        <mesh key={x} position={[x, 0.126, -0.2]}>
          <boxGeometry args={[0.025, 0.008, 0.25]} />
          <meshStandardMaterial color="#c7a44c" metalness={0.72} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[-0.37, 0.155, 0.34]} castShadow>
        <boxGeometry args={[0.19, 0.065, 0.12]} />
        <meshStandardMaterial color="#26272a" roughness={0.65} />
      </mesh>
      <MountingHole position={[0.42, 0.126, 0.37]} />
    </SelectableGroup>
  );
}

function createBreadboardHoles(): Array<[number, number, number]> {
  const holes: Array<[number, number, number]> = [];
  const rows = [-1.36, -0.98, -0.76, -0.54, 0.54, 0.76, 0.98, 1.36];

  for (let column = 0; column < 30; column += 1) {
    const x = (column - 14.5) * 0.145;
    rows.forEach((z) => holes.push([x, 0.347, z]));
  }

  return holes;
}

export function Breadboard({ onSelect, selected = false, label, onHover }: SelectableProps) {
  const holes = useMemo(createBreadboardHoles, []);
  const holesRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = holesRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    holes.forEach((position, index) => {
      matrix.makeTranslation(position[0], position[1], position[2]);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;
  }, [holes]);

  return (
    <SelectableGroup onSelect={onSelect} selected={selected} label={label} onHover={onHover}>
      <RoundedBox args={[4.8, 0.34, 3.2]} radius={0.085} smoothness={4} position={[0, 0.17, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e8e4d8"
          roughness={0.7}
          emissive={selected ? '#0e7490' : '#000000'}
          emissiveIntensity={selected ? 0.24 : 0}
        />
      </RoundedBox>
      <mesh position={[0, 0.343, 0]} receiveShadow>
        <boxGeometry args={[4.48, 0.018, 0.16]} />
        <meshStandardMaterial color="#aaa79f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.354, 0]}>
        <boxGeometry args={[4.42, 0.012, 0.07]} />
        <meshStandardMaterial color="#77766f" roughness={0.9} />
      </mesh>
      <instancedMesh ref={holesRef} args={[undefined, undefined, holes.length]} receiveShadow>
        <boxGeometry args={[0.072, 0.018, 0.072]} />
        <meshStandardMaterial color="#252622" roughness={0.88} />
      </instancedMesh>
      <mesh position={[0, 0.35, -1.52]}>
        <boxGeometry args={[4.4, 0.012, 0.025]} />
        <meshBasicMaterial color="#c95151" />
      </mesh>
      <mesh position={[0, 0.35, 1.52]}>
        <boxGeometry args={[4.4, 0.012, 0.025]} />
        <meshBasicMaterial color="#527fb5" />
      </mesh>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.55, 0.08, 0.32]} radius={0.03} smoothness={2} position={[side * 1.75, 0.01, 0]} receiveShadow>
          <meshStandardMaterial color="#333430" roughness={0.9} />
        </RoundedBox>
      ))}
    </SelectableGroup>
  );
}

export function JumperWire({
  points,
  color,
  highlighted = false,
  onSelect,
}: {
  points: [number, number, number][];
  color: string;
  highlighted?: boolean;
  onSelect?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const curve = useMemo(
    () => (points.length >= 2 ? new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), false, 'centripetal') : null),
    [points],
  );
  const segments = Math.max(32, points.length * 16);
  const geometry = useMemo(
    () => (curve ? new THREE.TubeGeometry(curve, segments, 0.035, 12, false) : null),
    [curve, segments],
  );
  const glowGeometry = useMemo(
    () => (curve && highlighted ? new THREE.TubeGeometry(curve, segments, 0.072, 12, false) : null),
    [curve, highlighted, segments],
  );

  useEffect(
    () => () => {
      geometry?.dispose();
      glowGeometry?.dispose();
    },
    [geometry, glowGeometry],
  );

  const start = points[0];
  const end = points[points.length - 1];
  if (!geometry || !start || !end) return null;

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.34}
          metalness={0.04}
          emissive={color}
          emissiveIntensity={highlighted ? 2.2 : hovered ? 0.65 : 0.035}
        />
      </mesh>
      {glowGeometry && (
        <mesh geometry={glowGeometry}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
      {[start, end].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <sphereGeometry args={[0.047, 16, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={highlighted ? 1.6 : 0.035} roughness={0.36} />
        </mesh>
      ))}
    </group>
  );
}
