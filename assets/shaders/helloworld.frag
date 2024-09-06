
precision mediump float;

uniform vec2 u_resolution; // 화면 해상도
uniform float u_time;      // 시간

#include <flutter/runtime_effect.glsl>


out vec4 fragColor;

vec3 hash33(vec3 p3)
{
    p3 = fract(p3 * vec3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
}
float snoise3(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;

    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);

    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;

    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));

    return dot(vec4(31.316), n);
}

vec4 extractAlpha(vec3 colorIn)
{
    vec4 colorOut;
    float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
    colorOut.rgb = 0.5 + 0.5*cos(u_time*0.001+vec3(0,2,4));
    colorOut.a = maxValue;
    return colorOut;
}

#define BG_COLOR (vec3(0,0,0))
#define time u_time*0.01
const vec3 color1 = vec3(0.0, 0.0, 0.0);
const vec3 color2 =  vec3(1.0, 0.0, 0.0);
const vec3 color3 =  vec3(0.0, 0.0, 0.0);
const float noiseScale = 0.01;


// 단순 해시 기반의 노이즈 함수
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
// Basic noise
float bnoise( in float x )
{
    // setup
    float i = floor(x);
    float f = fract(x);
    float s = sign(fract(x/2.0)-0.5);

    // use some hash to create a random value k in [0..1] from i
    //float k = hash(uint(i));
    //float k = 0.5+0.5*sin(i);
    float k = fract(i*.1731);

    // quartic polynomial
    return s*f*(f-1.0)*((16.0*k-4.0)*f*(f-1.0)-1.0);
}




float light1(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * attenuation);
}

// clamp  0~1 밀도가 높은 곳에서 더 크게 색깔이 변하는


void draw( out vec4 _FragColor, in vec2 vUv )
{
    float px = 1.0/u_resolution.y;
    vec2 p = FlutterFragCoord().xy*px;


    vec2 uv = vUv;

    float len = length(uv);
    float v0, v1, v2, v3, cl;
    float r0, d0, n0;
    float r, d;


    float y = 0.75 +0.25*bnoise(3.0 *p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).r);
    float any = 0.75+0.25*bnoise(5.0*p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).g);

    // ring
    n0 = snoise3( vec3(uv * noiseScale,  0.5) ) * 0.5 + 0.5;
    d0 = distance(uv, vec2(uv.x,min(y,any) -0.5));
    float d1 = distance(uv, vec2(uv.x , max(y,any) -0.5));

    vec2 pos = vec2(uv.x,min(y,any));



     v1 = light1(1.0, 50.0 , d0);
     v2 = light1(1.0,50.0, d1);



    vec3 col = mix(color1, color2, cl);

    col = (col  + v1 );
    col = (col  + v2 );


    col.rgb = clamp(col.rgb, 0.0, 1.0);

    _FragColor = extractAlpha(col);
}


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}


void main()
{
//    float px = 1.0/u_resolution.y;
//    vec2 p = FlutterFragCoord().xy*px;
//
//    vec3 col = vec3( 0.0,0.0,0.0 );
//
//    {
//        vec3 ancol = 0.5 + 0.5*cos(u_time*0.001+p.xyx+vec3(0,2,4));
//        float y = 0.75 +0.25*bnoise(3.0 *p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).r);
//        float any = 0.75+0.25*bnoise(5.0*p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).g);
//
//
//        if(p.y > (min(y,any) -0.3) && p.y < (max(y,any))-0.3 ){
//
//            fragColor = vec4( ancol, 1.0 );
//        }
//        else{
//            fragColor = vec4(0,0,0,1);
//        }
//    }
    vec2 uv = (FlutterFragCoord()*2-u_resolution.xy)/u_resolution.xy;

    vec4 col;
    vec4 myvec4;
    draw(col, uv);
    vec3 bg = BG_COLOR;
    myvec4 = vec4(mix(bg, col.rgb, col.a),1.0);

    fragColor = myvec4;

}




//    vec2 uv = FlutterFragCoord().xy/u_resolution.xy;


