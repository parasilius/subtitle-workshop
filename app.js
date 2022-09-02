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
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post("/subtitle-sync", (req, res) => {
    let tv = req.body.tv_series_name;
    let season = req.body.season_number;
    let episode = req.body.episode_number;
    let path_to_episodes = path.resolve(path.dirname(__dirname));
    fs.readFile(path.join(__dirname, 'static', 'path.json'), 'utf-8', (err, data) => {
        if (err) {
            path_to_episodes = path.join(path_to_episodes, tv);
            console.log(`no defined path found, setting path to ${path_to_episodes}`);
        } else {
            let pathJson = JSON.parse(data);
            path_to_episodes = (pathJson.useDefinedPath) ? pathJson.path : path_to_episodes;
            path_to_episodes = path.join(path_to_episodes, tv);
            console.log(`defined path found, setting path to ${path_to_episodes}`);
        }
        function getDirectories(path) {
            return fs.readdirSync(path).filter((file) => {
                return fs.statSync(path.join(path, file)).isDirectory();
            });
        };
        let path_to_subtitles = path.join(path_to_episodes, getDirectories(path_to_episodes)[0]); // assuming there is only one directory
        const regex = new RegExp(`[sS]${('0' + season).slice(-2)}.*[eE]${('0' + episode).slice(-2)}`, 'gi');
        let old_subtitle_path;
        for (subtitle of fs.readdirSync(path_to_subtitles))
        {
            if (subtitle.match(regex) != null)
            {
                old_subtitle_path = path.join(path_to_subtitles, subtitle);
                break;
            }
        }

        let new_subtitle_path;
        for (episode of fs.readdirSync(path_to_episodes))
        {
            if (episode.match(regex))
            {
                episode_path = path.join(path_to_episodes, episode);
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
    });
    res.end('Done!');
})

app.post("/subtitle-modify", (req, res) => {
    let name = req.body.name;
    let season = req.body.mseason_number;
    let episode = req.body.mepisode_number;
    let isTV = req.body.isTV;
    let directory_path;

    fs.readFile(path.join(__dirname, 'static', 'path.json'), 'utf-8', (err, data) => {
        if (err) {
            directory_path = path.resolve(path.dirname(__dirname));
            console.log(`no defined path found, setting path to ${directory_path}`);
        } else {
            let pathJson = JSON.parse(data);
            directory_path = (pathJson.useDefinedPath) ? pathJson.path : path.resolve(path.dirname(__dirname));
            console.log(`defined path found, setting path to ${directory_path}`);
        }

        if (isTV) {
            subtitle_path = path.join(directory_path, name);
            const regex = new RegExp(`[sS]${('0' + season).slice(-2)}.*[eE]${('0' + episode).slice(-2)}.*\.srt$`, 'gi');
            for (subtitle of fs.readdirSync(subtitle_path))
            {
                if (subtitle.match(regex) != null)
                {
                    subtitle_path = path.join(subtitle_path, subtitle);
                    break;
                }
            }
        } else {
            subtitle_path = directory_path;
            let subtitles = fs.readdirSync(subtitle_path).filter((string) => { return string.match(/.*\.srt$/) });
            for (subtitle of subtitles)
            {
                if (!(name.toLowerCase().split(' ').map((string) => { return subtitle.toLowerCase().includes(string) })).includes(false))
                {
                    subtitle_path = path.join(subtitle_path, subtitle);
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
            let seconds_to_add = req.body.secondsToAdd;
            if (req.body.delay == "on") seconds_to_add = `-${seconds_to_add}`;
            for (const time of times) {
                const time1 = new Time(time[1]);
                const time2 = new Time(time[2]);
                data = data.replace(time[0], `${time1.addSeconds(seconds_to_add)} --> ${time2.addSeconds(seconds_to_add)}`);
            }

            let path_to_save = path.join(__dirname, subtitle);
            fs.writeFile(path_to_save, data, err => {
                if (err) {
                    console.error(err);
                }
            });
            if (req.body.replaceModifiedSub) {
                fs.rename(path_to_save, subtitle_path, err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });

    res.end('Done!');
})

app.post("/set-new-path", (req, res) => {
    let content = `{
        "path": "${req.body.newPath}",
        "useDefinedPath": ${(req.body.useDefinedPath == undefined) ? false : true}
    }`
    fs.writeFile(path.join(__dirname, 'static', 'path.json'), content, err => {
        if (err) {
            console.error(err);
        }
    })
    res.end('Done!');
});

app.listen(port, () => {
    console.log(`SubtitleWorkshop listening on port ${port}`);
})