function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var fecha = new Date();
  
  var grado = e.parameter.grado;
  var voto = e.parameter.voto;
  
  sheet.appendRow([fecha, grado, voto]);
  
  return ContentService.createTextOutput("Voto registrado con éxito")
    .setMimeType(ContentService.MimeType.TEXT);
}