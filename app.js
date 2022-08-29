const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3030

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post("/subtitle-data", (req, res) => {
    let tv = req.body.tv_series_name;
    let season = req.body.season_number;
    let episode = req.body.episode_number;
    let username = req.body.username;
    let path_to_episodes = '/home/' + username + '/Videos/' + tv;
    function getDirectories(path) {
        return fs.readdirSync(path).filter((file) => {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    };
    let path_to_subtitles = path_to_episodes + '/' + getDirectories(path_to_episodes)[0]; // assuming there is only one directory
    const regex = new RegExp(`[sS]${('0' + season).slice(-2)}.*[eE]${('0' + episode).slice(-2)}`, 'gi');
    let old_subtitle_path;
    for (subtitle of fs.readdirSync(path_to_subtitles))
    {
        if (subtitle.match(regex) != null)
        {
            old_subtitle_path = path_to_subtitles + '/' + subtitle;
            break;
        }
    }

    let new_subtitle_path;
    for (episode of fs.readdirSync(path_to_episodes))
    {
        if (episode.match(regex))
        {
            episode_path = path_to_episodes + '/' + episode;
            break;
        }
    }

    // extension should include the dot, for example '.html'
    function changeExtension(file, extension) {
        const basename = path.basename(file, path.extname(file));
        return path.join(path.dirname(file), basename + extension);
    }

    new_subtitle_path = changeExtension(episode_path, '.srt');
    fs.rename(old_subtitle_path, new_subtitle_path, function (err) {
        if (err) throw err;
    })

    res.end('Done!');
})

app.listen(port, () => {
    console.log(`SubtitleWorkshop listening on port ${port}`);
})