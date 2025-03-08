//precision high float;

// https://github.com/daign/clipping-with-caps/

// adding flat means that the color will not be interpolated

uniform vec4 slicePlane;
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>

  float greyScale = 0.8;

  vec3 lightDir = normalize(vec3(0.0, 0.0, 1.0)); 

  if (gl_FrontFacing) { 
    float fragDot = abs(dot(lightDir, normalize(vNormal)));
    gl_FragColor = vec4(vec3(greyScale) * fragDot, 1.0);
  }
  else { //back facing (creates illusion of full material)
    gl_FragColor = vec4(vec3(greyScale), 1.0);
  }
}
