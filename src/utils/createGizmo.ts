import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/Addons";

export function createGizmo(camera: PerspectiveCamera | OrthographicCamera, renderer: WebGLRenderer, controls: OrbitControls): ViewportGizmo {
    const gizmo = new ViewportGizmo(camera, renderer, {
        type: "cube",
        placement: "bottom-right",
        right: { label: 'Right' },
        front: { label: 'Top' },
        back: { label: 'Bottom' },
        top: { label: 'Back' },
        bottom: { label: 'Front' }
    });
    gizmo.attachControls(controls)
    return gizmo
}
