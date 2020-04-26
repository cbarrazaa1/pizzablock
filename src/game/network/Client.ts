import {Packet, PacketType} from './Packets';
import {StrMap} from '../../util/Types';

type PacketHandler = (packet: Packet) => void;

class Client {
  private socket: SocketIOClient.Socket;
  private handlers: StrMap<PacketHandler>;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
    this.socket.on('data_packet', this.handleEvent.bind(this));
    this.handlers = {};
  }

  public on(type: PacketType, handler: PacketHandler): void {
    this.handlers[type] = handler;
  }

  public sendData(packet: Packet): void {
    this.socket.emit('data_packet', packet);
  }

  private handleEvent(packet: Packet): void {
    const handler = this.handlers[packet.type];
    if (handler != null) {
      handler(packet);
    }
  }
}

export default Client;
