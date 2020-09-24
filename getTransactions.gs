const UP_TOKEN = 'up:yeah:XXXXXXXX';

const options = {
  'method': 'GET',
  'headers': {
    'Authorization': `Bearer ${UP_TOKEN}`
}
};

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Up Bank')
  .addItem('Get Transactions','getTransactions')
  .addToUi();
}

function getTransactions() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var url = "https://api.up.com.au/api/v1/transactions?page[size]=100";
  var output = [];
  var numCols = 6;
  var startingRow = 2;
  
  while (url !== null){
  
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    var result = JSON.parse(json);
    var data = result["data"];
    
    data.forEach(function(elem,i) {

      var accountID = elem["relationships"]["account"]["data"]["id"];
      var createdAt = elem["attributes"]["createdAt"];
      var description = elem["attributes"]["description"];
      var status = elem["attributes"]["status"];
      var amountValue = elem["attributes"]["amount"]["value"];
      
      if (elem["attributes"]["roundUp"] !== null) {
        var roundUp = elem["attributes"]["roundUp"]["amount"]["value"];
      } else {
        var roundUp = 0;
      }
      
      output.push([accountID,createdAt,description,status,amountValue,roundUp]);
      
    });
    
    url = result["links"]["next"];
    
  }
  
  var len = output.length;
  sheet.getRange(startingRow,1,len,numCols).clearContent();
  sheet.getRange(startingRow,1,len,numCols).setValues(output);
  
}
