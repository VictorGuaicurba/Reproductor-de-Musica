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

	const songs = songItems.map(li => ({
		src: li.dataset.src,
		title: li.dataset.title,
		artist: li.dataset.artist,
		cover: li.dataset.cover,
		element: li
	}));

	function loadSong(index) {
		const s = songs[index];
		if (!s) return;
		audio.src = s.src;
		document.getElementById('title').textContent = s.title;
		document.getElementById('artist').textContent = s.artist;
		const currentCover = s.cover || 'cover-placeholder.png';
		coverEl.src = currentCover;
		bodyEl.style.backgroundImage = `url('${currentCover}')`;
		document.querySelectorAll('#song-list li').forEach(li => li.classList.remove('active'));
		s.element.classList.add('active');
	}

	songItems.forEach((li, i) => {
		li.addEventListener('click', () => {
			current = i;
			loadSong(current);
			playSong();
		});
	});

	if (songs.length) loadSong(0);
});

