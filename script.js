/*globals console,alert*/
var eventText = {};

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

function switchDay(event) {
    "use strict";
    var text = document.getElementById('eventDescription'),
        targetDay = document.getElementById('targetDay'),
        target = event.target;

    while (eventText.hasOwnProperty(target.getAttribute('id')) === false) {
        if (!target.parentNode) {
            console.log(event);
            throw "Can't find the day object clicked.";
        }
        target = target.parentNode;
    }

    targetDay.innerHTML = target.getAttribute('id');

    text.value = eventText[targetDay.innerHTML];
}

function changeDescription(event) {
    "use strict";
    var text = document.getElementById('eventDescription'),
        targetDay = document.getElementById('targetDay'),
        textBlocks,
        i,
        description;
    if (eventText.hasOwnProperty(targetDay.innerHTML) === false) {
        return;
    }
    textBlocks = document.getElementById(targetDay.innerHTML).getElementsByClassName('events');
    description = text.value.split('\n');

    for (i = 0; i < textBlocks.length && i < description.length; i += 1) {
        textBlocks[i].innerHTML = description[i];
    }
    for (i = i; i < textBlocks.length; i += 1) {
        textBlocks[i].innerHTML = "";
    }

    eventText[targetDay.innerHTML] = text.value;
}

function updateMonth(event) {
    "use strict";
    var text = document.getElementById('month').value,
        year = Number(text.substring(0, 4)),
        month = Number(text.substring(5, 7) - 1), // Not sure why -1... chrome bug?
        firstDay = new Date(year, month),
        lastDay = new Date(year, month + 1, -0),
        dateGroup = document.getElementById('datePrototype'),
        dateBox = dateGroup.getElementsByTagName('rect')[0],
        dateNumeral,
        textBlocks,
        dx = dateBox.getAttribute('width'),
        dy = dateBox.getAttribute('height'),
        x,
        y,
        i,
        j,
        newElement;

    document.getElementById('calendarArea').innerHTML = "";
    document.getElementById('targetDay').innerHTML = "Day_1";
    eventText = {};

    dx = Number(dx);
    dy = Number(dy);

    y = 0;
    x = dx * firstDay.getDay();

    for (i = 1; i <= lastDay.getDate(); i += 1) {
        eventText["Day_" + i] = "";
        dateGroup = cloneElement('datePrototype', {
            id: "Day_" + i
        }, 'calendarArea');
        dateGroup.setAttribute('transform', 'translate(' + x + ',' + y + ')');

        dateGroup.onclick = switchDay;

        dateNumeral = dateGroup.getElementsByClassName('numerals')[0];
        dateNumeral.innerHTML = String(i);

        textBlocks = dateGroup.getElementsByClassName('events');
        for (j = 0; j < textBlocks.length; j += 1) {
            textBlocks[j].innerHTML = "";
        }

        x += dx;
        if (x >= 7 * dx) {
            x = 0;
            y += dy;
        }
    }
}

function loadFile(fileName, callback, async) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", fileName, async);
    xmlhttp.send();
}

function downloadSvg() {
    var pom = document.createElement('a'),
        text = document.getElementById('calendarArea').innerHTML,
        temp,
        style;
    
    loadFile('style.css', function (resultText) {
        style = resultText;
    }, false);
    style = "<style type='text/css'><![CDATA[" + style + "]]></style>";
    document.getElementById('calendarArea').innerHTML = style + text;
    temp = document.getElementById('calendarDiv').innerHTML;
    pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(temp));
    pom.setAttribute('download', 'calendar.svg');
    pom.click();
    document.getElementById('calendarArea').innerHTML = text;
}