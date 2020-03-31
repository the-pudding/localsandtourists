/* global d3 */
import enterView from 'enter-view'
import legend from 'd3-svg-legend'

const height = window.innerHeight;
let $map;


function makeLegends() {

  const linearSize = d3.scaleLinear().domain([0, 24048]).range([2, 25]);

  const svgContainer = d3.select('#map').append('div')
  svgContainer.attr('class', 'legends-container')

  const svg = svgContainer.append('svg')
  svg.attr('class', 'legend')
  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(20, 40)");

  //   const legendSize = d3.legendSize()
  //     .scale(linearSize)
  //     .shape('circle')
  //     .shapePadding(15)
  //     .labelOffset(20)
  //     .orient('horizontal');

  //   svg.select(".legendSize")
  //     .call(legendSize);

  const thresholdScale = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5])
    .range(['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177']);

  svg.append("g")
    .attr("class", "legendQuant")
    .attr("transform", "translate(20,20)");

  const legend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .useClass(true)
    .scale(thresholdScale)
}


function resize() {}

function updateMapBack(el) {
  const currentStep = el.getAttribute('data-previous-step')
  if (currentStep === 'slide1') {
    console.log(currentStep)

    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', '#000000');
    $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');
    $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');

  } else if (currentStep === 'slide2') {
    console.log(currentStep)

    const centerCooords = [40.119448, -98.056438]

    $map.flyTo({
      center: [centerCooords[1], centerCooords[0]],
      speed: 0.3,
      zoom: 3.9
    })

  } else if (currentStep === 'slide3') {
    console.log(currentStep)
  } else if (currentStep === 'slide3_5') {
    console.log(currentStep)

  } else if (currentStep === 'slide4') {
    console.log(currentStep)
  } else if (currentStep === 'slide5') {
    console.log(currentStep)
  }
}



function updateMap(el) {
  const currentStep = el.getAttribute('data-step')

  if (currentStep === 'slide1') {
    console.log(currentStep)
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');


  } else if (currentStep === 'slide2') {
    console.log(currentStep)

    $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'visible');
    $map.setPaintProperty('local-tourist-alpaca-corner', 'text-color', '#fa9fb5');
    // $map.setPaintProperty('local-tourist-alpaca-corner', 'text-font', ["Open Sans Bold", "Arial Unicode MS Regular"])





    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-radius', ["interpolate", ["cubic-bezier", 0.1, 1, 0.2, 1],
    //   ["get", "total"], 0, 3, 1, 2, 85936, 20
    // ])
    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-color', 'hsl(0, 0%, 100%)')
    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-stroke-width', 0.2)
  } else if (currentStep === 'slide3') {
    console.log(currentStep)

    const nycCoords = [40.767474, -73.970294]
    const nycZoom = 10.8
    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'visible');

    $map.flyTo({
      center: [nycCoords[1], nycCoords[0]],
      speed: 0.7,
      zoom: nycZoom
    })


    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-color', ["interpolate", ["linear"],
    //   ["get", "pct_local"], 0, "#bf3a63", 1, "#3c58eb"
    // ])
  } else if (currentStep === 'slide4') {
    console.log(currentStep)
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'none');
    $map.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'visible');
    $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'visible');
    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-opacity', ["step", ["get", "pct_local"], 0, 0.5999, 0, 0.6, 1])
    // $map.setPaintProperty('local-vs-tourist-circles', 'circle-radius', ["interpolate", ["cubic-bezier", 0.1, 1, 0.2, 1],
    //   ["get", "total"], 0, 3, 1, 2, 24048, 25
    // ])
  } else if (currentStep === 'slide5') {
    console.log(currentStep)
    // const centerCooords = [40.119448, -98.056438]
    // $map.flyTo({
    //   center: [centerCooords[1], centerCooords[0]],
    //   speed: 1,
    //   zoom: 3.9
    // })
    // $map.setLayoutProperty('local-vs-tourist-scores', 'visibility', 'visible');
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'none');
    d3.select('.legends-container').style('visibility', 'visible')

    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'visible');

    $map.flyTo({
      zoom: 12.1
    })

    $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'visible');
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
    const relevantLayer = 'local_vs_tourist_scores-aitd0l'
    const relevantFeature = pointFeatures.filter(item => item.sourceLayer === relevantLayer)

    if (relevantFeature.length > 0) {
      console.log(relevantFeature[0].properties.attraction_name)
    }

    // const currentZoom = $map.getZoom()
    // if (currentZoom > 12) {
    //   $map.setLayoutProperty('local-vs-tourist-scores-text', 'visibility', 'none');
    // } else if (currentZoom < 12) {
    //   $map.setLayoutProperty('local-vs-tourist-scores-text', 'visibility', 'visible');
    // }

    // console.log(e.lngLat.wrap());
  })



  return $map

}

function init() {
  setupDOM()
  $map = makeMap()
  $map.on('load', () => {
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');
    $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'none');
    $map.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'none');
    $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');
    $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');

  })
  $map.on('load', () => {
    setupEnterView()
  })
  makeLegends()
}






export default {
  init,
  resize
};
