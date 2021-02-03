export interface BaseFormatter<T = any> {
  toJson(model: any): T;
}
