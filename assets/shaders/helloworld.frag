
precision mediump float;

uniform vec2 u_resolution; // 화면 해상도
uniform float u_time;      // 시간
out vec4 fragColor;



void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy);
    vec3 col = 0.5 + 0.5*cos(u_time*0.001+uv.xyx+vec3(0,2,4));



    // 배경 색상
    fragColor = vec4(col, 1.0);
}