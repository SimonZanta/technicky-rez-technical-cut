varying float vClipDistance; // Distance from the vertex to the clipping plane
uniform vec3 u_color;
#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>
  if (vClipDistance < 0.0) {
    discard; // Discard fragments on the wrong side of the plane
  }
  gl_FragColor = vec4(u_color, 1.0); // Your fragment color
}