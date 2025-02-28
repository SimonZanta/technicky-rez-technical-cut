uniform vec2 objectSize; // The dimensions of the object
uniform float lineWidth; // Width of lines in world units
uniform float lineAngle; // Angle in radians

varying vec2 vUv;
uniform float hasLines;

#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>

  if(hasLines == 0.0){
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0); // Line color
  }else{
    vec2 st = vUv.xy;

    vec2 aspectRatio = objectSize / max(objectSize.x, objectSize.y);
    vec2 adjustedUV = st * aspectRatio;
    
    float line = lineWidth;
    
    float angle = lineAngle;
    
    vec2 dir = normalize(vec2(cos(angle), sin(angle)));
    
    float distanceToLine = abs(dot(adjustedUV, dir));
    
    float linePosition = mod(distanceToLine, line * 2.);
  if (linePosition < line) {
    gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0); // Line color
  } else {
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0); // Background color
  }
  }
}
