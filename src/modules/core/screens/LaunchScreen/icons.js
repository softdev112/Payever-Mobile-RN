/* eslint-disable */
import React from 'react';
import { ART, Platform } from 'react-native';

const {
  LinearGradient,
} = ART;

const store = [
  {
    path: `M54.369,30.5c-0.176-1.516-1.553-2.741-3.076-2.741h-2.82l-1.555-8.869c-0.424-2.425-2.469-4.39-4.568-4.39h-8.871
	   c-2.1,0-4.145,1.563-4.568,3.988l-1.571,9.271h-3.632c-1.521,0-2.9,1.227-3.076,2.741L17.58,56.76
	   c-0.176,1.516,1.191,2.74,3.055,2.74h33.73c1.859,0,3.23-1.227,3.055-2.74L54.369,30.5z M31.699,18.955
	   c0.17-0.975,0.966-1.643,1.779-1.643h8.871c0.635,0,1.582,0.909,1.783,2.06l1.469,8.387H30.208L31.699,18.955z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#fe2666', '1': '#ff592e' },
        '0', '0', '100', '100'
      ),
      android: '#fe3951',
    }),
  },
];

const payments = [
  {
    path: `M29.221,25.48h16.559c6.362,0,11.52,5.158,11.52,11.52l0,0c0,6.361-5.157,11.52-11.52,11.52
	    H29.221c-6.362,0-11.52-5.158-11.52-11.52l0,0C17.701,30.639,22.858,25.48,29.221,25.48z`,
    fill: '#5AD713',
  },
  {
    path: 'M35.919000000000004,37.15a8.809,8.809 0 1,0 17.618,0a8.809,8.809 0 1,0 -17.618,0',
    fill: '#FFF',
  },
];

const pointOfSale = [
  {
    path: 'M18.621,37a18.879,18.879 0 1,0 37.758,0a18.879,18.879 0 1,0 -37.758,0',
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#A2A3A2', '1': '#646464' },
        '0', '0', '100', '100'
      ),
      android: '#646464',
    }),
  },
];

const communication = [
  {
    path: `M26.62,32.381c-0.598,0.148-1.009,0.678-0.988,1.273v2.071
      c0,5.864,4.651,10.658,10.551,11.305v7.804h-5.276c-1.582,0-2.638,1.019-2.638,2.549h18.463c0-1.53-1.054-2.549-2.638-2.549h-5.275
      V47.03c5.9-0.646,10.551-5.44,10.551-11.305v-2.071c0-0.703-0.59-1.273-1.32-1.273c-0.728,0-1.317,0.57-1.317,1.273v2.071
      c0,4.909-4.148,8.916-9.233,8.916c-5.082,0-9.23-4.007-9.23-8.916v-2.071c0.007-0.703-0.578-1.277-1.308-1.283
      c-0.058-0.001-0.117,0.003-0.177,0.01c-0.057-0.003-0.111-0.003-0.167,0H26.62z M37.499,16.617c-3.69,0-6.593,2.803-6.593,6.369
      v12.736c0,3.567,2.902,6.369,6.593,6.369c3.695,0,6.595-2.802,6.595-6.369V22.986C44.094,19.42,41.193,16.617,37.499,16.617
      L37.499,16.617z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#7DD3F9', '1': '#3D83F7' },
        '0', '0', '0', '100'
      ),
      android: '#7DD3F9',
    }),
  },
];

const contacts = [
  {
    path: `M41.659,34.062c0.806-0.801,1.681-1.788,1.929-3.019
		c0.331-1.637-0.343-1.846-0.343-2.411c0-1.186-0.011-3.132-0.374-4.396c-0.02-1.667-0.289-2.393-0.854-3.017
		c-0.531-0.584-1.84-0.446-2.521-0.832c-1.056-0.597-1.925-0.823-3.033-0.853c-0.031-0.006-0.064-0.003-0.096-0.002
		c-0.055-0.001-0.107-0.004-0.163-0.004c-2.696,0.114-5.567,1.846-6.555,4.631c-0.366,1.034-0.226,3.287-0.226,4.473
		c0,0.565-0.674,0.774-0.343,2.411c0.249,1.231,1.123,2.218,1.928,3.019c0.569,0.567,0.786,2.137,1.406,2.758
		c0.135,0.912,0.151,0.653,0.146,1.489c-0.001,0.281,0.007,0.721-0.436,1.152c-0.839,0.816-0.338,1.355-1.918,2.047
		c-2.084,0.91-5.472,2.367-6.252,2.775c-0.781,0.409-2.858,1.521-2.844,2.23c0.064,3.29,1.278,4.554,1.278,4.554h13.752h0.399h13.769
		c0,0,1.262-1.375,1.262-4.554c0-0.709-2.062-1.821-2.844-2.23c-0.781-0.408-4.168-1.865-6.252-2.775
		c-1.539-0.674-0.978-1.137-1.849-1.979c-0.296-0.284-0.504-0.582-0.507-1.306c-0.003-0.843,0.016-0.521,0.146-1.403
		C40.874,36.197,41.09,34.627,41.659,34.062z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#47a9eb', '1': '#7383e5' },
        '0', '0', '100', '100'
      ),
      android: '#47a9eb',
    }),
  },
];


const ad = [
  {
    path: `M57.608,44.72c-0.37,1.164-0.905,2.199-1.601,3.074c-0.684,0.866-1.533,1.562-2.532,2.065
	    c-0.982,0.506-2.142,0.765-3.438,0.765c-1.291,0-2.434-0.254-3.388-0.756c-0.966-0.51-1.771-1.206-2.396-2.074
	    c-0.648-0.889-1.137-1.935-1.467-3.097c-0.334-1.181-0.503-2.433-0.503-3.719c0-1.182,0.157-2.379,0.464-3.544
	    c0.298-1.152,0.772-2.201,1.401-3.119c0.621-0.898,1.429-1.647,2.414-2.217c0.966-0.561,2.136-0.849,3.474-0.849
	    c2.473,0,4.398,0.806,5.889,2.467c1.484,1.655,2.24,4.097,2.24,7.262C58.171,42.286,57.98,43.545,57.608,44.72L57.608,44.72z
	    M58.183,21.461v12.146c-0.574-0.921-1.264-1.731-2.124-2.416c-1.579-1.256-3.604-1.896-6.016-1.896
	    c-1.57,0-2.988,0.328-4.207,0.976c-1.218,0.64-2.244,1.511-3.061,2.588c-0.803,1.065-1.424,2.316-1.849,3.718
	    c-0.414,1.39-0.63,2.874-0.63,4.405c0,1.639,0.222,3.179,0.652,4.571c0.438,1.407,1.086,2.641,1.926,3.667
	    c0.844,1.035,1.876,1.857,3.078,2.437c1.207,0.585,2.578,0.883,4.084,0.883c2.328,0,4.324-0.641,5.916-1.896
	    c0.899-0.709,1.655-1.548,2.229-2.508v3.923h1.92V21.461H58.183z M21.834,40.536l6.549-16.069l6.324,16.069H21.834z M27.458,21.461
	    L14.897,52.059h2.165l3.975-9.632h14.455l3.934,9.632h2.158L29.327,21.461H27.458z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#fbda61', '1': '#f76b1c' },
        '0', '0', '0', '100'
      ),
      android: '#ffb400',
    }),
  },
];

const marketing = [
  {
    path: `M58.825,47.391c0,1.585-1.304,2.869-2.914,2.869H19.09
		  c-1.609,0-2.915-1.284-2.915-2.869V26.608c0-1.584,1.306-2.868,2.915-2.868h36.821c1.61,0,2.914,1.284,2.914,2.868V47.391z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#4eaaff', '1': '#0084ff' },
        '0', '0', '100', '0'
      ),
      android: '#4eaaff',
    }),
  },
  {
    path: 'M 37.5 41.17 L 17.694 24.09 M 37.876 41.57 L 56.828 24.34',
    stroke: '#FFF',
  },
];

const appMarket = [
  {
    path: `M57.129,0.145C67.969,0.145,75,7.055,75,17.708v38.583c0,10.652-7.031,17.564-17.871,17.564H17.87
	    C7.031,73.855,0,66.943,0,56.291V17.708C0,7.055,7.031,0.145,17.87,0.145H57.129z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#2AC4F8', '1': '#2780EF' },
        '0', '0', '0', '100'
      ),
      android: '#2780EF',
    }),
    x: 80,
    y: 70,
    scale: 1.2,
  },
  {
    path: `M36.962,36.234V21.741V21.02h1.442v0.721v14.493h14.354h0.723v1.442h-0.723H38.404v14.582v0.723h-1.442
		  v-0.723V37.676H22.241H21.52v-1.442h0.721H36.962L36.962,36.234z`,
    fill: '#FFF',
    x: 80,
    y: 70,
    scale: 1.2,
  },
];

const overlay = [
  {
    path: `M54.145,43.538c-0.013,0.013-0.023,0.024-0.047,0.036l-5.666,3.231
		  c-0.025,0.012-0.038,0.024-0.062,0.035l-9.345,5.339c-0.375,0.217-0.932,0.341-1.525,0.341c-0.508,0-0.98-0.086-1.356-0.256
		  L16.583,41.092c-0.121-0.084-0.17-0.157-0.182-0.181c0.024-0.05,0.097-0.158,0.291-0.268l6.222-3.534l0.957,0.556l11.573,6.61
		  c1.125,0.533,2.807,0.496,3.848-0.109l9.348-5.338c0.01-0.012,0.022-0.012,0.034-0.012l2.009-1.151l1.188-0.677l6.403,3.644
		  c0.219,0.12,0.303,0.229,0.327,0.265c-0.024,0.051-0.108,0.158-0.327,0.279L54.145,43.538z M53.915,35.814l0.473-0.267
		  c0.012-0.012,4.163-2.372,4.163-2.372c1.113-0.642,1.113-1.683-0.011-2.324L39.303,19.92c-1.113-0.63-2.916-0.63-4.042-0.013
		  L15.953,30.875c-1.017,0.592-1.077,1.537-0.158,2.179l5.072,2.892l-5.193,2.944c-0.811,0.47-1.271,1.16-1.307,1.936
		  c-0.024,0.738,0.363,1.452,1.078,1.948l19.731,11.271c0.727,0.35,1.501,0.509,2.324,0.509c0.945,0,1.839-0.218,2.53-0.617
		  l9.332-5.326c0.013,0,5.763-3.294,5.763-3.294c0.023-0.012,4.164-2.371,4.164-2.371c0.85-0.497,1.345-1.234,1.345-2.048
		  c0-0.797-0.495-1.549-1.357-2.033L53.915,35.814z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#fe2666', '1': '#ff5631' },
        '0', '0', '0', '100'
      ),
      android: '#FF2962',
    }),
  },
];

const products = [
  {
    path: `M24.805,26.033c0-1.238,1.012-2.25,2.263-2.25c1.238,0,2.25,1.012,2.25,2.25c0,1.25-1.012,2.25-2.25,2.25
	    C25.817,28.283,24.805,27.283,24.805,26.033z M36.701,20.948c-0.393-0.393-0.929-0.619-1.501-0.619H23.709
	    c-1.596,0-2.881,1.287-2.881,2.882v11.491c0,0.571,0.226,1.107,0.619,1.5l16.838,16.837c0.416,0.43,0.977,0.633,1.523,0.633
	    c0.561,0,1.106-0.203,1.524-0.633L53.54,40.834c0.842-0.846,0.842-2.201,0-3.047L36.701,20.948z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#FF2962', '1': '#FF4A48' },
        '-82.2917', '1.6704', '-82.2917', '0.5847'
      ),
      android: '#FF2962',
    }),
  }
];

const transactions = [
  {
    path: `M37.5,57.621c11.389,0,20.621-9.232,20.621-20.621c0-11.389-9.232-20.621-20.621-20.621
		  c-11.389,0-20.621,9.232-20.621,20.621C16.879,48.389,26.111,57.621,37.5,57.621L37.5,57.621z M37.5,55.109
		  C27.5,55.109,19.389,47,19.389,37S27.5,18.892,37.5,18.892S55.611,27,55.611,37S47.5,55.109,37.5,55.109L37.5,55.109z`,
    fill: '#5AD713',
  },
  {
    path: `M32.879,44.232c0.51,0.278,1.18,0.217,1.616-0.222L46.494,32.01c0.525-0.525,0.525-1.385-0.002-1.914
		  c-0.514-0.516-1.389-0.533-1.916-0.006L33.521,41.146l-3.263-3.264c-0.516-0.513-1.379-0.521-1.909,0.012
		  c-0.515,0.515-0.535,1.383-0.01,1.907l4.172,4.175C32.621,44.086,32.742,44.172,32.879,44.232z`,
    fill: '#5AD713',
  },
];

const liveSupport = [
  {
    path: `M44.309,25.276c0-0.878,0.707-1.598,1.577-1.598c0.862,0,1.571,0.72,1.571,1.598v23.491
		  c0,0.881-0.709,1.598-1.571,1.598c-0.87,0-1.577-0.717-1.577-1.598V25.276z M52.614,30.486c0-0.879,0.707-1.599,1.571-1.599
		  c0.868,0,1.576,0.72,1.576,1.599v13.07c0,0.881-0.708,1.602-1.576,1.602c-0.864,0-1.571-0.721-1.571-1.602V30.486z M19.238,30.486
		  c0-0.879,0.709-1.599,1.575-1.599s1.574,0.72,1.574,1.599v13.07c0,0.881-0.708,1.602-1.574,1.602s-1.575-0.721-1.575-1.602V30.486z
		  M27.54,25.276c0-0.878,0.709-1.598,1.576-1.598c0.866,0,1.574,0.72,1.574,1.598v23.491c0,0.881-0.708,1.598-1.574,1.598
		  c-0.867,0-1.576-0.717-1.576-1.598V25.276z M36.007,17.299c0-0.878,0.708-1.598,1.575-1.598s1.574,0.72,1.574,1.598v39.402
		  c0,0.879-0.707,1.598-1.574,1.598s-1.575-0.719-1.575-1.598V17.299z`,
    fill: Platform.select({
      ios: new LinearGradient(
        { '0': '#7dd3f9', '1': '#3d83f7' },
        '0', '0', '100', '100'
      ),
      android: '#3d83f7',
    }),
  },
];


const statistic = [
  {
    path: `M66.409,13.68L40.087,35.893c-1.029,1.012-2.686,1.012-3.714,0c-1.028-1.013-1.028-2.654,0-3.667
		  l26.324-22.196c1.028-1.013,2.685-1.013,3.712,0C67.438,11.041,67.438,12.684,66.409,13.68z M38.98,37.013L12.182,50.128
		  c-1.028,1.013-2.685,1.013-3.712,0c-1.028-1.014-1.028-2.637,0-3.649l26.799-13.134c1.028-1.013,2.683-1.013,3.711,0
		  C39.993,34.358,39.993,36,38.98,37.013z M37.67,27.854c3.62,0,6.565,2.899,6.565,6.474c0,3.576-2.945,6.473-6.565,6.473
		  c-3.621,0-6.55-2.897-6.55-6.473C31.12,30.753,34.049,27.854,37.67,27.854 M11.146,41.376c3.636,0,6.565,2.887,6.565,6.46
		  c0,3.574-2.93,6.474-6.565,6.474c-3.62,0-6.55-2.899-6.55-6.474C4.596,44.263,7.526,41.376,11.146,41.376 M63.749,5.212
		  c3.636,0,6.564,2.899,6.564,6.474c0,3.574-2.929,6.473-6.564,6.473c-3.619,0-6.566-2.899-6.566-6.473
		  C57.183,8.111,60.13,5.212,63.749,5.212`,
    fill: '#FDB937',
    x: 75,
    y: 65,
    scale: 1.3,
  },
  {
    path: `M37.662,31.325c1.703,0,3.068,1.349,3.068,3.021c0,1.673-1.365,3.022-3.068,3.022
      c-1.688,0-3.052-1.349-3.052-3.022C34.609,32.673,35.974,31.325,37.662,31.325
      M63.748,8.664c1.701,0,3.067,1.35,3.067,3.022c0,1.672-1.366,3.022-3.067,3.022
		  c-1.688,0-3.055-1.35-3.055-3.022C60.693,10.014,62.06,8.664,63.748,8.664
		  M10.991,45.022c1.703,0,3.068,1.352,3.068,3.022c0,1.673-1.366,3.021-3.068,3.021
		  c-1.688,0-3.053-1.349-3.053-3.021C7.938,46.374,9.303,45.022,10.991,45.022`,
    fill: '#FFF',
    x: 75,
    y: 65,
    scale: 1.3,
  },
  {
    path: `M37.446,50.082c0.737,0,1.319,0.582,1.319,1.289v15.538c0,0.723-0.582,1.29-1.319,1.29
		  c-0.721,0-1.303-0.567-1.303-1.29V51.371C36.143,50.664,36.726,50.082,37.446,50.082
		  M11.154,62.109v5.461c0,0.72-0.583,1.304-1.319,1.304c-0.721,0-1.304-0.584-1.304-1.304
		  v-5.461c0-0.708,0.583-1.289,1.304-1.289C10.571,60.82,11.154,61.401,11.154,62.109z
		  M66.378,28.36v38.965c0,0.704-0.583,1.288-1.319,1.288
		  c-0.721,0-1.304-0.584-1.304-1.288V28.36c0-0.705,0.583-1.288,1.304-1.288C65.795,27.072,66.378,27.655,66.378,28.36z`,
    fill: '#8E8E8E',
    x: 75,
    y: 65,
    scale: 1.3,
  },
];

const payever = [
  {
    path: `m 0,0 c -49.232,0 -89.285,-40.053 -89.285,-89.286 0,-49.232 40.053,-89.286 89.285,-89.286
      49.233,0 89.286,40.054 89.286,89.286 C 89.286,-40.053 49.233,0 0,0 m 0,-189.286
      c -55.14,0 -100,44.86 -100,100 0,55.14 44.86,100 100,100 55.14,0 100,-44.86 100,-100 0,-55.14 -44.86,-100 -100,-100`,
    fill: '#000',
    x: 125,
    y: 165,
    scale: 0.45,
  },
  {
    path: `m 0,0 c 0,33.531 27.183,60.714 60.714,60.714 33.532,0 60.714,-27.183 60.714,-60.714 0,-33.531
      -27.182,-60.714 -60.714,-60.714 C 27.183,-60.714 0,-33.531 0,0`,
    fill: '#000',
    x: 98,
    y: 125,
    scale: 0.45,
  },
];

export default [
  payever,
  store,
  payments,
  pointOfSale,
  communication,
  contacts,
  ad,
  marketing,
  appMarket,
  overlay,
  products,
  transactions,
  liveSupport,
  statistic,
];