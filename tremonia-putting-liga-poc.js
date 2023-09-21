function hideFirstTable() {
  $("#id_results tbody:first()").hide();
  $("#id_results thead:first()").hide();
}

function getResultsTbody() {
  return $("#id_results tbody:last()");
}

function invertTable(tbody) {
  tbody.html($('tr',tbody).get().reverse());
}

function hideColumns(tbody, columnSelectors) {
  columnSelectors.forEach(selector => tbody.find(`tr td:${selector}`).hide());
}


/* MAIN */

hideFirstTable();
tbody = getResultsTbody();
invertTable(tbody);
hideColumns(tbody, 'nth-child(3)', 'nth-last-child(2)');
