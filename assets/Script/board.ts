import {
    _decorator,
    Component,
    instantiate,
    Node,
    Prefab,
    TiledLayer,
    TiledMap,
    UITransform,
    Vec2,
    Vec3,
    view,
} from "cc";
import { customLabel } from "./customLabel";

const { ccclass, property } = _decorator;

@ccclass("board")
export class board extends Component {
    @property({ type: Prefab })
    labelPrefab: Prefab = null;

    label = 0;
    start() {
        let tiledMap = this.node.getComponent(TiledMap);
        let tileSize = tiledMap.getTileSize();
        let layer = tiledMap.getLayer("cell layer");
        let layerSize = layer.getLayerSize();
        // let min = Math.min(view.getDesignResolutionSize().x, view.getDesignResolutionSize().y);
        // let cellSize = this.findEvenMultiple(100, min);

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                this.label = this.label + 1;
                let labelNode = instantiate(this.labelPrefab);
                labelNode
                    .getComponent(UITransform)
                    .setContentSize(tiled.getComponent(UITransform).width, tiled.getComponent(UITransform).height);
                labelNode.getComponent(customLabel).setLabel(this.label.toString());

                let x = tiled.node.position.x - layer.node.getComponent(UITransform).width * 0.5 + tileSize.x / 2;

                let y = tiled.node.position.y - layer.node.getComponent(UITransform).height * 0.5 + tileSize.y / 2;

                labelNode.setPosition(x, y, 0);
                this.node.getParent().addChild(labelNode);
            }
        }
    }

    update(deltaTime: number) {}
    // findEvenMultiple(x: number, y: number) {
    //     if (y % x === 0) {
    //         return y - x;
    //     }

    //     return Math.floor(y / x) * x;
    // }
}
