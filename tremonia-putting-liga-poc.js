DEBUG = (typeof DEBUG !== "undefined") && DEBUG

function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function calculateSum(tr) {
  return Number($(tr).find('td:last()').text());
}

function setData(tr, key, value) {
  $(tr).data(key, value);
  if (DEBUG) {
    $(tr).find('td:nth-child(2)').text(`${$(tr).find('td:nth-child(2)').text()}, ${key}: ${value}`);
  }
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

function sortTable(tbody) {

  tbody
    .find('tr')
    .each((i, tr) => {
      if (isPuttingRound || i%2 == 1) {
        sourceTr = tr;
        orderModifier = i-1;
      }
      else {
        sourceTr = $(tr).next();
        orderModifier = i+1;
      }
      sum = calculateSum(sourceTr);
      setSum(tr, sum);
      setOrder(tr, sum * 100 + orderModifier+1);
    })
    .sort((a, b) => getOrder(b) - getOrder(a))
    .each((i, tr) => $(tr).appendTo(tbody))
    .each((i, tr) => {
      lastTr = $(tr).prev();
      sum = getSum(tr);
      lastSum = getSum(lastTr);
      lastPosition = getPosition(lastTr);
      
      if (isPuttingRound) {
        
        if (sum == lastSum) {
          position = lastPosition;
        }
        else {
          position = i+1;
        }
      }
      else if (i%2 == 0) { // odd rows
          if (sum == lastSum) {
            position = lastPosition;
          }
          else {
            position = i/2+1;
          }
      }
      else { // even rows
          position = lastPosition;
      }
      if (DEBUG) {
        console.log('tr', tr);
        console.log('lastTr', lastTr[0]);
        console.log('sum', sum);
        console.log('lastSum', lastSum);
        console.log('lastPosition', getPosition(lastTr));
        console.log(`i: ${i}, position: ${position}`);
      }
      setPosition(tr, position);
      if (isPuttingRound || i%2 == 0) {
        $(tr).find('td:first()').text(position);
      }
      console.log('-----------------------------------------');
    });
}

function hideColumns(trContainer, columnType, columnSelectors) {
  columnSelectors.forEach(
    selector => trContainer.find(`tr ${columnType}:${selector}`).hide()
  );
}

function removeColors(tdContainer) {
  $(tdContainer)
    .find('td')
    .css('background-color', 'unset')
}

/* MAIN */

var isPuttingRound = $(".main-title").text().includes('Runde');
var isMainCompetition = !$(".main-title").text().includes('→');

if (isMainCompetition) {
  $('body').css('background-color', 'red');
}
else {
  $('body').css('background-color', 'green');
  var tbody = $('#id_results tbody:last()');
  var thead = $('#id_results thead:last()');
  var uselessColumns;
  if (isPuttingRound) {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-last-child(2)'];
  }
  else {
    uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-child(5)', 'nth-last-child(4)', 'nth-last-child(2)'];
  }
  
  removeColors(tbody);
  hideFirstTable();

  hideColumns(tbody, 'td', uselessColumns);
  hideColumns(thead, 'th', uselessColumns);

  sortTable(tbody);
}
