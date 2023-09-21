function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function calculateSum(tr) {
  return Number($(tr).find('td:last()').text());
}

function setOrder(tr, sum) {
  $(tr).data('order', sum);
}

function getOrder(tr) {
  return $(tr).data('order');
}

function sortTable(tbody) {

  var lastPosition = 0;
  var lastSum = Number.MAX_VALUE;
  
  tbody
    .find('tr')
    .each((i, tr) => {
      if (isPuttingRound || i%2) {
        sourceTr = tr;
        orderModifier = i-1;
      }
      else {
        sourceTr = $(tr).next();
        orderModifier = i+1;
      }
      setOrder(tr, calculateSum(sourceTr) * 10 + orderModifier);
      //$(tr).find('td:nth-child(2)').text($(tr).find('td:nth-child(2)').text() + ' - ' + orderModifier + ' - ' + getOrder(tr));
    })
    .each((i, tr) => console.log(getOrder(tr)))
    .sort((a, b) => getOrder(b) - getOrder(a))
    .each((i, tr) => {
      $(tr).appendTo(tbody);
      sum = getOrder(tr);
      if (sum == lastSum) {
        position = lastPosition;
      }
      else {
        position = i + 1;
      }
      $(tr).find('td:first()').text(position);
      lastPosition = position;
      lastSum = sum;
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

const version = '19:44';
console.log('version', version);

const tbody = $('#id_results tbody:last()');
const thead = $('#id_results thead:last()');
const isPuttingRound = $(".main-title").text().includes("Runde");
var uselessColumns;

removeColors(tbody);

hideFirstTable();

if (isPuttingRound) {
  uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];
}
else {
  uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-last-child(4)', 'nth-last-child(2)'];
}

hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns);

sortTable(tbody);

console.log('version', version);
