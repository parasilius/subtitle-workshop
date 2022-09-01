function showOptions() {
    let checkbox = document.getElementById("isTV");
    let season_number = document.getElementById("mseason_number");
    let episode_number = document.getElementById("mepisode_number");

    if (checkbox.checked == true) {
        season_number.style.display = "block";
        episode_number.style.display = "block";
    } else {
        season_number.style.display = "none";
        episode_number.style.display = "none";
    }
}