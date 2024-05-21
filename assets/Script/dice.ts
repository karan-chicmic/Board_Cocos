import { _decorator, Component, Node, randomRangeInt, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("dice")
export class dice extends Component {
    @property({ type: SpriteFrame })
    one: SpriteFrame = null;
    @property({ type: SpriteFrame })
    two: SpriteFrame = null;
    @property({ type: SpriteFrame })
    three: SpriteFrame = null;
    @property({ type: SpriteFrame })
    four: SpriteFrame = null;
    @property({ type: SpriteFrame })
    five: SpriteFrame = null;
    @property({ type: SpriteFrame })
    six: SpriteFrame = null;

    @property({ type: Node })
    diceImage: Node = null;

    diceNumber: number = 1;

    start() {}

    update(deltaTime: number) {}

    generateDiceNumber() {
        this.diceNumber = randomRangeInt(1, 7);
        switch (this.diceNumber) {
            case 1: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.one;
                break;
            }
            case 2: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.two;
                break;
            }
            case 3: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.three;
                break;
            }
            case 4: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.four;
                break;
            }
            case 5: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.five;
                break;
            }
            case 6: {
                this.diceImage.getComponent(Sprite).spriteFrame = this.six;
                break;
            }
        }
    }
    getDiceNumber() {
        return this.diceNumber;
    }
}
