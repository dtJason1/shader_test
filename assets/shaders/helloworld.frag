#version 460 core
#include <flutter/runtime_effect.glsl>

#define PI 3.14159265359
#define SCALE_FACTOR 8
#define TIME_SCALE 0.005

out vec4 fragColor;
uniform vec2 resolution;
uniform float time;




vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,PI);
    }

    return _st;
}



void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;


    st = tile(st,1.0);
    st = rotate2D(st,-PI*time*0.0001);
    st = rotateTilePattern(st*2.);
    st = rotate2D(st,PI*time*0.0001);

    fragColor = vec4(vec3(step(st.x,st.y)),1.0);

//    vec2 pos = gl_FragCoord.xy / resolution;
//    float scaledTime = time;
//    float verticalStripe = normalizeTrigonometricFunction(sin(pos.x * PI * SCALE_FACTOR + scaledTime));
//    float horizontalStripe = normalizeTrigonometricFunction(cos(pos.y * PI * SCALE_FACTOR + scaledTime));
//    float diagonalStripe = normalizeTrigonometricFunction(sin((pos.x + pos.y) * PI * SCALE_FACTOR+ scaledTime ));
//    vec3 verticalStripeColor = vec3(1.0, 0.5, 0.0) * verticalStripe;
//    vec3 horizontalStripeColor = vec3(0.7, 1.0, 0.0) * horizontalStripe;
//    vec3 diagonalStripeColor = vec3(1.0, 1.0, 1.0) * diagonalStripe;
//
//    vec3 mixedColor = mix(
//    mix(verticalStripeColor, horizontalStripeColor, pos.x),
//    diagonalStripeColor,
//    pos.y
//    );
//    fragColor = vec4( mixedColor, 1.0);
}