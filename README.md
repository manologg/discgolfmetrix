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

    // only needed if you want to have a banner
    image = "https://i0.wp.com/flightcadets.com/wp-content/uploads/2023/07/XI-4.png?resize=1067%2C264";

    $.ajax({
        url: "https://raw.githubusercontent.com/manologg/discgolfmetrix/main/discgolfmetrix.js",
        success: function(response) {
            $("body").append("<script>" + response); // yes, the ending "script" tag is missing
        }
    });
</script>
```
