const breakpoints = {
    lg: 1280,
    md: 768,
    sm: 480
}

let row = 3,
    heightContainer,
    //heightContainer = window.innerHeight * 0.05,
    counts = row * row,
    widthBlock = 7,
    padding = 0.5;
let numbers;
let timeCounter = 0;
let moveCounter = 0;
let numberScore = 1;
let itemScore = [];
let currentType = 'nmb';
let min = 0;
let maxImg = 151;
let minImg = 1;
let image = 1;
let win = false;
let isAudio = true;
let timeOut;
let tableScore;
let container;
windowResize();
createContainer();
createMenuPage();
const menuContainer = document.querySelector('.menuContainer');
const gameButton = document.getElementById('gameButton');
const option = document.querySelector('.optionField');
const settingButton = document.getElementById('settingButton');
const recordsButton = document.getElementById('recordsButton');
const mainContainer = document.querySelector('.mainContainer');
const timeAndMove = document.querySelector('.timeAndMove');
const restart_btn = document.querySelector('.restart-btn');
const timers = document.querySelector('.timer');
const audio = document.querySelector('.audio');
const setAudio = document.querySelector('.setAudio');
const move = document.querySelector('.move');
const saveGame = document.querySelector('.save-btn');
const scoreBtn = document.querySelector('.score-btn');
const scoreTable = document.querySelector('.score-table');
const scoreTableOverlay = document.querySelector('.overlay-table');
const winDivOverlay = document.querySelector('.winDivoverlay');
const scoreClose = document.querySelector('.scoreClose');
const fieldSetBtn = document.querySelector('.fieldSet-btn');
const fieldSetDiv = document.querySelector('.fieldSetDiv');
const fieldSetDivOverlay = document.querySelector('.overlay-fieldSet');
const winBtnMenu = document.getElementById('winButtonMenu');
const winBtnNewGame = document.getElementById('winButtonNewGame');

function init() {
    initTableScore();
    if (localStorage.getItem('currentField') === null) {
        numbers = randomNumbers();
        image = selectImage();
        if (continueGame) {
            continueGame.style.pointerEvents = 'none';
            continueGame.style.backgroundColor = '#ec988ba3';
        }
        currentType = localStorage.getItem('currentType') || 'nmb';
        image = Number(localStorage.getItem('currentImage'));
        const rowNum = localStorage.getItem('currentSize'); // если приходит null, чтобы не преобразовывать в 0
        row = Number(rowNum ? rowNum : 4);
    } else {
        numbers = JSON.parse(localStorage.getItem('currentField'));
        moveCounter = localStorage.getItem('currentMove');
        move.innerHTML = moveCounter;
        min = localStorage.getItem('currentMin');
        timeCounter = localStorage.getItem('currentSec');
        isAudio = JSON.parse(localStorage.getItem('currentAudio'));
        if (continueGame) {
            continueGame.style.backgroundColor = '#e84a31'
            continueGame.style.pointerEvents = 'auto'
        }
        currentType = localStorage.getItem('currentType');
        row = Number(localStorage.getItem('currentSize'));
        image = Number(localStorage.getItem('currentImage'));
    }
    renderField();
    timer();
}

function initTableScore() {
    tableScore = JSON.parse(localStorage.getItem('currentTableScore')) || [];
}

function randomNumbers() {
/* return [
             [1, 2, 3, 4],
             [5, 6, 7, 8],
             [9, 10, 11, 12],
             [13, 14, 0, 15]
         ]; */
    const numbersCount = (row * row) - 1;
    let numbers = [];
    for (let i = 0; i <= numbersCount; i++) {
        numbers[i] = i;
    }
    const size = row;
    let subArray = [];

    function random(n) {
        return Math.floor(Math.random() * Math.floor(n));
    }

    function shuffle(arr) {
        for (var i = 0; i < arr.length; i++) {
            var j = random(arr.length);
            var k = random(arr.length);
            var t = arr[j];
            arr[j] = arr[k];
            arr[k] = t;
        }
        return arr;
    };
    numbers = shuffle(numbers);
    for (let i = 0; i < Math.ceil(numbers.length / size); i++) {
        subArray[i] = numbers.slice((i * size), (i * size) + size);
    }
    numbers = subArray;
    return numbers;
}

function renderFieldNumber() {
    const width = (heightContainer - (padding * (row + 1))) / row;
    container.innerHTML = '';
    for (let y = 0; y < numbers.length; y++) {
        for (let x = 0; x < numbers[y].length; x++) {
            let div = document.createElement('div');
            let circle = document.createElement('div');
            if (numbers[y][x] !== 0) {
                div.setAttribute('data-x', x);
                div.setAttribute('data-y', y);
                div.addEventListener('click', clickBlock)
                div.classList.add('oneBlock');
                circle.classList.add('circle');
                circle.textContent = numbers[y][x];
                div.appendChild(circle);
                div.style.width = `${width}rem`;
                div.style.height = `${width}rem`;
                div.style.top = `${padding + (width+padding)*y}rem`;
                div.style.left = `${padding + (width+padding)*x}rem`;
                container.appendChild(div);
            }
        }
    }
}

function renderField() {
    if (currentType === 'img') {
        renderFieldImg()
    } else {
        renderFieldNumber()
    }
}

function renderFieldImg() {
    const width = (heightContainer - (padding * (row + 1))) / row;
    container.innerHTML = '';
    for (let y = 0; y < numbers.length; y++) {
        for (let x = 0; x < numbers[y].length; x++) {
            let div = document.createElement('div');
            div.style.backgroundImage = `url(assets/images/puzzle-image/${image}.jpg)`;
            div.style.backgroundSize = `${heightContainer}rem`
            div.style.backgroundPosition = 'top left';

            if (numbers[y][x] !== 0) {
                div.setAttribute('data-x', x);
                div.setAttribute('data-y', y);
                div.addEventListener('click', clickBlock)
                div.classList.add('oneBlock');
                div.textContent = numbers[y][x];
                div.style.width = `${width}rem`;
                div.style.height = `${width}rem`;
                const posY = Math.floor((numbers[y][x] - 1) / row);
                const posX = Math.floor((numbers[y][x] - 1) % row);;
                div.style.backgroundPositionY = `-${padding + (width+padding)*posY}rem`;
                div.style.backgroundPositionX = `-${padding + (width+padding)*posX}rem`;
                div.style.top = `${padding + (width+padding)*y}rem`;
                div.style.left = `${padding + (width+padding)*x}rem`;
                container.appendChild(div);
            }
        }
    }
}

function selectImage() {
    let image = Math.floor(Math.random() * (maxImg - minImg)) + minImg;
    return image;
}

function clickBlock() {
    const width = (heightContainer - (padding * (row + 1))) / row;
    const x = Number(this.getAttribute('data-x'));
    const y = Number(this.getAttribute('data-y'));
    if (numbers[y - 1] && numbers[y - 1][x] === 0) {
        //top
        numbers[y - 1][x] = numbers[y][x];
        numbers[y][x] = 0;
        this.style.top = `${(padding + (width+padding)*y)-(width+padding)}rem`;
        this.setAttribute('data-y', y - 1);
        move.innerHTML = ++moveCounter;

    }
    if (numbers[y + 1] !== undefined && numbers[y + 1][x] === 0) {
        //bottom
        numbers[y + 1][x] = numbers[y][x];
        numbers[y][x] = 0;
        this.style.top = `${(padding + (width+padding)*y)+(width+padding)}rem`;
        this.setAttribute('data-y', y + 1);
        move.innerHTML = ++moveCounter;

    }
    if (numbers[x] && numbers[y][x + 1] === 0) {
        //right
        numbers[y][x + 1] = numbers[y][x];
        numbers[y][x] = 0;
        this.style.left = `${(padding + (width+padding)*x)+(width+padding)}rem`;
        this.setAttribute('data-x', x + 1);
        move.innerHTML = ++moveCounter;

    }
    if (numbers[x] && numbers[y][x - 1] === 0) {
        //left
        numbers[y][x - 1] = numbers[y][x];
        numbers[y][x] = 0;
        this.style.left = `${(padding + (width+padding)*x)-(width+padding)}rem`;
        this.setAttribute('data-x', x - 1);
        move.innerHTML = ++moveCounter;
    }
    audioKey();
    youWin();
}

function youWin() {
    const numbersWin = (row * row) - 1;
    const youCombination = numbers.flat();
    for (let i = 1; i <= numbersWin; i++) {
        if (i !== youCombination[i - 1]) {
            return
        }
    }
    win = true;
    if (win && youCombination[youCombination.length - 1] === 0) {
        scoreTableSave();
        createWinAlert();
    }
}

function createWinAlert() {
    let winDivOverlay = document.createElement('div');
    winDivOverlay.classList.add('winDivOverlay');
    mainContainer.appendChild(winDivOverlay);
    let winDiv = document.createElement('div');
    winDiv.classList.add('winDiv');
    winDivOverlay.appendChild(winDiv);
    let winMessage = document.createElement('div');
    winMessage.id = 'winMessage';
    winDiv.appendChild(winMessage);
    winMessage.textContent = `Ура! Вы решили головоломку за ${addZero(min)}:${addZero(timeCounter)} и ${moveCounter} ходов`;
    let winButtons = document.createElement('div');
    winButtons.classList.add('winButtons');
    winDiv.appendChild(winButtons);
    let winButtonNewGame = document.createElement('button');
    winButtonNewGame.id = 'winButtonNewGame';
    winButtons.appendChild(winButtonNewGame);
    winButtonNewGame.innerHTML = 'NEW GAME';
    let winButtonMenu = document.createElement('button');
    winButtonMenu.id = 'winButtonMenu';
    winButtonMenu.innerHTML = 'MENU';
    winButtons.appendChild(winButtonMenu);
    winDivOverlay.style.visibility = 'visible';
    winDiv.style.visibility = 'visible';
    winDiv.style.opacity = '1';
    winButtonMenu.addEventListener('click', function () {
        winDivOverlay.style.visibility = 'hidden';
        winDiv.style.visibility = 'hidden';
        winDiv.style.opacity = '0';
        menuContainer.style.display = 'flex';
    mainContainer.style.display = 'none';
    });
    winButtonNewGame.addEventListener('click', function () {
        winDivOverlay.style.visibility = 'hidden';
        winDiv.style.visibility = 'hidden';
        winDiv.style.opacity = '0';
        restart();
    })

}

function scoreTableSave() {
    const scoreTableItem = {
        min: addZero(min),
        sec: addZero(timeCounter),
        moveCounter
    }

    localStorage.setItem('scoreTableItem', JSON.stringify(scoreTableItem));
    localStorage.setItem('currentTableScore', JSON.stringify([...tableScore, scoreTableItem]));
    initTableScore();
}

function pressScore() {
    storageGame()
    scoreTableOverlay.style.visibility = 'visible';
    scoreTable.style.visibility = 'visible';
    scoreTable.style.opacity = '1';
    renderScoreList()
}

function renderScoreList() {
    scoreTable.innerHTML = '';
    let score = JSON.parse(localStorage.getItem('currentTableScore')) || [];
    score = score.sort((a, b) => a.moveCounter > b.moveCounter ? 1 : -1)
    score = score.sort((a, b) => (a.moveCounter === b.moveCounter && a.min < b.min) ? 1 : -1)
    score = score.sort((a, b) => (a.moveCounter === b.moveCounter && a.min === b.min && a.sec > b.sec) ? 1 : -1)
    let scoreH2 = document.createElement('h2');
    scoreTable.appendChild(scoreH2);
    scoreH2.innerText = 'TOP 10 (sorted of numbers of moves)'
    let scorePositionOl = document.createElement('ol');
    scoreTable.appendChild(scorePositionOl);
    scorePositionOl.classList.add('scoreList')
    scoreTable.appendChild(scorePositionOl);
    buttonClose(scoreTable)
    const cuttedScore = score.slice(0, 10)
    for (let i = 0; i < cuttedScore.length; i++) {
        let text = cuttedScore[i];
        let scorePositionLi = document.createElement('li');
        scorePositionOl.appendChild(scorePositionLi);
        scorePositionLi.innerHTML = `${text.min}:${text.sec} and ${text.moveCounter} moves`;
    }

}

function buttonClose(div) {
    let scoreClose = document.createElement('div');
    scoreClose.classList.add('scoreClose');
    div.appendChild(scoreClose);
    scoreClose.addEventListener('click', function () {
        scoreTableOverlay.style.visibility = 'hidden';
        fieldSetDivOverlay.style.visibility = 'hidden';
        div.style.visibility = 'hidden';
        div.style.opacity = '0';
        init();
    })
}

function overlayPress() {
    body.style.overflow = 'initial';
    scoreTableOverlay.style.visibility = 'hidden';
    fieldSetDivOverlay.style.visibility = 'hidden';
    fieldSetDiv.style.visibility = 'hidden';
    fieldSetDiv.style.opacity = '0';
    scoreTable.style.visibility = 'hidden';
    scoreTable.style.opacity = '0';
    init();
}

function storageGame() {
    const storageField = localStorage.getItem('currentField');
    localStorage.setItem('currentField', JSON.stringify(numbers));
    const storageMove = localStorage.getItem('currentMove');
    localStorage.setItem('currentMove', moveCounter);
    const storageMin = localStorage.getItem('currentMin');
    localStorage.setItem('currentMin', min);
    const storageSec = localStorage.getItem('currentSec');
    localStorage.setItem('currentSec', timeCounter);
    const storageAudioSet = localStorage.getItem('currentAudio');
    localStorage.setItem('currentAudio', isAudio);
    const storageType = localStorage.getItem('currentType');
    localStorage.setItem('currentType', currentType);
    const storageSize = localStorage.getItem('currentSize');
    localStorage.setItem('currentSize', row);
    const storageImage = localStorage.getItem('currentImage');
    localStorage.setItem('currentImage', image);
}

function audioKey() {
    if (isAudio) {
        let audio = new Audio('assets/audio.mp3');
        audio.play();
    }
}

function toggleAudio() {
    isAudio = !isAudio;
    (isAudio) 
        ? audio.style.backgroundImage = 'url(assets/images/musical-note.svg)'
        : audio.style.backgroundImage = 'url(assets/images/mute.svg)';
}

function restart() {
    numbers = randomNumbers();
    image = selectImage();
    moveCounter = 0;
    move.innerHTML = moveCounter;
    localStorage.removeItem('currentField')
    localStorage.removeItem('currentMove')
    localStorage.removeItem('currentMin')
    localStorage.removeItem('currentSec')
    renderField();
    timeCounter = 0;
    min = 0;
    win = false;
    clearInterval(timeOut)
    timer();
}

function pressSetting() {
    fieldSetDiv.style.visibility = 'visible';
    fieldSetDivOverlay.style.visibility = 'visible';
    fieldSetDiv.style.opacity = '1';
    init()
}

function createSettingContainer() {
    fieldSetDiv.innerHTML = '';
    let settingH2 = document.createElement('h2');
    let setDiv = document.createElement('div');
    settingH2.classList.add('setting-name');
    fieldSetDiv.appendChild(settingH2);
    setDiv.classList.add('settings-container');
    fieldSetDiv.appendChild(setDiv);
    settingH2.innerHTML = 'SETTINGS';
    buttonClose(fieldSetDiv);
    let selectFormat = document.createElement('div');

    selectFormat.classList.add('format-container');
    setDiv.appendChild(selectFormat);
    let labelImg = document.createElement('label');
    labelImg.classList.add('labelImg');
    labelImg.innerHTML = 'image';
    selectFormat.appendChild(labelImg);
    let selectImg = document.createElement('input');
    selectImg.classList.add('selectImg');
    selectImg.setAttribute('type', 'radio');
    selectImg.setAttribute('name', 'selectType');
    selectImg.setAttribute('value', 'img');
    selectImg.checked = (currentType === 'img');
    labelImg.appendChild(selectImg);
    let labelNumber = document.createElement('label');
    labelNumber.classList.add('labelNumber');
    labelNumber.innerHTML = 'number';
    selectFormat.appendChild(labelNumber);
    let selectNumber = document.createElement('input');
    selectNumber.classList.add('selectNumber');
    selectNumber.setAttribute('type', 'radio');
    selectNumber.setAttribute('name', 'selectType');
    selectNumber.setAttribute('value', 'nmb');
    selectNumber.checked = (currentType === 'nmb') 
    labelNumber.appendChild(selectNumber);
    let selectDiv = document.createElement('div');
    selectDiv.classList.add('select-container');
    setDiv.appendChild(selectDiv);
    let select = document.createElement('select');
    select.setAttribute('name', 'selectFieldSize');
    select.setAttribute('id', 'formSelectField');
    let selectLabel = document.createElement('label');
    selectDiv.appendChild(selectLabel);
    selectLabel.setAttribute('for', 'selectFieldSize');
    selectLabel.innerHTML = 'Размер поля';
    selectDiv.appendChild(select);
    for (let i = 3; i < 8; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.classList.add('optionField');
        option.innerHTML = `${i}x${i}`;
        select.appendChild(option);
        option.selected = (i === row)
        
    }

    let soundContainer = document.createElement('div');
    soundContainer.classList.add('soundContainer');
    setDiv.appendChild(soundContainer);
    let soundLabel = document.createElement('p');
    soundContainer.appendChild(soundLabel);
    soundLabel.innerHTML = 'Звук передвижения костяшек';
    let setAudio = document.createElement('button');
    setAudio.classList.add('setAudio', 'btn-min');
    (isAudio) 
        ? setAudio.style.backgroundImage = 'url(assets/images/musical-note.svg)'
        : setAudio.style.backgroundImage = 'url(assets/images/mute.svg)'
    soundContainer.appendChild(setAudio);
    setAudio.addEventListener('click', function () {
        toggleAudio();
        (isAudio) 
            ? setAudio.style.backgroundImage = 'url(assets/images/musical-note.svg)'
            : setAudio.style.backgroundImage = 'url(assets/images/mute.svg)';

    });
    let button = document.createElement('button');
    button.setAttribute('id', 'formSend');
    setDiv.appendChild(button);
    button.innerHTML = 'Применить';
    button.addEventListener('click', sform)

}

function sform() {
    let e = document.getElementById('formSelectField');
    let type = document.getElementsByName('selectType');
    for (let i = 0; i < type.length; i++) {
        if (type[i].checked) {
            currentType = type[i].value;
        }
    }
    let value = e.value;
    row = Number(value);
    renderField();
    storageGame();
    fieldSetDivOverlay.style.visibility = 'hidden';
    fieldSetDiv.style.visibility = 'hidden';
    fieldSetDiv.style.opacity = '0';

    restart();
    init();
}

function createMenuPage() {
    let menuContainer = document.createElement('div');
    let listContainer = document.createElement('div');
    let menuList = document.createElement('ul');
    let game = document.createElement('li');
    let continueGame = document.createElement('li');
    let setting = document.createElement('li');
    let records = document.createElement('li');
    let scoreTableDiv = document.createElement('div');
    let scoreTableOverlay = document.createElement('div');
    menuContainer.classList.add('menuContainer');
    listContainer.classList.add('listContainer');
    menuList.classList.add('menuList');
    game.id = 'gameButton';
    game.addEventListener('click', function () {
        menuContainer.style.display = 'none';
        mainContainer.style.display = 'flex';
        restart();
    });
    continueGame.id = 'continueGame';
    continueGame.addEventListener('click', function () {
        menuContainer.style.display = 'none';
        mainContainer.style.display = 'flex';
        init();
    });
    setting.id = 'settingButton';
    records.id = 'recordsButton';
    scoreTableOverlay.classList.add('overlay-table');
    scoreTableDiv.classList.add('score-table');
    document.body.appendChild(menuContainer);
    menuContainer.appendChild(listContainer);
    listContainer.appendChild(menuList);
    menuList.appendChild(continueGame);
    menuList.appendChild(game);
    menuList.appendChild(setting);
    menuList.appendChild(records);
    records.addEventListener('click', pressScore);
    document.body.appendChild(scoreTableOverlay);
    scoreTableOverlay.appendChild(scoreTableDiv);
    menuContainer.style.display = 'flex';
    continueGame.innerHTML = 'CONTINUE';
    game.innerHTML = 'NEW GAME';
    setting.innerHTML = 'SETTING';
    records.innerHTML = 'TOP 10';
    scoreTableOverlay.style.visibility = 'hidden';
    scoreTableDiv.style.visibility = 'hidden';
    scoreTableDiv.style.opacity = '0';
    let fieldSetDiv = document.createElement('div');
    let fieldSetDivOverlay = document.createElement('div');
    fieldSetDiv.classList.add('fieldSetDiv');
    document.body.appendChild(fieldSetDivOverlay);
    fieldSetDivOverlay.classList.add('overlay-fieldSet');
    fieldSetDivOverlay.appendChild(fieldSetDiv);
    fieldSetDivOverlay.style.visibility = 'hidden';
    fieldSetDiv.style.visibility = 'hidden';
    fieldSetDiv.style.opacity = '0';
    setting.addEventListener('click', function () {
        pressSetting();
        createSettingContainer();
    });

}

function createContainer() {
    let main = document.createElement('div');
    let section = document.createElement('div');
    let mainContainer = document.createElement('div');
    container = document.createElement('div');
    let timerContainer = document.createElement('div');
    let restart = document.createElement('button');
    let move = document.createElement('div');
    let audio = document.createElement('button');
    let saveField = document.createElement('button');
    let fieldSetBtn = document.createElement('button');
    let scoreBtn = document.createElement('button');
    let currentTimeAndMove = document.createElement('div');
    main.classList.add('main');
    section.classList.add('section-btn');
    restart.classList.add('restart-btn', 'btn-min');
    container.classList.add('container');
    mainContainer.classList.add('mainContainer');
    currentTimeAndMove.classList.add('timeAndMove');
    timerContainer.classList.add('timer');
    saveField.classList.add('save-btn', 'btn-min');
    audio.classList.add('audio', 'btn-min');
    scoreBtn.classList.add('score-btn', 'btn-min');
    move.classList.add('move');
    fieldSetBtn.classList.add('fieldSet-btn', 'btn-min'); //home
    currentTimeAndMove.style.visibility = 'visible';
    container.style.width = `${heightContainer}rem`;
    container.style.height = `${heightContainer}rem`;
    document.body.appendChild(mainContainer);
    mainContainer.appendChild(currentTimeAndMove);
    currentTimeAndMove.appendChild(timerContainer);
    mainContainer.appendChild(main);
    main.appendChild(container);
    mainContainer.appendChild(section);
    mainContainer.style.display = 'none'
    section.appendChild(restart);
    section.appendChild(audio);
    section.appendChild(saveField);
    section.appendChild(scoreBtn);
    section.appendChild(fieldSetBtn);
    currentTimeAndMove.appendChild(move);
    mainContainer.style.display = 'none'
    saveField.style.backgroundImage = 'url(assets/images/save.svg)';
    restart.style.backgroundImage = 'url(assets/images/circular-arrow.svg)';
    fieldSetBtn.style.backgroundImage = 'url(assets/images/home.svg)';
    isAudio = JSON.parse(localStorage.getItem('currentAudio'));
    (isAudio) ? audio.style.backgroundImage = 'url(assets/images/musical-note.svg)': audio.style.backgroundImage = 'url(assets/images/mute.svg)';
    scoreBtn.style.backgroundImage = 'url(assets/images/crown.svg)';
    move.innerHTML = moveCounter;
}

function timer() {
    clearTimeout(timeOut)
    timeCounter++;
    if (timeCounter % 60 === 0) {
        min++;
        timeCounter = 0;
    }
    timers.innerHTML = `${addZero(min)}:${addZero(timeCounter)}`;
    if (win) {
        return
    }
    timeOut = setTimeout(timer, 1000)
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function resizeField() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.width = `${heightContainer}rem`;
        container.style.height = `${heightContainer}rem`;
        renderField();
    }

}

function windowResize() {
    let width;
    if (window.innerWidth > breakpoints.lg) {
        width = 50
    }
    if (window.innerWidth > breakpoints.md && window.innerWidth <= breakpoints.lg) {
        width = 50
    }
    if (window.innerWidth > breakpoints.sm && window.innerWidth <= breakpoints.md) {
        width = 40
    }
    if (window.innerWidth < breakpoints.sm) {
        width = 30
    }
    if (heightContainer !== width) {
        heightContainer = width;
        resizeField()
    }
}

settingButton.addEventListener('click', pressSetting);
recordsButton.addEventListener('click', pressScore);
init();
restart_btn.addEventListener('click', restart);
saveGame.addEventListener('click', storageGame);
scoreBtn.addEventListener('click', pressScore)
fieldSetBtn.addEventListener('click', function () {
    storageGame();
    init();
    menuContainer.style.display = 'flex';
    mainContainer.style.display = 'none';
})
audio.addEventListener('click', function () {
    toggleAudio()
});

window.addEventListener('resize', windowResize)