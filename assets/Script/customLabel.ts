import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("customLabel")
export class customLabel extends Component {
    @property({ type: Label })
    label: Label = null;
    start() {}

    update(deltaTime: number) {}

    setLabel(label: string) {
        this.label.string = label;
    }
}
