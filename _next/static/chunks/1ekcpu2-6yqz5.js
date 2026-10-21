(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,84433,e=>{"use strict";var o=e.i(43476),i=e.i(71645),r=e.i(75056),t=e.i(98903),n=e.i(38408),a=e.i(90072),c=e.i(53920),l=e.i(81970),s=e.i(59340);let u=`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`,v=`
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uTwist;
varying float vDisp;
varying vec3 vObj;
${u}
float blobDisp(vec3 p){
  float n = snoise(p * uFreq + vec3(0.0, uTime * 0.16, uTime * 0.09));
  n += 0.18 * snoise(p * uFreq * 2.0 - vec3(uTime * 0.11));
  return n * uAmp;
}
vec3 twistY(vec3 p, float k){
  float a = p.y * k;
  float c = cos(a), s = sin(a);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}
vec3 blobPos(vec3 p){
  vec3 dir = normalize(p);
  return twistY(dir * (1.0 + blobDisp(dir)), uTwist);
}
`,m=`
vec3 bN = normalize(normal);
vec3 bT = normalize(abs(bN.y) > 0.98 ? cross(bN, vec3(1.0, 0.0, 0.0)) : cross(bN, vec3(0.0, 1.0, 0.0)));
vec3 bB = cross(bN, bT);
float bE = 0.012;
vec3 bP0 = blobPos(position);
vec3 bP1 = blobPos(position + bT * bE);
vec3 bP2 = blobPos(position + bB * bE);
vec3 objectNormal = normalize(cross(bP1 - bP0, bP2 - bP0));
vDisp = blobDisp(normalize(position));
vObj = bP0;
#ifdef USE_TANGENT
vec3 objectTangent = vec3( tangent.xyz );
#endif
`,p=`
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform vec3 uRimCol;
uniform float uRim;
uniform float uAmpF;
varying float vDisp;
varying vec3 vObj;
`,x=`
float g = clamp(dot(normalize(vObj), normalize(vec3(0.55, -0.7, 0.35))) * 0.5 + 0.5, 0.0, 1.0);
vec3 base = mix(uColA, uColB, smoothstep(0.15, 0.95, g));
base = mix(base, uColC, smoothstep(0.35, 1.0, vDisp / max(uAmpF, 0.001)) * 0.55);
diffuseColor.rgb = base;
`,f=`
float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
outgoingLight += uRimCol * fres * uRim;
`,b=Math.PI/180,y={dark:{a:"#6d5dfc",b:"#22d3ee",c:"#c084fc",rim:"#a5b4fc",rimK:.9,env:1.15},light:{a:"#5b4bf0",b:"#0ea5c6",c:"#a855f7",rim:"#818cf8",rimK:.45,env:.85}};function d({inputs:e,small:r}){let n=(0,i.useRef)(null),l=(0,i.useRef)(null),s=(0,i.useRef)(0),u=(0,i.useMemo)(()=>({a:new a.Es,b:new a.Es,c:new a.Es,r:new a.Es}),[]),b=(0,i.useMemo)(()=>({uTime:{value:0},uAmp:{value:.17},uAmpF:{value:.17},uFreq:{value:.82},uTwist:{value:0},uColA:{value:new a.Es(y.dark.a)},uColB:{value:new a.Es(y.dark.b)},uColC:{value:new a.Es(y.dark.c)},uRimCol:{value:new a.Es(y.dark.rim)},uRim:{value:y.dark.rimK}}),[]),h=(0,i.useMemo)(()=>{let e=new a.Ox({roughness:.18,metalness:.15,clearcoat:1,clearcoatRoughness:.08,iridescence:1,iridescenceIOR:1.35,iridescenceThicknessRange:[180,520],envMapIntensity:y.dark.env});return e.onBeforeCompile=e=>{Object.assign(e.uniforms,b),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
${v}`).replace("#include <beginnormal_vertex>",m).replace("#include <begin_vertex>","vec3 transformed = bP0;"),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
${p}`).replace("#include <color_fragment>",`#include <color_fragment>
${x}`).replace("#include <opaque_fragment>",`${f}
#include <opaque_fragment>`)},e.customProgramCacheKey=()=>"jo-blob-v1",e},[b]),w=(0,i.useMemo)(()=>new a.Pg(1,r?28:56),[r]);return(0,t.f)((o,i)=>{let r=e.current,t=n.current;if(!t||!r)return;let a=Math.min(i,.05),l=o.clock.elapsedTime,v=r.progress;s.current=(0,c.w)(s.current,1,2.2,a),b.uTime.value=l,b.uTwist.value=(0,c.w)(b.uTwist.value,2.6*v,6,a),b.uAmp.value=(0,c.w)(b.uAmp.value,.17+.08*v,4,a),b.uAmpF.value=b.uAmp.value;let m=y[r.theme],p=1-Math.exp(-6*a);b.uColA.value.lerp(u.a.set(m.a),p),b.uColB.value.lerp(u.b.set(m.b),p),b.uColC.value.lerp(u.c.set(m.c),p),b.uRimCol.value.lerp(u.r.set(m.rim),p),b.uRim.value=(0,c.w)(b.uRim.value,m.rimK,6,a),h.envMapIntensity=(0,c.w)(h.envMapIntensity,m.env,6,a);let x=.16*r.px+.04*Math.sin(.35*l),f=-(.12*r.py)+.04*Math.cos(.3*l);t.position.x=(0,c.w)(t.position.x,x,3,a),t.position.y=(0,c.w)(t.position.y,f+.35*v,3,a),t.position.z=(0,c.w)(t.position.z,-(2.2*v),5,a),t.rotation.y=(0,c.w)(t.rotation.y,.5*r.px+1.4*v+.06*l,3,a),t.rotation.x=(0,c.w)(t.rotation.x,.35*r.py+.4*v,3,a);let d=(.72+.28*s.current)*(1-.3*v);t.scale.setScalar(d)}),(0,o.jsx)("group",{ref:n,children:(0,o.jsx)("mesh",{ref:l,geometry:w,material:h})})}function h({radius:e}){let o=(0,n.f)(e=>e.camera),r=(0,n.f)(e=>e.size);return(0,i.useEffect)(()=>{let i=r.width/Math.max(1,r.height),t=o.fov*b/2,n=Math.atan(Math.tan(t)*i);o.position.z=e/Math.sin(Math.min(t,n)),o.updateProjectionMatrix()},[o,r,e]),null}e.s(["default",0,function({inputs:e,onReady:i,onFail:t,small:n,active:a}){return(0,o.jsxs)(r.f,{frameloop:a?"always":"never",dpr:(0,l.x)(),camera:{position:[0,0,4.4],fov:35},gl:{alpha:!0,antialias:!n,powerPreference:"high-performance"},style:{background:"transparent"},children:[(0,o.jsx)(c.u,{onFail:t}),(0,o.jsx)(s.f,{palette:"brand",small:n}),(0,o.jsx)("directionalLight",{position:[3,4,5],intensity:.6}),(0,o.jsx)(h,{radius:n?1.34:1.42}),(0,o.jsx)(d,{inputs:e,small:n}),(0,o.jsx)(c.h,{onReady:i})]})}])},64293,function(e){e.n(e.i(84433))},19419,e=>{"use strict";var o=e.i(30353);e.s(["f",()=>o.H])}]);