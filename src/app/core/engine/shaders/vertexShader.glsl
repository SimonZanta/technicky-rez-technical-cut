// https://github.com/angular/angular-cli/pull/26371
// importing of glsl files in angular

// https://www.youtube.com/watch?v=oKbCaj1J6EI&t=3s
// shader tutorial

// https://stackoverflow.com/questions/16522897/how-to-cut-an-object-using-webgl-shaders
// https://thebookofshaders.com

varying vec3 vPosition;	

void main() {

	vPosition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}