import { httpResponse, httpResquest } from "./http_interface";

export interface controller {
  handle(httpResquest: httpResquest): httpResponse;
}
