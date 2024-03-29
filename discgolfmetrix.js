var REPO_BASE_URL = "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/";
var DGM_VERSION = '08:12';
console.log('----------------------------------');
console.log(`discgolfmetrix.js version: ${DGM_VERSION}`);

function loadCss() {
    $.ajax({
        url: `${REPO_BASE_URL}/discgolfmetrix.css`,
        success: function(response) {
            if (typeof primaryColor !== "undefined") {
                response = response.replaceAll("#1b2633", primaryColor);
            }
            if (typeof secondaryColor !== "undefined") {
                response = response.replaceAll("#8d1950", secondaryColor);
            }
            if (typeof lightSecondaryColor !== "undefined") {
                response = response.replaceAll("#ba7596", lightSecondaryColor);
            }
            if (typeof lighterSecondaryColor !== "undefined") {
                response = response.replaceAll("#f6e7ee", lighterSecondaryColor);
            }
            $("head").append(`<style>${response}</style>`);
        }
    });
}

function fixIcons(){
    $(".main-header-meta svg").after("<i class='fi-map'></i> ");
    $(".main-header-meta svg").remove();
}

function isMobile() {
    return window.matchMedia("only screen and (max-width: 1024px)").matches;
}

function loadSubcompetitionButtons(onlyFuture) {
    $.ajax({
        type: "GET",
        url: "https://discgolfmetrix.com/api.php?content=result&id=" + document.URL.split('/').pop(),
        success: function(response) {
            
            const today = new Date().toISOString().slice(0, 10);
            const sortNextTournaments = () => {
                const allTournaments = $("#subcompetitions .button").sort((a, b) => $(a).data('date') > $(b).data('date') ? 1 : -1);
                $("#subcompetitions .button").remove();
                allTournaments.each(function(){$("#subcompetitions").append(this.outerHTML)});
            };
            const childName = (competition) => competition.Name.split(" &rarr; ").pop();
            const appendSubcompetition = (competition) => {
                if ((!onlyFuture || competition.Date > today) && competition.Name.match(SHOW_SUBCOMPETITIONS_REGEX) !== null) {
                            $("#subcompetitions").append(`<a
                                                                class='button'
                                                                href='https://discgolfmetrix.com/${competition.ID}'
                                                                data-date='${competition.Date} ${competition.Time}'>
                                                            ${childName(competition)}
                                                        </a>
                                                        `);
                            sortNextTournaments();
                        }
            };
            
            if (response.Competition.Events || response.Competition.SubCompetitions) {
                $(".main-header .main-title").after("<div id='subcompetitions'/>");
            }
            response.Competition.Events?.forEach(function(event){
                $.ajax({
                    type: "GET",
                    url: "https://discgolfmetrix.com/api.php?content=result&id=" + event.ID,
                    success: function(response) {
                        appendSubcompetition(response.Competition);
                    }
                });
            });
            response.Competition.SubCompetitions?.forEach(function(subCompetition){
                appendSubcompetition(subCompetition);
            });
        },
        error: function(response, e) {
            console.log(response.statusText);
            console.log(response);
            console.log(e);
        }
    });
}

function showScoringReminderAlert() {
  if (typeof SCORING_REMINDER !== 'undefined') {
    $('#id_start_desktop, #id_start_mobile').on('click', () => { alert(SCORING_REMINDER); });
    console.log(`[discgolfmetrix.js - configured in metrix] Scoring reminder: ${SCORING_REMINDER}`);
  }
  else {
    console.log('[discgolfmetrix.js - default] No scoring reminder set');
  }
}

/* MAIN */

loadCss();
fixIcons();
const onlyFuture = (typeof showOnlyFutureSubcompetitions !== "undefined") && showOnlyFutureSubcompetitions; // default: show all
if (typeof SHOW_SUBCOMPETITIONS_REGEX !== 'undefined') {
    console.log(`[discgolfmetrix.js - configured in metrix] Regex for filtering subcompetitions: ${SHOW_SUBCOMPETITIONS_REGEX}`);
}
else {
 SHOW_SUBCOMPETITIONS_REGEX = /.*/;
 console.log('[discgolfmetrix.js - default] No regex for filtering subcompetitions was set');
}
loadSubcompetitionButtons(onlyFuture);

showScoringReminderAlert();

$(".breadcrumbs").hide();

console.log(`discgolfmetrix.js version: ${DGM_VERSION}`);
console.log('----------------------------------');
