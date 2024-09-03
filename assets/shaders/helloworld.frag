
precision mediump float;

uniform vec2 u_resolution; // 화면 해상도
uniform float u_time;      // 시간
out vec4 fragColor;



#define S smoothstep

float map(vec3 p) {
    vec3 n = vec3(0, 1, 0);
    float k1 = 0.1;
    float k2 = (sin(p.x * k1) + sin(p.z * k1)) * 0.2;
    float k3 = (sin(p.y * k1) + sin(p.z * k1)) * 0.2;
    float w1 = 10.0 - dot(abs(p), normalize(n)) + k2;
    float w2 = 10.0- dot(abs(p), normalize(n.yzx)) + k3;
    float s1 = length(mod(p.xy + vec2(sin((p.z + p.x) * 2.0) * 0.3, cos((p.z + p.x) * 1.0) * 0.5), 2.0) - 1.0) - 0.2;
    float s2 = length(mod(0.5+p.yz + vec2(sin((p.z + p.x) * 2.0) * 0.3, cos((p.z + p.x) * 1.0) * 0.3), 2.0) - 1.0) - 0.2;
    return min(w1, min(w2, min(s1, s2)));
}

vec2 rot(vec2 p, float a) {
    return vec2(
    p.x + p.y ,
    p.x  - p.y );

//    return vec2(
//    p.x * cos(a) - p.y * sin(a),
//    p.x * sin(a) + p.y * cos(a));
}

void main() {
    float time = u_time * 0.001;
    vec2 uv = ( gl_FragCoord.xy / u_resolution.xy ) * 2.0 - 1.0;
    vec3 dir = normalize(vec3(uv, 1.0));
    dir.xz = rot(dir.xz, time * 0.23);dir = dir.yzx;
    dir.xz = rot(dir.xz, time * 0.2);dir = dir.yzx;
    vec3 pos = vec3(0, 0, time);
    vec3 col = vec3(0.0);
    float t = 1.0;
    float tt = 1.0;


    fragColor.a = 1.0 / (t * t * t * t);

    fragColor = vec4(0.05*t+abs(dir) + max(0.0, map(ip - 0.1) - tt), 1.0);
}