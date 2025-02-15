//precision high float;

// https://github.com/daign/clipping-with-caps/

// adding flat means that the color will not be interpolated

uniform vec4 slicePlane;
//varying vec3 vPosition;
uniform float time;

//varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

#include <clipping_planes_pars_fragment>
void main() {
  //  float distance = dot(slicePlane.xyz, vPosition) + slicePlane.w;
  //  if (distance > -0.01 && distance < 0.0){
  //    gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);
  //  }else if (distance > 0.0) {
  //    discard;// Discard fragments below the plane
  //  }else{
  //  }


  // this is used for function clipping
  // Define a sine wave clipping function
  //  float waveHeight = sin(vPosition.x * 2.0 + 0.2) * 0.5;
  //
  //  // Clip fragments below the wave
  //  if (vPosition.y < waveHeight) {
  //    discard;
  //  }
  #include <clipping_planes_fragment>

  //  gl_FragColor = vec4(color, 1.0);
  gl_FragColor = vec4(vec3(0.0, 1.0, 0.0), 1.0);
}
