import VectorIcon from './VectorIcon';
import BitmapIcon from './BitmapIcon';
import StackedIcon from './StackedIcon';

import icons from './icons';

export default function componentFactory(componentInfo, newProps = {}) {
  let meta = componentInfo;
  if (typeof componentInfo === 'string') {
    meta = icons[componentInfo];
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
    default: {
      throw new Error('Unknown icon type ' + alias);
    }
  }
}