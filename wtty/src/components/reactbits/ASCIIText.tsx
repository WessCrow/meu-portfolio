import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.;
  float waveFactor = uEnableWaves;
  vec3 transformed = position;
  transformed.x += sin(time + position.y) * 0.5 * waveFactor;
  transformed.y += cos(time + position.z) * 0.15 * waveFactor;
  transformed.z += sin(time + position.x) * waveFactor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;
  float move = sin(time + mouse) * 0.01;
  float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
  float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
  float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  deg: number;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width: number = 0;
  height: number = 0;
  cols: number = 0;
  rows: number = 0;
  center: { x: number; y: number } = { x: 0, y: 0 };
  mouse: { x: number; y: number } = { x: 0, y: 0 };

  constructor(renderer: THREE.WebGLRenderer, { fontSize, fontFamily, charset, invert }: any = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

    this.context.imageSmoothingEnabled = false;
    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width;
    this.cols = Math.floor(this.width / charWidth);
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;

    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '0';
    this.pre.style.top = '0';
    this.pre.style.zIndex = '9';
    this.pre.style.mixBlendMode = 'difference';
    this.pre.style.color = 'white';
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }
    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() { return this.mouse.x - this.center.x; }
  get dy() { return this.mouse.y - this.center.y; }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let str = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (x + y * w) * 4;
          const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
          if (a === 0) { str += ' '; continue; }
          let gray = (0.3 * r! + 0.6 * g! + 0.1 * b!) / 255;
          let idx = Math.floor((1 - gray) * (this.charset.length - 1));
          if (this.invert) idx = this.charset.length - idx - 1;
          str += this.charset[idx] ?? ' ';
        }
        str += '\n';
      }
      this.pre.innerHTML = str;
    }
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;

  constructor(txt: string, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    const textWidth = Math.ceil(metrics.width) + 20;
    const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    const yPos = 10 + metrics.actualBoundingBoxAscent;
    this.context.fillText(this.txt, 10, yPos);
    return this.canvas;
  }
}

class CanvAscii {
  textString: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  container: HTMLElement;
  width: number;
  height: number;
  enableWaves: boolean;

  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  filter?: AsciiFilter;
  material?: THREE.ShaderMaterial;
  geometry?: THREE.PlaneGeometry;
  texture?: THREE.CanvasTexture;
  mesh?: THREE.Mesh;
  canvasTxt?: CanvasTxt;
  mouse: { x: number; y: number };

  constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }: any, containerElem: HTMLElement, width: number, height: number) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: this.width / 2, y: this.height / 2 };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await (document as any).fonts.load('600 200px "IBM Plex Mono"');
      await (document as any).fonts.load('500 12px "IBM Plex Mono"');
    } catch (e) {}
    await (document as any).fonts.ready;
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.canvasTxt = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: '"IBM Plex Mono"',
      color: this.textColor
    });
    this.canvasTxt.resize();
    const txtCanvas = this.canvasTxt.render();

    this.texture = new THREE.CanvasTexture(txtCanvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    const aspect = txtCanvas.width / txtCanvas.height;
    const planeHeight = this.planeBaseHeight;
    const planeWidth = planeHeight * aspect;

    this.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 128, 128);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.texture },
        mouse: { value: 0 },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(PX_RATIO);
    this.renderer.setSize(this.width, this.height);

    this.filter = new AsciiFilter(this.renderer, {
      fontSize: this.asciiFontSize,
      fontFamily: '"IBM Plex Mono"',
      invert: true
    });
    this.filter.setSize(this.width, this.height);
    this.container.appendChild(this.filter.domElement);
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) / this.width;
    this.mouse.y = (e.clientY - rect.top) / this.height;
  }

  render(time: number) {
    if (this.material) {
      this.material.uniforms.uTime.value = time;
      this.material.uniforms.mouse.value = this.mouse.x;
    }
    if (this.filter) {
      this.filter.render(this.scene, this.camera);
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.filter) this.filter.setSize(width, height);
  }

  dispose() {
    this.filter?.dispose();
    this.geometry?.dispose();
    this.material?.dispose();
    this.texture?.dispose();
  }
}

interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
}

export default function ASCIIText({
  text = 'W-TTY',
  asciiFontSize = 12,
  textFontSize = 200,
  textColor = '#ffffff',
  planeBaseHeight = 8,
  enableWaves = true
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CanvAscii | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new CanvAscii(
      { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
      container,
      container.clientWidth,
      container.clientHeight
    );
    engineRef.current = engine;

    engine.init();

    let frameId: number;
    const animate = (time: number) => {
      engine.render(time / 1000);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      engine.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      if (container) container.innerHTML = '';
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
}
