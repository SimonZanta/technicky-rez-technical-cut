precision highp float;

// adding flat means that the color will not be interpolated 

uniform vec4 slicePlane;
varying vec3 vPosition;

void main() {
	float distance = dot(slicePlane.xyz, vPosition) + slicePlane.w;
    if (distance > 0.0) {
        discard; // Discard fragments below the plane
    }
	gl_FragColor = vec4(vec3(0.0, 1.0, 0.0), 1.0);
}