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
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');
  } else if (currentStep === 'slide2') {
    console.log(currentStep)
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-radius', ["interpolate", ["cubic-bezier", 0.1, 1, 0.2, 1],
      ["get", "total"], 0, 3, 1, 2, 85936, 20
    ])
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-color', 'hsl(0, 0%, 100%)')
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-width', 0.2)
  } else if (currentStep === 'slide3') {
    console.log(currentStep)

    const nycCoords = [40.767474, -73.970294]
    const nycZoom = 10.8

    $map.flyTo({
      center: [nycCoords[1], nycCoords[0]],
      speed: 1,
      zoom: nycZoom
    })
    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', ["interpolate", ["linear"],
    //   ["get", "pct_local"], 0, "#bf3a63", 1, "#3c58eb"
    // ])
  } else if (currentStep === 'slide4') {
    console.log(currentStep)
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-opacity', ["step", ["get", "pct_local"], 0, 0.5999, 0, 0.6, 1])
    $map.setPaintProperty('local-vs-tourist-circles', 'circle-radius', ["interpolate", ["cubic-bezier", 0.1, 1, 0.2, 1],
      ["get", "total"], 0, 3, 1, 2, 24048, 25
    ])
  } else if (currentStep === 'slide5') {
    console.log(currentStep)
    const centerCooords = [40.119448, -98.056438]
    $map.flyTo({
      center: [centerCooords[1], centerCooords[0]],
      speed: 1,
      zoom: 3.9
    })
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

  const centerCooords = [40.119448, -98.056438]

  const $map = new mapboxgl.Map({
    container: `map`,
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 14,
    minZoom: 3,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/ck86bp6qk01jy1io6gzwfmxhb',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 3.9,
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
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'none');

  })
  $map.on('load', () => {
    setupEnterView()
  })

}






export default {
  init,
  resize
};
