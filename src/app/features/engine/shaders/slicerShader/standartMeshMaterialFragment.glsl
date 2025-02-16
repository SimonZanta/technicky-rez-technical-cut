uniform vec3 u_color;
uniform vec2 u_resolution;
  varying vec3 vWorldPosition;
varying vec2 vUv;
  uniform float hasLines;

#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>

  if(hasLines == 0.0){
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0); // Line color
  }else{
  vec2 st = vUv.xy;
	vec3 canvas = vec3(0.0);
    
    float line = .003;
    
    float angle =  3.14159265358 / 4.0;
    
    vec2 dir = vec2(cos(angle), sin(angle));
    
    float distanceToLine = abs(dot(st, dir));
    
    float linePosition = mod(distanceToLine, line * 2.);
  if (linePosition < line) {
    gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0); // Line color
  } else {
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0); // Background color
  }
  }
}
