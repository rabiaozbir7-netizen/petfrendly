document.addEventListener('DOMContentLoaded', () => {
    // --- Data Models ---
    const PETS = {
        cat: { id: 'cat', emoji: '🐱', foodEmoji: '🐟', bg: '#ffe5ec', secondary: '#ff758c', type: 'Kedi' },
        dog: { id: 'dog', emoji: '🐶', foodEmoji: '🦴', bg: '#e0f2fe', secondary: '#4facfe', type: 'Köpek' },
        rabbit: { id: 'rabbit', emoji: '🐰', foodEmoji: '🥕', bg: '#e0ffff', secondary: '#00f2fe', type: 'Tavşan' },
        panda: { id: 'panda', emoji: '🐼', foodEmoji: '🎋', bg: '#f1f8e9', secondary: '#2ecc71', type: 'Panda' },
        hamster: { id: 'hamster', emoji: '🐹', foodEmoji: '🌻', bg: '#fff3e0', secondary: '#ffa726', type: 'Hamster' }
    };

    const MAX_XP = 500;
    const STAT_MAX = 100;

    // --- State ---
    let state = {
        selectedPetId: null,
        petName: '',
        hunger: 50,
        happiness: 80,
        xp: 0,
        level: 1,
        isAnimating: false,
        gameLoopId: null
    };

    // --- DOM Elements ---
    const selectionScreen = document.getElementById('selection-screen');
    const namingScreen = document.getElementById('naming-screen');
    const mainScreen = document.getElementById('main-screen');
    const petSelectionGrid = document.getElementById('pet-selection-grid');
    const selectionContinueBtn = document.getElementById('selection-continue-btn');
    const namingPetPreview = document.getElementById('naming-pet-preview');
    const petNameInput = document.getElementById('pet-name-input');
    const confirmNameBtn = document.getElementById('confirm-name-btn');
    const appContainer = document.getElementById('app-container');
    const displayPetName = document.getElementById('display-pet-name');
    const displayPetType = document.getElementById('display-pet-type');
    const levelText = document.getElementById('level-text');
    const xpText = document.getElementById('xp-text');
    const hungerBar = document.getElementById('hunger-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const xpBar = document.getElementById('xp-bar');
    const petWrapper = document.getElementById('pet');
    const petImage = document.getElementById('pet-image');
    const animationLayer = document.getElementById('animation-layer');
    const foodTray = document.getElementById('food-tray');
    const draggableFood = document.getElementById('draggable-food');
    const foodEmojiDisplay = document.getElementById('food-emoji');
    const feedToggleBtn = document.getElementById('feed-toggle-btn');
    const playMenuBtn = document.getElementById('play-menu-btn');
    const gamesModal = document.getElementById('games-modal');
    const closeGamesBtn = document.getElementById('close-games-btn');
    const gamesModalBg = document.getElementById('games-modal-bg');
    const gameCards = document.querySelectorAll('.game-card');
    const minigameContainer = document.getElementById('minigame-container');
    const minigameTitle = document.getElementById('minigame-title');
    const exitGameBtn = document.getElementById('exit-game-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameInstructions = document.getElementById('game-instructions');
    const gameCanvas = document.getElementById('game-canvas');
    const mazeControls = document.getElementById('maze-controls');
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleGrid = document.getElementById('puzzle-grid');
    const puzzlePiecesBench = document.getElementById('puzzle-pieces');
    const puzzleRestartBtn = document.getElementById('puzzle-restart-btn');
    const puzzlePreviewOverlay = document.getElementById('puzzle-preview-overlay');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const gameScoreValue = document.getElementById('game-score-value');
    const gamePointsEarned = document.getElementById('game-points-earned');
    const gameClaimBtn = document.getElementById('game-claim-btn');
    const gameRetryBtn = document.getElementById('game-retry-btn');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const levelUpModal = document.getElementById('level-up-modal');
    const newLevelDisplay = document.getElementById('new-level-display');
    const closeLevelUpBtn = document.getElementById('close-level-up-btn');
    const puzzleStartBtn = document.getElementById('puzzle-start-btn');
    const puzzlePreviewContainer = document.getElementById('puzzle-preview-container');
    const puzzleGridContainer = document.getElementById('puzzle-grid-container');
    const gameCtx = gameCanvas.getContext('2d');
    const confettiCtx = confettiCanvas.getContext('2d');

    function resizeCanvasToDisplaySize(canvas, ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // --- Initialization ---
    function init() {
        renderSelectionGrid();
        setupEventListeners();
        setupDragAndDrop();
    }

    function renderSelectionGrid() {
        petSelectionGrid.innerHTML = '';
        Object.values(PETS).forEach(pet => {
            const el = document.createElement('div');
            el.className = 'pet-option glass-panel';
            el.innerHTML = `<span class="pet-option-emoji">${pet.emoji}</span>`;
            el.dataset.id = pet.id;
            el.addEventListener('click', () => handlePetChoice(pet.id));
            petSelectionGrid.appendChild(el);
        });
    }

    function handlePetChoice(id) {
        state.selectedPetId = id;
        document.querySelectorAll('.pet-option').forEach(opt => opt.classList.toggle('selected', opt.dataset.id === id));
        selectionContinueBtn.disabled = false;
        selectionContinueBtn.classList.add('scale-in-center');
    }

    selectionContinueBtn.addEventListener('click', () => {
        if (state.selectedPetId) goToNamingScreen();
    });

    function goToNamingScreen() {
        selectionScreen.classList.add('hidden');
        namingScreen.classList.remove('hidden');
        namingPetPreview.textContent = PETS[state.selectedPetId].emoji;
        petNameInput.focus();
    }

    confirmNameBtn.addEventListener('click', () => {
        const val = petNameInput.value.trim();
        if (val) {
            state.petName = val;
            goToMainGame();
        } else {
            petNameInput.classList.add('shake');
            setTimeout(() => petNameInput.classList.remove('shake'), 500);
        }
    });

    function goToMainGame() {
        const pet = PETS[state.selectedPetId];
        displayPetName.textContent = state.petName;
        displayPetType.textContent = pet.type;
        petImage.textContent = pet.emoji;
        foodEmojiDisplay.textContent = pet.foodEmoji;
        appContainer.style.background = `linear-gradient(to bottom, ${pet.bg} 0%, #fdfbfb 50%, #ebedee 100%)`;
        namingScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        updateUI();
        startGameLoop();
    }

    // --- Core UI & Level Logic ---
    function updateUI() {
        state.hunger = Math.max(0, Math.min(STAT_MAX, state.hunger));
        state.happiness = Math.max(0, Math.min(STAT_MAX, state.happiness));
        hungerBar.style.width = `${state.hunger}%`;
        happinessBar.style.width = `${state.happiness}%`;
        levelText.textContent = `Seviye ${state.level}`;
        xpText.textContent = `${state.xp} / ${MAX_XP}`;
        const xpPercent = (state.xp / MAX_XP) * 100;
        xpBar.style.width = `${xpPercent}%`;
        checkPetState();
    }

    function checkPetState() {
        if (state.isAnimating) return;
        if (state.hunger < 30 || state.happiness < 30) petImage.classList.add('sad');
        else petImage.classList.remove('sad');
    }

    function startGameLoop() {
        if (state.gameLoopId) clearInterval(state.gameLoopId);
        state.gameLoopId = setInterval(() => {
            state.hunger -= 1;
            state.happiness -= 1;
            updateUI();
        }, 12000);
    }

    function addXP(amount) {
        state.xp += amount;
        spawnFloatingText(`+${amount} TP`, '#f6d365');
        if (state.xp >= MAX_XP) {
            state.xp -= MAX_XP;
            state.level += 1;
            showLevelUp();
        }
        updateUI();
    }

    function showLevelUp() {
        newLevelDisplay.textContent = state.level;
        levelUpModal.classList.remove('hidden');
        fireConfetti();
    }

    function setupEventListeners() {
        feedToggleBtn.addEventListener('click', () => foodTray.classList.toggle('hidden'));
        playMenuBtn.addEventListener('click', () => {
            gamesModal.classList.remove('hidden');
            foodTray.classList.add('hidden');
        });
        closeGamesBtn.addEventListener('click', () => gamesModal.classList.add('hidden'));
        gamesModalBg.addEventListener('click', () => gamesModal.classList.add('hidden'));
        gameCards.forEach(card => card.addEventListener('click', () => {
            const gameType = card.dataset.game;
            gamesModal.classList.add('hidden');
            openMiniGame(gameType);
        }));
        exitGameBtn.addEventListener('click', closeMiniGame);
        gameClaimBtn.addEventListener('click', () => {
            const pts = parseInt(gamePointsEarned.textContent);
            state.happiness = Math.min(100, state.happiness + Math.floor(pts / 3));
            addXP(pts);
            closeMiniGame();
        });
        gameRetryBtn.addEventListener('click', () => openMiniGame(minigameTitle.dataset.type));
        closeLevelUpBtn.addEventListener('click', () => levelUpModal.classList.add('hidden'));
        puzzleRestartBtn.addEventListener('click', startPuzzleGame);
        puzzleStartBtn.addEventListener('click', () => {
            puzzleStartBtn.classList.add('hidden');
            puzzleGridContainer.classList.remove('hidden');
            setupPuzzle();
        });
    }

    // --- Feed System ---
    function setupDragAndDrop() {
        let isDragging = false;
        let foodClone = null;
        let startX, startY;
        const start = (e) => {
            e.preventDefault();
            const t = e.type.includes('touch') ? e.touches[0] : e;
            isDragging = true;
            const r = draggableFood.getBoundingClientRect();
            foodClone = draggableFood.cloneNode(true);
            Object.assign(foodClone.style, {
                position: 'fixed', left: `${r.left}px`, top: `${r.top}px`,
                width: `${r.width}px`, height: `${r.height}px`, zIndex: '2000',
                pointerEvents: 'none', opacity: '0.8'
            });
            document.body.appendChild(foodClone);
            startX = t.clientX - r.left; startY = t.clientY - r.top;
            petWrapper.classList.add('drop-target');
        };
        const move = (e) => {
            if (!isDragging || !foodClone) return;
            const t = e.type.includes('touch') ? e.touches[0] : e;
            foodClone.style.left = `${t.clientX - startX}px`;
            foodClone.style.top = `${t.clientY - startY}px`;
        };
        const end = (e) => {
            if (!isDragging) return;
            isDragging = false;
            petWrapper.classList.remove('drop-target');
            if (foodClone) {
                const t = e.type.includes('touch') ? e.changedTouches[0] : e;
                const pr = petWrapper.getBoundingClientRect();
                if (t.clientX >= pr.left && t.clientX <= pr.right && t.clientY >= pr.top && t.clientY <= pr.bottom) handleFeed();
                foodClone.remove(); foodClone = null;
            }
        };
        draggableFood.addEventListener('mousedown', start);
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        draggableFood.addEventListener('touchstart', start, {passive:false});
        document.addEventListener('touchmove', move, {passive:false});
        document.addEventListener('touchend', end);
    }

    function handleFeed() {
        if (state.isAnimating) return;
        state.hunger = Math.min(100, state.hunger + 25);
        addXP(50); updateUI();
        triggerAnimation('eat');
        spawnFloatingText(PETS[state.selectedPetId].foodEmoji, PETS[state.selectedPetId].secondary);
        setTimeout(() => foodTray.classList.add('hidden'), 500);
    }

    // --- Animations & VFX ---
    function triggerAnimation(cls) {
        state.isAnimating = true;
        petImage.classList.remove('sad', 'eat', 'playful');
        void petImage.offsetWidth;
        petImage.classList.add(cls);
        setTimeout(() => { petImage.classList.remove(cls); state.isAnimating = false; checkPetState(); }, 600);
    }

    function spawnFloatingText(txt, col) {
        const el = document.createElement('div');
        el.className = 'point-float'; el.textContent = txt; el.style.color = col;
        el.style.left = '50%'; el.style.top = '40%'; el.style.transform = 'translate(-50%, -50%)';
        animationLayer.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }

    function fireConfetti() {
        const pCount = 100;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        const p = Array.from({length:pCount}, () => ({
            x: window.innerWidth/2, y: window.innerHeight/2, dx: (Math.random()-0.5)*12, dy: (Math.random()-0.8)*18,
            r: Math.random()*6+2, col: ['#ff758c','#f6d365','#2ecc71','#4facfe','#a18cd1'][Math.floor(Math.random()*5)]
        }));
        function step() {
            confettiCtx.clearRect(0,0,window.innerWidth, window.innerHeight);
            let alive = false;
            p.forEach(f => {
                f.x += f.dx; f.y += f.dy; f.dy += 0.5;
                if(f.y < window.innerHeight) alive = true;
                confettiCtx.beginPath(); confettiCtx.fillStyle = f.col; confettiCtx.arc(f.x, f.y, f.r, 0, Math.PI*2); confettiCtx.fill();
            });
            if(alive) requestAnimationFrame(step);
        }
        step();
    }

    // --- Mini Games Hub ---
    let currentGameLoop = null;
    let minigameScore = 0;

    function openMiniGame(type) {
        minigameContainer.classList.remove('hidden');
        gameOverOverlay.classList.add('hidden');
        gameCanvas.classList.add('hidden');
        mazeControls.classList.add('hidden');
        puzzleArea.classList.add('hidden');
        gameInstructions.classList.remove('hidden');
        minigameTitle.dataset.type = type;
        const titles = { maze: 'Labirent Koşucusu', tower: 'Kule Yığma', puzzle: 'Evcil Hayvan Yapbozu' };
        minigameTitle.textContent = titles[type];
        
        startGameBtn.onclick = () => {
            gameInstructions.classList.add('hidden');
            // Ensure canvas uses correct pixel size before drawing
            resizeCanvasToDisplaySize(gameCanvas, gameCtx);
            if(type === 'maze') startMazeGame();
            else if(type === 'tower') startTowerGame();
            else if(type === 'puzzle') startPuzzleGame();
        };
    }

    function closeMiniGame() {
        if(currentGameLoop) cancelAnimationFrame(currentGameLoop);
        gameCanvas.onmousedown = null;
        gameCanvas.ontouchstart = null;
        gameCanvas.onpointerdown = null;
        window.onkeydown = null;
        minigameContainer.classList.add('hidden');
        updateUI();
    }

    function endGame(score, win = false) {
        if(currentGameLoop) cancelAnimationFrame(currentGameLoop);
        minigameScore = score;
        gameScoreValue.textContent = score;
        gamePointsEarned.textContent = Math.min(score, 300);
        gameOverOverlay.classList.remove('hidden');
        mazeControls.classList.add('hidden');
        if(win) { fireConfetti(); spawnFloatingText('ZAFER!', '#2ecc71'); }
    }

    // GAME A: MAZE RUNNER (REAL GRID-BASED)
    function startMazeGame() {
        gameCanvas.classList.remove('hidden');
        mazeControls.classList.remove('hidden');
        resizeCanvasToDisplaySize(gameCanvas, gameCtx);
        const grid = [
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,1,0,1],
            [1,1,1,1,1,0,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,1,2,1],
            [1,1,1,1,1,1,1,1,1,1,1]
        ];
        const rows = grid.length; const cols = grid[0].length;
        const cw = gameCanvas.clientWidth; const ch = gameCanvas.clientHeight;
        const cellSize = Math.min(cw/cols, ch/rows) * 0.9;
        const offsetX = (cw - cols*cellSize)/2; const offsetY = (ch - rows*cellSize)/2;
        let player = { x: 1, y: 1 };

        function draw() {
            gameCtx.clearRect(0,0,cw,ch);
            grid.forEach((row, r) => row.forEach((cell, c) => {
                const x = offsetX + c*cellSize; const y = offsetY + r*cellSize;
                if(cell === 1) { // Wall
                    gameCtx.fillStyle = '#333'; gameCtx.shadowBlur = 4; gameCtx.shadowColor = 'black';
                    gameCtx.fillRect(x,y,cellSize,cellSize);
                } else if(cell === 2) { // Goal
                    gameCtx.shadowBlur = 0; gameCtx.font = `${cellSize*0.7}px Arial`;
                    gameCtx.textAlign = 'center'; gameCtx.textBaseline = 'middle';
                    gameCtx.fillText(PETS[state.selectedPetId].foodEmoji, x+cellSize/2, y+cellSize/2);
                } else { // Path
                    gameCtx.fillStyle = '#222'; gameCtx.shadowBlur = 0;
                    gameCtx.fillRect(x,y,cellSize,cellSize);
                }
            }));
            // Player
            gameCtx.font = `${cellSize*0.8}px Arial`; gameCtx.textAlign = 'center'; gameCtx.textBaseline = 'middle';
            gameCtx.fillText(PETS[state.selectedPetId].emoji, offsetX + player.x*cellSize + cellSize/2, offsetY + player.y*cellSize + cellSize/2);

            // HUD
            gameCtx.shadowBlur = 0;
            gameCtx.textAlign = 'left';
            gameCtx.textBaseline = 'top';
            gameCtx.font = '16px Outfit';
            gameCtx.fillStyle = 'rgba(255,255,255,0.9)';
            gameCtx.fillText('Kazanmak için yemeği bul', 16, 16);
        }

        const move = (dir) => {
            let next = {x: player.x, y: player.y};
            if(dir === 'up') next.y--; else if(dir === 'down') next.y++;
            else if(dir === 'left') next.x--; else if(dir === 'right') next.x++;
            if(grid[next.y][next.x] !== 1) {
                player = next; draw();
                if(grid[player.y][player.x] === 2) endGame(250, true);
            }
        };

        mazeControls.querySelectorAll('.ctrl-btn').forEach(btn => btn.onclick = () => move(btn.dataset.dir));
        window.onkeydown = (e) => {
            const k = e.key;
            if (k === 'ArrowUp') move('up');
            else if (k === 'ArrowDown') move('down');
            else if (k === 'ArrowLeft') move('left');
            else if (k === 'ArrowRight') move('right');
        };
        draw();
    }

    // GAME B: TOWER STACK (STABLE LOGIC)
    function startTowerGame() {
        gameCanvas.classList.remove('hidden');
        resizeCanvasToDisplaySize(gameCanvas, gameCtx);
        const baseW = Math.min(140, Math.max(90, Math.floor(gameCanvas.clientWidth * 0.34)));
        const blockH = 30;
        const minW = 22;
        let blocks = [{ x: gameCanvas.clientWidth/2 - baseW/2, y: gameCanvas.clientHeight - 40, w: baseW, h: blockH }];
        let current = { x: 0, y: 50, w: baseW, h: blockH, speed: 6, dir: 1, isFalling: false };

        const drop = (e) => {
            e.preventDefault();
            if (!current.isFalling) current.isFalling = true;
        };
        gameCanvas.onmousedown = drop;
        gameCanvas.ontouchstart = drop;
        gameCanvas.onpointerdown = drop;

        function loop() {
            const cw = gameCanvas.clientWidth;
            const ch = gameCanvas.clientHeight;
            gameCtx.clearRect(0,0,cw,ch);
            blocks.forEach((b, i) => { 
                gameCtx.fillStyle = `hsl(${200 + i*15}, 70%, 60%)`;
                gameCtx.fillRect(b.x, b.y, b.w, b.h);
                gameCtx.strokeStyle = 'white'; gameCtx.strokeRect(b.x, b.y, b.w, b.h);
            });

            if(!current.isFalling) {
                current.x += current.speed * current.dir;
                if(current.x + current.w > cw || current.x < 0) current.dir *= -1;
            } else {
                current.y += 15;
                const last = blocks[blocks.length-1];
                if(current.y + current.h >= last.y) {
                    current.isFalling = false;
                    // Compute overlap and shrink the next block accordingly
                    const overlapLeft = Math.max(current.x, last.x);
                    const overlapRight = Math.min(current.x + current.w, last.x + last.w);
                    const overlapW = overlapRight - overlapLeft;

                    if (overlapW < minW) { endGame(minigameScore); return; }

                    blocks.push({ x: overlapLeft, y: last.y - blockH, w: overlapW, h: blockH });
                    addScore(Math.round(overlapW)); // reward tighter stacks

                    // Prepare next moving block with new width
                    current = {
                        x: 0,
                        y: 50,
                        w: overlapW,
                        h: blockH,
                        speed: Math.min(11, current.speed + 0.35),
                        dir: current.dir,
                        isFalling: false
                    };

                    if (blocks.length > 8) blocks.forEach(b => b.y += blockH);
                }
            }
            gameCtx.fillStyle = '#ff758c'; gameCtx.fillRect(current.x, current.y, current.w, current.h);
            gameCtx.font = '24px Outfit'; gameCtx.fillStyle = 'white'; gameCtx.fillText(`Kule: ${blocks.length-1}`, 20, 40);
            currentGameLoop = requestAnimationFrame(loop);
        }
        function addScore(s) { minigameScore += s; spawnFloatingText(`+${s}`, 'cyan'); }
        loop();
    }

    // GAME C: PET PUZZLE (SLICED DRAG & DROP)
    function startPuzzleGame() {
        puzzleArea.classList.remove('hidden');
        puzzleGrid.innerHTML = ''; puzzlePiecesBench.innerHTML = '';
        puzzlePreviewOverlay.textContent = PETS[state.selectedPetId].emoji;
        
        puzzlePreviewContainer.classList.remove('hidden');
        puzzleGridContainer.classList.add('hidden');
        puzzleStartBtn.classList.remove('hidden');
    }

    function setupPuzzle() {
        const pet = PETS[state.selectedPetId];
        const size = 3; let pieces = [];
        const gridRect = puzzleGrid.getBoundingClientRect();
        const gap = parseFloat(getComputedStyle(puzzleGrid).gap || '8') || 8;
        const pieceSize = Math.floor((gridRect.width - gap * (size - 1)) / size);
        
        // Create Slots & Correct Pieces
        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                const idx = r * size + c;
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot'; slot.dataset.idx = idx;
                puzzleGrid.appendChild(slot);
                
                // Create Piece representation (offset emoji)
                const piece = createPuzzlePiece(pet.emoji, r, c, idx, pieceSize, size);
                pieces.push(piece);
            }
        }

        // Shuffle and place in bench
        pieces.sort(() => Math.random() - 0.5).forEach(p => puzzlePiecesBench.appendChild(p));

        // Drag and Drop implementation
        puzzleGrid.querySelectorAll('.puzzle-slot').forEach(slot => {
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text');
                if(slot.dataset.idx === id) snapPiece(id, slot);
            });
        });
    }

    function createPuzzlePiece(emoji, r, c, id, pieceSize, size) {
        const p = document.createElement('div');
        p.className = 'draggable-piece'; p.dataset.id = id;
        p.draggable = true;
        
        // Use a container and style it to show only a part of the emoji
        // This is tricky with characters, so we'll use a styled approach:
        p.style.overflow = 'hidden';
        const inner = document.createElement('div');
        inner.textContent = emoji;
        const sheetSize = pieceSize * size;
        inner.style.fontSize = `${sheetSize}px`;
        inner.style.width = `${sheetSize}px`; inner.style.height = `${sheetSize}px`;
        inner.style.position = 'absolute';
        inner.style.left = `-${c * pieceSize}px`; inner.style.top = `-${r * pieceSize}px`;
        inner.style.pointerEvents = 'none';
        p.appendChild(inner);

        p.addEventListener('dragstart', e => e.dataTransfer.setData('text', id));
        p.addEventListener('touchstart', handlePieceTouchStart, {passive:false});
        return p;
    }

    function snapPiece(id, slot) {
        const p = document.querySelector(`.draggable-piece[data-id="${id}"]`);
        if(!p) return;
        p.classList.add('placed'); p.draggable = false;
        slot.appendChild(p); minigameScore += 50;
        if(puzzlePiecesBench.children.length === 0) endGame(450, true);
    }

    let activeP = null;
    function handlePieceTouchStart(e) {
        e.preventDefault(); activeP = e.target.classList.contains('draggable-piece') ? e.target : e.target.parentNode;
        document.addEventListener('touchmove', handlePieceTouchMove, {passive:false});
        document.addEventListener('touchend', handlePieceTouchEnd);
    }
    function handlePieceTouchMove(e) {
        if(!activeP) return; const t = e.touches[0];
        activeP.style.position = 'fixed'; activeP.style.zIndex = '3000';
        activeP.style.left = `${t.clientX - 40}px`; activeP.style.top = `${t.clientY - 40}px`;
    }
    function handlePieceTouchEnd(e) {
        if(!activeP) return; const t = e.changedTouches[0];
        let snapped = false;
        puzzleGrid.querySelectorAll('.puzzle-slot').forEach(slot => {
            const r = slot.getBoundingClientRect();
            if(t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom) {
                if(slot.dataset.idx === activeP.dataset.id) { snapped = true; snapPiece(activeP.dataset.id, slot); }
            }
        });
        if(!snapped) activeP.style.position = 'static';
        activeP = null;
        document.removeEventListener('touchmove', handlePieceTouchMove);
        document.removeEventListener('touchend', handlePieceTouchEnd);
    }

    init();
});
