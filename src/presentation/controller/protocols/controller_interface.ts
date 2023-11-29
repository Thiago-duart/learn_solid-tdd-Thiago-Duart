import { HttpResponse, HttpResquest } from "./http_interface";

export interface Controller {
  handle(httpResquest: HttpResquest): Promise<HttpResponse>;
}
