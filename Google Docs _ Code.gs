function onOpen() {
  DocumentApp.getUi()
    .createMenu("Character Tools")
    .addItem("Open Auto Highlighter", "showSidebar")
    .addToUi();
}


function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("Sidebar")
    .setTitle("4250 Character Highlighter");
  DocumentApp.getUi().showSidebar(html);
}


// ===========================
// SETTINGS
// ===========================
const START = 4000;
const END = 4250;
const MAX_SCAN = 5000;


let lastJumpText = null;
let lastJumpOffset = 0;


// ===========================
// HIGHLIGHT
// ===========================
function highlightCharacterRange() {


  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();


  let charPos = 1;
  let stop = false;


  scan(body);


  function scan(element) {


    if (stop) return;


    if (charPos > MAX_SCAN) {
      stop = true;
      return;
    }


    if (typeof element.getNumChildren === "function") {


      const children = element.getNumChildren();


      for (let i = 0; i < children && !stop; i++) {
        scan(element.getChild(i));
      }


      return;
    }


    if (element.getType() !== DocumentApp.ElementType.TEXT)
      return;


    const text = element.asText();
    const str = text.getText();


    if (!str.length)
      return;


    const len = str.length;


    const startChar = charPos;
    const endChar = charPos + len - 1;


    const clearEnd = Math.min(len - 1, MAX_SCAN - startChar);


    if (clearEnd >= 0) {
      text.setBackgroundColor(0, clearEnd, null);
    }


    if (endChar >= START && startChar <= END) {


      const s = Math.max(0, START - startChar);
      const e = Math.min(len - 1, END - startChar);


      text.setBackgroundColor(s, e, "#FFFF00");


      lastJumpText = text;
      lastJumpOffset = s;
    }


    charPos += len;


    // Count paragraph breaks as one character.
    if (
      element.getParent &&
      element.getParent().getType &&
      element.getParent().getType() === DocumentApp.ElementType.PARAGRAPH
    ) {
      charPos++;
    }


    if (charPos > MAX_SCAN)
      stop = true;
  }
}


// ===========================
// JUMP
// ===========================
function jumpToHighlight() {


  if (!lastJumpText)
    return;


  const doc = DocumentApp.getActiveDocument();


  doc.setCursor(
    doc.newPosition(lastJumpText, lastJumpOffset)
  );
}
