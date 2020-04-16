import {Nullable} from '../../util/Types';
import InputHandler, {InputEvent, InputKey} from '../InputHandler';
import State from './State';
import io from 'socket.io-client';
import Client from '../network/Client';
import {Packet, PacketType} from '../network/Packets';
import Container from '../ui/Container';
import {Screen} from '../Game';
import WidgetManager from '../ui/WidgetManager';
import Text from '../ui/Text';
import CounterComponent from '../ui/custom/CounterComponent';
import NextBlockComponent from '../ui/custom/NextBlockComponent';
import Block from '../logic/Block';
import Board, {BOARD_WIDTH, BOARD_HEIGHT, PlaceBlockCallbackData} from '../logic/Board';
import CustomWidget from '../ui/CustomWidget';
import OtherBoard from '../logic/OtherBoard';
import {mapBlockTypeToColor} from '../logic/Block';

enum InternalState {
  NONE,
  QUEUE_WAIT,
  IN_GAME,
  GAME_OVER,
}

class Multiplayer1v1State extends State {
  private static instance: Nullable<Multiplayer1v1State> = null;
  private internalState: InternalState;
  private client: Client;
  private board!: Board;
  private otherBoard!: OtherBoard;
  private widgets: WidgetManager;
  private txtStatus: Text;
  private cntMenu: Container;
  private cntBoard: Container;
  private cntOtherBoard: Container;
  private cntGame: Container;

  constructor() {
    super();
    this.internalState = InternalState.NONE;

    // setup client socket
    this.client = new Client(io('http://localhost:4000'));
    this.initNetworkHandlers();

    // setup interface
    this.txtStatus = new Text(0, 0, `Press 'Space' to enter game queue.`)
      .centerHorizontally()
      .centerVertically();

    this.cntMenu = new Container(0, 0, Screen.width, Screen.height)
      .addChild('txtStatus', this.txtStatus)
      .setStyle({borderWidth: 0});

    this.cntBoard = new Container(10, 10, BOARD_WIDTH * 32, BOARD_HEIGHT * 32);

    this.cntBoard.addChild(
      'board',
      new CustomWidget()
        .onInit((): void => {
          this.board = new Board(this.cntBoard, 32);
          this.board.onPlaceBlock = this.sendPlaceBlock.bind(this);
        })
        .onUpdate((_, delta: number): void => {
          this.board.update(delta);
        })
        .onInput((_, e: InputEvent): void => {
          this.board.input(e);
        })
        .onRender((_, g: CanvasRenderingContext2D): void => {
          this.board.render(g);
        }),
    );

    this.cntOtherBoard = new Container(
      BOARD_WIDTH * 32 + 20,
      10,
      BOARD_WIDTH * 32,
      BOARD_HEIGHT * 32,
    );

    this.cntOtherBoard.addChild(
      'board',
      new CustomWidget()
        .onInit((): void => {
          this.otherBoard = new OtherBoard(this.cntOtherBoard, 32);
        })
        .onRender((_, g: CanvasRenderingContext2D): void => {
          this.otherBoard.render(g);
        }),
    );

    this.cntGame = new Container(0, 0, Screen.width, Screen.height)
      .addChild('cntBoard', this.cntBoard)
      .addChild('cntOtherBoard', this.cntOtherBoard);
    this.cntGame.setVisible(false);

    this.widgets = new WidgetManager()
      .addWidget('cntMenu', this.cntMenu)
      .addWidget('cntGame', this.cntGame);
  }

  public static getInstance(): Multiplayer1v1State {
    if (this.instance == null) {
      this.instance = new Multiplayer1v1State();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.widgets.update(delta);
  }

  public render(g: CanvasRenderingContext2D): void {
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    if (this.internalState === InternalState.NONE) {
      if (InputHandler.isKeyUp(InputKey.SPACE, e)) {
        this.internalState = InternalState.QUEUE_WAIT;
        this.txtStatus.text = 'Waiting in queue...';
        this.sendEnterQueue();
      }
    }

    this.widgets.input(e);
  }

  private sendEnterQueue(): void {
    this.client.sendData({
      type: PacketType.C_1V1_ENTER_QUEUE,
      data: {},
    });
  }

  private sendPlaceBlock(block: PlaceBlockCallbackData): void {
    this.client.sendData({
      type: PacketType.C_1v1_PLACE_BLOCK,
      data: {
        block,
      }
    });
  }

  private initNetworkHandlers(): void {
    this.client.on(
      PacketType.S_1v1_ENTER_GAME,
      this.handleEnterGame.bind(this),
    );

    this.client.on(
      PacketType.S_1v1_PLAYER_PLACE_BLOCK,
      this.handlePlayerPlaceBlock.bind(this),
    );
  }

  private handleEnterGame(packet: Packet): void {
    const otherID = packet.data['otherID'] as string;
    this.internalState = InternalState.IN_GAME;
    this.cntMenu.setVisible(false);
    this.cntGame.setVisible(true);
  }

  private handlePlayerPlaceBlock(packet: Packet): void {
    const block = packet.data['block'] as PlaceBlockCallbackData;
    console.log(block);

    for (let i = 0; i < block.data.length; i++) {
      for (let j = 0; j < block.data[0].length; j++) {
        if (block.data[i][j] === 1) {
          this.otherBoard.mat[block.x + j][block.y + i] = {
            color: mapBlockTypeToColor(block.type),
            value: 1,   
          }
        }
      }
    }
  }
}

export default Multiplayer1v1State;
