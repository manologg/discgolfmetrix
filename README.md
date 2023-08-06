# discgolfmetrix

To be used with the following source code in the public text field

```html
<script>
    // only needed if you only want to show future subcompetitions (not all) like in Tremonia Series
    showOnlyFutureSubcompetitions = false;

    // only needed if you want to have a banner
    image = "https://discgolffriends.de/static/img/banners/tremonia-open.png";

    $.ajax({
        url: "https://discgolffriends.de/static/js/discgolfmetrix.js",
        success: function(response) {
            $("body").append("<script>" + response); // yes, the ending "script" tag is missing
        }
    });
</script>
```
