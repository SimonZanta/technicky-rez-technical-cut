import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {
  private loaderOBJ = new OBJLoader();

  async loadOBJModel(path: string): Promise<THREE.Object3D> {
    let object: THREE.Object3D
    try {
      // Convert the loader.load callback to a Promise
      let object = await new Promise<THREE.Object3D>((resolve, reject) => {
        this.loaderOBJ.load(
          path,
          (object) => resolve(object),
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => reject(error)
        );
      });
      return object;
    } catch (error) {
      throw Error('no object was found')
    }
  }
}
