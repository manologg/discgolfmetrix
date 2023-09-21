function hideFirstTable() {
  $("#id_results tbody:first()").hide();
  $("#id_results thead:first()").hide();
}

function invertTable(table) {
  table.html($("tr", table).get().reverse());
}

function hideColumns(trContainer, columnType, columnSelectors) {
  columnSelectors.forEach(selector => trContainer.find(`tr ${columnType}:${selector}`).hide());
}

function removeColors(tdContainer) {
  $(tdContainer).find("td").css('background-color', 'unset')
}


/* MAIN */

hideFirstTable();

tbody = $("#id_results tbody:last()");
thead = $("#id_results thead:last()");
uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];

hideColumns(tbody, 'td', uselessColumns);
hideColumns(thead, 'th', uselessColumns);

invertTable(tbody);

removeColors(tbody);

console.log('12:31')
