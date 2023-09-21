function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function setSum(tr) {
    return $(tr).data('sum', Number($(tr).find('td:last()').text()));
}

function sortTable(tbody) {
  tbody
    .find('tr')
    .each((i, elem) => setSum(elem))
    .sort((a, b) => $(b).data('sum') - $(a).data('sum'))
    .each((i, elem) => {
      $(elem).appendTo(tbody);
      console.log($(elem).find.('td:last()').text
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

console.log('version 13:03')

hideFirstTable();

tbody = $('#id_results tbody:last()');
thead = $('#id_results thead:last()');
uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];

hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns);

sortTable(tbody);

removeColors(tbody);

console.log('version 13:03')
