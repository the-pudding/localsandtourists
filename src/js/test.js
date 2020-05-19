let $localMap;
let width = window.innerWidth;
let height = window.innerHeight;

function makeMap() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2pjazE5eTM2NDl2aDJ3cDUyeDlsb292NiJ9.Jr__XbmAolbLyzPDj7-8kQ';

  const centerCooords = [40.119448, -98.056438]

  const $localMap = new mapboxgl.Map({
    container: 'map',
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 17,
    minZoom: 3,
    fadeDuration: 0,
    dragPan: true,
    scrollZoom: true,
    style: 'mapbox://styles/dock4242/cka4g5py203jk1iqs4cpx6b9e?optimize=true', // optimize=true',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 3.9,
  });



  $localMap.on('mousemove', () => {
    console.log('localmap')
  })


  return $localMap

}

function init() {
  d3.select('#map')
    .style('height', `${height}px`)
  $localMap = makeMap()
}

function resize() {

}



export default {
  init,
  resize
};
