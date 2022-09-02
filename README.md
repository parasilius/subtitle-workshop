# SubtitleWorkshop
This app helps you work with subtitles; modify them when they are out of sync with audio and rename
them such that the movie and the subtitle file have the same base name.
## set default path
The default path is `SubtitleWorkshop`'s parent directory. To change the default path you can 
manually fill in the `new path` field and check `use defined path`. To use the default path after 
submitting the defined path, you can just submit with `use defined path` unchecked.

Whichever path you choose(default or defined), this should be the path where your TV series 
directories or movies are. Suppose there is an `<example path>`, and there is a directory, 
`<example path>/<myShow>/` in which the episodes of the show are available, or we have 
`<example path>/<myMovie>.mkv` and `<example path>/<myMovie>.srt`. So if we want to manipulate 
`<myMovie>` or `<myShow>`, we have to either clone the repository to `<example path>` and run the app 
from there, or fill the `new path` to be the `<example path>`(which is an absolute path) and check 
`use defined path` and submit.
## sync subtitle with TV episode
Considering the example in the previous section, suppose we have all the subtitles of myShow's 
season `i` episodes in `<example path>/<myShow>/<season-i-subtitles>`, and the goal is to move 
episode `j`'s subtitle and rename it to have the same base name as the episode itself. So we fill 
in the fields as follows:

`Enter TV series`: `<myShow>`(note that this the directory name, and may or may not be the same as the show name itself)
`Enter season number`: `i`(`i` > 0)
`Enter episode number`: `j`(`j` >= 0)

After submission, we should have these files in `<example path>/<myShow>`:

`myShow.S0i.E0j.mkv`

`myShow.S01.E0j.srt`
## modify subtitle
This section is for subtitle modification when it's out of sync with the audio. Considering the above 
example again, suppose `<myMovie>.mkv` is out of sync with its subtitle, `<myMovie>.srt`.

If we see a sentence but after 96000ms we hear the audio, we need to forward the subtitle.

To do that, we fill `TV series or movie name` with `<myMovie>`.
Note that every substring in `<myMovie>` seperated by spaces should be in a substring of `<myMovie>.srt`.
Also there should be only one superstring such as `<myMovie>.srt` containing these substring.
If we want to modify the subtitle for an episode in a directory named `<myShow>`, we fill this field with `<myShow>` instead.

If we are modifying the subtitle for a movie(meaning outside a directory) we leave the `TV series` unchecked.
Otherwise we check the box and in the fields that appear we specify the season and episode number.

We want to modify the subtitle 96000ms, so we can fill `Seconds to add` with each one of these:

`96,000`  `96`  `96.0`  `96.00`  `96.000`  ...

In order to replace the original subtitle check `replace subtitle`.
Otherwise leave it unchecked and the modified subtitle will be saved in `SubtitleWorkshop`.

If we want to forward the subtitle(such as in this example), we leave `delay` unchecked.