//noinspection JSUnresolvedVariable
import vector from './vector.json';

export default {
  ...vector,

  spinner: {
    component: 'stacked',
    style: { width: 65, height: 65 },
    layers: [
      {
        component: 'vector',
        source: 'spinner-container',
        style: { color: '#e1e1e1' },
      },
      {
        component: 'vector',
        source: 'spinner-roller',
        style: { color: '#0084ff' },
      },
    ],
  },

};