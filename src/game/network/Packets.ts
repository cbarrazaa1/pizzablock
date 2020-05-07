export enum PacketType {
  C_1V1_ENTER_QUEUE,
  C_1v4_ENTER_QUEUE,
  C_PLACE_BLOCK,

  S_1v1_ENTER_GAME,
  S_1v4_ENTER_GAME,
  S_PLAYER_PLACE_BLOCK,
  S_GAME_OVER,
  S_END_GAME,
}

export class Packet {
  public type: PacketType;
  public data: any;

  constructor() {
    this.type = -1;
  }
}

type EnterQueuePacketData = {
  readonly userID: string;
  readonly name: string;
  readonly ip: string;
};

export class EnterQueue1v1Packet extends Packet {
  public data: EnterQueuePacketData;

  constructor(data: EnterQueuePacketData) {
    super();
    this.type = PacketType.C_1V1_ENTER_QUEUE;
    this.data = data;
  }
}

export class EnterQueue1v4Packet extends Packet {
  public data: EnterQueuePacketData;

  constructor(data: EnterQueuePacketData) {
    super();
    this.type = PacketType.C_1v4_ENTER_QUEUE;
    this.data = data;
  }
}

type PlaceBlockPacketData = {
  readonly x: number;
  readonly y: number;
  readonly data: number[][];
  readonly type: number;
};

export class PlaceBlockPacket extends Packet {
  public data: PlaceBlockPacketData;

  constructor(data: PlaceBlockPacketData) {
    super();
    this.type = PacketType.C_PLACE_BLOCK;
    this.data = data;
  }
}

type EnterGame1v1PacketData = {
  readonly otherID: string;
  readonly otherName: string;
  readonly initialLevel: number;
};

export class EnterGame1v1Packet extends Packet {
  public data: EnterGame1v1PacketData;

  constructor(data: EnterGame1v1PacketData) {
    super();
    this.type = PacketType.S_1v1_ENTER_GAME;
    this.data = data;
  }
}

type EnterGame1v4PacketData = {
  readonly others: {
    id: string,
    name: string,
  }[];
  readonly initialLevel: number;
}

export class EnterGame1v4Packet extends Packet {
  public data: EnterGame1v4PacketData;

  constructor(data: EnterGame1v4PacketData) {
    super();
    this.type = PacketType.S_1v4_ENTER_GAME;
    this.data = data;
  }
}

type PlayerPlaceBlockData = {
  readonly whoID: string;
  block: {
    readonly x: number;
    readonly y: number;
    readonly data: number[][];
    readonly type: number;
  };
  readonly level: number;
  readonly score: number;
  readonly lines: number;
  readonly clearedLines: number[];
};

export class PlayerPlaceBlockPacket extends Packet {
  public data: PlayerPlaceBlockData;

  constructor(data: PlayerPlaceBlockData) {
    super();
    this.type = PacketType.S_PLAYER_PLACE_BLOCK;
    this.data = data;
  }
}

type GameOverPacketData = {
  readonly whoID: string;
};

export class GameOverPacket extends Packet {
  public data: GameOverPacketData;

  constructor(data: GameOverPacketData) {
    super();
    this.type = PacketType.S_GAME_OVER;
    this.data = data;
  }
}

type EndGamePacketData = {
  readonly winnerID: string;
  readonly gameID: string;
};

export class EndGamePacket extends Packet {
  public data: EndGamePacketData;

  constructor(data: EndGamePacketData) {
    super();
    this.type = PacketType.S_END_GAME;
    this.data = data;
  }
}
