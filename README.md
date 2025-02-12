**GPT integration for Google Sheets!**

This project demonstrates how to integrate OpenAI’s GPT models into Google Sheets using Google Apps Script. The script reads product descriptions from a designated input sheet and processes them using a custom prompt, then writes the generated output into specified columns. All configuration (such as input column, output column, number of output columns, and base prompt) is managed through a dedicated Config sheet, making it easy for non-technical users to modify settings without changing the code.



**Features**

_Configurable Settings:_ Easily update the input column, output column, number of output columns, and the base prompt directly from the Config sheet.

_Automated Processing:_ The script automatically reads the input column's value/text, sends them (with your custom prompt) to the OpenAI API, and writes the response back to your sheet.

_Customizable Prompts:_ Combine a base prompt with the specified column's value/text to instruct GPT on generating the desired output.

_Error Handling:_ The corresponding output cells are cleared if a column's cell is blank. API errors are logged for troubleshooting.


**Prerequisites**

A Google account with access to Google Sheets.
An OpenAI API key.
Basic familiarity with Google Apps Script is helpful.


**How It Works**
1. **_Configuration:_**
The script reads settings from the Config sheet (cells A2:D2):
_Input Column:_ Which column has the product descriptions.
_Start Output Column:_ Where the output should begin.
_Number of Output Columns:_How many columns to fill with the output.
_Base Prompt:_ The custom prompt that will be combined with each product description.

2. **_Processing Data:_**
The script retrieves data of input column from the input sheet (using its sheet ID) and processes each non-blank cell:
		○ It concatenates the base prompt and the cell data.
		○ It sends this text to OpenAI via the callOpenAI function.
		○ It parses the response into the specified number of items and writes them to the sheet.

3. _Error Handling:_
Blank cells result in the corresponding output cells being cleared. Any errors from the API call are logged for troubleshooting.

**Customization**

Feel free to modify the code to suit your needs. You can change the prompt, adjust API parameters (such as model, max tokens, and temperature), or extend the functionality to include additional features.

**Config Sheet Sample**
![image](https://github.com/user-attachments/assets/eda56c16-3826-478f-82cf-36ccfadb7ac0)

**Input Sheet Sample**
![image](https://github.com/user-attachments/assets/473573fe-b41e-4c0e-b659-9b6984eccba4)


