import {inject, Injectable, signal} from '@angular/core';
import {BufferGeometry, Vector3} from 'three';
import * as THREE from 'three';
import {MaterialService} from "../../engine/service/material.service";

@Injectable({
    providedIn: 'root'
})
export class SlicerService {
    //https://threejs.org/examples/?q=sli#webgpu_tsl_angular_slicing
    // slicing is showed in docs\slicing_using_fragment_shader_GPT.md

    public readonly slicers: THREE.Mesh[] = [];
    public slicerPlane: THREE.Vector4;
    public slicerPosition = signal<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

    initSlicers() {
        this.slicerPlane = this.setSlicePlane(this.slicerPosition())
        this.createSlicerGeometry()
    }

    setSlicePlane(position: THREE.Vector3) {
        // Calculate plane equation (ax + by + cz + d = 0)
        const normal = new THREE.Vector3(0, 0, 1);
        const d = -normal.dot(position);

        return new THREE.Vector4(normal.x, normal.y, normal.z, d);
    }

    createSlicerGeometry() {
        //TODO make this with max size of object

        //TODO add cuts with angles not just plane
        const geometry = this.getMockSlicerGeometry();
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.slicers.push(mesh);
    }

    updateSlicerPosition(position: THREE.Vector3) {
        const slicer = this.slicers.at(0);
        if (slicer) {
            slicer.position.set(position.x, position.y, position.z);
        }
        this.slicerPosition.set(position)
    }

    getMockSlicerGeometry() {
        const geometry = new THREE.BufferGeometry()
        const vertices = [
            // bigger plane
            -0.5, -0.5, this.slicerPosition().z, // v0
            0.5, -0.5, this.slicerPosition().z, // v1
            0.5, 0.5, this.slicerPosition().z, // v2
            -0.5, 0.5, this.slicerPosition().z, // v3

            // smaller plane
            -0.25, -0.25, this.slicerPosition().z, // v4
            0.25, -0.25, this.slicerPosition().z, // v5
            0.25, 0.25, this.slicerPosition().z, // v6
            -0.25, 0.25, this.slicerPosition().z, // v7
        ]

        const indices = [
            0, 4, 5,
            0, 1, 5,
            1, 5, 6,
            1, 2, 6,
            2, 6, 7,
            2, 3, 7,
            3, 7, 4,
            3, 0, 4
        ];
         
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        return geometry
    }
}
