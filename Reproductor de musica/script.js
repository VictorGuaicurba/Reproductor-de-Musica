document.addEventListener('DOMContentLoaded', () => {
	const audio = document.getElementById('audio');
	const songItems = Array.from(document.querySelectorAll('#song-list li'));
	const playBtn = document.getElementById('play');
	const pauseBtn = document.getElementById('pause');
	const nextBtn = document.getElementById('next');
	const prevBtn = document.getElementById('prev');
	const progress = document.getElementById('progress');
	const currentTimeEl = document.getElementById('current');
	const durationEl = document.getElementById('duration');
	const coverEl = document.getElementById('cover');
	const bodyEl = document.body;
	const searchInput = document.getElementById('search-input');
	const shuffleBtn = document.getElementById('shuffle');
	const loopBtn = document.getElementById('loop');

	const songs = songItems.map(li => ({
		src: li.dataset.src,
		title: li.dataset.title,
		artist: li.dataset.artist,
		cover: li.dataset.cover,
		element: li
	}));

	let current = 0;
	let isShuffle = false;
	let isLoop = false;

	if (searchInput) {
    	searchInput.addEventListener('input', (e) => {
        	const searchTerm = e.target.value.toLowerCase();

        	songs.forEach(song => {
            	const matchesTitle = song.title.toLowerCase().includes(searchTerm);
            	const matchesArtist = song.artist.toLowerCase().includes(searchTerm);

            	if (matchesTitle || matchesArtist) {
                	song.element.style.display = 'block';
            	} else {
                	song.element.style.display = 'none';
            	}
        	});
    	});
	}

	function loadSong(index) {
		const s = songs[index];
		if (!s) return;
		audio.src = s.src;
		document.getElementById('title').textContent = s.title;
		document.getElementById('artist').textContent = s.artist;
		const currentCover = s.cover || 'cover-placeholder.png';
		coverEl.src = currentCover;
		bodyEl.style.setProperty('--bg-dynamic', `url('${currentCover}')`);
		document.querySelectorAll('#song-list li').forEach(li => li.classList.remove('active'));
		s.element.classList.add('active');
	}

	function playSong() {
		if (!audio.src) loadSong(current);
		audio.play().catch(() => {});
		playBtn.style.display = 'none';
		pauseBtn.style.display = 'inline-block';
		coverEl.classList.add('playing');
	}

	function pauseSong() {
		audio.pause();
		playBtn.style.display = 'inline-block';
		pauseBtn.style.display = 'none';
		coverEl.classList.remove('playing');
	}

	if (shuffleBtn) {
		shuffleBtn.addEventListener('click', () => {
			isShuffle = !isShuffle;
			shuffleBtn.classList.toggle('active-btn', isShuffle);

			if (isShuffle && isLoop) {
				isLoop = false;
				loopBtn.classList.remove('active-btn');
			}
		});
	}

	if (loopBtn) {
		loopBtn.addEventListener('click', () => {
			isLoop = !isLoop;
			loopBtn.classList.toggle('active-btn', isLoop);

			if (isLoop && isShuffle) {
				isShuffle = false;
				shuffleBtn.classList.remove('active-btn');
			}
		});
	}

	songItems.forEach((li, i) => {
		li.addEventListener('click', () => {
			current = i;
			loadSong(current);
			playSong();
		});
	});

	playBtn.addEventListener('click', () => playSong());
	pauseBtn.addEventListener('click', () => pauseSong());

	nextBtn.addEventListener('click', () => {
		if (isShuffle) {

			let randomIndex;

			do {
				randomIndex = Math.floor(Math.random() * songs.length);
			} while (randomIndex === current && songs.length > 1);
			current = randomIndex;
		} else {
			current = (current + 1) % songs.length;
		}
		loadSong(current);
		playSong();
	});

	prevBtn.addEventListener('click', () => {
		current = (current - 1 + songs.length) % songs.length;
		loadSong(current);
		playSong();
	});

	audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.value = progressPercent;
            
            // Formatear minutos y segundos
            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            currentTimeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        let mins = Math.floor(audio.duration / 60);
        let secs = Math.floor(audio.duration % 60);
        durationEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    });

    progress.addEventListener('input', () => {
        const timeToChange = (progress.value * audio.duration) / 100;
        audio.currentTime = timeToChange;
    });

	audio.addEventListener('ended', () => {
		if (isLoop) {
			audio.currentTime = 0;
			playSong();
		} else if (isShuffle) {
			let randomIndex;
			do {
				randomIndex = Math.floor(Math.random() * songs.length);
			} while (randomIndex === current && songs.length > 1);

			current = randomIndex;
			loadSong(current);
			playSong();
		} else {
			nextBtn.click();
		}
	});

	if (songs.length) loadSong(0);
});

