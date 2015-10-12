// ==UserScript==
// @name       SmartSyges
// @namespace  http://www.expertime.com/
// @version    0.2
// @description  SmartSyges
// @match      https://gestion.expertime.com/sygesweb/*
// @copyright  2015+, M.TUDURY
// ==/UserScript==

'use strict';
/*  classe smartsyges   */

var smartsyges = smartsyges || {};

// add smart frame button
smartsyges.init = function () {
    if ($('form[name="TEM_SA_SAISIEMENSUELLE"]').length > 0) {
        smartsyges.colorize();
        smartsyges.autosave();
    }
    if ($('form[name="SYW_EC_INFOSUTILISATEUR"]').length > 0) {
        smartsyges.autovalid();
    }
}

smartsyges.colorize = function () {
    //identifie les contrats sur la page + met en couleur les lignes de contrats
    $('input[name$="_AVA_ACTSAI"]').each(function (index, item) { 
        $(item).css('background-color', smartsyges.colors[index]);
        if (smartsyges.countcontracts < index)
            smartsyges.countcontracts = index;
    });
    smartsyges.countcontracts=smartsyges.countcontracts+2;
    
    // identifie les jours ouvrés
    var cnt = 1;
    $('.CSS-LibTitreJourZoneRepetee').each(function (index, td) {
        var std = $(td);
        smartsyges.fields[cnt] = std;
        if (std.attr('width') > 10) {
            std.attr('data-day', cnt);
            if ((std.css('background-color') != 'rgb(212, 212, 212)')&&($('#dzLIB_ABSD'+smartsyges.padDay(cnt)).css('visibility')=='hidden')) {
                smartsyges.opendays.push(cnt);
            }
            cnt++;
        }
    });
    
    // "colorise" les jours dans l'entete de tableau + si le contenu != 1
    for (var i = 0; i < smartsyges.opendays.length; i++) {
        var day = smartsyges.opendays[i];
        var color = [];
        
        var headfield = $('input[name="SIE_TOTJ' + smartsyges.padDay(day) + '"]');
        if (headfield.val() != '1.00') {
            headfield.css('background-color', '#FFFF00');
        }
        
        for (var j = 1; j < smartsyges.countcontracts; j++) {
            var name = '_' + j + '_AVA_QTES' + smartsyges.padDay(day);
            var valdays = $('input[name="'+name+'"]').val();
            if (valdays != '') {
                color.push(smartsyges.colors[j-1]);
            }
        }
        if (color.length > 0) {
            if (color.length == 1) {
                smartsyges.fields[day].css('background-color', color[0]);
            }
            if (color.length == 2) {
                smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color[0]+', '+color[0]+' 49.9%, '+color[1]+' 50.1%, '+color[1]+' 100%)');
            }
            if (color.length == 3) {
                smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color[0]+', '+color[0]+' 33.2%, '+color[1]+' 33.4%, '+color[1]+' 66.5%, '+color[2]+' 66.7%, '+color[2]+' 100%)');
            }
            if (color.length > 3) {
                smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color.join()+')');
            }
        }
    }
    
    // "colorise" les cases à ne pas remplir en rouge
    for (var k = 1; k < 33; k++) {
        var notopened = true;
        for (var i = 0; i < smartsyges.opendays.length; i++) {
            var day = smartsyges.opendays[i];
            if (k == day)
                notopened = false;
        }
        if (notopened) {
            for (var j = 1; j < smartsyges.countcontracts; j++) {
                var name = '_' + j + '_AVA_QTES' + smartsyges.padDay(k);
                var field = $('input[name="'+name+'"]');
                if (field.css('background-color')!='rgb(212, 212, 212)')
                    field.css('background-color', '#E4E4E4');
            }
        }
    }
}

smartsyges.autosave = function () {
    window.setTimeout(smartsyges.save, 18000);
}
        
smartsyges.save = function () {
    try {
        eval($('a[name="BTN_ENRLIG"]').attr('href'));
    }
    catch (e) {
        console.log('cannot save');
    }
}

smartsyges.autovalid = function () {
    window.setTimeout(smartsyges.infovalid, 5000);
}

smartsyges.infovalid = function () {
    try {
        eval($('a[name="BTN_MO_FERCEL"]').attr('href'));
    }
    catch (e) {
        console.log('cannot valid');
    }
}

smartsyges.padDay = function (day) {
   return ((day< 10)?('0'+day):day);
}

smartsyges.colors = ['#00FF00', '#FF0000', '#00FFFF', '#FFFF00', '#FF00FF', '#007777', '#777700', '#770077', '#0000FF'];

smartsyges.data = [];
smartsyges.opendays = [];

smartsyges.fields = [];
smartsyges.contractsfields = [];
smartsyges.countcontracts = 0;


/* INCLUDE JQUERY */
var $;

// Add jQuery
    (function(){
        if (typeof unsafeWindow.jQuery == 'undefined') {
            var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
                GM_JQ = document.createElement('script');
    
            GM_JQ.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
            GM_JQ.type = 'text/javascript';
            GM_JQ.async = true;
    
            GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
        }
        GM_wait();
    })();

// Check if jQuery's loaded
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined') {
            window.setTimeout(GM_wait, 100);
        } else {
            $ = unsafeWindow.jQuery.noConflict(true);
            letsJQuery();
        }
    }

// All your GM code must be inside this function
    function letsJQuery() {
        GM_log($().jquery); // check jQuery version
        smartsyges.init();
    }
