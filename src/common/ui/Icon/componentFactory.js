import { Image } from 'react-native';
import VectorIcon from './VectorIcon';
import BitmapIcon from './BitmapIcon';
import StackedIcon from './StackedIcon';

import icons from './icons';

export default function componentFactory(componentInfo, newProps = {}) {
  let meta = componentInfo;

  /* eslint-disable default-case */
  switch (typeof componentInfo) {
    case 'string': {
      meta = icons[componentInfo];
      break;
    }
    case 'object': {
      if (componentInfo.uri) {
        meta.component = 'image';
      }
      break;
    }
    case 'number': {
      meta = { component: 'image', source: componentInfo };
    }
  }

  if (!meta || !meta.component) {
    throw new Error(
      `Cannot get Icon component for "${JSON.stringify([componentInfo, meta])}"`
    );
  }

  /* eslint-disable no-unused-vars */
  //noinspection JSUnusedLocalSymbols
  const Component = getComponentByAlias(meta.component);
  const props = {
    ...meta,
    ...newProps,
    style: [meta.style, newProps.style],
  };
  /* eslint-disable react/prop-types */
  delete props.component;

  return <Component {...props} />;
}

function getComponentByAlias(alias) {
  /* eslint-disable no-multi-spaces */
  switch (alias) {
    case 'vector':  return VectorIcon;
    case 'bitmap':  return BitmapIcon;
    case 'stacked': return StackedIcon;
    case 'image':   return Image;
    default: {
      throw new Error('Unknown icon type ' + alias);
    }
  }
}