function showOptions() {
    let isTV = document.getElementById("isTV");
    let season_number = document.getElementById("mseason_number");
    let episode_number = document.getElementById("mepisode_number");
    let modifyAllEpisodes = document.getElementById("modifyAllEpisodes");
    let modifyAllEpisodesLabel = document.getElementById("modifyAllEpisodesLabel");

    if (isTV.checked == true) {
        season_number.style.display = "block";
        episode_number.style.display = "block";
        modifyAllEpisodes.style.display = "block";
        modifyAllEpisodesLabel.style.display = "block";
    } else {
        season_number.style.display = "none";
        episode_number.style.display = "none";
        modifyAllEpisodes.style.display = "none";
        modifyAllEpisodesLabel.style.display = "none";
    }
}

function disableTVOptions() {
    let modifyAllEpisodes = document.getElementById("modifyAllEpisodes");

    if (modifyAllEpisodes.checked == true) {
        document.getElementById("mseason_number").disabled = true;
        document.getElementById("mepisode_number").disabled = true;
    } else {
        document.getElementById("mseason_number").disabled = false;
        document.getElementById("mepisode_number").disabled = false;
    }
}