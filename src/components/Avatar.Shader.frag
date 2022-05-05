precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;

float PI = 3.1415926535897932384626433832795;
float freq = 0.02;
float offset = 2.;

void main(void) {
    // テクスチャのピクセルデータ
    vec4 color = texture2D(uSampler, vTextureCoord);

    // ゲーミング
    color.r = color.r * abs(sin(vTextureCoord.x * offset + uTime * freq * PI));
    color.g = color.g * abs(sin(vTextureCoord.x * offset + uTime * freq * PI + 90. * PI / 180.));
    color.b = color.b * abs(sin(vTextureCoord.x * offset + uTime * freq * PI + 180. * PI / 180.));

    gl_FragColor = color;
}