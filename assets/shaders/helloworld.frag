
precision mediump float;

uniform vec2 u_resolution; // 화면 해상도
uniform float u_time;      // 시간

#include <flutter/runtime_effect.glsl>


out vec4 fragColor;

//vec3 hash33(vec3 p3)
//{
//    p3 = fract(p3 * MOD3);
//    p3 += dot(p3, p3.yxz+19.19);
//    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
//}
//
//float simplex_noise(vec3 p)
//{
//    const float K1 = 0.333333333;
//    const float K2 = 0.166666667;
//
//    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
//    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
//
//    vec3 e = step(vec3(0.0), d0 - d0.yzx);
//    vec3 i1 = e * (1.0 - e.zxy);
//    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
//
//    vec3 d1 = d0 - (i1 - 1.0 * K2);
//    vec3 d2 = d0 - (i2 - 2.0 * K2);
//    vec3 d3 = d0 - (1.0 - 3.0 * K2);
//
//    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
//    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
//
//    return dot(vec4(31.316), n);
//}


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

//float noise (in vec2 st) {
//    vec2 i = floor(st);
//    vec2 f = fract(st);
//
//    // Four corners in 2D of a tile
//    float a = random(i +vec2(0.0, 0.8));
//    float b = random(i +vec2(1.0, 0.6));
//    float c = random(i +vec2(0.0, 1.0));
//    float d = random(i +vec2(1.0, 0.2));
//
//    // Smooth Interpolation
//
//    // Cubic Hermine Curve.  Same as SmoothStep()
//    vec2 u = f*f*(3.0-2.0*f);
//    // u = smoothstep(0.,1.,f);
//
//    // Mix 4 coorners percentages
//    return mix(a, b, u.x) +
//    (c - a)* u.y * (1.0 - u.x) +
//    (d - b) * u.x * u.y;
//}
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


void main()
{
    float px = 1.0/u_resolution.y;
    vec2 p = FlutterFragCoord().xy*px;

    vec3 col = vec3( 0.0,0.0,0.0 );
//    {
//        float y = 0.75+0.25*bnoise(6.0*p.x);
//        col = mix(col, vec3(1.0, 1.0, 1.0), 1.0 - smoothstep(0.0, 4.0*px, abs(p.y-y)));
//    }
    {
        vec3 ancol = 0.5 + 0.5*cos(u_time*0.001+p.xyx+vec3(0,2,4));
        float y = 0.75  +0.25*bnoise(3.0 * p.x) *cos(u_time*0.001+p.xyx+vec3(0,2,4)*2).x ;
        float any = 0.75+ +0.25*bnoise(4.0*p.x)*cos(u_time*0.001+p.xyx+vec3(0,2,4)).x;


        if(p.y > (min(y,any) -0.4 ) && p.y < (max(y,any))-0.4){
            fragColor = vec4( ancol, 1.0 );
        }
        else{
            fragColor = vec4(0,0,0,1);
        }
    }


//    fragColor = vec4( col, 1.0 );

}




//    vec2 uv = FlutterFragCoord().xy/u_resolution.xy;


