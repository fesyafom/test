'use strict';

const APIURL = "";

function getDateFromDB (url) {
    var	req	= new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var responce = JSON.parse(req.responseText);
                displayFilms(responce,true);
            }

            else {
                console.log(req.responseText + req.readyState + req.status);
            }
        }
    };
    req.send(null);
}

function setDateToDB(data,url) {
    var	req	= new XMLHttpRequest();

    req.open("POST",url, true);
    req.setRequestHeader('Content-Type', 'multipart/form-data; charset=utf-8');

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log(req.responseText);
                getDateFromDB (`${APIURL}/films`);
            }

            else {
                alert(req.status + ": " + req.statusText);
            }

        }
    };
    req.send(data);
}

function displayFilms(arrJSON, clearTable) {

    var tagTr, tagTh, tagA, delLink;
    var films = document.getElementById('tableFilms');
    if(clearTable) {
        clearChildrenWithoutFirst(films);
    }
    for(var i = 0; i < arrJSON.length; i++) {
        tagTr = document.createElement('tr');
        films.appendChild(tagTr);

        for(var key in arrJSON[i]) {
            if(key === "_id") continue;
            tagTh = document.createElement('th');
            tagTh.className = "tableFilms-cells";
            tagTr.appendChild(tagTh);

            if(key === 'Title') {
                tagA = document.createElement('a');
                tagA.innerHTML = arrJSON[i][key];
                tagA.href = `${APIURL}/films/` + arrJSON[i]['_id'];
                tagA.className = "film_link";
                tagTh.appendChild(tagA);

                delLink = tagA.cloneNode(false);
                delLink.innerHTML = 'x';
                delLink.href = "#";
                delLink.className = "delete_link";
                tagTh.appendChild(delLink);
                
            }
            else tagTh.innerHTML = arrJSON[i][key];
        }
    }
}

function clearChildrenWithoutFirst(parentElem) {
    for (var j = 1; j < parentElem.children.length; j++) {
        parentElem.removeChild(parentElem.children[j--]);
    }
}

var search = document.getElementById('search');
var addFilmForm = document.getElementById('addFilmForm');
var upload = document.getElementById('upload');
var tableFilms = document.getElementById('tableFilms');

addFilmForm.onsubmit = function () {
    var elems = addFilmForm.elements;
    var data =
            'Title=' + elems.Title.value +
            '&Release=' + elems.Release.value +
            '&Format=' + elems.Format.value +
            '&Stars=' + elems.Stars.value
        ;
    setDateToDB(data,`${APIURL}/films`);
    return false;
};

search.onsubmit = function () {
    var value = search.elements.search.value;
    getDateFromDB (`${APIURL}/search?str=${encodeURIComponent(value)}&by=title`);
    return false;
};

upload.onsubmit = function () {
    var file = upload.elements.upload.files[0];
    if (file) {
        setDateToDB(file,`${APIURL}/films`);
    }
    return false;
};

tableFilms.onclick = function(event) {
    var target = event.target;

    if (target.tagName === 'TD') return;

    while (target != tableFilms) {
        if (target.className === 'delete_link') {
            target.style.color = 'green';
            setDateToDB(null, target.previousSibling.href);
            return false;
        }
        else if (target.className === 'film_link') {
            getDateFromDB(target.href);
            return false;
        }
        target = target.parentNode;
    }
};

getDateFromDB(`${APIURL}/films`);
