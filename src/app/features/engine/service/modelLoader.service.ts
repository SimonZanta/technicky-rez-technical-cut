import { inject, Injectable, signal } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {
  private loaderOBJ = new OBJLoader();
  isLoading = signal(false)
  loadingLevel = signal(0.00)

  async loadOBJModel(path: string): Promise<THREE.Object3D> {
    this.isLoading.set(true)
    let object: THREE.Object3D
    try {
      // Convert the loader.load callback to a Promise
      let object = await new Promise<THREE.Object3D>((resolve, reject) => {
        this.loaderOBJ.load(
          path,
          (object) => {
            this.isLoading.set(false)
            resolve(object)
          },
          (xhr) => {

            this.loadingLevel.set(xhr.loaded / xhr.total * 100)
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
