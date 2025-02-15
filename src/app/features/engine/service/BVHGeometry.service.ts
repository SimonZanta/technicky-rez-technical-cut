import {inject, Injectable} from '@angular/core';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import {BufferGeometry} from 'three';
import { GeometryService } from './geometry.service';
import standartMeshMaterialVertex from '../shaders/slicerShader/standartMeshMaterialVertex.glsl'
import standartMeshMaterialFragment from '../shaders/slicerShader/standartMeshMaterialFragment.glsl'
import { SlicerService } from '../../slicer/service/slicer.service';

@Injectable({
  providedIn: 'root'
})
export class BVHGeometryService {
    //https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/clippedEdges.js
      //https://github.com/gkjohnson/three-mesh-bvh
  
      geometryService = inject(GeometryService)
      slicerService = inject(SlicerService)

      bvhGeometrie: {model: THREE.Mesh, cap: THREE.Mesh}[] = [] 

      private clippingPlane: THREE.Plane;
      frontModel: THREE.Mesh;
      backModel: THREE.Mesh;


      // private basicMeshMaterial = new THREE.MeshStandardMaterial({
      //             color: 0x00ff00,
      //             side: THREE.FrontSide,
      //             clippingPlanes: [],
      //             stencilWrite: true,
      //             stencilFunc: THREE.AlwaysStencilFunc,
      //             stencilRef: 1,
      //             stencilZPass: THREE.DecrementWrapStencilOp
      //         });

      // private capMaterial = new THREE.MeshStandardMaterial({
      //             color: 0x00ff00,
      //             side: THREE.BackSide,
      //             clippingPlanes: [],
      //             stencilWrite: true,
      //             stencilFunc: THREE.AlwaysStencilFunc,
      //             stencilRef: 1,
      //             stencilZPass: THREE.DecrementWrapStencilOp
      //         });

      private basicMeshMaterial = new THREE.ShaderMaterial({
        vertexShader: standartMeshMaterialVertex,
        fragmentShader: standartMeshMaterialFragment,
        side: THREE.FrontSide,
        clippingPlanes: [],
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilRef: 1,
        stencilZPass: THREE.DecrementWrapStencilOp
    });

    private capMaterial = new THREE.ShaderMaterial({
  vertexShader: standartMeshMaterialVertex,
  fragmentShader: standartMeshMaterialFragment,
  side: THREE.FrontSide,
  clippingPlanes: [],
  stencilWrite: true,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilRef: 1,
  stencilZPass: THREE.DecrementWrapStencilOp
});

      init(clippingPlane: THREE.Plane){
          this.clippingPlane = clippingPlane

          // this.capMaterial.uniforms['clipPlane'].value = this.slicerService.getSlicerAsVector()
          // this.basicMeshMaterial.uniforms['clipPlane'].value = this.slicerService.getSlicerAsVector()

          this.capMaterial.clippingPlanes?.push(this.clippingPlane)
          this.basicMeshMaterial.clippingPlanes?.push(this.clippingPlane)
      }
  
      getGeometryBVH(geometry: THREE.BufferGeometry){ 
          if(!this.clippingPlane) throw Error('no clipping plane')

          //   const basicMeshMaterial = new THREE.MeshStandardMaterial({
          //     color: 0xff00ff,
          //     side: THREE.FrontSide,
          //     clippingPlanes: [this.clippingPlane], // Apply the clipping plane
          //     stencilWrite: true,
          //     stencilFunc: THREE.AlwaysStencilFunc,
          //     stencilRef: 1,
          //     stencilZPass: THREE.ReplaceStencilOp // Writes 1 to the stencil buffer
          // });

        //   const basicMeshMaterial = new THREE.ShaderMaterial({
        //     vertexShader: standartMeshMaterialVertex,
        //     fragmentShader: standartMeshMaterialFragment,
        //     side: THREE.FrontSide,
        //       clippingPlanes: [this.clippingPlane], // Apply the clipping plane
        //       stencilWrite: true,
        //       stencilFunc: THREE.AlwaysStencilFunc,
        //       stencilRef: 1,
        //       stencilZPass: THREE.ReplaceStencilOp // Keeps the stencil buffer unchanged
        // });
          
        //   const capMaterial = new THREE.ShaderMaterial({
        //       vertexShader: standartMeshMaterialVertex,
        //       fragmentShader: standartMeshMaterialFragment,
        //       side: THREE.BackSide, // Caps should render on both sides
        //       clippingPlanes: [this.clippingPlane], // Apply the same clipping plane
        //       stencilWrite: true,
        //       stencilFunc: THREE.NotEqualStencilFunc, // Only render where stencil == 1
        //       stencilRef: 1,
        //       stencilZPass: THREE.KeepStencilOp // Keeps the stencil buffer unchanged
        //   });

        const basicMeshMaterial = new THREE.ShaderMaterial({    
          vertexShader: standartMeshMaterialVertex,
          fragmentShader: standartMeshMaterialFragment,
          uniforms: {
            clippingPlane: { value: new THREE.Vector4(this.clippingPlane.normal.x, this.clippingPlane.normal.y, this.clippingPlane.normal.z, this.clippingPlane.constant)},
            u_color: {value: new THREE.Color(0xff00ff)}
          },  
          // color: 0xff00ff,
          side: THREE.FrontSide,
                      clippingPlanes: [this.clippingPlane],
          stencilWrite: true,
                stencilFunc: THREE.AlwaysStencilFunc, // Only render where stencil == 1
                stencilRef: 1,
                stencilZPass: THREE.IncrementWrapStencilOp
        });
        
        // Cap material
        const capMaterial = new THREE.ShaderMaterial({
          vertexShader: standartMeshMaterialVertex,
          fragmentShader: standartMeshMaterialFragment,
          uniforms: {
            clippingPlane: { value: new THREE.Vector4(this.clippingPlane.normal.x, this.clippingPlane.normal.y, this.clippingPlane.normal.z, this.clippingPlane.constant)},
            u_color: {value: new THREE.Color(0x00ff00)}
          },
          // color: 0xff00ff,
          side: THREE.BackSide,
                      clippingPlanes: [this.clippingPlane],
          stencilWrite: true,
                stencilFunc: THREE.AlwaysStencilFunc, // Only render where stencil == 1
                stencilRef: 1,
                stencilZPass: THREE.DecrementWrapStencilOp
        });


          const finalGeom = {model: new THREE.Mesh(geometry, basicMeshMaterial), cap: new THREE.Mesh(geometry, capMaterial)}

          this.bvhGeometrie.push(finalGeom)
  
          return finalGeom
      }
  
      private updateCrossSection(geom: THREE.BufferGeometry) {

      //          // Temporary variables for calculations
      //  const tempLine = new THREE.Line3();
      //  const tempVector = new THREE.Vector3();
      //  const localPlane = new THREE.Plane();
      //  const inverseMatrix = new THREE.Matrix4();
      //     const colliderBvh = new MeshBVH(geom);

      //     // Get the clipping plane in local space
      //     inverseMatrix.copy(this.frontModel.matrixWorld).invert();
      //     localPlane.copy(this.clippingPlane).applyMatrix4(inverseMatrix);
  
      //     let index = 0;
      //     const posAttr = geom.attributes['position'];
  
      //     // Find intersections using shapecast
      //     colliderBvh.shapecast({
      //         intersectsBounds: (box) => {
      //             return localPlane.intersectsBox(box);
      //         },
      //         intersectsTriangle: (tri) => {
      //             let count = 0;
  
      //             // Check edge: a -> b
      //             tempLine.start.copy(tri.a);
      //             tempLine.end.copy(tri.b);
      //             if (localPlane.intersectLine(tempLine, tempVector)) {
      //                 posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
      //                 index++;
      //                 count++;
      //             }
  
      //             // Check edge: b -> c
      //             tempLine.start.copy(tri.b);
      //             tempLine.end.copy(tri.c);
      //             if (localPlane.intersectLine(tempLine, tempVector)) {
      //                 posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
      //                 index++;
      //                 count++;
      //             }
  
      //             // Check edge: c -> a
      //             tempLine.start.copy(tri.c);
      //             tempLine.end.copy(tri.a);
      //             if (localPlane.intersectLine(tempLine, tempVector)) {
      //                 posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
      //                 index++;
      //                 count++;
      //             }
  
      //             // Remove if we don't have exactly 2 intersection points
      //             if (count !== 2) {
      //                 index -= count;
      //             }
      //         }
      //     });

      //     console.log(posAttr)
      //     // Update geometry
      //     posAttr.needsUpdate = true;
      }

      public updateClipPlaneForGeometries(){
        this.geometryService.geometry.forEach(geom => {
          this.updateCrossSection(geom)
        })


        // this.bvhGeometrie.forEach(geom => {
        //   geom.cap.material = this.capMaterial
        //   geom.model.material = this.basicMeshMaterial
        // })
      }
  
      public updateClipPlane(normal: THREE.Vector3, constant: number) {
          this.clippingPlane.normal.copy(normal)
          this.clippingPlane.constant = constant;
          this.updateClipPlaneForGeometries()
      }
}
