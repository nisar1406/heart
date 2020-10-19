import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import * as meshline from "threejs-meshline";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Curves } from "three/examples/jsm/curves/CurveExtras";
import Pulse from "react-reveal/Pulse";
import { EffectComposer } from "three/examples/jsm//postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm//postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm//postprocessing/GlitchPass";

import "./styles.css";

// Pour que React three friber puisse utiliser la 3rd party threejs-meshline
extend(meshline);
extend({ OrbitControls });
extend({ EffectComposer, RenderPass, GlitchPass });

/* Controls Compoent */
const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  // orbitRef.current.enableKeys = false
  useFrame(() => {
    orbitRef.current.update();
  });
  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
      enableKeys={false}
    />
  );
};

// function Effects({ factor }) {
//   const { gl, scene, camera, size } = useThree();
//   const composer = useRef();
//   useEffect(() => void composer.current.obj.setSize(size.width, size.height), [
//     size
//   ]);
//   useRender(() => composer.current.obj.render(), true);
//   return (
//     <effectComposer ref={composer} args={[gl]}>
//       <renderPass name="passes" args={[scene, camera]} />
//       <glitchPass name="passes" factor={factor} renderToScreen />
//     </effectComposer>
//   );
// }

function Fatline({ curve, width, color, speed }) {
  const material = useRef();

  useFrame(() => (material.current.uniforms.dashOffset.value -= speed));

  return (
    <mesh rotation={[0, Math.random() * Math.PI, 0]}>
      <meshLine attach="geometry" vertices={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.01}
        dashRatio={0.95}
      />
    </mesh>
  );
}

const lineWidth = 0.2;
const count = 200;

function Lines({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        const curve = new Curves.HeartCurve(3.5).getPoints(50);

        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: lineWidth,
          speed: Math.max(0.0001, 0.0005 * Math.random()),
          curve
        };
      }),
    [colors, count]
  );
  return lines.map((props, index) => <Fatline key={index} {...props} />);
}

export default function App() {
  return (
    <div className="App">
      <Pulse>
        <h1 className="text">
          I love you alot
          <br />
          <span role="img">Sabah..❤️</span>
        </h1>
      </Pulse>
      {/* <div className="hello"> */}
      <Canvas className="hello" camera={{ position: [0, 0, 300], fov: 25 }}>
        <Controls />
        <Lines count={count} colors={["#eb3d63", "#4a4e7c", "#eb1717"]} />
      </Canvas>
      {/* </div> */}
    </div>
  );
}
