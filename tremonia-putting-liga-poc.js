function hideFirstTable() {
  $("#id_results tbody:first()").hide();
  $("#id_results thead:first()").hide();
}

function invertTable(tbody) {
  tbody.html($('tr',tbody).get().reverse());
}

function hideColumns(trContainer, columnSelectors) {
  columnSelectors.forEach(selector => trContainer.find(`tr td:${selector}`).hide());
}


/* MAIN */

hideFirstTable();

tbody = $("#id_results tbody:last()");
thead = $("#id_results thead:last()");
uselessColumns = ['nth-child(3)', 'nth-last-child(2)'];

hideColumns(tbody, uselessColumns);
hideColumns(thead, uselessColumns);

invertTable(tbody);
