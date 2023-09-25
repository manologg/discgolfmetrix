var REPO_BASE_URL = "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/";

var VERSION = '15:39';
console.log(VERSION);
//var DEBUG = (typeof DEBUG !== "undefined") && DEBUG
var DEBUG = false;

// Sure, this breaks if you use arrows in the competition's name. Please DON'T
var currentCompetition = $(".main-title").text().match(/→/g)?.length || 0;

// competition levels
var LEAGUE = 0;
var TOURNAMENT = 1;
var ROUND = 2;

function loadCss() {
  $.ajax({
    url: `${REPO_BASE_URL}/tremonia-putting-liga.css`,
    success: function(response) {
      $("head").append(`<style>${response}</style>`);
    }
  });
}

function parseSum(tr) {
  return Number($(tr).find('td:last()').text());
}

function setData(tr, key, value) {
  $(tr).data(key, value);
  if (DEBUG) {
    $(tr).find('td:nth-child(2)').text(`${$(tr).find('td:nth-child(2)').text()}, ${key}: ${value}`);
  }
}

function setPutts(td, putts) {
  setData(td, 'putts', putts)
}

function getPutts(td) {
  return $(td).data('putts');
}

function setScore(td, points) {
  setData(td, 'score', points)
}

function getScore(td) {
  return $(td).data('score');
}

function setSubSum(tr, subSum) {
  setData(tr, 'subSum', subSum)
}

function getSubSum(tr) {
  return $(tr).data('subSum');
}

function setSum(tr, sum) {
  setData(tr, 'sum', sum)
}

function getSum(tr) {
  return $(tr).data('sum');
}

function setOrder(tr, order) {
  setData(tr, 'order', order);
}

function getOrder(tr) {
  return $(tr).data('order');
}

function setPosition(tr, position) {
  setData(tr, 'position', position);
}

function getPosition(tr) {
  return $(tr).data('position');
}

var stations = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5}
var MAX_PUTTS_PER_STATION = 3;
function setTdSum(i, td) {

  var putts = Number($(td).text()) || 0;
  var scoreMultiplicator = stations[i+1];
  var score = putts * scoreMultiplicator;
  setPutts(td, putts);
  setScore(td, score);
  $(td).text(score);
  $(td).addClass('tpl-points');
  $(td).append(`<span class="tpl-putts">${'•'.repeat(putts)}</span>`)
  if (putts > MAX_PUTTS_PER_STATION) {
    $(td).addClass('tpl-error');
  }
    
  if (DEBUG) {
    console.log('td', td);
    console.log(`${i} => ${$(td).text()}: ${putts} * ${scoreMultiplicator} = ${score}`);
    console.log('-----------------------------------------')
  }

}

function displaySubSum(tr, sum) {
  $(tr).find('td:nth-last-child(3)').text(sum);
}

var stationsStart;
if (currentCompetition === ROUND) {
  stationsStart = 4;
}
else if (currentCompetition === TOURNAMENT) {
  stationsStart = 5;
}
function setTdSums(i, tr) {

  // EXPERIMENT!
  if ($(".main-title").text().includes('2. Spieltag')) {
    allScores = $(tr).find('td')
                     .slice(stationsStart, stationsStart + Object.values(stations).length)
                     .each(setTdSum)
                     .map((i, td) => getScore(td));

    var sum = Array.from(allScores).reduce((a, b) => a + b);

    if (currentCompetition === ROUND) {
      displaySubSum(tr, sum);
    }
    setSubSum(tr, sum);
  }
}

function displaySum(tr, sum) {
  if (currentCompetition === ROUND || (currentCompetition === TOURNAMENT && i%2 == 1)) {
    $(tr).find('td:last()').text(sum);
  }
}

function setTrSumAndOrder(i, tr) {

  // EXPERIMENT!
  // this if-else is "duplicated"
  
  if ($(".main-title").text().includes('2. Spieltag')) {

    if (currentCompetition === ROUND) {
      sum = getSubSum(tr);
      orderModifier = i-1;
    }
    // currentCompetition === TOURNAMENT
    else if (i%2 == 1) { // even rows
      sum = getSubSum($(tr).prev()) + getSubSum(tr);
      orderModifier = i-1;
    }
    else { // odd rows
      sum = getSubSum(tr) + getSubSum($(tr).next());
      orderModifier = i+1;
    }
    
  }
  else {
    
    if (currentCompetition === LEAGUE || currentCompetition === ROUND || i%2 == 1) { // ONLY even rows in TOURNAMENT competition
      sourceTr = tr;
      orderModifier = i-1;
    }
    else {
      sourceTr = $(tr).next();
      orderModifier = i+1;
    }
    
    sum = parseSum(sourceTr);
  }

  displaySum(tr, sum);
  setSum(tr, sum);
  setOrder(tr, sum * 100 + orderModifier+1);
}

function setTrPosition(i, tr) {
    
  lastTr = $(tr).prev();
    sum = getSum(tr);
    lastSum = getSum(lastTr);
    lastPosition = getPosition(lastTr);
    
    if (currentCompetition === LEAGUE || currentCompetition === ROUND) {
      
      if (sum == lastSum) {
        position = lastPosition;
      }
      else {
        position = i+1;
      }
    }
    // currentCompetition === TOURNAMENT
    else if (i%2 == 1) { // even rows
        position = lastPosition;
    }
    else { // odd rows
        if (sum == lastSum) {
          position = lastPosition;
        }
        else {
          position = i/2+1;
        }
    }
    if (DEBUG) {
      console.log('tr', tr);
      console.log('lastTr', lastTr[0]);
      console.log('sum', sum);
      console.log('lastSum', lastSum);
      console.log('lastPosition', getPosition(lastTr));
      console.log(`i: ${i}, position: ${position}`);
      console.log('-----------------------------------------')
    }
    setPosition(tr, position);
    if (currentCompetition === LEAGUE || currentCompetition === ROUND || i%2 == 0) { // ONLY odd rows in TOURNAMENT competition
      $(tr).find('td:first()').text(position);
    }
  }

function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function removeColors(tdContainer) {
  $(tdContainer)
    .find('td')
    .css('background-color', 'unset')
}

function hideColumns(trContainer, columnType, columnSelectors) {
  columnSelectors.forEach(
    selector => trContainer.find(`tr ${columnType}:${selector}`).hide()
  );
}

/* MAIN */

loadCss();

var tbody;

if (currentCompetition === LEAGUE) {
  tbody = $('.data tbody:last()');
}
else {

  hideFirstTable();
  
  var thead = $('#id_results thead:last()');
  tbody = $('#id_results tbody:last()');

  removeColors(tbody);
  
  var uselessColumns;
  if (currentCompetition === TOURNAMENT) {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-child(5)', 'nth-last-child(4)', 'nth-last-child(2)'];
  }
  else if (currentCompetition === ROUND) {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-last-child(2)'];
  }
  
  hideColumns(tbody, 'td', uselessColumns);
  hideColumns(thead, 'th', uselessColumns);

  var uselessElements = ["h2", "#hs-switch-1", "#hs-switch-2", "#hs-switch-3", "#hole-stats-charts-container"]
  uselessElements.forEach(selector => $(selector).hide());
}

tbody.find('tr')
     // EXPERIMENT!
     .each(setTdSums)
     .each(setTrSumAndOrder)
     .sort((a, b) => getOrder(b) - getOrder(a))
     .each((i, tr) => $(tr).appendTo(tbody))
     .each(setTrPosition);

console.log(VERSION);
