varying float vClipDistance; // Distance from the vertex to the clipping plane
uniform vec3 u_color;
uniform vec2 u_resolution;
  varying vec3 vWorldPosition;

  uniform float hasLines;

#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>
  if (vClipDistance < 0.0) {
    discard; // Discard fragments on the wrong side of the plane
  }

  if(hasLines == 0.0){
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0); // Line color
  }else{
vec2 st = gl_FragCoord.xy/u_resolution;;
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

