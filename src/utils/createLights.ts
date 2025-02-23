import { AmbientLight, DirectionalLight, Scene } from "three";

export function createLights(scene: Scene) {
    const dirLight1 = new DirectionalLight(0xffffff, 3);
    dirLight1.position.set(100, 100, 100);
    scene.add(dirLight1);

    const dirLight2 = new DirectionalLight(0xffffff, 3);
    dirLight2.position.set(-100, -100, -100);
    scene.add(dirLight2);

    const ambientLight = new AmbientLight(0xcccccc);
    scene.add(ambientLight);
}