function hideFirstTable() {
  $("#id_results tbody:first()").hide();
  $("#id_results thead:first()").hide();
}

function invertResultsTable() {
  tbody.html($('tr',tbody).get().reverse());
}


/* MAIN */

hideFirstTable();
invertResultsTable();
console("END tremonia-putting-liga-poc")
