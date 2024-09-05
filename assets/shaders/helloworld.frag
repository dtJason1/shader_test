
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
    if (maxValue > 1e-5)
    {
        colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
        colorOut.a = maxValue;
    }
    else
    {
        colorOut = vec4(0.0);
    }
    return colorOut;
}

#define BG_COLOR (vec3(sin(u_time)*0.5+0.5) * 0.0 + vec3(0.0))
#define time u_time*0.01
const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
const float noiseScale = 0.65;

float light1(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * dist * attenuation);
}

void draw( out vec4 _FragColor, in vec2 vUv )
{
    vec2 uv = vUv;
    float ang = atan(uv.y, uv.x);
    float len = length(uv);
    float v0, v1, v2, v3, cl;
    float r0, d0, n0;
    float r, d;

    // ring
    n0 = snoise3( vec3(uv * noiseScale, time * 0.5) ) * 0.5 + 0.5;
    r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
    d0 = distance(uv, r0 / len * uv);
    v0 = light1(1.0, 10.0, d0);
    v0 *= smoothstep(r0 * 1.05, r0, len);
    cl = cos(ang + time * 2.0) * 0.5 + 0.5;

    // high light
    float a = time * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    d = distance(uv, pos);
    v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0 , d0);

    // back decay
    v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);

    // hole
    v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

    // color
    vec3 c = mix(color1, color2, cl);
    vec3 col = mix(color1, color2, cl);
    col = mix(color3, col, v0);
    col = (col + v1) * v2 * v3;
    col.rgb = clamp(col.rgb, 0.0, 1.0);

    //gl_FragColor = extractAlpha(col);
    _FragColor = extractAlpha(col);
}


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

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


void main()
{





    vec2 uv = (FlutterFragCoord()*2.-u_resolution.xy)/u_resolution.y;

    vec4 col;
    draw(col, uv);

    vec3 bg = BG_COLOR;
    fragColor = vec4(mix(bg, col.rgb, col.a),1.0);
//    float px = 1.0/u_resolution.y;
//    vec2 p = FlutterFragCoord().xy*px;
//
//    vec3 col = vec3( 0.0,0.0,0.0 );
////    {
////        float y = 0.75+0.25*bnoise(6.0*p.x);
////        col = mix(col, vec3(1.0, 1.0, 1.0), 1.0 - smoothstep(0.0, 4.0*px, abs(p.y-y)));
////    }
//    {
//        vec3 ancol = 0.5 + 0.5*cos(u_time*0.001+p.xyx+vec3(0,2,4));
//        float y = 0.75 +0.25*bnoise(3.0 *p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).r);
//        float any = 0.75+0.25*bnoise(3.6*p.x*cos(u_time*0.001+p.xyx+vec3(0,2,4)).y);
//
//
//        if(p.y > (min(y,any) -0.3) && p.y < (max(y,any))-0.3 ){
//            fragColor = vec4( ancol, 1.0 );
//        }
//        else{
//            fragColor = vec4(0,0,0,1);
//        }
//    }


//    fragColor = vec4( col, 1.0 );

}




//    vec2 uv = FlutterFragCoord().xy/u_resolution.xy;


