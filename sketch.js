let questionTable;
let allQuestions = [];
let quizQuestions = []; // 儲存本次測驗的題目
let currentQuestionIndex = 0;
let score = 0;
let gameState = 'START'; // 遊戲狀態: START, QUESTION, FEEDBACK, RESULT

// 按鈕物件
let answerButtons = [];
let startButton, restartButton;

// 互動效果
let particles = [];
let feedbackMessage = '';
let feedbackColor;
let feedbackTimer = 0;

const NUM_QUESTIONS = 5; // 每次測驗出題數

function preload() {
  // 載入 CSV 檔案，指定 'csv' 格式 (檔案放在同一資料夾，名稱為 questions.csv)
  questionTable = loadTable('questions.csv', 'csv');
}

function setup() {
  createCanvas(800, 600);
  processData();
  setupButtons();
  setupParticles();
  startGame();
}

function draw() {
  // 極簡主題：白色背景
  background(245);

  // 移除粒子效果（如需極簡可註解掉 drawParticles）
  // drawParticles();

  // 根據不同的遊戲狀態繪製不同畫面
  switch (gameState) {
    case 'START':
      drawStartScreen();
      break;
    case 'QUESTION':
      drawQuestionScreen();
      break;
    case 'FEEDBACK':
      drawFeedbackScreen();
      break;
    case 'RESULT':
      drawResultScreen();
      break;
  }
}

// ---------------------------------
// 遊戲流程函數
// ---------------------------------

// 1. 處理CSV資料
function processData() {
  // 清空以防重複呼叫
  allQuestions = [];
  // 遍歷 CSV 的每一行
  for (let row of questionTable.getRows()) {
    allQuestions.push({
      question: row.getString(0),
      opA: row.getString(1),
      opB: row.getString(2),
      opC: row.getString(3),
      opD: row.getString(4),
      correct: row.getString(5) // 儲存 'A', 'B', 'C', or 'D'
    });
  }
}

// 2. 設定按鈕位置
function setupButtons() {
  // 開始按鈕
  startButton = { x: width / 2 - 120, y: height / 2 + 50, w: 240, h: 64, text: '開始測驗' };
  // 重新開始按鈕
  restartButton = { x: width / 2 - 120, y: height / 2 + 150, w: 240, h: 64, text: '重新開始' };

  // 四個答案按鈕（配置為兩列兩行）
  let btnW = 350;
  let btnH = 80;
  let gap = 20;
  answerButtons = [];
  answerButtons.push({ x: 40, y: 220, w: btnW, h: btnH, option: 'A' });
  answerButtons.push({ x: 40 + btnW + gap, y: 220, w: btnW, h: btnH, option: 'B' });
  answerButtons.push({ x: 40, y: 220 + btnH + gap, w: btnW, h: btnH, option: 'C' });
  answerButtons.push({ x: 40 + btnW + gap, y: 220 + btnH + gap, w: btnW, h: btnH, option: 'D' });
}

// 3. 開始或重新開始遊戲
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  // 決定本次測驗要幾題（如果題庫不足則使用題庫數）
  let n = min(NUM_QUESTIONS, allQuestions.length);
  // 隨機排序所有問題，並取出前 n 題
  quizQuestions = shuffle(allQuestions).slice(0, n);
  gameState = 'START';
}

// 4. 檢查答案
function checkAnswer(selectedOption) {
  let correctOption = quizQuestions[currentQuestionIndex].correct;

  if (selectedOption === correctOption) {
    score++;
    feedbackMessage = '答對了！';
    feedbackColor = color(0, 200, 100, 220); // 綠色
  } else {
    feedbackMessage = `答錯了... 正確答案是 ${correctOption}`;
    feedbackColor = color(200, 50, 50, 220); // 紅色
  }
  
  gameState = 'FEEDBACK';
  feedbackTimer = 90; // 顯示回饋 1.5 秒 (60fps * 1.5)
}

// 5. 進入下一題
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizQuestions.length) {
    gameState = 'RESULT';
  } else {
    gameState = 'QUESTION';
  }
}

// 6. 取得回饋用語（根據 NUM_QUESTIONS 調整）
function getFeedbackText() {
  let n = quizQuestions.length || NUM_QUESTIONS;
  let percent = Math.round((score / n) * 100);

  if (percent === 100) return '【100分】777！你是天選之人！';
  if (percent >= 80) return '【80分】猜C就滿分了，高手！';
  if (percent >= 60) return '【60分】總算及格，還可以再進步！';
  if (percent >= 40) return '【40分】路邊一條，繼續努力！';
  if (percent >= 20) return '【20分】運氣不錯，賽到一題！';
  return '【0分】回家吧，回家吧孩子，你適合回家當一坨！';
}

// ---------------------------------
// 畫面繪製函數（簡約風格）
// ---------------------------------

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  fill(30);
  textSize(40);
  text('p5.js 選擇題測驗', width / 2, height / 2 - 120);
  textSize(18);
  fill(80);
  text(`隨機抽取 ${min(NUM_QUESTIONS, allQuestions.length)} 題`, width / 2, height / 2 - 60);
  textSize(14);
  fill(120);
  text('點選「開始測驗」開始答題', width/2, height/2 - 30);

  drawButton(startButton);
}

function drawQuestionScreen() {
  if (quizQuestions.length === 0) return;
  let q = quizQuestions[currentQuestionIndex];
  let total = quizQuestions.length;

  // 題目
  textAlign(LEFT, TOP);
  fill(30);
  textSize(16);
  text(`第 ${currentQuestionIndex + 1} / ${total}`, 40, 30);
  textSize(22);
  text(q.question, 40, 70, width - 80, 120);

  // 答案按鈕
  answerButtons[0].text = 'A. ' + q.opA;
  answerButtons[1].text = 'B. ' + q.opB;
  answerButtons[2].text = 'C. ' + q.opC;
  answerButtons[3].text = 'D. ' + q.opD;

  for (let btn of answerButtons) {
    drawButton(btn);
  }

  // 分數提示
  textAlign(RIGHT, TOP);
  textSize(14);
  fill(160);
  text(`得分: ${score}`, width - 20, 20);
}

function drawFeedbackScreen() {
  // 半透明白色覆蓋
  push();
  noStroke();
  fill(255, 230);
  rect(0, 0, width, height);
  pop();

  textAlign(CENTER, CENTER);
  fill(feedbackColor);
  textSize(36);
  text(feedbackMessage, width / 2, height / 2);

  feedbackTimer--;
  if (feedbackTimer <= 0) {
    nextQuestion();
  }
}

function drawResultScreen() {
  // 動態放大回饋文字
  let percent = Math.round((score / (quizQuestions.length || NUM_QUESTIONS)) * 100);
  let feedback = getFeedbackText();
  let baseSize = 32;
  let animSize = baseSize + 12 * sin(frameCount * 0.08);

  textAlign(CENTER, CENTER);
  fill(30);
  textSize(32);
  text('測驗結束', width / 2, 120);

  textSize(28);
  fill(40, 120, 220);
  text(`成績: ${score} / ${quizQuestions.length}`, width / 2, 200);

  // 明顯且動態的回饋文字
  textSize(animSize);
  fill(percent === 100 ? color(255, 180, 0) : percent >= 60 ? color(0, 180, 80) : color(220, 40, 40));
  stroke(255);
  strokeWeight(3);
  text(feedback, width / 2, 280);
  noStroke();

  // 顯示每題正確答案摘要
  textAlign(LEFT, TOP);
  fill(120);
  textSize(13);
  let startY = 340;
  for (let i = 0; i < quizQuestions.length; i++) {
    let q = quizQuestions[i];
    text(`${i+1}. (${q.correct}) ${q.question}`, 40, startY + i * 22, width - 80, 22);
  }

  drawButton(restartButton);
}

// ---------------------------------
// 按鈕繪製（簡約風格）
// ---------------------------------
function drawButton(btn) {
  let isHover = isMouseOver(btn);

  push();
  if (isHover) {
    fill(220, 240, 255);
    stroke(80, 120, 220);
    strokeWeight(2);
    cursor(HAND);
  } else {
    fill(255);
    stroke(200);
    strokeWeight(1);
    cursor(ARROW);
  }
  rect(btn.x, btn.y, btn.w, btn.h, 8);

  fill(40);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(btn.text, btn.x + btn.w/2, btn.y + btn.h/2);
  pop();
}

// ---------------------------------
// 互動與輔助函數
// ---------------------------------

// 檢查滑鼠是否在按鈕上
function isMouseOver(btn) {
  return (mouseX > btn.x && mouseX < btn.x + btn.w &&
          mouseY > btn.y && mouseY < btn.y + btn.h);
}

// 滑鼠點擊事件
function mousePressed() {
  // 重設游標
  cursor(ARROW);

  if (gameState === 'START') {
    if (isMouseOver(startButton)) {
      gameState = 'QUESTION';
    }
  } else if (gameState === 'QUESTION') {
    for (let btn of answerButtons) {
      if (isMouseOver(btn)) {
        checkAnswer(btn.option);
        break; // 點擊後就停止檢查
      }
    }
  } else if (gameState === 'RESULT') {
    if (isMouseOver(restartButton)) {
      // 重新抽題並直接開始
      startGame();
      gameState = 'QUESTION';
    }
  }
}

// ---------------------------------
// 互動視覺效果 (背景粒子)
// ---------------------------------

function setupParticles() {
  particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.6, 0.6),
      vy: random(-0.6, 0.6),
      r: random(2, 5),
      alpha: random(40, 160)
    });
  }
}

function drawParticles() {
  for (let p of particles) {
    // 更新位置
    p.x += p.vx;
    p.y += p.vy;
    
    // 簡單吸引滑鼠效果
    let dx = mouseX - p.x;
    let dy = mouseY - p.y;
    let distSq = dx*dx + dy*dy;
    if (distSq < 40000 && distSq > 1) {
      p.x += dx * 0.0006;
      p.y += dy * 0.0006;
    }
    
    // 邊界環繞
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // 繪製
    noStroke();
    fill(255, p.alpha);
    ellipse(p.x, p.y, p.r);
  }
}
