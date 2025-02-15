// https://stackoverflow.com/questions/42532545/add-clipping-to-three-shadermaterial

// https://github.com/angular/angular-cli/pull/26371
// importing of glsl files in angular

// https://www.youtube.com/watch?v=oKbCaj1J6EI&t=3s
// shader tutorial

// https://stackoverflow.com/questions/16522897/how-to-cut-an-object-using-webgl-shaders
// https://thebookofshaders.com
#include <clipping_planes_pars_vertex>
//varying vec3 vPosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  #include <begin_vertex>
  //  vPosition = position;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  #include <project_vertex>
  #include <clipping_planes_vertex>
}
