// ==UserScript==
// @name       SmartSyges
// @namespace  http://www.expertime.com/
// @description  SmartSyges pour Greasemonkey & Tampermonkey
// @version    0.6
// @match      https://gestion.expertime.com/sygesweb/*
// @copyright  2015+, M.TUDURY (OpenSource, Licence MIT)
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

'use strict';
/*  classe smartsyges   */

var smartsyges = smartsyges || {};

// add smart frame button
smartsyges.init = function () {
    smartsyges.loadoptions();
    if ($('form[name="SYW_EC_INFOSUTILISATEUR"]').length > 0) {
        if (smartsyges.options.autobypassmsg == 1)
            smartsyges.autovalid();
    }
    else {
        if ($('form[name="TEM_SA_SAISIEMENSUELLE"]').length > 0) {
            smartsyges.colorize();
            smartsyges.autosaveinit('#dwwCELTITREZRP');
            smartsyges.initcraoptions();
        }
        if ($('form[name="FRS_SA_FRAISJOURNALIER"]').length > 0) {
            smartsyges.autosaveinit('#dwwCELTITZRP');
        }
    }
}

smartsyges.colorize = function () {
    //identifie les contrats sur la page + met en couleur les lignes de contrats
    $('input[name$="_AVA_ACTSAI"]').each(function (index, item) { 
        if (smartsyges.options.cracontractcolor == 1) {
            $(item).css('background-color', smartsyges.colors[index]);
			$(item).css('color', smartsyges.fontcolors[index]);
		}
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
		var fontcolor = [];

        if (smartsyges.options.cradiverscolor == 1) {
            var headfield = $('input[name="SIE_TOTJ' + smartsyges.padDay(day) + '"]');
            if (headfield.val() != '1.00') {
                headfield.css('background-color', '#FFFF00');
            }
        }

        if (smartsyges.options.cracontractcolor == 1) {
            for (var j = 1; j < smartsyges.countcontracts; j++) {
                var name = '_' + j + '_AVA_QTES' + smartsyges.padDay(day);
                var valdays = $('input[name="'+name+'"]').val();
                if (valdays != '') {
                    color.push(smartsyges.colors[j-1]);
					fontcolor.push(smartsyges.fontcolors[j-1]);
                }
            }
            if (color.length > 0) {
                if (color.length == 1) {
                    smartsyges.fields[day].css('background-color', color[0]);
					smartsyges.fields[day].css('color', fontcolor[0]);
                }
                if (color.length == 2) {
                    smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color[0]+', '+color[0]+' 49.9%, '+color[1]+' 50.1%, '+color[1]+' 100%)');
					smartsyges.fields[day].css('color', fontcolor[0]);
                }
                if (color.length == 3) {
                    smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color[0]+', '+color[0]+' 33.2%, '+color[1]+' 33.4%, '+color[1]+' 66.5%, '+color[2]+' 66.7%, '+color[2]+' 100%)');
					smartsyges.fields[day].css('color', fontcolor[0]);
                }
                if (color.length > 3) {
                    smartsyges.fields[day].css('background', 'linear-gradient(45deg, '+color.join()+')');
					smartsyges.fields[day].css('color', fontcolor[0]);
                }
            }
        }
    }

    if (smartsyges.options.cradiverscolor == 1) {
        // "colorise" les cases à ne pas remplir en gris
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
}

smartsyges.autosavecounter = 210;
smartsyges.autosaveinit = function (divtofind) {
    var k = $(divtofind);
    $('<div id="smartsygestopdiv" style="position:absolute;left:1;top:60;width:998;height:20;z-index:9999;opacity:0.95;background-color:#eeffee;"><div id="smartsygesoptionsdiv" style="float: left;"></div><div id="smartsygesautosavecounter" style="text-align: center;">autosave...</div></div>').insertBefore(k);

    window.setTimeout(smartsyges.autosave, 1000);
}

smartsyges.loadoptions = function () {
    var opt = localStorage.getItem('smartsyges_options');
    if (opt) {
        opt = JSON.parse(opt);
        smartsyges.options.cracontractcolor = opt.hasOwnProperty('cracontractcolor') ? opt.cracontractcolor : smartsyges.options.cracontractcolor;
        smartsyges.options.cradiverscolor =  opt.hasOwnProperty('cradiverscolor') ? opt.cradiverscolor : smartsyges.options.cradiverscolor;
        smartsyges.options.autosave = opt.hasOwnProperty('autosave') ? opt.autosave : smartsyges.options.autosave;
        smartsyges.options.autobypassmsg = opt.hasOwnProperty('autobypassmsg') ? opt.autobypassmsg : smartsyges.options.autobypassmsg;
    }
}

smartsyges.initcraoptions = function () {
    $('#smartsygesoptionsdiv').html('<input type="checkbox" id="ssoptcontractcolor"><label for="ssoptcontractcolor">Couleurs de contrat</label> | <input type="checkbox" id="ssoptdiverscolor"><label for="ssoptdiverscolor">Autres couleurs</label> | <input type="checkbox" id="ssoptautosave"><label for="ssoptautosave">AutoSave</label> | <input type="checkbox" id="ssoptautobypassmsg"><label for="ssoptautobypassmsg">ByPass Messages</label>');
    
    $('#ssoptcontractcolor').prop('checked', smartsyges.options.cracontractcolor == 1);
    $('#ssoptdiverscolor').prop('checked', smartsyges.options.cradiverscolor == 1);
    $('#ssoptautosave').prop('checked', smartsyges.options.autosave == 1);
    $('#ssoptautobypassmsg').prop('checked', smartsyges.options.autobypassmsg == 1);
    

    $('#ssoptcontractcolor').change(smartsyges.saveoptions);
    $('#ssoptdiverscolor').change(smartsyges.saveoptions);
    $('#ssoptautosave').change(smartsyges.saveoptions);
    $('#ssoptautobypassmsg').change(smartsyges.saveoptions);
}

smartsyges.saveoptions = function () {
    var o = $('#ssoptcontractcolor');
    if (o.length > 0)
    	smartsyges.options.cracontractcolor = o.prop('checked') ? 1 : 0;
    o = $('#ssoptdiverscolor');
    if (o.length > 0)
    	smartsyges.options.cradiverscolor = o.prop('checked') ? 1 : 0;
    o = $('#ssoptautosave');
    if (o.length > 0)
    	smartsyges.options.autosave = o.prop('checked') ? 1 : 0;
    o = $('#ssoptautobypassmsg');
    if (o.length > 0)
    	smartsyges.options.autobypassmsg = o.prop('checked') ? 1 : 0;
    
    localStorage.setItem('smartsyges_options', JSON.stringify(smartsyges.options));    
}

smartsyges.autosave = function () {
    smartsyges.autosavecounter--;
    if (smartsyges.options.autosave == 1) {
        $('#smartsygesautosavecounter').html('autosave in '+smartsyges.autosavecounter+'s');
        if (smartsyges.autosavecounter>0)
            window.setTimeout(smartsyges.autosave, 1000);
        else
            window.setTimeout(smartsyges.save, 1000);
    } else {
        $('#smartsygesautosavecounter').html('autosave disabled');
        window.setTimeout(smartsyges.autosave, 5000);
    }

}


smartsyges.save = function () {
    if (smartsyges.options.autosave == 1) {
        try {
            eval($('a[name="BTN_ENRLIG"]').attr('href'));
        }
        catch (e) {
            console.log('cannot save');
        }
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
smartsyges.fontcolors = ['#000000', '#FFFFFF', '#000000', '#000000', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];

smartsyges.data = [];
smartsyges.opendays = [];

smartsyges.fields = [];
smartsyges.contractsfields = [];
smartsyges.countcontracts = 0;

smartsyges.options = { "cracontractcolor": 1, "cradiverscolor": 1, "autosave": 1, "autobypassmsg": 0 };



console.log($().jquery); // check jQuery version
smartsyges.init();
