import { computed } from 'mobx';

export default class Media {
  content_type: string;
  formats: {
    reference: {
      properties: FileProperties | ImageProperties;
      type: 'reference';
      url: string;
    };
  };
  name: string;
  size: number;
  url: string;

  constructor(data) {
    Object.assign(this, data);
  }

  @computed
  get isImage() {
    return this.content_type.startsWith('image');
  }
}

type ImageProperties = {
  alt: string;
  height: number;
  src: string;
  title: string;
  width: number;
};

type FileProperties = {
  file: string;
  thumbnail: string;
  title: string;
};