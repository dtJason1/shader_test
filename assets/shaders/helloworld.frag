#ifdef GL_ES
precision mediump float;
#endif

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.010

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

uniform vec2 resolution;
uniform float Time;
out vec4 fragColor;
void main(void){
    vec2 uv= gl_FragCoord.xy/resolution.xy-.5;

    float itime= Time * speed *0.01;
    vec3 dir=vec3(uv*zoom,1.) - vec3(itime);

    //volumetric rendering
    float s=0.1, fade=1.;
    vec3 v=vec3(0.);

    for (int r=0; r<volsteps; r++) {
        vec3 p=s*dir*.5;
        p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
        float pa,a=pa=0.;
        for (int i=0; i<iterations; i++) {
            p=abs(p)/dot(p,p)-formuparam ; // the magic formula
            a+=abs(length(p)-pa); // absolute sum of average change
            pa=length(p);

        }
        float dm=max(0.,darkmatter-a*a*.001); //dark matter
        a*=a*a; // add contrast
        if (r>6) fade*=1.-dm;
        //v+=vec3(dm,dm*.5,0.);
        v+=fade;
        v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
        fade*=distfading; // distance fading
        s+=stepsize;
    }
    v=mix(vec3(length(v)),v,saturation);
    fragColor = vec4(v*.01,1.);
}