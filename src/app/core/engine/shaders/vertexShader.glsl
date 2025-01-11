// https://github.com/angular/angular-cli/pull/26371
// importing of glsl files in angular

// https://www.youtube.com/watch?v=oKbCaj1J6EI&t=3s
// shader tutorial
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}