import { useEffect, useRef } from 'react';

// Light through leaves: warm patches of evening sun that pass between swaying foliage, drawn by a small
// fragment shader at half resolution (the patches are soft, so nobody sees the pixels). It draws only while
// on screen; with reduced motion it draws one still frame.
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision mediump float;
uniform vec2 res; uniform float t; uniform vec3 tint; uniform float gain;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*n(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / res.y;
  vec2 wind = vec2(sin(t*0.31)*0.09 + t*0.012, cos(t*0.23)*0.06);
  float leaves = fbm(uv*7.0 + wind*2.2);
  float twigs = fbm(uv*15.0 - wind*3.1 + 3.1);
  float boughs = fbm(uv*1.6 - wind*0.6 + 7.3);
  float hole = smoothstep(0.48, 0.6, leaves) * smoothstep(0.34, 0.54, twigs) * smoothstep(0.36, 0.6, boughs);
  float flicker = 0.85 + 0.15*sin(t*1.7 + uv.x*9.0);
  float fall = smoothstep(0.0, 0.55, gl_FragCoord.y / res.y);
  float a = hole * flicker * fall * gain;
  gl_FragColor = vec4(tint * a, a);
}`;

const WARM = [1.0, 0.82, 0.58];

export default function DappledLight({ className = '', color = WARM, strength = 0.8, scale = 0.6 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return undefined;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'res');
    const uT = gl.getUniformLocation(prog, 't');
    gl.uniform3fv(gl.getUniformLocation(prog, 'tint'), color);
    gl.uniform1f(gl.getUniformLocation(prog, 'gain'), strength);

    const size = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const hgt = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== hgt) { canvas.width = w; canvas.height = hgt; gl.viewport(0, 0, w, hgt); }
      gl.uniform2f(uRes, w, hgt);
    };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let seen = false;
    const t0 = performance.now();
    const draw = () => {
      raf = 0;
      gl.uniform1f(uT, (performance.now() - t0) / 1000 + 40);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (seen && !still) raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(() => { size(); if (!raf) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) raf = requestAnimationFrame(draw); });
    io.observe(canvas);
    size();
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [color, strength, scale]);
  return <canvas ref={ref} className={`dappled ${className}`.trim()} aria-hidden="true" />;
}
