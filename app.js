const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const { allowedNodeEnvironmentFlags } = require('process')
const app = express()
const port = 3030
const {Time} = require('./Time')

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static('./static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post("/subtitle-sync", (req, res) => {
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

app.post("/subtitle-modify", (req, res) => {
    let name = req.body.name;
    let season = req.body.mseason_number;
    let episode = req.body.mepisode_number;
    let username = req.body.username;
    let isTV = req.body.isTV;
    let subtitle_path = '/home/' + username + '/Videos/';
    if (isTV) {
        subtitle_path += name;
        const regex = new RegExp(`[sS]${('0' + season).slice(-2)}.*[eE]${('0' + episode).slice(-2)}.*\.srt$`, 'gi');
        for (subtitle of fs.readdirSync(subtitle_path))
        {
            if (subtitle.match(regex) != null)
            {
                let directory_path = subtitle_path;
                subtitle_path += '/' + subtitle;
                break;
            }
        }
    } else {
        for (subtitle of fs.readdirSync(subtitle_path))
        {
            if (subtitle.match(name))
            {
                let directory_path = subtitle_path;
                subtitle_path += '/' + subtitle;
                break;
            }
        }
    }

    fs.readFile(subtitle_path, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const regexp = new RegExp(`(\\S*) --> (\\S*)`, 'g');
        const times = data.matchAll(regexp);
        let seconds_to_add = "1";
        for (const time of times) {
            const time1 = new Time(time[1]);
            const time2 = new Time(time[2]);
            data = data.replace(time[0], `${time1.addSeconds(seconds_to_add)} --> ${time2.addSeconds(seconds_to_add)}`);
        }

        fs.writeFile(`/home/${username}/1.srt`, data, err => {
            if (err) {
                console.error(err);
            }
        });
    });

    res.end('Done!');
})

app.listen(port, () => {
    console.log(`SubtitleWorkshop listening on port ${port}`);
})