var count = 0;
var serializedHighlights = decodeURIComponent(window.location.search.slice(window.location.search.indexOf('=') + 1));
var highlighter;

var canvas = new fabric.Canvas(document.getElementById('canvas'))
canvas.isDrawingMode = false;
canvas.freeDrawingBrush.width = 5;

var highlightButton = document.getElementById('highlightButton');

window.onload = function() {
    rangy.init();

    highlighter = rangy.createHighlighter();

    if (serializedHighlights) {
        highlighter.deserialize(serializedHighlights);
    }
};

highlightButton.onclick = function() {

    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    highlighter.addClassApplier(rangy.createClassApplier('highlight'+count, {
        ignoreWhiteSpace: true,
        elementTagName: 'a',
        elementProperties: {
            href: '#',
            onclick: function() {
                var highlight = highlighter.getHighlightForElement(this);
                var dialog = $('<p>Label path, Delete or Cancel, Please select:</p>').dialog({
                    modal:true,
                    buttons: {
                        "Label Path": function() {
                            var text = document.getElementsByClassName(highlight.classApplier.className)[0];
                            var textColor = window.getComputedStyle(text).backgroundColor;
                            
                            canvas.isDrawingMode = true;
                            canvas.freeDrawingBrush.color = textColor;
                            dialog.dialog('close');
                        },
                        "Delete":  function() {
                            var text = document.getElementsByClassName(highlight.classApplier.className)[0];
                            var textColor = window.getComputedStyle(text).backgroundColor;
                            for(var i=0; i<canvas.getObjects().length; i++) {
                                if(canvas.getObjects()[i]['stroke'] == textColor) {
                                    canvas.remove(canvas.getObjects()[i]);
                                    i--;
                                }
                            }
                            highlighter.removeHighlights( [highlight] );
                            printConsole();
                            dialog.dialog('close');
                        },
                        "Cancel":  function() {
                            dialog.dialog('close');
                        }
                    }
                });
                return false;
            }
        }
    }));
    highlighter.highlightSelection('highlight'+count);

    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    if(!!(window.attachEvent && !window.opera)) {
         styleNode.styleSheet.cssText = '.highlight'+count+' { background-color: #'+randomColor+'; }';
    } else {
         var styleText = document.createTextNode('.highlight'+count+' { background-color: #'+randomColor+'; }');
         styleNode.appendChild(styleText);
    }
    document.getElementsByTagName('head')[0].appendChild(styleNode)
    printConsole();
    count++;
}

function removeHighlightFromSelectedText() {
    highlighter.unhighlightSelection();
}

function printConsole() {
    var descriptionHTML = document.getElementById('descriptionText').innerHTML;
    var textCount = 1;
    var str = textCount + '. ';
    var inAnchor = false;
    
    for(var i=0; i<descriptionHTML.length; i++) {
        if(inAnchor == true) {
            if(descriptionHTML.charAt(i) == '>') {
                inAnchor = false;
            }
        }
        else {
            if(descriptionHTML.charAt(i) == '<') {
                if(i > 0 && descriptionHTML.charAt(i-1) != '>') {
                    console.log(str);
                    textCount++;
                    str = textCount + '. ';
                }
                inAnchor = true;
            }
            else {
                str += descriptionHTML.charAt(i);
            }
        }
    }
    console.log(str);
    console.log(' ');
}