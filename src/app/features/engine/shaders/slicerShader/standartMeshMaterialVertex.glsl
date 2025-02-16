uniform vec4 clippingPlane; // Clipping plane equation (passed from JavaScript)
  varying vec3 vWorldPosition;
  varying vec2 vUv;

varying float vClipDistance; // Distance from the vertex to the clipping plane
#include <clipping_planes_pars_vertex>
void main() {
  #include <begin_vertex>
  #include <project_vertex>
   #include <clipping_planes_vertex>
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vClipDistance = dot(worldPosition, clippingPlane); // Calculate distance to plane
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}