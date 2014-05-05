/*globals console,alert,confirm,ActiveXObject*/
var currentDay = null;
var sheetIndex = 0;

function cloneElement(id, attributes, appendTargetId) {
    "use strict";
    var newNode = document.getElementById(id).cloneNode(true),
        attr;
    for (attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            newNode.setAttribute(attr, attributes[attr]);
        }
    }
    document.getElementById(appendTargetId).appendChild(newNode);
    return newNode;
}

function setDay(dayString) {
	"use strict";
	if (currentDay !== null) {
		currentDay.setAttribute('class', 'unselected');
	}
	currentDay = document.getElementById(dayString);
	currentDay.setAttribute('class', 'selected');
	
    document.getElementById('eventDescription').value = localStorage.getItem(dayString);
}

function switchDay(event) {
    "use strict";
    var text = document.getElementById('eventDescription'),
        target = event.target,
		targetDay;

    while (localStorage.hasOwnProperty(target.getAttribute('id')) === false) {
        if (!target.parentNode) {
            console.log(event);
            throw "Can't find the day object clicked.";
        }
        target = target.parentNode;
    }
	
	setDay(target.getAttribute('id'));
}

function changeDescription(event) {
    "use strict";
    var text = document.getElementById('eventDescription'),
        targetDay = currentDay.getAttribute('id'),
        textBlocks,
        i,
        description;
    if (localStorage.hasOwnProperty(targetDay) === false) {
        return;
    }
    textBlocks = currentDay.getElementsByClassName('events');
    description = text.value.split('\n');

    for (i = 0; i < textBlocks.length && i < description.length; i += 1) {
        textBlocks[i].innerHTML = description[i];
    }
    for (i = description.length; i < textBlocks.length; i += 1) {
        textBlocks[i].innerHTML = "";
    }

    localStorage.setItem(targetDay, text.value);
}

function updateMonth() {
    "use strict";
    var year = document.getElementById('year').value,
        month = document.getElementById('month').value,
        firstDay = new Date(year, month - 1), // Not sure why -1... chrome bug?
        lastDay = new Date(year, month, -0),
        dateGroup = document.getElementById('datePrototype'),
        dateBox = dateGroup.getElementsByTagName('rect')[0],
        dateNumeral,
        textBlocks,
        dx = dateBox.getAttribute('width'),
        dy = dateBox.getAttribute('height'),
		targetDay,
		description,
        x,
        y,
        i,
        j,
        newElement;

    document.getElementById('calendarArea').innerHTML = "";
	
    dx = Number(dx);
    dy = Number(dy);

    y = 0;
    x = dx * firstDay.getDay();

    for (i = 1; i <= lastDay.getDate(); i += 1) {
		targetDay = month + "/" + i + "/" + year;
        dateGroup = cloneElement('datePrototype', {
            id: targetDay
        }, 'calendarArea');
		
        dateGroup.setAttribute('transform', 'translate(' + x + ',' + y + ')');

        dateGroup.onclick = switchDay;

        dateNumeral = dateGroup.getElementsByClassName('numerals')[0];
        dateNumeral.innerHTML = String(i);
		
		if (localStorage.hasOwnProperty(targetDay) === false) {
			localStorage.setItem(targetDay, "");
		}
		textBlocks = dateGroup.getElementsByClassName('events');
		description = localStorage.getItem(targetDay).split('\n');

		for (j = 0; j < textBlocks.length && j < description.length; j += 1) {
			textBlocks[j].innerHTML = description[j];
		}
		for (j = description.length; j < textBlocks.length; j += 1) {
			textBlocks[j].innerHTML = "";
		}
		
		if (i === 1) {
			currentDay = dateGroup;
			currentDay.setAttribute('class', 'selected');
			document.getElementById('eventDescription').value = localStorage.getItem(targetDay);
		}
		
        x += dx;
        if (x >= 7 * dx) {
            x = 0;
            y += dy;
        }
    }
}

function loadFile(fileName, callback, async) {
	"use strict";
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", fileName, async);
    xmlhttp.send();
}

function downloadSvg() {
	"use strict";
    var pom = document.createElement('a'),
        text = document.getElementById('calendarArea').innerHTML,
        temp,
        style = "",
		i;
    currentDay.setAttribute('class', 'unselected');
	
	for (i = 0; i < document.styleSheets[sheetIndex].rules.length; i += 1) {
		style += document.styleSheets[sheetIndex].rules[i].cssText + "\n";
	}
	
    style = "<style type='text/css'><![CDATA[" + style + "]]></style>";
    document.getElementById('calendarArea').innerHTML = style + text;
    temp = document.getElementById('calendarDiv').innerHTML;
    pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(temp));
    pom.setAttribute('download', 'calendar.svg');
    pom.click();
    document.getElementById('calendarArea').innerHTML = text;
	currentDay.setAttribute('class', 'selected');
}

function setDate(d) {
	"use strict";
	document.getElementById('month').selectedIndex = d.getMonth();
	document.getElementById('year').value = d.getFullYear();
	updateMonth();
	setDay((d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
}

function eraseCalendar() {
	"use strict";
	if (confirm("This will erase EVERYTHING (even for other months). Are you sure?") === true) {
		localStorage.clear();
	}
	updateMonth();
}

function updateNumeralSize() {
	"use strict";
	var newSize = document.getElementById('numeralFontSize').value;
	// Ugly quick hack to change the class... I need this if I
	// load things like google fonts on the fly
	document.styleSheets[sheetIndex].rules[0].style.fontSize = newSize + "px";
}
function updateNumeralFont() {
	"use strict";
	var newFont = document.getElementById('numeralFont').value;
	// Ugly quick hack to change the class... I need this if I
	// load things like google fonts on the fly
	document.styleSheets[sheetIndex].rules[0].style.fontFamily = newFont;
}
function updateTextSize() {
	"use strict";
	var newSize = document.getElementById('textFontSize').value;
	// Ugly quick hack to change the class... I need this if I
	// load things like google fonts on the fly
	document.styleSheets[sheetIndex].rules[1].style.fontSize = newSize + "px";
}
function updateTextFont() {
	"use strict";
	var newFont = document.getElementById('textFont').value;
	// Ugly quick hack to change the class... I need this if I
	// load things like google fonts on the fly
	document.styleSheets[sheetIndex].rules[1].style.fontFamily = newFont;
}
function updateBoxes() {
	"use strict";
	var newWidth = document.getElementById('boxWidth').value,
		newHeight = document.getElementById('boxHeight').value,
		protBox = document.getElementById('rectPrototype'),
		calArea = document.getElementById('calendarArea');
	protBox.setAttribute('width', newWidth);
	protBox.setAttribute('height', newHeight);
	calArea.setAttribute('width', 7 * newWidth);
	calArea.setAttribute('height', 6 * newHeight);
	updateMonth();
}
function findStyleSheetIndex() {
	"use strict";
	var i;
	for (i = 0; i < document.styleSheets.length; i += 1) {
		if (document.styleSheets[i].rules &&
			    document.styleSheets[i].rules[0].cssText.substring(0, 9) === ('.numerals')) {
			sheetIndex = i;
			return;
		}
	}
}