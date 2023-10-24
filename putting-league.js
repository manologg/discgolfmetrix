/***** CONSTANTS *****/

var REPO_BASE_URL = "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/";
var VERSION = '10:15';
console.log(VERSION);
var DEBUG = (typeof DEBUG !== "undefined") && DEBUG

// things needed for calculating stuff in the results table
var THEAD = $('#id_results thead:last()');
var TBODY = $('#id_results tbody:last()');
var categoryHeader = THEAD.find('tr').find('th:nth-child(2)').text().match(/[0-9]+/);
if (categoryHeader !== null) {
  var amountOfPlayers = Number(categoryHeader[0]);
  var amountOfTotalRounds = TBODY.find('tr').length;
  var AMOUNT_OF_ROUNDS = amountOfTotalRounds / amountOfPlayers;
  console.log(`There are ${amountOfPlayers} players and ${amountOfTotalRounds} rounds --> AMOUNT_OF_ROUNDS=${AMOUNT_OF_ROUNDS}`);
}
else {
  var AMOUNT_OF_ROUNDS = 0;
  console.log('No players yet!');
}
var playedHolesText = TBODY.find('tr').find('td[title="Played holes"]').text();
var ROUND_STARTED = playedHolesText.replaceAll('-', '').length !== 0;

// Sure, this breaks if you use arrows in the competition's name. Please DON'T
var currentCompetition = $(".main-title").text().match(/→/g)?.length || 0;

// competition levels
var LEAGUE = 0;
var TOURNAMENT = 1;
var ROUND = 2;

// just for debug
DEFAULT = 'DEFAULT';
METRIX = 'configured in metrix';

/***** THESE CAN BE DEFINED IN METRIX *****/

if (typeof POINT_SYSTEM === 'undefined') {
  POINT_SYSTEM = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1};
  DEFAULT_POINTS = true;
  origin = DEFAULT;
}
else {
  DEFAULT_POINTS = false;
  origin = METRIX;
}
console.log(`[${origin}] Using point system:`, POINT_SYSTEM);

if (typeof MAX_PUTTS_PER_STATION === 'undefined') {
  MAX_PUTTS_PER_STATION = 3;
  origin = DEFAULT;
}
else {
  origin = METRIX;
}
console.log(`[${origin}] Only ${MAX_PUTTS_PER_STATION} putts per station allowed`);

if (typeof EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE === "undefined") {
  EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE = 0;
  origin = DEFAULT;
}
else {
  origin = METRIX;
}
console.log(`[${origin}] If all putts from one station are made the player gets ${EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE} extra points`);

/***** THOUSAND FUNCTIONS *****/

function loadCss() {
  $.ajax({
    url: `${REPO_BASE_URL}/putting-league.css`,
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
    console.log(`Setting ${key} to ${value}`);
  }
}

function getPutts(td) {
  return $(td).data('putts');
}

function getScore(td) {
  return $(td).data('score');
}

function getSubSum(tr) {
  return $(tr).data('subSum');
}

function getSum(tr) {
  return $(tr).data('sum');
}

function getOrder(tr) {
  return $(tr).data('order');
}

function getPosition(tr) {
  return $(tr).data('position');
}

function setTdSum(i, td) {

  var putts = Number($(td).text()) || 0;
  var scoreMultiplicator = POINT_SYSTEM[i+1];
  var score = putts * scoreMultiplicator;
  if (putts == MAX_PUTTS_PER_STATION) {
    score = score + EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE;
    $(td).addClass('tpl-ace').css('background-color', '#ffb400');
  }
  setData(td, 'putts', putts)
  setData(td, 'score', score);
  $(td).text(score);
  $(td).addClass('tpl-points');
  if (!DEFAULT_POINTS) {
    $(td).append(`<span class="tpl-putts">${'•'.repeat(putts)}</span>`)
  }
  if (putts > MAX_PUTTS_PER_STATION) {
    $(td).addClass('tpl-error');
  }
    
  if (DEBUG) {
    console.log('td', td);
    console.log(`${i} => ${$(td).text()}: ${putts} * ${scoreMultiplicator} + ${EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE} = ${score}`);
    console.log('-----------------------------------------')
  }

}

function displaySubSum(tr, sum) {
  $(tr).find('td:nth-last-child(3)').text(sum);
}

function displaySum(tr, sum) {
  $(tr).find('td:last()').text(sum);
}

var stationsStart;
if (currentCompetition === ROUND) {
  stationsStart = 4;
}
else if (currentCompetition === TOURNAMENT || currentCompetition === LEAGUE) {
  stationsStart = 5;
}
function setTdSums(i, tr) {

  allScores = $(tr).find('td')
                   .slice(stationsStart, stationsStart + Object.values(POINT_SYSTEM).length)
                   .each(setTdSum)
                   .map((i, td) => getScore(td));

  var someTdHasErrors = $(tr).find('td.tpl-error').length > 0;
  if (someTdHasErrors) {
    $(tr).addClass('tpl-error');
    displaySubSum(tr, '');
  }
  else {
    var sum = Array.from(allScores).reduce((a, b) => a + b);
  
    if (currentCompetition === TOURNAMENT || currentCompetition === LEAGUE) {
      displaySubSum(tr, sum);
    }
    setData(tr, 'subSum', sum);
  }

}

function getPrevSubSums(tr, amountOfRounds) {
  if (amountOfRounds <= 0) {
    return 0;
  }
  var prev = $(tr).prev();
  return getPrevSubSums(prev, amountOfRounds - 1) + getSubSum(prev);
}

function getNextSubSums(tr, amountOfRounds) {
  if (amountOfRounds <= 0) {
    return 0;
  }
  var next = $(tr).next();
  return getNextSubSums(next, amountOfRounds - 1) + getSubSum(next);
}

function calculateAmountOfPrevRounds(AMOUNT_OF_ROUNDS, i) {
  return i % AMOUNT_OF_ROUNDS;
}

function calculateAmountOfNextRounds(AMOUNT_OF_ROUNDS, i) {
  return AMOUNT_OF_ROUNDS - 1 - i % AMOUNT_OF_ROUNDS;
}

function setTrSumAndOrder(i, tr) {
  
  if (currentCompetition === ROUND) {
    sum = getSubSum(tr);
    orderModifier = 0;
  }
  else { // currentCompetition === TOURNAMENT  || currentCompetition === LEAGUE
    
    var amountOfPrevRounds = calculateAmountOfPrevRounds(AMOUNT_OF_ROUNDS, i);
    var amountOfNextRounds = calculateAmountOfNextRounds(AMOUNT_OF_ROUNDS, i);
    sum = getPrevSubSums(tr, amountOfPrevRounds) + getSubSum(tr) + getNextSubSums(tr, amountOfNextRounds);
    
    var innerIndex = i % AMOUNT_OF_ROUNDS;
    var revInnerIndex = AMOUNT_OF_ROUNDS - 1 - i % AMOUNT_OF_ROUNDS;
    orderModifier = i - innerIndex + revInnerIndex;
  }

  if (currentCompetition === ROUND || ((currentCompetition === TOURNAMENT || currentCompetition === LEAGUE) && i % AMOUNT_OF_ROUNDS == AMOUNT_OF_ROUNDS - 1)) {
    if ($(tr).hasClass('tpl-error')) {
      displaySubSum(tr, '');
    }
    else {
      displaySum(tr, sum);
    }
  }
  setData(tr, 'sum', sum);
  setData(tr, 'order', sum * 100 + orderModifier);
}

function setTrPosition(i, tr) {
    
  lastTr = $(tr).prev();
  sum = getSum(tr);
  lastSum = getSum(lastTr);
  lastPosition = getPosition(lastTr);
  
  if (currentCompetition === ROUND) {
    
    if (sum == lastSum) {
      position = lastPosition;
    }
    else {
      position = i+1;
    }
  }
  // currentCompetition === TOURNAMENT || currentCompetition === LEAGUE
  else if (i % AMOUNT_OF_ROUNDS == 0) { // first row with name
      if (sum == lastSum) {
        position = lastPosition;
      }
      else {
        position = i / AMOUNT_OF_ROUNDS + 1;
      }
  }
  else { // other rows
      position = lastPosition;
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
  setData(tr, 'position', position);
  if (currentCompetition === ROUND || i % AMOUNT_OF_ROUNDS == 0) { // ONLY first rows in TOURNAMENT and LEAGUE competition
    $(tr).find('td:first()').text(position);
  }
}

function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function removeMetrixColors() {
  $(TBODY)
    .find('td')
    .removeClass('holeinone albatross eagle birdie bodey dbogey fail')
}

function hideColumns(trContainer, columnType, columnSelectors) {
  columnSelectors.forEach(
    selector => trContainer.find(`tr ${columnType}:${selector}`).hide()
  );
}

function displayThPoints(i, th) {
  $(th).text(`${$(th).text()} (${POINT_SYSTEM[i+1]}P)`)
}

function customizeResultsTable() {
  
  removeMetrixColors();
  
  var uselessColumns;
  if (currentCompetition === TOURNAMENT || currentCompetition === LEAGUE) {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-child(5)', 'nth-last-child(4)', 'nth-last-child(2)'];
  }
  else if (currentCompetition === ROUND) {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-last-child(2)'];
  }
  
  hideColumns(TBODY, 'td', uselessColumns);
  hideColumns(THEAD, 'th', uselessColumns);
  
  var uselessElements = ["h2", "#hs-switch-1", "#hs-switch-2", "#hs-switch-3", "#hole-stats-charts-container"]
  uselessElements.forEach(selector => $(selector).hide());

  if (!DEFAULT_POINTS) {
    THEAD.find('th')
         .slice(stationsStart, stationsStart + Object.values(POINT_SYSTEM).length)
         .each(displayThPoints);
  }

  if (ROUND_STARTED) {
    TBODY.find('tr')
         .each(setTdSums)
         .each(setTrSumAndOrder)
         .sort((a, b) => getOrder(b) - getOrder(a))
         .each((i, tr) => $(tr).appendTo(TBODY))
         .each(setTrPosition);
  }
}

/***** MAIN *****/

loadCss();
hideFirstTable();
customizeResultsTable();

console.log(VERSION);
