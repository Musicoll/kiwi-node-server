<template lang="html">
  <div id="latest-release" class="ui message">
    <a id="latest-release-link" class="ui button" href="https://github.com/Musicoll/Kiwi/releases/latest">
    <i class="download icon"></i> Latest release (<span id="latest-release-name">?</span>)
    </a>
    <br><br>
    <div id="platforms">
      <a id="download-mac" class="download ui huge primary button" href="https://github.com/Musicoll/Kiwi/releases">
        <i class="apple icon"></i> Mac
      </a>
      <a id="download-win64" class="download ui huge primary button" href="https://github.com/Musicoll/Kiwi/releases">
        <i class="windows icon"></i> Windows
      </a>
      <a id="download-linux" class="download ui huge primary button" href="https://github.com/Musicoll/Kiwi/releases">
        <i class="linux icon"></i> Linux
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  mounted() {
    function GetLatestReleaseInfo() {
      // hide release block
      $("#latest-release #platforms").hide();

      const latest_release_url =
        "https://api.github.com/repos/Musicoll/Kiwi/releases/latest";

      $.getJSON(latest_release_url).done(function(release) {
        var asset = release.assets[0];
        let html_url = release.html_url;
        var release_tag = release.name;

        $("#latest-release #latest-release-name").text(release_tag);

        const download_url_base =
          "https://github.com/Musicoll/Kiwi/releases/download/" +
          release_tag +
          "/";

        $("#download-mac").attr(
          "href",
          download_url_base + "Kiwi-macos-x64.zip"
        );
        $("#download-win64").attr(
          "href",
          download_url_base + "Kiwi-windows-x64.zip"
        );
        $("#download-linux").attr(
          "href",
          download_url_base + "Kiwi-linux-x64.zip"
        );

        // show release block
        $("#latest-release #platforms").fadeIn("slow");
      });
    }

    GetLatestReleaseInfo();
  }
};
</script>

<style lang="css">
</style>
