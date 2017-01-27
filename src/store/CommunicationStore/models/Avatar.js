export default class Avatar {
  type: string;
  value: string;
  valueRetina: string | undefined;

  constructor(data) {
    Object.assign(this, data);
  }
}