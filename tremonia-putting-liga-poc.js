function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function setSum(tr) {
    return $(tr).data('sum', Number($(tr).find('td:last()').text()));
}

function getSum(tr) {
    return $(tr).data('sum');
}

function sortTable(tbody) {

  var lastPosition = 0;
  var lastSum = Number.MAX_VALUE;
  
  tbody
    .find('tr')
    .each((i, elem) => setSum(elem))
    .sort((a, b) => getSum(b) - getSum(a))
    .each((i, tr) => {
      $(tr).appendTo(tbody);
      sum = getSum(tr);
      if (sum == lastSum) {
        position = lastPosition;
      }
      else {
        position = i+1;
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

const version = '16:00';
console.log('version', version);

const tbody = $('#id_results tbody:last()');
const thead = $('#id_results thead:last()');
const isPuttingRound = $(".main-title").text().includes("Runde");
const uselessColumns;

removeColors(tbody);

hideFirstTable();

if (isPuttingRound) {
  uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];
  sortTable(tbody);
}
else {
  uselessColumns = ['nth-child(3)', 'nth-child(4)', 'nth-last-child(4)', 'nth-last-child(2)'];
}

hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns); 

console.log('version', version);
