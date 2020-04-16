export enum PacketType {
  C_1V1_ENTER_QUEUE,
  C_1v1_PLACE_BLOCK,

  S_1v1_ENTER_GAME,
  S_1v1_PLAYER_PLACE_BLOCK,
}

export interface Packet {
  type: PacketType;
  data: any;
};