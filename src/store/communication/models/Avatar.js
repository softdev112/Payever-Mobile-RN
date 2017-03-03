export default class Avatar {
  type: 'url' | 'letters';
  value: string;
  valueRetina: string | undefined;

  constructor(data) {
    Object.assign(this, data);
  }
}