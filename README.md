# AIDoutputBlockerW_GoogleDocsCharacter_Tools
AI Dungeon tool. For Exporting and compressing stories. Helps you visually see how much of the story you can put before you risk seeing the message: Action is too long, limit is 4250 characters

Character Tools and Output restrictions: 

AIDungeon and Google Docs Scripts:
How to export your longer story for Google Docs in AID:
Edit your preferred adventure > Go down to the bottom of Details where it says “Export Backup” and “Export Text.” (I personally prefer Export Text as that is the more… human version.) > Open it with whatever… Notepad is what I do on desktop. Copy and paste into a Google Doc. 

Guide: Open Google Docs
Extensions > Apps Script 
Replace ALL of Code.gs With the Code.gs script provided. 

Code.gs: 

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

Above Find Files Add a file with the + and Choose HTML
Title it Sidebar.html (rename the file “Sidebar” the html part will be added automatically.)
Replace ALL of Sidebar.html with the Sidebar.html script provided.

Sidebar.html:

<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 12px;
    }


    button {
      width: 100%;
      padding: 10px;
      margin-bottom: 8px;
      font-size: 14px;
      cursor: pointer;
    }


    #status {
      margin-top: 10px;
      color: #555;
      font-size: 12px;
    }
  </style>
</head>


<body>


<h3>4250 Character Highlighter</h3>


<button onclick="refreshHighlight()">
🔄 Refresh Highlight
</button>


<button onclick="jumpToHighlight()">
📍 Jump to Highlight
</button>


<div id="status">
Ready.
</div>


<script>
function refreshHighlight() {
  document.getElementById("status").textContent = "Refreshing...";


  google.script.run
    .withSuccessHandler(function() {
      document.getElementById("status").textContent =
        "Highlight refreshed.";
    })
    .highlightCharacterRange();
}
function jumpToHighlight() {
  document.getElementById("status").textContent = "Jumping...";


  google.script.run
    .withSuccessHandler(function() {
      document.getElementById("status").textContent =
        "Cursor moved to highlight.";
    })
    .jumpToHighlight();
}
</script>


</body>
</html>

Save project and Go back to Code.gs and press Run
Review and accept permissions Click on Advanced and go to the “Go to Untitled project (unsafe) ” file and accept the necessary permissions. 

Then go Back to Your Google Doc and wait for the “Character Tools” tab to show up 
Click on that and then Open Auto Highlighter.

⚠️BUG NOTICE⚠️ if it tells you “Exception: No HTML file named Sidebar was found.” Go back into the code and make sure to rename the html file to Sidebar. HTML will automatically be added to the name, and Sidebar.html will be able to be found (Capital S). Dismiss the warning and open Character Tools again.

What does this script do? 
AI Dungeon tool. For Exporting and compressing stories. Helps you visually see how much of the story you can put before you risk seeing the message:
Action is too long, limit is 4250 characters 

It highlights/unhighlights/rehighlights the area roughly around the 4000-4250th character mark. So that you can see where your maximum limit is in the text. 
*Fun fact I think you can actually go around 35 characters passed the supposed “limit,” so if you see that it stops in the middle of a sentence, you don’t have to break up the sentence 

After you got your story in Docs, the Highlighter is working, and you are ready to begin transferring… Open your AI Dungeon adventure and Start Copy/Pasting into What happens next? / Take a turn (Story).

2 Things to note, AI Dungeon will generate responses after each entry. If you do not want that to happen. That is where the Output Blocker mod works best.
When the output blocker is enabled the only thing that the AI will output is the ⛓️‍💥 emoji. If you really want to go into the tab and customize the output to be your own thing. Go ahead.
Here’s the code. The whole thing goes into the Output Tab in the Script. 
const modifier = (text) => {
    return {
        text: ` ⛓️‍💥 `
    };
};
// Don't modify this part
modifier(text);

/*DO NOT INCLUDE THIS PART…
 WARNING: as tempting as it may be to have it completely output nothing.
text: ``
WILL CREATE WARNINGS.
You could have it export a space each time or a symbol to go through and delete later… but it CANNOT be nothing.
text: `
`
Is a blank line. Which may or may not be what you’re looking for.
*/
