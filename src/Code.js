/**
 * Processes each product description based on configurable parameters.
 * The configuration is read from the "Config" sheet.
 * - Input Column: where the product descriptions are.
 * - Output Column: the starting column for output (5 columns will be used).
 * - Prompt: the base prompt used to generate the output.
 */
function processGermanUSPsFromConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Retrieve configuration from the "Config" sheet.
  var configSheet = ss.getSheetByName("Config");
  if (!configSheet) {
    Logger.log("Config sheet not found. Please create a sheet named 'Config'.");
    return;
  }
  
  var configValues = configSheet.getRange("A2:D2").getValues()[0];
  var inputColumn = Number(configValues[0]);    
  var startOutputColumn = Number(configValues[1]);  
  var numberOfOutputColumn = Number(configValues[2]);   
  var basePrompt = configValues[3];

  // Get the active sheet (the one containing product descriptions).
  var sheet = ss.getSheetById("SheetID");
  var lastRow = sheet.getLastRow();
  
  if (!sheet) {
    Logger.log("Input sheet not found with gid: " + sheet);
    return;
  }

  if (lastRow < 2) {
    Logger.log("No data found on the active sheet.");
    return;
  }
  
  // Get product descriptions from the configured input column, starting at row 2.
  var dataRange = sheet.getRange(2, inputColumn, lastRow - 1, 1);
  var data = dataRange.getValues();
  
  for (var i = 0; i < data.length; i++) {
    var productDesc = data[i][0];
    var row = i + 2; // Adjust row number because data starts at row 2.
    var productStr = productDesc ? productDesc.toString() : "";
    
    if (productStr.trim() !== "") {
      // Combine the base prompt with the product description.
      var prompt = basePrompt + "\n\n" + productStr;
      var output = callOpenAI(prompt);
      var items = parseResponseToItems(output, numberOfOutputColumn);
      // Write the output into 5 columns starting at the configured output column.
      sheet.getRange(row, startOutputColumn, 1, numberOfOutputColumn).setValues([items]);
      Utilities.sleep(1000); // Pause to avoid hitting API rate limits.
    } else {
      // Clear output if the product description is blank.
      sheet.getRange(row, startOutputColumn, 1, numberOfOutputColumn).clearContent();
    }
  }
}

/**
 * Calls the OpenAI API with the given prompt and returns the generated text.
 */
function callOpenAI(prompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set in Script Properties.");
  }
  
  var url = "https://api.openai.com/v1/chat/completions";
  var payload = {
    "model": "gpt-3.5-turbo",  // or "gpt-3.5-turbo"
    "messages": [{"role": "user", "content": prompt}],
    "max_tokens":500,
    "temperature": 0.7
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {"Authorization": "Bearer " + apiKey},
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    return json.choices[0].message.content;
  } catch (e) {
    Logger.log("Error calling OpenAI: " + e);
    return "Fehler bei der API-Anfrage";
  }
}

/**
 * Parses the API response.
 */
function parseResponseToItems(reply, columnNumber) {
  var lines = reply.split("\n").filter(function(line) { 
    return line.trim() !== ""; 
  });
  
  var items = lines.map(function(line) {
    return line.replace(/^\d+\.\s*/, "").trim();
  });
  
  while (items.length < columnNumber) {
    items.push("");
  }
  return items.slice(0, columnNumber);
}

