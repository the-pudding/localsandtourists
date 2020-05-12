/* global d3 */
import enterView from 'enter-view'
import legend from 'd3-svg-legend'
// import mapboxgl from 'mapbox-gl';
// import MapboxCompare from 'mapbox-gl-compare';

const height = window.innerHeight;
let $map;
let stopTimesquare = true

let attractionName = ''
let attractionScore = ''
let attractionTotal = ''

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


function resize() {


  const height = window.innerHeight
  const width = window.innerWidth

  console.log(height)

  d3.selectAll('.story-step')
    .style('height', `${height}px`)

  d3.select('html')
    .style('width', `${width}px`)

  d3.select('.cover')
    .style('height', `${height}px`)
    .style('width', `${width}px`)

  d3.select('.v2-cover-text')
    .style('height', `${height}px`)

  d3.select('.title-text')
    .style('height', `${height/2}px`)

  d3.select('.subhed')
    .style('height', `${height/2}px`)
}

function formatScore(score) {
  let returnedScore = score.toString()
  //   console.log(returnedScore)

  if (returnedScore.length > 4) {
    returnedScore = returnedScore.substring(0, 4)
  }
  return (returnedScore + '⭐')
}

function setupExplore() {
  const $exploreButton = d3.select('[data-step="slide5"]').select('.story-text')
  const $storyButton = d3.select('.btn--to-story')
  const detailsBar = d3.select('.attraction-detail-container')
  const $aboutButton = d3.select('.btn--about')
  const $aboutCloseButton = d3.select('.about-close')
  //   const $mapOverlayList = d3.select('.map-overlay')

  const $detailsAttractionName = d3.select('.display--attraction-name')
  const $detailsRating = d3.select('.display--rating')
  const $detailsTotal = d3.select('.display--total')


  $map.on('mousemove', e => {

    const pointFeatures = $map.queryRenderedFeatures(e.point)
    const relevantLayer = ['local_vs_tourist_scores_abrid-1tqzb9']
    const relevantFeature = pointFeatures.filter(item => relevantLayer.includes(item.sourceLayer))

    // console.log(relevantFeature)


    if (relevantFeature.length > 0) {
      attractionName = relevantFeature[0].properties.attraction_name
      attractionScore = relevantFeature[0].properties.score
      attractionTotal = relevantFeature[0].properties.total
    }

    $detailsAttractionName.text(attractionName)
    $detailsRating.text(attractionScore)
    $detailsTotal.text(attractionTotal)



    const htmlString = attractionName == '' ? 'Hover over a destination to find out its rating and total number of reviews.' : `
    <span class='display--attraction-name'>${attractionName}</span> scores an average of <span class='display--rating'>${formatScore(attractionScore)}</span>, with
    <span class='display--total'>${attractionTotal}</span> ratings.`;

    detailsBar.html(htmlString)
    // console.log($map.queryRenderedFeatures(e))
    // const currentZoom = $map.getZoom()
    // if (currentZoom > 12) {
    //   $map.setLayoutProperty('local-vs-tourist-scores-text', 'visibility', 'none');
    // } else if (currentZoom < 12) {
    //   $map.setLayoutProperty('local-vs-tourist-scores-text', 'visibility', 'visible');
    // }

    // console.log(e.lngLat.wrap());
  })

  $exploreButton.on('click', () => {

    // $mapOverlayList.classed('hidden', false)
    // console.log(`length ${attractionName.length}`)

    $aboutButton.classed('hidden', false)
    detailsBar.classed('hidden', false)

    $storyButton.classed('hidden', false)
    d3.select('.story').classed('hidden', true)
    $map.scrollZoom.enable()
    $map.dragPan.enable()

    d3.select('header.is-sticky').classed('invisible', true)
  })


  $storyButton.on('click', () => {
    // $mapOverlayList.classed('hidden', true)
    $aboutButton.classed('hidden', true)
    detailsBar.classed('hidden', true)
    $storyButton.classed('hidden', true)
    d3.select('.story').classed('hidden', false)
    $map.scrollZoom.disable()
    $map.dragPan.disable()

    d3.select('header.is-sticky').classed('invisible', false)
  })

  $aboutButton.on('click', () => {
    d3.select('.about').classed('hidden', false)
    d3.select('.about-close').classed('hidden', false)
  })

  $aboutCloseButton.on('click', () => {
    d3.select('.about').classed('hidden', true)
    d3.select('.about-close').classed('hidden', true)

  })

  d3.selectAll('.story-step')
    .style('z-index', '5')







  // FILTER ON PAGE CODE

  let airports = [];

  // Create a popup, but don't add it to the map yet.
  let popup = new mapboxgl.Popup({
    closeButton: false
  });


  let filterEl = document.getElementById('feature-filter');
  let listingEl = document.getElementById('feature-listing');


  //   function renderListings(features) {
  //     let empty = document.createElement('p');
  //     // Clear any existing listings
  //     listingEl.innerHTML = '';
  //     if (features.length) {

  //       features.sort((a, b) => (+a.properties.score < +b.properties.score) ? 1 : ((+b.properties.score < +a.properties.score) ? -1 : 0)).forEach(function (feature) {
  //         let prop = feature.properties;
  //         // console.log(prop)
  //         let item = document.createElement('a');
  //         item.href = prop.attraction_name;
  //         item.target = '_blank';
  //         item.textContent = `${prop.attraction_name} (${formatScore(feature.properties.score)}, ${feature.properties.total} reviews)`;
  //         item.addEventListener('mouseover', function () {
  //           // Highlight corresponding feature on the map
  //           popup
  //             .setLngLat(feature.geometry.coordinates)
  //             .setText(`${prop.attraction_name}`)
  //             .addTo($map);
  //         });
  //         listingEl.appendChild(item);
  //       });

  //       // Show the filter input
  //       filterEl.parentNode.style.display = 'block';
  //     } else if (features.length === 0 && filterEl.value !== '') {
  //       empty.textContent = 'No results found';
  //       listingEl.appendChild(empty);
  //     } else {
  //       empty.textContent = 'Drag the map to populate results';
  //       listingEl.appendChild(empty);

  //       // Hide the filter input
  //       filterEl.parentNode.style.display = 'none';

  //       // remove features filter
  //       $map.setFilter('local-vs-tourist-scores-abridged-circles', ['has', 'attraction_name']);
  //     }
  //   }

  function normalize(string) {
    return string.trim().toLowerCase();
  }

  //   function getUniqueFeatures(array, comparatorProperty) {
  //     var existingFeatureKeys = {};
  //     // Because features come from tiled vector data, feature geometries may be split
  //     // or duplicated across tile boundaries and, as a result, features may appear
  //     // multiple times in query results.
  //     var uniqueFeatures = array.filter(function (el) {
  //       if (existingFeatureKeys[el.properties[comparatorProperty]]) {
  //         return false;
  //       } else {
  //         existingFeatureKeys[el.properties[comparatorProperty]] = true;
  //         return true;
  //       }
  //     });
  //     return uniqueFeatures;
  //   }

  $map.on('moveend', function () {
    // const features = $map.queryRenderedFeatures({
    //   layers: ['local-vs-tourist-scores-abridged-circles']
    // });

    // console.log(features)

    // if (features) {
    //   const uniqueFeatures = getUniqueFeatures(features, 'attraction_id');

    //   //   console.log(uniqueFeatures)
    //   // Populate features for the listing overlay.
    //   renderListings(uniqueFeatures);

    //   // Clear the input container
    //   filterEl.value = '';

    //   // Store the current features in sn `airports` variable to
    //   // later use for filtering on `keyup`.
    //   airports = uniqueFeatures;
    // }
  });


  //   $map.on('mousemove', 'local-vs-tourist-scores-abridged-circles', (e) => {
  //     // Change the cursor style as a UI indicator.
  //     $map.getCanvas().style.cursor = 'pointer';

  //     // Populate the popup and set its coordinates based on the feature.
  //     var feature = e.features[0];
  //     popup
  //       .setLngLat(feature.geometry.coordinates)
  //       .setText(`${feature.properties.attraction_name}`)
  //       .addTo($map);
  //   });

  //   $map.on('mouseleave', 'local-vs-tourist-scores-abridged-circles', () => {
  //     $map.getCanvas().style.cursor = '';
  //     popup.remove();
  //   });


  //   filterEl.addEventListener('keyup', function (e) {
  //     let value = normalize(e.target.value);

  //     // console.log(value)
  //     // Filter visible features that don't match the input value.
  //     let filtered = airports.filter(function (feature) {
  //       let name = normalize(feature.properties.attraction_name);
  //       //   let code = feature.properties.attraction_id;
  //       return name.indexOf(value) > -1;
  //     });

  //     // Populate the sidebar with filtered results
  //     // renderListings(filtered);

  //     // Set the filter to populate features into the layer.
  //     if (filtered.length) {
  //       $map.setFilter('local-vs-tourist-scores-abridged-circles', [
  //         'match',
  //         ['get', 'attraction_id'],
  //         filtered.map(function (feature) {
  //           return feature.properties.attraction_id;
  //         }),
  //         true,
  //         false
  //       ]);
  //       // Call this function on initialization
  //       // passing an empty array to render an empty state
  //     } else if (filtered.length == 0) {

  //       let features = $map.queryRenderedFeatures({
  //         layers: ['local-vs-tourist-scores-abridged-circles']
  //       });


  //       letuniqueFeatures = getUniqueFeatures(features, 'attraction_id');

  //       renderListings([]);

  //       //   console.log(uniqueFeatures)
  //       // Populate features for the listing overlay.
  //       renderListings(uniqueFeatures);

  //       // Clear the input container
  //       filterEl.value = '';

  //       // Store the current features in sn `airports` variable to
  //       // later use for filtering on `keyup`.
  //       airports = uniqueFeatures;
  //     }
  //   });


}


function updateMapBack(el) {
  const currentStep = el.getAttribute('data-previous-step')
  if (currentStep === 'slide1') {
    // console.log(currentStep)
    // $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'none');

  } else if (currentStep === 'slide2') {
    // console.log(currentStep)

    const centerCooords = [40.119448, -98.056438]

    $map.flyTo({
      center: [centerCooords[1], centerCooords[0]],
      speed: 0.3,
      zoom: 3.9
    }).on('render', () => {
      if (stopTimesquare) {
        // console.log(0)
        // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none')
        stopTimesquare = false
      }
    })


  } else if (currentStep === 'slide3') {
    // console.log(currentStep)
  } else if (currentStep === 'slide3_5') {
    // console.log(currentStep)
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'none');
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'none');
    // $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');
    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'visible')
  } else if (currentStep === 'slide4') {
    // console.log(currentStep)

    $map.flyTo({
      zoom: 10.8
    })
  } else if (currentStep === 'slide5') {
    // console.log(currentStep)
  }
}



function updateMap(el) {

  d3.selectAll('.story')
    .style('z-index', '50')

  d3.selectAll('.story-step')
    .style('z-index', '50')

  const currentStep = el.getAttribute('data-step')

  if (currentStep === 'slide1') {
    // console.log(currentStep)
    // $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');


  } else if (currentStep === 'slide2') {
    // console.log(currentStep)
    // $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'visible');
    // $map.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'visible');


  } else if (currentStep === 'slide3') {
    // console.log(currentStep)
    stopTimesquare = true;
    const nycCoords = [40.767474, -73.970294]
    const nycZoom = 10.8

    $map.flyTo({
        center: [nycCoords[1], nycCoords[0]],
        speed: 0.7,
        zoom: nycZoom
      })
      .on('render', () => {
        if (stopTimesquare) {
          console.log(0)
          $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'visible')
        }
      })

  } else if (currentStep === 'slide4') {
    stopTimesquare = false;
    // $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none')
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'visible');
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'visible');
  } else if (currentStep === 'slide5') {
    // console.log(currentStep)
    $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'none');
    d3.select('.legends-container').style('visibility', 'visible')



    $map.flyTo({
      zoom: 12.1,
      center: [-73.993158, 40.737553]
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

  //   const $map =
  //     new mapboxgl.Map({
  //       container: `map`,
  //       center: [centerCooords[1], centerCooords[0]],
  //       maxZoom: 17,
  //       minZoom: 3,
  //       dragPan: false,
  //       scrollZoom: false,
  //       style: 'mapbox://styles/dock4242/ck86bp6qk01jy1io6gzwfmxhb',
  //       maxBounds: [
  //         [-180, 0],
  //         [-40, 75]
  //       ],
  //       zoom: 3.9,
  //     });


  //   $map.addControl(new mapboxgl.NavigationControl())
  //   return $map

  const $beforeMap = new mapboxgl.Map({
    container: 'before',
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 17,
    minZoom: 3,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/ck8jdkvdj01e71io5umxeue26?optimize=true', // optimize=true',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 3.9,
  });

  const $afterMap = new mapboxgl.Map({
    container: 'after',
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 17,
    minZoom: 3,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/ck9ydd3ta225y1ipjj63ttblk?optimize=true', // optimize=true',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 6.9,
  });

  const container = '#map'
  const $map = new mapboxgl.Compare($beforeMap, $afterMap, container, {
    // Set this to enable comparing two maps by mouse movement:
    // orientation: 'horizontal',
    // mousemove: true
  });

  return $afterMap

}

function init() {
  resize()
  setupDOM()
  $map = makeMap()
  $map.on('load', () => {

    $map.flyTo({
      zoom: 12.1,
      center: [-73.993158, 40.737553]
    })

    // $map.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'none');
    // $map.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');
    // $map.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'none');
  })
  $map.on('load', () => {
    setupEnterView()
  })
  //   makeLegends()
  setupExplore()
}






export default {
  init,
  resize
};
