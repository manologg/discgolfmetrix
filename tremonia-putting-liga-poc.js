function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function getSum(tr) {
    return Number($(tr).find('td:last()').text());
}

function sortTable(trContainer) {
  trContainer
    .find('tr')
    .sort((a, b) => getSum(b) - getSum(a))
    .each((i, elem) => $(elem).appendTo(tbody));
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

hideFirstTable();

tbody = $('#id_results tbody:last()');
thead = $('#id_results thead:last()');
uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];

hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns);

sortTable(tbody);

removeColors(tbody);

console.log('version 12:47')
