# Bounded Plane Shader for Slicing 3D Objects

This document outlines the steps to create a shader that slices 3D objects along a plane with precise positioning and bounded dimensions (e.g., 5x5 units). It includes implementation details for GPU shaders, bounding logic, and optional enhancements.

---

## 1. Plane Representation
A plane in 3D space is mathematically represented as:

\[ Ax + By + Cz + D = 0 \]

- (A,B,C) is the normal vector (perpendicular to the plane).
- D is the distance from the origin along the normal vector (negative if the plane is below the origin).

### Defining the Plane
#### Using a Point and Normal Vector
- a. Using a Point and Normal Vector

If you know:

- A point P0=(x0,y0,z0) on the plane.
- A normal vector N=(A,B,C).

Then the plane equation is:
- A(x−x0)+B(y−y0)+C(z−z0)=0

Simplify to:
- Ax+By+Cz+D=0, where D=−(Ax0+By0+Cz0)


#### Using Three Points
If you know three points P1,P2,P3​ on the plane:
1. Compute two vectors in the plane:
- v1=P2−P1
- v2​=P3​−P1
2. Compute the normal vector as the cross product:
- N=v1×v2
3. Use one of the points (e.g., P1) and the computed N to derive D:
- D=−(N⋅P1)

---

#### Using a Normal Vector and a Distance

If you know:

The normal vector N=(A,B,C)
The distance d from the origin to the plane along N.

Then:
1. Normalize the normal vector:
- N′=N\∥N∥
2. Use d as D:
- D=−d\
If d>0, the plane faces the positive direction of the normal vector. If d<0, it faces the opposite direction.
---

## 3. Implementation in GLSL or Three.js

GLSL Uniform for the Plane

Pass the plane as a vec4 uniform:
```javascript
const planeNormal = new THREE.Vector3(0, 1, 0); // Example normal (pointing up)
const planePoint = new THREE.Vector3(0, 0, 0); // Example point on the plane
const planeD = -planeNormal.dot(planePoint); // Compute D
const plane = new THREE.Vector4(planeNormal.x, planeNormal.y, planeNormal.z, planeD);
```
Pass this plane to the shader as a uniform:

```javascript
shader.uniforms.plane.value = plane;
```

GLSL fragment Shader Example

Use the plane uniform in the shader to compute the distance of a point (e.g., fragment position) to the plane:

```glsl
uniform vec4 plane; // Plane in the form vec4(A, B, C, D)

varying vec3 vPosition; // Fragment's position in world space

void main() {
    float distance = dot(plane.xyz, vPosition) + plane.w;
    if (distance < 0.0) {
        discard; // Discard fragments below the plane
    }
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Example fragment color
}
```

---

## 3.5 Another GLSL Shader Implementation

### Uniforms
- `vec4 plane`: The plane equation \((A, B, C, D)\).
- `vec3 planeCenter`: Center of the bounded plane.
- `vec2 planeSize`: Width and height of the plane.

### Shader Code
#### Fragment Shader
```glsl
uniform vec4 plane; // Plane equation: vec4(A, B, C, D)
uniform vec3 planeCenter; // Center of the bounded plane
uniform vec2 planeSize; // vec2(width, height)

varying vec3 vPosition; // Fragment position in world space

void main() {
    // Distance to the infinite plane
    float distance = dot(plane.xyz, vPosition) + plane.w;
    if (distance > 0.0) {
        discard; // Only keep fragments below the plane
    }

    // Project fragment position onto the plane's local axes
    vec3 toFragment = vPosition - planeCenter;
    vec3 localX = normalize(cross(plane.xyz, vec3(0.0, 1.0, 0.0))); // Local X-axis
    vec3 localY = cross(plane.xyz, localX);                        // Local Y-axis

    float x = dot(toFragment, localX);
    float y = dot(toFragment, localY);

    // Check if the fragment is within the bounds of the plane
    if (abs(x) > planeSize.x / 2.0 || abs(y) > planeSize.y / 2.0) {
        discard; // Outside bounds, discard fragment
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Example color
}
```

---

## 4. Three.js Integration

### Plane Definition
```javascript
const planeSize = new THREE.Vector2(5, 5); // 5x5 plane
const planeCenter = new THREE.Vector3(0, 0, 0); // Center at origin
const planeNormal = new THREE.Vector3(0, 1, 0); // Normal pointing up
const planeD = -planeNormal.dot(planeCenter);

const plane = new THREE.Vector4(planeNormal.x, planeNormal.y, planeNormal.z, planeD);
```

### Pass Uniforms
```javascript
shader.uniforms.plane.value = plane;
shader.uniforms.planeCenter.value = planeCenter;
shader.uniforms.planeSize.value = planeSize;
```

---

## 5. Optional Enhancements

### Plane Thickness
Add a slab effect by testing if the distance falls within a range:
```glsl
if (distance < -thickness / 2.0 || distance > thickness / 2.0) {
    discard;
}
```

### Visual Debugging
Use a helper mesh (e.g., `THREE.PlaneGeometry`) to visualize the plane in the scene:
```javascript
const planeHelper = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const planeMesh = new THREE.Mesh(planeHelper, planeMaterial);
scene.add(planeMesh);
```

---

## 6. Resources

### Learning GLSL
- [The Book of Shaders](https://thebookofshaders.com/)
- [OpenGL Shading Language (GLSL) Documentation](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL))

### Three.js Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js ShaderMaterial Guide](https://threejs.org/docs/#api/en/materials/ShaderMaterial)

### Plane Clipping and Bounded Logic
- [Learn OpenGL - Clipping Planes](https://learnopengl.com/Advanced-OpenGL/Depth-testing)
- [Sutherland-Hodgman Clipping (Wikipedia)](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)

---

This guide should help you implement a bounded slicing shader with dynamic plane dimensions. Feel free to expand upon this setup for specific applications such as interactive slicing or capping cut surfaces.
