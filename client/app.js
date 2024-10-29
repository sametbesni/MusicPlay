document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('search').value;
    searchMusic(query);
});

document.getElementById('search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        searchMusic(query);
    }
});

function searchMusic(query) {
    // API çağrısı yaparak sonuçları alın
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyA6Mj6JoVOr6o7GreMUtuOBW-YyxpzYQDY`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        });
}

function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.snippet.title;

        const playButton = document.createElement('button');
        playButton.innerHTML = '▶️';
        playButton.onclick = () => playMusic(item);

        const pauseButton = document.createElement('button');
        pauseButton.innerHTML = '⏸️';
        pauseButton.onclick = pauseMusic;

        const stopButton = document.createElement('button');
        stopButton.innerHTML = '⏹️';
        stopButton.onclick = stopMusic;

        div.appendChild(playButton);
        div.appendChild(pauseButton);
        div.appendChild(stopButton);
        resultsDiv.appendChild(div);
    });
}

let player;
let duration = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Oynatıcı hazır olduğunda yapılacak işlemler
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        duration = player.getDuration();
        document.getElementById('total-time').textContent = formatTime(duration);
        updateProgressBar();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');

    setInterval(() => {
        const currentTime = player.getCurrentTime();
        progressBar.value = (currentTime / duration) * 100;
        currentTimeSpan.textContent = formatTime(currentTime);
    }, 1000);

    progressBar.addEventListener('click', (e) => {
        const percent = e.offsetX / progressBar.offsetWidth;
        const newTime = percent * duration;
        player.seekTo(newTime);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function playMusic(item) {
    player.loadVideoById(item.id.videoId);
    player.playVideo();
    getLyrics(item.snippet.channelTitle, item.snippet.title);
}

function pauseMusic() {
    player.pauseVideo();
}

function stopMusic() {
    player.stopVideo();
}

function addToPlaylist(item) {
    const playlistDiv = document.getElementById('playlist');
    const div = document.createElement('div');
    div.textContent = item.snippet.title;
    playlistDiv.appendChild(div);
}

function getLyrics(artist, title) {
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        .then(response => response.json())
        .then(data => {
            displayLyrics(data.lyrics);
        })
        .catch(error => {
            console.error('Error fetching lyrics:', error);
            displayLyrics('Şarkı sözleri bulunamadı.');
        });
}

function displayLyrics(lyrics) {
    const lyricsDiv = document.getElementById('lyrics');
    lyricsDiv.innerHTML = lyrics.replace(/\n/g, '<br />');
}

document.getElementById('play-btn').addEventListener('click', () => player.playVideo());
document.getElementById('pause-btn').addEventListener('click', () => player.pauseVideo());
document.getElementById('stop-btn').addEventListener('click', () => {
    player.stopVideo();
    document.getElementById('progress-bar').value = 0;
    document.getElementById('current-time').textContent = '0:00';
});

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');

    setInterval(() => {
        const currentTime = player.getCurrentTime();
        progressBar.value = (currentTime / duration) * 100;
        currentTimeSpan.textContent = formatTime(currentTime);
    }, 1000);

    progressBar.addEventListener('click', (e) => {
        const percent = e.offsetX / progressBar.offsetWidth;
        const newTime = percent * duration;
        player.seekTo(newTime);
    });
}

