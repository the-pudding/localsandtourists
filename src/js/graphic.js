/* global d3 */
import enterView from 'enter-view'
import legend from 'd3-svg-legend'

const height = window.innerHeight;
let $compareMap;
let $localMap;
let $touristMap;
let stopTimesquare = true

let attractionName = ''
let attractionScore = ''
let attractionTotal = ''
let compareGraphicBuilt = false;
let width;

let mapSelected = "local";
const nycCoords = [40.767474, -73.970294]
const centerCooords = [40.119448, -98.056438]

const nycZoom = 10.8

let storyZindex;
let storyStepZindex;
let mapZindex;

let changeZindex = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function changeShownMap(){
  if(mapSelected == "tourist"){
    $touristMap.setCenter($localMap.getCenter());
    $touristMap.setZoom($localMap.getZoom())

    d3.select("#local").style("display",null);
    d3.select("#tourist").style("display",null);
  }
  else if(mapSelected == "local") {
    $localMap.setCenter($touristMap.getCenter());
    $localMap.setZoom($touristMap.getZoom())

    d3.select("#local").style("display","block");
    d3.select("#tourist").style("display","none");
  }
}

function makeLegends() {

  const linearSize = d3.scaleLinear().domain([0, 24048]).range([2, 25]);

  const svgContainer = d3.select('#map').append('div')
  svgContainer.attr('class', 'legends-container')

  const svg = svgContainer.append('svg')
  svg.attr('class', 'legend')
  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(20, 40)");

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
  width = window.innerWidth

  console.log(height)

  d3.selectAll('.story-step')
    .style('height', function(d,i){
      if(i == d3.selectAll('.story-step').size() - 1){
        return height*3/4+"px";
      }
      return height+"px"
    })

  d3.select('html')
    .style('width', `${width}px`)

  d3.select('.cover')
    .style('height', `${height}px`)
    .style('width', `${width}px`)

  d3.select('.v2-cover-text')
    .style('height', `${height}px`)


  if($touristMap){
    $touristMap.resize();
  }
  if($localMap){
    $localMap.resize();
  }

  // d3.select('.title-text')
  //   .style('height', `${height/2}px`)

  //d3.select('.subhed')
    //.style('height', "100px")//`${height/2}px`)
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatScore(score) {

  let returnedScore = score.toString()
  //   console.log(returnedScore)

  if (returnedScore.length > 4) {
    returnedScore = returnedScore.substring(0, 4)
  }
  //   return (returnedScore + '⭐')
  return (returnedScore + '/5')
}

function setupExplore() {
  const $exploreButton = d3.select('[data-step="slide6"]').select('.story-text')
  const $storyButton = d3.select('.btn--to-story')
  const $toggle = d3.select('.btn--map-select').selectAll("p");
  const detailsBar = d3.select('.attraction-detail-container')
  const $aboutButton = d3.select('.btn--about')
  const $aboutCloseButton = d3.select('.about-close')
  //   const $localMapOverlayList = d3.select('.map-overlay')

  const $detailsAttractionName = d3.select('.display--attraction-name')
  const $detailsRating = d3.select('.display--rating')
  const $detailsTotal = d3.select('.display--total')


  $touristMap.on('mousemove', e => {

    console.log('touristMap')
    const pointFeatures = $touristMap.queryRenderedFeatures(e.point)
    const relevantLayer = ['all_locals_tourists-8w7k0h']
    const relevantFeature = pointFeatures.filter(item => relevantLayer.includes(item.sourceLayer))

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
      <span class='display--total'>${numberWithCommas(attractionTotal)}</span> ratings.`;

    detailsBar.html(htmlString)
  })
  $localMap.on('mousemove', e => {

    const pointFeatures = $localMap.queryRenderedFeatures(e.point)
    const relevantLayer = ['all_locals_tourists-8w7k0h']
    const relevantFeature = pointFeatures.filter(item => relevantLayer.includes(item.sourceLayer))


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
    <span class='display--total'>${numberWithCommas(attractionTotal)}</span> ratings.`;

    detailsBar.html(htmlString)

  })

  $exploreButton.on('click', () => {

    $aboutButton.classed('hidden', false)
    detailsBar.classed('hidden', false)

    $storyButton.style('display', 'flex')
    d3.select('.story').classed('hidden', true)
    d3.select('.cover').classed('hidden', true)
    $localMap.scrollZoom.enable()
    $localMap.dragPan.enable()
    $touristMap.scrollZoom.enable()
    $touristMap.dragPan.enable()

    d3.select('.btn--map-select').style('display', 'flex');

    $touristMap.setCenter([centerCooords[1], centerCooords[0]]);
    $touristMap.setZoom(3.9);

    $localMap.setCenter([centerCooords[1], centerCooords[0]]);
    $localMap.setZoom(3.9);


    // d3.select('header.is-sticky').classed('invisible', true)

    // let storyZindex = parseInt(d3.select('.story').style('z-index'))
    // let storyStepZindex = parseInt(d3.selectAll('.story-step').style('z-index'))
    // let mapZindex = parseInt(d3.select('#map').style('z-index'))


  })

  $storyButton.on('click', () => {
    changeZindex = true;

    $aboutButton.classed('hidden', true)
    // detailsBar.classed('hidden', true)
    $storyButton.style('display', 'none')
    d3.select('.btn--map-select').style('display', null);

    d3.select('.story').classed('hidden', false)
    d3.select('.cover').classed('hidden', false)
    $localMap.scrollZoom.disable()
    $localMap.dragPan.disable()
    $touristMap.scrollZoom.disable()
    $touristMap.dragPan.disable()

    mapSelected = "local"
    changeShownMap();

    $touristMap.setCenter([nycCoords[1], nycCoords[0]]);
    $touristMap.setZoom(nycZoom);

    $localMap.setCenter([nycCoords[1], nycCoords[0]]);
    $localMap.setZoom(nycZoom);

    //d3.select('header.is-sticky').classed('invisible', false)


    // d3.select('.story').style('z-index', `${storyZindex+1}`)
    // d3.selectAll('.story-step').style('z-index', `${storyStepZindex+1}`)
    // d3.select('#map').style('z-index', `${mapZindex-1}`)
  })

  $aboutButton.on('click', () => {
    d3.select('.about').classed('hidden', false)
    d3.select('.about-close').classed('hidden', false)
  })

  $aboutCloseButton.on('click', () => {
    d3.select('.about').classed('hidden', true)
    d3.select('.about-close').classed('hidden', true)

  })

  $toggle.classed("selected",function(d,i){
    if(i==1){
      return true;
    }
    return false
  })

  $toggle.on('click', function(d,i){
    $toggle.classed("selected",false)
    d3.select(this).classed("selected",true);
    if(i==0){
      mapSelected = "tourist"
      changeShownMap();
    }
    else {
      mapSelected = "local";
      changeShownMap();
    }
  });

  d3.selectAll('.story-step')
    .style('z-index', '5')

  function normalize(string) {
    return string.trim().toLowerCase();
  }
}

function updateMapBack(el) {

  const currentStep = el.getAttribute('data-previous-step')
  console.log(currentStep);
  if (currentStep === 'slide1') {
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'none');

  }
  else if (currentStep === 'slide2') {

    $touristMap.flyTo({
      center: [centerCooords[1], centerCooords[0]],
      zoom: 3.9
    }).on('render', () => {
      if (stopTimesquare) {
        // console.log(0)
        // $localMap.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none')
        stopTimesquare = false
      }
    })

  }
  else if (currentStep === 'slide3') {
    if(compareGraphicBuilt){
      removeCompare("right");
    }
  }
  else if (currentStep === 'slide3_5') {

    $touristMap.stop()
    $touristMap.setCenter([nycCoords[1], nycCoords[0]])
    $touristMap.setZoom(nycZoom)
    stopTimesquare = false;
    $touristMap.resize();

    if(!compareGraphicBuilt){
      createCompare("tourist");
    }
  } else if (currentStep === 'slide4') {


  } else if (currentStep === 'slide5') {
    console.log(currentStep)
  }
}

function createCompare(match){
  d3.select("#local").style("display","block");
  d3.select("#tourist").style("display",null);

  if(match == "tourist"){
    $localMap.setCenter($touristMap.getCenter());
    $localMap.setZoom($touristMap.getZoom())
  }
  else{
    $touristMap.setCenter(localMap.getCenter());
    $touristMap.setZoom($localMap.getZoom())
  }


  $compareMap = new mapboxgl.Compare($touristMap,$localMap,"#compare-container");
  $localMap.resize();
  $touristMap.resize();
  compareGraphicBuilt = true;
}

function removeCompare(mapDirection){

  var sliderScale = d3.scalePow().domain([0,499]).range([$compareMap.currentPosition,width]).exponent(3);
  if(mapDirection == "left"){
    sliderScale.range([$compareMap.currentPosition,0])
  }

  var t = d3.timer(function(elapsed) {
    $compareMap.setSlider(sliderScale(elapsed))
    if (elapsed > 499){
      t.stop();
      $compareMap.remove();
      compareGraphicBuilt = false;
      if(mapDirection == "right"){
        d3.select("#local").style("display",null);
        $touristMap.resize();
      }
      else {
        d3.select("#tourist").style("display","none");
      }
    }
  }, 500);


}

function slideCompare(amount){

  var sliderScale = d3.scalePow().domain([0,499]).range([$compareMap.currentPosition,amount*width]).exponent(3);
  // if($compareMap.currentPosition > amount*width){
  //   sliderScale.range([$compareMap.currentPosition,amount*width])
  // }

  var t = d3.timer(function(elapsed) {
    $compareMap.setSlider(sliderScale(elapsed))
    if (elapsed > 499){
      t.stop();
      $touristMap.resize();
      $localMap.resize();
    }
  }, 500);
}




function updateMap(el) {

  storyZindex = +d3.selectAll('.story').style('z-index')
  storyStepZindex = +d3.selectAll('.story-step').style('z-index')

  if (changeZindex) {
    storyZindex += 1
    storyStepZindex += 1

    d3.selectAll('.story')
      .style('z-index', storyZindex)

    d3.selectAll('.story-step')
      .style('z-index', storyStepZindex)

    changeZindex = false

    console.log('changed z index')
  } else if (!changeZindex) {
    d3.selectAll('.story')
      .style('z-index', '50')

    d3.selectAll('.story-step')
      .style('z-index', '50')
  }

  const currentStep = el.getAttribute('data-step')
  console.log(currentStep)

  if (currentStep === 'slide1') {

    // d3.selectAll('.story')
    //   .style('z-index', (storyZindex + 1))

    // d3.selectAll('.story-step')
    //   .style('z-index', (storyStepZindex + 1))

    // console.log(storyZindex)
    // $localMap.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');


  }
  else if (currentStep === 'slide2') {
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'visible');
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'visible');


  } else if (currentStep === 'slide3') {

    console.log(currentStep)
    stopTimesquare = true;

    $touristMap.flyTo({
        center: [nycCoords[1], nycCoords[0]],
        zoom: nycZoom
      })

      // .on('render', () => {
      //   if (stopTimesquare) {
      //     //   $localMap.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'visible')
      //   }
      // })

    // $localMap.setLayoutProperty('min-9-zoom-all_reviews', 'visibility', 'none');

  }
  else if (currentStep == 'slide3_5'){
    $touristMap.stop()
    $touristMap.setCenter([nycCoords[1], nycCoords[0]])
    $touristMap.setZoom(nycZoom)
    stopTimesquare = false;
    $touristMap.resize();

    if(!compareGraphicBuilt){
      createCompare("tourist");
    }
    d3.select('.mapboxgl-compare').classed('hidden', false)
  }
  else if (currentStep === 'slide4') {
    if(compareGraphicBuilt){
      slideCompare(.2);
    }
  }
  else if (currentStep === 'slide5') {
  }
  else if (currentStep == 'slide6'){
    if(compareGraphicBuilt){
      removeCompare("left");
    }
    $localMap.resize()
    $localMap.flyTo({
      center: [centerCooords[1], centerCooords[0]],
      zoom: 3.9
    })

    d3.select('.legends-container').style('visibility', 'visible')
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
    },
    offset: 0.05, // enter at middle of viewport
    once: false, // trigger just once
  });
}

function setupDOM() {

  d3.select('#map')
    .style('height', `${height}px`)

  d3.selectAll(".story-step").style("margin-top",function(d,i){
    if(i==0){
      return -height/3+"px"
    }
    return null;
  })
}

function makeMap() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2thZWxrN3cxMDVpYTJ0bXZwenI2ZXl1ZCJ9.E0ICxBW96VVQbnQqyRTWbA';

  $touristMap = new mapboxgl.Map({
    container: 'tourist',
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 17,
    minZoom: 3,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/cka4gpcor04481is1e30pmzc2?optimize=true', // optimize=true',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 3.9,
  });

  $localMap = new mapboxgl.Map({
    container: 'local',
    center: [centerCooords[1], centerCooords[0]],
    maxZoom: 17,
    minZoom: 3,
    dragPan: false,
    scrollZoom: false,
    style: 'mapbox://styles/dock4242/cka4g5py203jk1iqs4cpx6b9e', // optimize=true',
    maxBounds: [
      [-180, 0],
      [-40, 75]
    ],
    zoom: 3.9,
  });

  return [$touristMap, $localMap]
}

function init() {
  resize()
  setupDOM()
  const maps = makeMap()

  $touristMap.on('load', () => {
    $touristMap.resize();
    $touristMap.scrollZoom.disable()
    // $compareMap.setSlider(width)
    //   d3.select('.mapboxgl-compare').classed('hidden', true)
    setupEnterView()
  })


  $localMap.on('load', () => {

    $localMap.scrollZoom.disable()
    // $localMap.flyTo({
    //   zoom: 12.1,
    //   center: [-73.993158, 40.737553]
    // })

    // $localMap.setLayoutProperty('local-vs-tourist-circles', 'visibility', 'visible');
    // $localMap.setLayoutProperty('local-vs-tourist-scores-abridged-text', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-vs-tourist-scores-abridged-circles', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-tourist-liberty-time-sq', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner', 'visibility', 'none');
    // $localMap.setLayoutProperty('local-tourist-alpaca-corner-circles', 'visibility', 'none');
  })

  //   makeLegends()
  setupExplore()
}






export default {
  init,
  resize
};
