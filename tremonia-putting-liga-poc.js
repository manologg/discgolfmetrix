function hideFirstTable() {
  $("#id_results tbody:first()").hide();
  $("#id_results thead:first()").hide();
}

function invertResultsTable() {
  tbody = $("#id_results tbody:last()");
  tbody.html($('tr',tbody).get().reverse());
}


/* MAIN */

hideFirstTable();
invertResultsTable();
console.log("END tremonia-putting-liga-poc")
