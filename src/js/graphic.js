/* global d3 */
import enterView from 'enter-view'


const height = window.innerHeight;
let $map;



function resize() {}

function updateMapBack(el) {
  const currentStep = el.getAttribute('data-previous-step')
  if (currentStep === 'slide1') {
    console.log(currentStep)

    console.log('CHANGING COLOR BLACK')
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', '#000000');

  } else if (currentStep === 'slide2') {
    console.log(currentStep)

    console.log('CHANGING COLOR WHITE')
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', '#ffffff');

  }
}

function updateMap(el) {
  const currentStep = el.getAttribute('data-step')

  if (currentStep === 'slide1') {
    console.log(currentStep)

    console.log('CHANGING COLOR BLACK')
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', '#000000');

  } else if (currentStep === 'slide2') {
    console.log(currentStep)

    $map.setPaintProperty('local-vs-tourist-circles', 'circle-radius',
      [
        "interpolate",
        ["cubic-bezier", 0.1, 1, 0.2, 1],
        ["get", "total"], 0, 3, 1, 2, 85936, 20
      ])

    $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-color', 'hsl(0, 0%, 100%)')
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-width', 0.2)

    "hsl(0, 0%, 100%)"

  } else if (currentStep === 'slide3') {

    $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', [
      "interpolate",
      ["linear"],
      ["get", "pct_local"], 0, "#bf3a63", 1, "#3c58eb"
    ])
  } else if (currentStep === 'slide4') {

  }

}


function setupEnterView() {

  console.log('enter view setting up')
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
    offset: 0.05, // enter at middle of viewport
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

    // console.log($map.queryRenderedFeatures(e))

    const pointFeatures = $map.queryRenderedFeatures(e.point)
    const relevantLayer = "local_vs_tourist-0aaeny"
    const relevantFeature = pointFeatures.filter(item => item.sourceLayer === relevantLayer)

    if (relevantFeature.length > 0) {
      console.log(relevantFeature[0].properties.attraction_name)
    }

    // console.log(e.lngLat.wrap());
  })

  return $map

}

function init() {
  setupDOM()
  $map = makeMap()
  $map.on('load', () => {
    setupEnterView()
  })

}






export default {
  init,
  resize
};
