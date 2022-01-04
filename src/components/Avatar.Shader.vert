varying vec2 vUv;
uniform float uTime;
uniform float uOffset; // y座標に比例して値をずらすが、そのままだとかなり値が大きいので調整するための係数
uniform float uFreq; // 振動数（の役割）。大きくすると波が細かくなる
uniform float uAmp; // 振幅（の役割）。大きくすると波が大きくなる

float PI = 3.1415926535897932384626433832795;

void main(){
  vUv = uv;
  vec3 pos = position;

  pos.x = pos.x + sin(pos.y * uOffset + uTime * uFreq * PI ) * uAmp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}