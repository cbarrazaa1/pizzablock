export enum PacketType {
  C_1V1_ENTER_QUEUE,
  C_1v1_PLACE_BLOCK,

  S_1v1_ENTER_GAME,
  S_1v1_PLAYER_PLACE_BLOCK,
}

export class Packet {
  public type: PacketType;
  public data: any;

  constructor() {
    this.type = -1;
  }
};

type EnterQueuePacketData = {};

export class EnterQueuePacket extends Packet {
  public data: EnterQueuePacketData;

  constructor() {
    super();
    this.type = PacketType.C_1V1_ENTER_QUEUE;
    this.data = {};
  }
}

type PlaceBlockPacketData = {
  readonly x: number;
  readonly y: number;
  readonly data: number[][];
  readonly type: number;
}

export class PlaceBlockPacket extends Packet {
  public data: PlaceBlockPacketData;

  constructor(data: PlaceBlockPacketData) {
    super();
    this.type = PacketType.C_1v1_PLACE_BLOCK;
    this.data = data;
  }
}

type EnterGamePacketData = {
  readonly otherID: string;
  readonly initialLevel: number;
};

export class EnterGamePacket extends Packet {
  public data: EnterGamePacketData;

  constructor(data: EnterGamePacketData) {
    super();
    this.type = PacketType.S_1v1_ENTER_GAME;
    this.data = data;
  }
}

type PlayerPlaceBlockData = {
  block: {
    readonly x: number;
    readonly y: number;
    readonly data: number[][];
    readonly type: number;
  },
  readonly level: number;
  readonly score: number;
  readonly lines: number;
  readonly clearedLines: number[];
};

export class PlayerPlaceBlockPacket extends Packet {
  public data: PlayerPlaceBlockData;

  constructor(data: PlayerPlaceBlockData) {
    super();
    this.type = PacketType.S_1v1_PLAYER_PLACE_BLOCK;
    this.data = data;
  }
}