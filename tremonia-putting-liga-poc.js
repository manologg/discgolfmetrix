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

version = '13:16';
console.log('version', version);

tbody = $('#id_results tbody:last()');
thead = $('#id_results thead:last()');
uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];

removeColors(tbody);

hideFirstTable();
hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns);

sortTable(tbody);

console.log('version', version);
