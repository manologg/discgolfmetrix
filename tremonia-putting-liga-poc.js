function hideFirstTable() {
  $('#id_results tbody:first()').hide();
  $('#id_results thead:first()').hide();
}

function calculateSum(tr) {
  return Number($(tr).find('td:last()').text());
}

function setSum(tr, sum) {
  $(tr).data('sum', sum);
}

function setOrder(tr, order) {
  $(tr).data('order', order);
}

function getOrder(tr) {
  return $(tr).data('order');
}

function getSum(tr) {
  return $(tr).data('sum');
}

function sortTable(tbody) {

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
      sum = calculateSum(sourceTr);
      setSum(tr, sum);
      setOrder(tr, sum * 100 + orderModifier+1);
      $(tr).find('td:nth-child(2)').text($(tr).find('td:nth-child(2)').text() + ', sum: ' + getSum(tr) + ', orderModifier: ' + orderModifier + ', order: ' + getOrder(tr));
    })
    .sort((a, b) => getOrder(b) - getOrder(a))
    .each((i, tr) => {
      $(tr).appendTo(tbody);
      sum = getSum(tr);
      lastSum = getSum($(tr).prev());
      if (sum == lastSum) {
        position = $(tr).prev().find('td:first()').text();
      }
      else {
        position = i+1;
      }
      console.log(`i: ${i}, sum: ${sum}, lastSum: ${lastSum} => position: ${position}`);
      $(tr).find('td:first()').text(position);
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

var version = '20:23';
console.log('version', version);

var tbody = $('#id_results tbody:last()');
var thead = $('#id_results thead:last()');
var isPuttingRound = $(".main-title").text().includes("Runde");
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
