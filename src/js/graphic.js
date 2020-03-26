/* global d3 */
import enterView from 'enter-view'


const height = window.innerHeight;
let $map;



function resize() {}

function updateMapBack(el) {
  console.log(el)
}

function updateMap(el) {
  console.log(el)
}


function setupEnterView() {

  enterView({
    selector: '.story-step',
    enter(el) {
      updateMap(el)
    },
    exit(el) {
      updateMapBack(el)
    },
    progress(el, progress) {
      //   el.style.opacity = progress;
    },
    offset: 0.4, // enter at middle of viewport
    once: false, // trigger just once
  });
}

function setupDOM() {

  console.log(height)
  d3.select('#map')
    .style('height', `${height}px`)
}

function makeMap() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2pjazE5eTM2NDl2aDJ3cDUyeDlsb292NiJ9.Jr__XbmAolbLyzPDj7-8kQ';


  const $map = new mapboxgl.Map({
    // TODO Ask russell: Why do I need to return this map object if I declared it here? It's a global object, so shouldn't its value remain declared in the upper scope?
    container: `map`,
    // center: [mapCoordinates.X1, mapCoordinates.Y1],
    // maxZoom: 16,
    maxZoom: 14,
    minZoom: 3,
    // pitch: 60,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/ck86bp6qk01jy1io6gzwfmxhb',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    // zoom: 11,
  });

  $map.on('mousemove', e => {


    const pointFeatures = $map.queryRenderedFeatures(e.point)
    const relevantLayer = "local_vs_tourist-0aaeny"
    const relevantFeature = pointFeatures.filter(item => item.sourceLayer === relevantLayer)

    if (relevantFeature.length > 0) {
      console.log(relevantFeature[0].properties.attraction_name)
    }

    // console.log(e.lngLat.wrap());
  })

}

function init() {
  setupDOM()
  makeMap()
  setupEnterView()
}






export default {
  init,
  resize
};
