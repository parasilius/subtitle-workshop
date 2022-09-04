function showOptions() {
    let isTV = document.getElementById("isTV");
    let season_number = document.getElementById("mseason_number");
    let episode_number = document.getElementById("mepisode_number");
    let modifyAllEpisodes = document.getElementById("modifyAllEpisodes");
    let modifyAllEpisodesLabel = document.getElementById("modifyAllEpisodesLabel");
    let modifyAllSeasonEpisodes = document.getElementById("modifyAllSeasonEpisodes");
    let modifyAllSeasonEpisodesLabel = document.getElementById("modifyAllSeasonEpisodesLabel");

    if (isTV.checked == true) {
        season_number.style.display = "block";
        episode_number.style.display = "block";
        modifyAllEpisodes.style.display = "block";
        modifyAllEpisodesLabel.style.display = "block";
        modifyAllSeasonEpisodes.style.display = "block";
        modifyAllSeasonEpisodesLabel.style.display = "block";
    } else {
        season_number.style.display = "none";
        episode_number.style.display = "none";
        modifyAllEpisodes.style.display = "none";
        modifyAllEpisodesLabel.style.display = "none";
        modifyAllSeasonEpisodes.style.display = "none";
        modifyAllSeasonEpisodesLabel.style.display = "none";
    }
}

function disableTVSeasonsAndEpisodes() {
    document.getElementById("mseason_number").disabled = true;
    document.getElementById("mepisode_number").disabled = true;
}

function disableTVEpisodes() {
    document.getElementById("mseason_number").disabled = false;
    document.getElementById("mepisode_number").disabled = true;
}