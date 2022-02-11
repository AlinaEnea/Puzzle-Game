// clasa imageBlock
function imageBlock(num, x, y) {
  // Public Variables (sometimes called properties)
  this.x = x;
  this.y = y;
  this.num = num;
  this.isSelected = 0; // 0 for false, 1 for true
}

// clasa puzzle

function puzzle(canvasID, imageID, rows, cols) {
  //constante

  var TOTAL_ROWS = rows;
  var TOTAL_COLS = cols;
  var TOTAL_PIECES = TOTAL_ROWS * TOTAL_COLS;

  var MAIN_IMG_WIDTH = 600;
  var MAIN_IMG_HEIGHT = 400;
  var IMG_WIDTH = Math.round(MAIN_IMG_WIDTH / TOTAL_COLS); // round() return o valoare rotunjita
  var IMG_HEIGHT = Math.round(MAIN_IMG_HEIGHT / TOTAL_ROWS);

  var BLOCK_IMG_WIDTH = 600;
  var BLOCK_IMG_HEIGHT = 450;
  var BLOCK_WIDTH = 0;
  var BLOCK_HEIGHT = 0;

  //variabile private
  var theImage;
  var canvas;
  var ctx;

  //variabile pentru onFinished si clearGame
  var interval = null;
  var removeWidth;
  var removeHeight;

  // Variabila va fi folosită pentru a face obiectul disponibil pentru
  // funcțiile private ale clasei
  var myThis = this;

  //variabile publice
  this.canvasID = canvasID;
  this.imageID = imageID;

  this.top = 0;
  this.left = 0;

  this.imageBlockList = new Array();
  this.blockList = new Array();

  this.selectedBlock = null;

  this.initDrawing = function () {
    theImage = document.getElementById(imageID);
    canvas = document.getElementById(canvasID);
    ctx = canvas.getContext("2d");

    // Setare event handlere
    canvas.onmousedown = handleOnMouseDown;
    canvas.onmouseup = handleOnMouseUp;
    canvas.onmouseout = handleOnMouseOut;
    canvas.onmousemove = handleOnMouseMove;

    selectedBlock = null;

    initializeNewGame();
  };

  function initializeNewGame() {
    BLOCK_WIDTH = Math.round(BLOCK_IMG_WIDTH / TOTAL_COLS);
    BLOCK_HEIGHT = Math.round(BLOCK_IMG_HEIGHT / TOTAL_ROWS);

    // Draw image
    setImageBlock();
    drawGame();
  }

  this.showPreview = function () {
    var x1 = 20;
    var y1 = 20;
    var width = BLOCK_IMG_WIDTH - x1 * 2;
    var height = BLOCK_IMG_HEIGHT - y1 * 2;

    ctx.save();

    ctx.drawImage(
      theImage,
      0,
      0,
      MAIN_IMG_WIDTH,
      MAIN_IMG_HEIGHT,
      x1,
      y1,
      width,
      height
    );

    //Desenare dreptunghi
    ctx.fillStyle = "#cce";
    ctx.strokeStyle = "#a46";
    ctx.lineWidth = 4;
    ctx.strokeRect(x1 - 2, y1 - 2, width + 4, height + 4);
    ctx.restore();
  };

  function drawGame() {
    clear(ctx);
    drawLines();
    drawAllImages();
    if (selectedBlock) {
      drawImageBlock(selectedBlock);
    }
  }
  function setImageBlock() {
    var total = TOTAL_PIECES;
    imageBlockList = new Array();
    blockList = new Array();

    var x1 = BLOCK_IMG_WIDTH + 20;
    var x2 = canvas.width - 50;
    var y2 = BLOCK_IMG_HEIGHT;
    for (var i = 0; i < total; i++) {
      var randomX = getRandVal(x1, x2, 2);
      var randomY = getRandVal(0, y2, 2);
      var imgBlock = new imageBlock(i, randomX, randomY);

      imageBlockList.push(imgBlock);

      var x = (i % TOTAL_COLS) * BLOCK_WIDTH;
      var y = Math.floor(i / TOTAL_COLS) * BLOCK_HEIGHT;

      var block = new imageBlock(i, x, y);
      blockList.push(block);
    }
  }
  function drawLines() {
    ctx.strokeStyle = "#e9e9e9";
    ctx.lineWidth = 1;
    ctx.beginPath();

    // desenare linii verticale
    for (var i = 0; i <= TOTAL_COLS; i++) {
      var x = BLOCK_WIDTH * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 450);
    }
    // desenare linii orizontale
    for (var i = 0; i <= TOTAL_ROWS; i++) {
      var y = BLOCK_HEIGHT * i;
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawAllImages() {
    for (var i = 0; i < imageBlockList.length; i++) {
      var imgBlock = imageBlockList[i];
      if (imgBlock.isSelected == false) {
        drawImageBlock(imgBlock);
      }
    }
  }

  function drawImageBlock(imgBlock) {
    drawFinalImage(
      imgBlock.num,
      imgBlock.x,
      imgBlock.y,
      BLOCK_WIDTH,
      BLOCK_HEIGHT
    );
  }

  function drawFinalImage(index, destX, destY, destWidth, destHeight) {
    ctx.save();

    var srcX = (index % TOTAL_COLS) * IMG_WIDTH;
    var srcY = Math.floor(index / TOTAL_COLS) * IMG_HEIGHT;

    ctx.drawImage(
      theImage,
      srcX,
      srcY,
      IMG_WIDTH,
      IMG_HEIGHT,
      destX,
      destY,
      destWidth,
      destHeight
    );

    ctx.restore();
  }

  function drawImage(image) {
    ctx.save();
    ctx.drawImage(
      image,
      0,
      0,
      BLOCK_WIDTH,
      BLOCK_WIDTH,
      10,
      10,
      BLOCK_WIDTH,
      BLOCK_WIDTH
    );
    ctx.restore();
  }

  function onFinished() {
    var audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "sunete/applause.mp3");
    audioElement.play();
    removeWidth = BLOCK_WIDTH;
    removeHeight = BLOCK_HEIGHT;

    // Stergere bord
    interval = setInterval(function () {
      myThis.clearGame();
    }, 120);
  }

  this.clearGame = function () {
    //   alert("f");
    removeWidth -= 30;
    removeHeight -= 20;

    if (removeWidth > 0 && removeHeight > 0) {
      clear(ctx);
      for (var i = 0; i < imageBlockList.length; i++) {
        var imgBlock = imageBlockList[i];

        imgBlock.x += 10;
        imgBlock.y += 10;

        drawFinalImage(
          imgBlock.num,
          imgBlock.x,
          imgBlock.y,
          removeWidth,
          removeHeight
        );
      }
    } else {
      clearInterval(interval);
      // Restart game
      initializeNewGame();
    }
  };

  //Event Hendlere
  function handleOnMouseOut(e) {
    //sterge selectare anterioara
    if (selectedBlock != null) {
      imageBlockList[selectedBlock.num].isSelected = false;
      selectedBlock = null;
      drawGame();
    }
  }
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(
        ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
      ),
      y: Math.round(
        ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
      ),
    };
  }
  function handleOnMouseDown(e) {
    // stergere bloc selectat anterior
    if (selectedBlock != null) {
      imageBlockList[selectedBlock.num].isSelected = false;
    }

    var mousePos = getMousePos(canvas, e);
    selectedBlock = getImageBlock(imageBlockList, mousePos.x, mousePos.y);
    if (selectedBlock) {
      imageBlockList[selectedBlock.num].isSelected = true;
    }
  }

  function handleOnMouseUp(e) {
    if (selectedBlock) {
      var index = selectedBlock.num;

      var mousePos = getMousePos(canvas, e);
      var block = getImageBlock(blockList, mousePos.x, mousePos.y);
      if (block) {
        var blockOldImage = getImageBlockOnEqual(
          imageBlockList,
          block.x,
          block.y
        );
        if (blockOldImage == null) {
          imageBlockList[index].x = block.x;
          imageBlockList[index].y = block.y;
        }
      } else {
        imageBlockList[index].x = selectedBlock.x;
        imageBlockList[index].y = selectedBlock.y;
      }

      imageBlockList[index].isSelected = false;
      selectedBlock = null;
      drawGame();

      if (isFinished()) {
        onFinished();
      }
    }
  }

  function handleOnMouseMove(e) {
    if (selectedBlock) {
      var mousePos = getMousePos(canvas, e); // do not use e.pageX and e.pageY
      selectedBlock.x = mousePos.x - 30; // offset drag pt from upper left corner
      selectedBlock.y = mousePos.y - 30;
      drawGame();
    }
  }

  //functii ajutatoare
  function clear(c) {
    c.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getRandVal(minVal, maxVal, floatVal) {
    var randVal = minVal + Math.random() * (maxVal - minVal);
    var val =
      typeof floatVal == "undefined"
        ? Math.round(randVal)
        : randVal.toFixed(floatVal);
    return Math.round(val);
  }

  function getImageBlock(list, x, y) {
    for (var i = list.length - 1; i >= 0; i--) {
      var imgBlock = list[i];
      var x1 = imgBlock.x;
      var x2 = x1 + BLOCK_WIDTH;
      var y1 = imgBlock.y;
      var y2 = y1 + BLOCK_HEIGHT;

      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        var img = new imageBlock(imgBlock.num, imgBlock.x, imgBlock.y);
        return img;
      }
    }
    return null;
  }
  function getImageBlockOnEqual(list, x, y) {
    for (var i = 0; i < list.length; i++) {
      var imgBlock = list[i];
      var x1 = imgBlock.x;
      var y1 = imgBlock.y;
      if (x == x1 && y == y1) {
        var img = new imageBlock(imgBlock.num, imgBlock.x, imgBlock.y);
        return img;
      }
    }
    return null;
  }
  function isFinished() {
    var total = TOTAL_PIECES;

    for (var i = 0; i < total; i++) {
      var img = imageBlockList[i];
      var block = blockList[i];

      if (img.x != block.x || img.y != block.y) {
        return false;
      }
    }
    return true;
  }
}

//theGame-  este un obiect singleton-permite un singur punct de intrare pentru a crea noua instanta a clasei(pentru controlul resurselor)
var theGame = {
  //pseudo-constante
  CANVAS_NAME: "PuzzleGameCanvas", //id-ul canvas din html
  RADIOBUTN01: "radio1", // radio button id din html
  RADIOBUTN02: "radio2", // radio button id din html
  RADIOBUTN03: "radio3", // radio button id din html
  //Variabile
  game: null,
  imageID: "img1",
  totalRows: 3,
  totalColumns: 3,

  //Functii
  InitGame: function () {
    theGame.LoadNewImage(this.imageID);
  },
  LoadNewImage: function (imgID) {
    this.imageID = imgID;

    theGame.SetRowsColumn();

    theGame.LoadGame();
  },
  LoadGame: function () {
    this.game = new puzzle(
      this.CANVAS_NAME,
      this.imageID,
      this.totalRows,
      this.totalColumns
    );

    this.game.initDrawing();
  },

  ShowPreview: function () {
    if (this.game) {
      // != null
      this.game.showPreview();
    }
  },

  SetRowsColumn: function () {
    var r1 = document.getElementById(this.RADIOBUTN01); // usor
    var r2 = document.getElementById(this.RADIOBUTN02); // mediu
    var r3 = document.getElementById(this.RADIOBUTN03); // greu

    if (r1.checked) {
      this.totalRows = 2;
      this.totalColumns = 2;
    } else if (r2.checked) {
      this.totalRows = 3;
      this.totalColumns = 3;
    } else if (r3.checked) {
      this.totalRows = 4;
      this.totalColumns = 4;
    } else {
      console.log("ERROR SetRowsColumn() - no radio buttons checked/detected");
    }
  },
};
window.onload = function () {
  // Initializare si incepere joc
  theGame.InitGame();
};
