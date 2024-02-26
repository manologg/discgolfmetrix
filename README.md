# discgolfmetrix

To be used with the following source code in the public text field

```html
<script>

    /// basic colors

    primaryColor = "#000000";
    secondaryColor = "#950710";
    lightSecondaryColor = "#bb5f65";

    // only needed if you only want to show future subcompetitions (not all) like in Tremonia Series
    showOnlyFutureSubcompetitions = false;

    // needed if you want to add an alert that appear when you click on the "Enter" scores button
    SCORING_REMINDER = 'Erinnerung: du musst nur die Anzahl an erfolgreichen Putts eingetragen!';

    $.ajax({
        url: "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/discgolfmetrix.js",
        success: function(response) {
            $("body").append("<script>" + response); // yes, the ending "script" tag is missing
        }
    });

    // if these are not defined, default will be used (1 point, 3 putts per station and 0 extra points if all putts are made)
    POINT_SYSTEM = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5};
    MAX_PUTTS_PER_STATION = 3;
    EXTRA_POINTS_IF_ALL_PUTTS_ARE_MADE = 1;

    $.ajax({
        url: "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/putting-league.js",
        success: function(response) {
            $("body").append("<script>" + response); // yes, the ending "script" tag is missing
        }
    });
</script></p>

```
