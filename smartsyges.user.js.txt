// ==UserScript==
// @name       SmartSyges
// @namespace  http://www.expertime.com/
// @version    0.1
// @description  SmartSyges
// @match      https://gestion.expertime.com/sygesweb/SYW_EC_MENUPRINCIPAL/*?WD_ACTION_=MENU&ID=OPM_MO_ACTIVITETEMPSPASSES
// @copyright  2015+, M.TUDURY
// ==/UserScript==


/*  classe smartsyges   */

var smartsyges = smartsyges || {};

// add smart frame button
smartsyges.init = function () {
        $('#tzLIB_INFPAG').html('<button id="smartsyges_launcher">Launch Smart Frame</button>');
        $('#smartsyges_launcher').click(smartsyges.startframe);
}

// construct div or hide it
smartsyges.startframe = function() {
    if ($('#smartsygesframe').length > 0) {
        var z = $('#smartsygesframe')[0];
        z.parentNode.removeChild(z);
        return false;
    }
    var k = $('#dwwCELTITREZRP');
    $('<div id="smartsygesframe" style="position:absolute;left:1;top:85;width:998;height:500;z-index:9999;opacity:0.95;background-color:#eeffee;">Selectionner le contrat ci dessous et cliquez sur le jour du mois<br/>Liste des contrats<div id="smartsygeslistcontrat"></div><br/><table></table><button id="smartsyges_apply">Update Syges</button></div>').insertBefore(k);
    
    $('#smartsygesframe table').html($($('.CSS-LibTitreJourZoneRepetee:first')[0].parentNode).html());
    var lstctrdiv = $('#smartsygeslistcontrat');
    $('input[name$="_AVA_ACTSAI"]').each(function (index, item) { lstctrdiv.append('<input type="radio" name="smartsygesctrselect" id="smartsygesselect'+index+'" value="'+index+'"><label for="smartsygesselect'+index+'" style="background-color: '+smartsyges.colors[index]+';">' + $(item).val()+'</label><button "smartsygesctr'+index+'">ALL</button>' +'<br/>'); });
    
    $('#smartsygesframe table td').each(function (index, td) { $(td).attr('data-day', index); $(td).click(smartsyges.updateDay); });
    
    $('#smartsyges_apply').click(smartsyges.savevalue);
    
    return false;
}

smartsyges.updateColors = function () {
    
}

smartsyges.updateDay = function () {
    var id = $(this).attr('data-day');
    var ctrsel = $('input[name="smartsygesctrselect"]:checked').val();
    $($('#smartsygesframe table td')[id]).css('background-color', smartsyges.colors[ctrsel]);

    //smartsyges.data
}

smartsyges.savevalue = function () {
    alert($('#CBO_PERSAI option:selected').text());
    
    return false;
}

smartsyges.colors = ['#00FF00', '#FF0000', '#0000FF', '#00FFFF', '#FFFF00', '#FF00FF', '#770077', '#777700', '#007777'];

smartsyges.data = {};

// construct help div or hide it
smartsyges.helpme = function() {
    if ($('#smartsygesframe').length > 0) {
        var z = $('#smartsygeshelp')[0];
        z.parentNode.removeChild(z);
        return false;
    }
    var k = $('#dwwCELTITREZRP');
    $('<div id="smartsygeshelp" style="position:absolute;left:1;top:85;width:998;height:500;z-index:9999;opacity:0.95;background-color:#eeffee;">Selectionner le contrat ci dessous et cliquez sur le jour du mois<br/>Liste des contrats<div id="smartsygeslistcontrat"></div><br/><table></table><button id="smartsyges_apply">Update Syges</button></div>').insertBefore(k);
    
    
    return false;
}


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
