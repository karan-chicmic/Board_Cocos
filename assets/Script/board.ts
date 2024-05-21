import {
    _decorator,
    Component,
    instantiate,
    Label,
    Node,
    Prefab,
    Sprite,
    SpriteFrame,
    TiledLayer,
    TiledMap,
    tween,
    UITransform,
    Vec2,
    Vec3,
    view,
} from "cc";
import { customLabel } from "./customLabel";
import { dice } from "./dice";

const { ccclass, property } = _decorator;
const Player = {
    Player1: "player 1",
    Player2: "player 2",
};
@ccclass("board")
export class board extends Component {
    @property({ type: Prefab })
    labelPrefab: Prefab = null;
    @property({ type: Node })
    diceImage: Node = null;

    firstStart: boolean = false;
    secondStart: boolean = false;

    moveOnlyBackward: boolean = false;

    player1CurrLabel: number = 0;
    player2CurrLabel: number = 0;

    player1sixes = 0;
    player2sixes = 0;

    @property({ type: Node })
    player1Gotti: Node;

    @property({ type: Node })
    player2Gotti: Node;

    boardMap: Map<string, Vec3> = new Map<string, Vec3>();

    label = 0;
    canRollDice: boolean = true;
    currPlayer = Player.Player1;

    start() {
        let tiledMap = this.node.getComponent(TiledMap);
        let layer = tiledMap.getLayer("cell layer");
        let tileSize = tiledMap.getTileSize();
        let layerSize = layer.getLayerSize();

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
                this.boardMap.set(this.label.toString(), labelNode.position);
                console.log(labelNode.getPosition());

                this.node.getParent().addChild(labelNode);
            }
        }
    }

    update(deltaTime: number) {}
    findEvenMultiple(x: number, y: number) {
        if (y % x === 0) {
            return y - x;
        }

        return Math.floor(y / x) * x;
    }
    rollDice() {
        if (this.canRollDice) {
            this.diceImage.getComponent(dice).generateDiceNumber();
            let diceNumber = this.diceImage.getComponent(dice).getDiceNumber();
            console.log(diceNumber);
            if (!(diceNumber == 6) && this.currPlayer == Player.Player1 && !this.firstStart) {
                this.currPlayer = Player.Player2;
            } else if (!(diceNumber == 6) && this.currPlayer == Player.Player2 && !this.secondStart) {
                this.currPlayer = Player.Player1;
            } else if (diceNumber == 6 && this.currPlayer == Player.Player1 && !this.firstStart) {
                this.firstStart = true;
                this.player1CurrLabel = 1;

                this.player1Gotti.setPosition(this.boardMap.get("1"));
                this.node.parent.addChild(this.player1Gotti);

                this.currPlayer = Player.Player2;
            } else if (diceNumber == 6 && this.currPlayer == Player.Player2 && !this.secondStart) {
                this.secondStart = true;
                this.player2CurrLabel = 1;
                console.log("player 2 first 6", this.boardMap.get("1"));

                this.player2Gotti.setPosition(this.boardMap.get("1"));
                this.node.parent.addChild(this.player2Gotti);

                this.currPlayer = Player.Player1;
            } else if (this.firstStart && this.currPlayer == Player.Player1) {
                this.player1Turn(diceNumber, Player.Player2);
            } else if (this.secondStart && this.currPlayer == Player.Player2) {
                this.player2Turn(diceNumber, Player.Player1);
            }
        } else {
            console.log("wait for your turn");
        }
    }
    player1Turn(diceNumber: number, nextPlayer) {
        let finalPosition = this.player1CurrLabel + diceNumber;

        this.movePlayer(this.player1CurrLabel, this.player1Gotti, diceNumber, () => {
            this.currPlayer = nextPlayer;
        });
        this.player1CurrLabel = finalPosition;
    }

    player2Turn(diceNumber: number, nextPlayer: string) {
        let finalPosition = this.player2CurrLabel + diceNumber;

        this.movePlayer(this.player2CurrLabel, this.player2Gotti, diceNumber, () => {
            this.currPlayer = nextPlayer;
        });
        this.player2CurrLabel = finalPosition;
    }
    movePlayer(
        currLabel: number,
        playerNode: Node,
        remainingMoves: number,

        callback: () => void
    ) {
        if (remainingMoves <= 0) {
            callback();
            this.canRollDice = true;
            return;
        }
        this.canRollDice = false;

        let newLabel: number;
        let isMovingBackward = currLabel === 100 && remainingMoves > 0;

        if (this.moveOnlyBackward) {
            newLabel = currLabel - 1;
        } else if (isMovingBackward) {
            this.moveOnlyBackward = true;
            newLabel = currLabel - 1;
        } else {
            newLabel = currLabel + 1;
        }

        console.log("player label", newLabel);
        let newPos = this.boardMap.get(newLabel.toString());
        let isMultiple = currLabel % 10 === 0;

        tween(playerNode)
            .to(
                0.3,
                {
                    position: isMultiple
                        ? new Vec3(newPos.x, newPos.y, newPos.z)
                        : this.boardMap.get(currLabel.toString())
                        ? new Vec3(newPos.x - 35, newPos.y + 15, newPos.z)
                        : this.moveOnlyBackward
                        ? new Vec3(newPos.x - 35, newPos.y + 15, newPos.z)
                        : new Vec3(newPos.x + 35, newPos.y + 15, newPos.z),
                },
                {
                    easing: "sineIn",
                }
            )
            .to(
                0.3,
                {
                    position: new Vec3(newPos.x, newPos.y, newPos.z),
                },
                { easing: "sineOut" }
            )
            .call(() => {
                if (this.moveOnlyBackward) {
                    console.log("if called");
                    this.movePlayer(currLabel - 1, playerNode, remainingMoves - 1, callback);
                } else if (isMovingBackward) {
                    console.log("else if called");
                    this.movePlayer(currLabel - 1, playerNode, remainingMoves - 1, callback);
                } else {
                    console.log("else called");
                    this.movePlayer(currLabel + 1, playerNode, remainingMoves - 1, callback);
                }
            })
            .start();
    }
}
