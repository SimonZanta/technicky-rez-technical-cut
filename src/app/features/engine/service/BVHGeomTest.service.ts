import {inject, Injectable} from '@angular/core';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

/**
 * Test box geometry with plane slicer
 * - !! for testing only !!
 * - used for testing BVH functionality
 * - creates slice using plane
 * - closes slice using stencil buffer cap
 */
@Injectable({
  providedIn: 'root'
})
export class BVHGeomTest {

    //https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/clippedEdges.js
    //

    clippingPlane: THREE.Plane;
    frontModel: THREE.Mesh;
    backModel: THREE.Mesh;
    capMesh: THREE.Mesh;
    outlineLines: THREE.LineSegments;
    private colliderBvh: MeshBVH;


     // Temporary variables for calculations
     private tempLine = new THREE.Line3();
     private tempVector = new THREE.Vector3();
     private localPlane = new THREE.Plane();
     private inverseMatrix = new THREE.Matrix4();

    init(){
        // Clipping plane
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

        // Create geometry
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        
        // Create BVH
        this.colliderBvh = new MeshBVH(geometry);

        // Setup materials
        const frontMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            side: THREE.FrontSide,
            clippingPlanes: [this.clippingPlane],
            stencilWrite: true,
            stencilFunc: THREE.AlwaysStencilFunc,
            stencilRef: 1,
            stencilZPass: THREE.IncrementWrapStencilOp
        });

        const backMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            side: THREE.BackSide,
            clippingPlanes: [this.clippingPlane],
            stencilWrite: true,
            stencilFunc: THREE.AlwaysStencilFunc,
            stencilRef: 1,
            stencilZPass: THREE.DecrementWrapStencilOp
        });

        // Create meshes
        this.frontModel = new THREE.Mesh(geometry, frontMaterial);
        this.backModel = new THREE.Mesh(geometry, backMaterial);

        // Create outline geometry
        const lineGeometry = new THREE.BufferGeometry();
        const linePosAttr = new THREE.BufferAttribute(new Float32Array(300000), 3, false);
        linePosAttr.setUsage(THREE.DynamicDrawUsage);
        lineGeometry.setAttribute('position', linePosAttr);
        
        this.outlineLines = new THREE.LineSegments(
            lineGeometry,
            new THREE.LineBasicMaterial({ color: 0x00acc1 })
        );
        this.outlineLines.frustumCulled = false;
    }

    private updateCrossSection() {
        // Get the clipping plane in local space
        this.inverseMatrix.copy(this.frontModel.matrixWorld).invert();
        this.localPlane.copy(this.clippingPlane).applyMatrix4(this.inverseMatrix);

        let index = 0;
        const posAttr = this.outlineLines.geometry.attributes['position'];

        // Find intersections using shapecast
        this.colliderBvh.shapecast({
            intersectsBounds: (box) => {
                return this.localPlane.intersectsBox(box);
            },
            intersectsTriangle: (tri) => {
                let count = 0;

                // Check edge: a -> b
                this.tempLine.start.copy(tri.a);
                this.tempLine.end.copy(tri.b);
                if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
                    posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                    index++;
                    count++;
                }

                // Check edge: b -> c
                this.tempLine.start.copy(tri.b);
                this.tempLine.end.copy(tri.c);
                if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
                    posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                    index++;
                    count++;
                }

                // Check edge: c -> a
                this.tempLine.start.copy(tri.c);
                this.tempLine.end.copy(tri.a);
                if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
                    posAttr.setXYZ(index, this.tempVector.x, this.tempVector.y, this.tempVector.z);
                    index++;
                    count++;
                }

                // Remove if we don't have exactly 2 intersection points
                if (count !== 2) {
                    index -= count;
                }
            }
        });

        // Update geometry
        this.outlineLines.geometry.setDrawRange(0, index);
        posAttr.needsUpdate = true;
    }

    public updateClipPlane(normal: THREE.Vector3, constant: number) {
        this.clippingPlane.normal.copy(normal);
        this.clippingPlane.constant = constant;
        this.updateCrossSection();
    }
}
