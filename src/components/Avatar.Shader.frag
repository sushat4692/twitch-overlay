varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform bool uGrayScaleFlag;
uniform bool uGamingFlag;
uniform float uTime;

const float redScale   = 0.298912;
const float greenScale = 0.586611;
const float blueScale  = 0.114478;
const vec3 monochromeScale = vec3(redScale, greenScale, blueScale);

float PI = 3.1415926535897932384626433832795;
float freq = 0.02;
float offset = 2.;

void main(){
    // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
    vec2 ratio = vec2(
        min(uPlaneAspect / uImageAspect, 1.0),
        min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
    );

    // 計算結果を用いて補正後のuv値を生成
    vec2 fixedUv = vec2(
        (vUv.x - 0.5) * ratio.x + 0.5,
        (vUv.y - 0.5) * ratio.y + 0.5
    );

    vec4 texture = texture2D(uTexture, fixedUv);

    if(texture.a < 0.5) {
        discard;
    }

    if(uGrayScaleFlag){
        float grayColor = dot(texture.rgb, monochromeScale);
        texture = vec4(vec3(grayColor), 1.0);
    }

    if (uGamingFlag) {
        texture.r = texture.r * abs(sin(vUv.x * offset + uTime * freq * PI));
        texture.g = texture.g * abs(sin(vUv.x * offset + uTime * freq * PI + 90. * PI / 180.));
        texture.b = texture.b * abs(sin(vUv.x * offset + uTime * freq * PI + 180. * PI / 180.));
    }

    gl_FragColor = texture;
}