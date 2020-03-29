import Widget from './Widget';
import {StrMap, Nullable} from '../../util/Types';
import {InputEvent} from '../InputHandler';

class WidgetManager {
  private widgets: StrMap<Widget>;

  constructor() {
    this.widgets = {};
  }

  public addWidget(name: string, widget: Widget): WidgetManager {
    this.widgets[name] = widget;
    return this;
  }

  public removeWidget(name: string): WidgetManager {
    delete this.widgets[name];
    return this;
  }

  public getWidget(name: string): Nullable<Widget> {
    return this.widgets[name];
  }

  public update(delta: number): void {
    Object.values(this.widgets).forEach(widget => widget.update(delta));
  }

  public input(e: InputEvent): void {
    Object.values(this.widgets).forEach(widget => widget.input(e));
  }

  public render(g: CanvasRenderingContext2D): void {
    Object.values(this.widgets).forEach(widget => widget.render(g));
  }
}

export default WidgetManager;
