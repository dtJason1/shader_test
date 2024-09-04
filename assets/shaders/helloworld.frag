
precision mediump float;

uniform vec2 u_resolution; // 화면 해상도
uniform float u_time;      // 시간
#define COUNT 10.
#define COL_BLACK vec3(23,32,38) / 255.0

#define SF 1./min(u_resolution.x,u_resolution.y)
#define SS(l,s) smoothstep(SF,-SF,l-s)
#define hue(h) clamp( abs( fract(h + vec4(3,2,1,0)/3.) * 6. - 3.) -1. , 0., 1.)

#define MOD3 vec3(.1031,.11369,.13787)


#include <flutter/runtime_effect.glsl>


out vec4 fragColor;

vec3 hash33(vec3 p3)
{
    p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplex_noise(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;

    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);

    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);

    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));

    return dot(vec4(31.316), n);
}



void main()
{

    vec2 uv = FlutterFragCoord().xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;

    float m = 0.;
    float t = u_time *.5*0.001;
    vec3 col;


    float edge = simplex_noise(vec3(1.,0,0))*.2 + (.5/COUNT)*COUNT + .25;

    m *= SS(edge, uv.y+.015);

    col = hue(0.5).rgb;



    col = mix(COL_BLACK, col, m);

    fragColor = vec4(col,1.0);
}