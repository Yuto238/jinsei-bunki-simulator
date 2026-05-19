const SAVE_KEY = "jinsei_branch_sim_v2";
const TOTAL_WEEKS = 12;

const initialStats = {
  money: 50,
  time: 50,
  mind: 50,
  health: 50,
  action: 50,
  relation: 50,
  rhythm: 50,
  anxiety: 50
};

const statLabels = {
  money: "所持金",
  time: "時間",
  mind: "心の余裕",
  health: "体調",
  action: "行動力",
  relation: "人間関係",
  rhythm: "生活リズム",
  anxiety: "将来不安"
};

const stateLabelMap = {
  normal: "通常",
  tired: "疲れ",
  recovered: "回復",
  determined: "決意",
  anxious: "不安"
};

const stateImageMap = {
  normal: "assets/player-normal.png",
  tired: "assets/player-tired.png",
  recovered: "assets/player-recovered.png",
  determined: "assets/player-determined.png",
  anxious: "assets/player-anxious.png"
};

const baseDialogue = [
  "……聞こえるか。",
  "",
  "俺は、3ヶ月後のお前だ。",
  "見ての通り、だいぶ仕上がっている。",
  "悪い意味で。",
  "",
  "このままだと、",
  "休日は回復だけで消え、",
  "財布は常に軽く、",
  "スマホの通知を見るだけで心拍数が上がる。",
  "",
  "頼む。",
  "この3ヶ月だけ、選び直してくれ。"
].join("\n");

const reopenDialogue = [
  "閉じるな。",
  "俺も3ヶ月前に閉じた。",
  "その結果がこれだ。"
].join("\n");

const commands = [
  {
    id: "work",
    label: "仕事をこなす",
    delta: { money: 5, time: -8, health: -4, mind: -4, anxiety: -2 },
    message:
      "今日もなんとか仕事をこなした。\nえらい。ただし、えらさだけで疲労は相殺されない。",
    state: "tired"
  },
  {
    id: "rest",
    label: "早めに休む",
    delta: { health: 10, mind: 8, time: -2, action: -1 },
    message:
      "早めに休んだ。\n何も進んでいないようで、実はかなり進んでいる日もある。",
    state: "recovered"
  },
  {
    id: "finance",
    label: "家計を整理する",
    delta: { money: 3, anxiety: -10, mind: 3, action: 2 },
    message:
      "固定費を見た。\n現実は少し痛かったが、見ない現実よりはだいぶマシだった。",
    state: "determined"
  },
  {
    id: "career",
    label: "転職先を調べる",
    delta: { action: 8, anxiety: -6, time: -5, mind: 2 },
    message:
      "求人を少し見た。\n今の場所だけが世界ではない、と画面が小声で言っている。",
    state: "determined"
  },
  {
    id: "study",
    label: "勉強する",
    delta: { action: 7, time: -6, health: -2, anxiety: -4 },
    message:
      "少し勉強した。\n未来の自分が、うっすら拍手している気配がする。",
    state: "determined"
  },
  {
    id: "consult",
    label: "誰かに相談する",
    delta: { relation: 6, mind: 8, anxiety: -5, action: 2 },
    message:
      "ひとり会議を一度閉じた。\n外部の声が入ると、脳内の会議室が少し静かになる。",
    state: "recovered"
  },
  {
    id: "sidejob",
    label: "副業を小さく試す",
    delta: { action: 10, time: -8, anxiety: -2, health: -3 },
    message:
      "小さく試した。\nいきなり人生を変える必要はない。まずは1人に届けば上出来。",
    state: "determined"
  },
  {
    id: "cleanup",
    label: "部屋を片付ける",
    delta: { rhythm: 8, mind: 5, health: 2, time: -4 },
    message:
      "部屋を少し片付けた。\n床が見えると、人間は少しだけ未来を信じられる。",
    state: "recovered"
  },
  {
    id: "walk",
    label: "散歩する",
    delta: { health: 6, mind: 6, anxiety: -2, time: -3 },
    message:
      "少し歩いた。\n問題は解決していないが、呼吸は少し戻った。",
    state: "recovered"
  },
  {
    id: "doomscroll",
    label: "何もしないでスマホを見る",
    delta: { time: -8, mind: -4, anxiety: 8, rhythm: -5 },
    message:
      "スマホを見ていたら時間が溶けた。\n現代には、時間を吸う小さな黒い板がある。",
    state: "anxious"
  }
];

const randomFallbackMessages = [
  "今日も選べた。選べた日は、まだやり直せる日だ。",
  "地味な選択は、だいたい後から効いてくる。",
  "派手ではない。でも、来週の自分には確実に届く。"
];

const eventDefinitions = [
  {
    id: "health-low",
    condition: (stats) => stats.health <= 30,
    title: "体調の赤信号",
    body:
      "朝、起き上がるまでに少し時間がかかった。\n気合いでどうにかなる日もある。\nでも、気合いでどうにかしてきたツケが来る日もある。",
    choices: [
      {
        label: "今日は休む",
        delta: { health: 8, mind: 4, anxiety: -6, action: -2, time: -2, rhythm: 2 },
        message: "今日はブレーキを踏んだ。壊れてから止まるより、今止まるほうが強い。"
      },
      {
        label: "無理して進める",
        delta: { health: -6, mind: -4, anxiety: 8, money: 2, action: 2 },
        message: "前に進んだ。だが、体調の請求書はあとでまとめて届く。"
      }
    ]
  },
  {
    id: "anxiety-high",
    condition: (stats) => stats.anxiety >= 75,
    title: "深夜の検索ループ",
    body:
      "夜、気づいたら検索欄に同じ言葉を入れていた。\n「転職　不安」\n「副業　初心者」\n「人生　詰んだ　気のせい」",
    choices: [
      {
        label: "不安を書き出す",
        delta: { anxiety: -10, mind: 5, action: 2, time: -2 },
        message: "言語化したら、霧が少しだけ薄くなった。"
      },
      {
        label: "そのまま検索を続ける",
        delta: { anxiety: 8, mind: -6, rhythm: -4, time: -3 },
        message: "情報は増えた。安心は増えなかった。"
      }
    ]
  },
  {
    id: "mind-low",
    condition: (stats) => stats.mind <= 30,
    title: "返信できない通知",
    body:
      "メッセージが来ている。\n悪い内容ではない。\nでも、開く気力がない。",
    choices: [
      {
        label: "短く返信する",
        delta: { relation: 4, mind: 3, anxiety: -2, action: 1 },
        message: "短い一文を返せた。会話のドアは閉じずに済んだ。"
      },
      {
        label: "今日は開かない",
        delta: { mind: 1, relation: -3, anxiety: 3 },
        message: "今日は守った。あとで返す準備だけ、明日の自分に渡そう。"
      }
    ]
  },
  {
    id: "action-high",
    condition: (stats) => stats.action >= 70,
    title: "小さな前進",
    body:
      "少しだけ動ける気がした。\n人生を変えるほどではない。\nでも、予定をひとつ入れるくらいならできそうだ。",
    choices: [
      {
        label: "来週の予定を入れる",
        delta: { action: 3, anxiety: -4, time: -3, mind: 2 },
        message: "予定が一つ入った。未来がぼんやりではなく、日付つきになった。"
      },
      {
        label: "今日は満足して終わる",
        delta: { mind: 4, health: 2, action: -2 },
        message: "無理に伸ばさず終えた。継続に必要なのは、引き際のうまさでもある。"
      }
    ]
  }
];

const endings = [
  {
    min: 0,
    max: 30,
    name: "また同じ未来エンド",
    image: "assets/future-bad.png",
    message:
      "……またこのルートか。\nいや、責めてるわけじゃない。\n俺たちはだいたい、疲れている時に大事な選択を迫られる。\n\nもう一回やろう。\n次は、少しだけ違う選択をしてくれ。"
  },
  {
    min: 31,
    max: 55,
    name: "まだかなり危ないエンド",
    image: "assets/future-bad.png",
    message:
      "最悪は少し遠ざかった。\nでも、将来不安がまだ玄関の外で待っている。\n\n今週、ひとつだけ現実を見てくれ。\nそれだけでもルートは変わる。"
  },
  {
    min: 56,
    max: 75,
    name: "最悪は避けたエンド",
    image: "assets/future-saved.png",
    message:
      "助かった。\nまだ全部が解決したわけじゃない。\nでも、あの未来よりはだいぶいい。\n\n休日に少し余白がある。\nそれだけで、かなり違う。"
  },
  {
    min: 76,
    max: 90,
    name: "ルート変更成功エンド",
    image: "assets/future-saved.png",
    message:
      "よくやった。\n派手な奇跡は起きていない。\nでも、生活の向きが少し変わった。\n\nこういう地味な変化が、いちばん効く。"
  },
  {
    min: 91,
    max: 100,
    name: "静かな勝利エンド",
    image: "assets/future-saved.png",
    message:
      "ありがとう。\n3ヶ月後の俺は、まだ少し疲れている。\nでも、ちゃんと息ができている。\n\n勝利って、たぶんこういう地味な形で来る。"
  }
];

const gameState = {
  week: 1,
  stats: { ...initialStats },
  currentState: "normal",
  history: [],
  pendingCommand: null,
  pendingEvent: null,
  closeTried: false
};

const dom = {
  titleScreen: document.getElementById("titleScreen"),
  futureScreen: document.getElementById("futureScreen"),
  mainScreen: document.getElementById("mainScreen"),
  eventScreen: document.getElementById("eventScreen"),
  endingScreen: document.getElementById("endingScreen"),

  openFutureMessage: document.getElementById("openFutureMessage"),
  resumeButton: document.getElementById("resumeButton"),
  resetRunButton: document.getElementById("resetRunButton"),
  restartButton: document.getElementById("restartButton"),
  reportButton: document.getElementById("reportButton"),

  futureDialogueText: document.getElementById("futureDialogueText"),
  futureChoices: document.getElementById("futureChoices"),

  weekLabel: document.getElementById("weekLabel"),
  remainingLabel: document.getElementById("remainingLabel"),
  playerImage: document.getElementById("playerImage"),
  playerStateLabel: document.getElementById("playerStateLabel"),
  commandList: document.getElementById("commandList"),
  statusList: document.getElementById("statusList"),
  messageText: document.getElementById("messageText"),
  nextWeekButton: document.getElementById("nextWeekButton"),

  eventWeekLabel: document.getElementById("eventWeekLabel"),
  eventTitle: document.getElementById("eventTitle"),
  eventBody: document.getElementById("eventBody"),
  eventChoices: document.getElementById("eventChoices"),

  endingName: document.getElementById("endingName"),
  avoidRate: document.getElementById("avoidRate"),
  futureEndingImage: document.getElementById("futureEndingImage"),
  futureStateText: document.getElementById("futureStateText"),
  improvedList: document.getElementById("improvedList"),
  riskList: document.getElementById("riskList"),
  futureMessageText: document.getElementById("futureMessageText"),
  nextActionList: document.getElementById("nextActionList")
};

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function applyDelta(delta) {
  Object.entries(delta).forEach(([key, value]) => {
    gameState.stats[key] = clamp((gameState.stats[key] || 0) + value);
  });
}

function showScreen(target) {
  [
    dom.titleScreen,
    dom.futureScreen,
    dom.mainScreen,
    dom.eventScreen,
    dom.endingScreen
  ].forEach((screen) => {
    screen.classList.toggle("hidden", screen !== target);
  });
}

function setCharacterState(stateName, useFade = false) {
  gameState.currentState = stateName;
  dom.playerStateLabel.textContent = stateLabelMap[stateName] || stateLabelMap.normal;

  if (!dom.playerImage) return;

  if (useFade) {
    dom.playerImage.classList.add("fade-swap");
    setTimeout(() => {
      dom.playerImage.src = stateImageMap[stateName] || stateImageMap.normal;
      dom.playerImage.classList.remove("fade-swap");
    }, 120);
    return;
  }

  dom.playerImage.src = stateImageMap[stateName] || stateImageMap.normal;
}

function chooseStateFromStats() {
  const { anxiety, health, mind, action } = gameState.stats;

  if (anxiety >= 75) return "anxious";
  if (health <= 36 || mind <= 36) return "tired";
  if (action >= 68) return "determined";
  if (health >= 60 && mind >= 60) return "recovered";
  return "normal";
}

function renderStatus() {
  dom.statusList.innerHTML = "";

  Object.keys(statLabels).forEach((key) => {
    const value = gameState.stats[key];
    const item = document.createElement("div");
    item.className = "status-item";

    const head = document.createElement("div");
    head.className = "status-head";
    head.innerHTML = `<span>${statLabels[key]}</span><strong>${value}</strong>`;

    const meter = document.createElement("div");
    meter.className = "status-meter";

    const fill = document.createElement("div");
    fill.className = `status-fill ${key === "anxiety" ? "anxiety" : ""}`;
    fill.style.width = `${value}%`;

    meter.appendChild(fill);
    item.appendChild(head);
    item.appendChild(meter);
    dom.statusList.appendChild(item);
  });
}

function updateWeekHeader() {
  const remaining = TOTAL_WEEKS - gameState.week + 1;
  dom.weekLabel.textContent = `${gameState.week}週目`;
  dom.remainingLabel.textContent = `3ヶ月後まで残り ${remaining}週間`;
}

function setMessage(text) {
  dom.messageText.textContent = text;
}

function setCommandButtonsDisabled(disabled) {
  const buttons = dom.commandList.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = disabled;
  });
}

function detectEvent() {
  return eventDefinitions.find((eventDef) => eventDef.condition(gameState.stats)) || null;
}

function renderEvent(eventDef) {
  gameState.pendingEvent = eventDef;
  dom.eventWeekLabel.textContent = `${gameState.week}週目のイベント`;
  dom.eventTitle.textContent = eventDef.title;
  dom.eventBody.textContent = eventDef.body;
  dom.eventChoices.innerHTML = "";

  eventDef.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.label;
    button.addEventListener("click", () => resolveEventChoice(choice));
    dom.eventChoices.appendChild(button);
  });

  showScreen(dom.eventScreen);
}

function resolveEventChoice(choice) {
  applyDelta(choice.delta);

  const chosenState = chooseStateFromStats();
  setCharacterState(chosenState, true);

  gameState.history.push({
    week: gameState.week,
    kind: "event",
    title: gameState.pendingEvent.title,
    choice: choice.label,
    delta: choice.delta,
    message: choice.message,
    stats: { ...gameState.stats }
  });

  setMessage(`${choice.message}\n\n次の週へ進む準備ができています。`);
  gameState.pendingEvent = null;
  showScreen(dom.mainScreen);
  dom.nextWeekButton.classList.remove("hidden");
  saveState();
}

function onChooseCommand(command) {
  if (gameState.pendingCommand) return;

  gameState.pendingCommand = command;
  applyDelta(command.delta);
  setCharacterState(command.state, true);

  gameState.history.push({
    week: gameState.week,
    kind: "command",
    label: command.label,
    delta: command.delta,
    message: command.message,
    stats: { ...gameState.stats }
  });

  renderStatus();
  setMessage(command.message);
  setCommandButtonsDisabled(true);

  const eventDef = detectEvent();
  if (eventDef) {
    setTimeout(() => renderEvent(eventDef), 300);
  } else {
    dom.nextWeekButton.classList.remove("hidden");
    saveState();
  }
}

function renderCommands() {
  dom.commandList.innerHTML = "";

  commands.forEach((command) => {
    const button = document.createElement("button");
    button.className = "command-button";
    button.innerHTML = `<strong>${command.label}</strong>`;
    button.addEventListener("click", () => onChooseCommand(command));
    dom.commandList.appendChild(button);
  });

  setCommandButtonsDisabled(false);
}

function goNextWeek() {
  if (!gameState.pendingCommand) return;

  gameState.week += 1;
  gameState.pendingCommand = null;
  dom.nextWeekButton.classList.add("hidden");

  if (gameState.week > TOTAL_WEEKS) {
    finishGame();
    return;
  }

  updateWeekHeader();
  renderStatus();
  renderCommands();

  const fallback =
    randomFallbackMessages[Math.floor(Math.random() * randomFallbackMessages.length)];
  setMessage(`${fallback}\n今週の行動をひとつ選んでください。`);

  saveState();
}

function calculateAvoidRate(stats) {
  const positiveAverage =
    (stats.money + stats.mind + stats.health + stats.action + stats.relation + stats.rhythm) / 6;
  const anxietyScore = 100 - stats.anxiety;
  const timePenaltyScore = stats.time < 20 ? clamp(100 - (20 - stats.time) * 3) : 100;
  const weighted = positiveAverage * 0.68 + anxietyScore * 0.27 + timePenaltyScore * 0.05;
  return Math.round(clamp(weighted));
}

function pickEnding(rate) {
  return endings.find((ending) => rate >= ending.min && rate <= ending.max) || endings[0];
}

function getImprovedStats(stats) {
  const improved = Object.keys(stats)
    .filter((key) => key !== "anxiety" && stats[key] >= 55)
    .sort((a, b) => stats[b] - stats[a])
    .slice(0, 4)
    .map((key) => `${statLabels[key]}: ${stats[key]}`);

  if (improved.length === 0) {
    return ["数字はまだ伸び切っていない。次の3ヶ月で伸ばしどころが見えている。"];
  }

  return improved;
}

function getRiskStats(stats) {
  const risks = [];

  if (stats.anxiety >= 60) risks.push(`将来不安が高め (${stats.anxiety})`);
  if (stats.health <= 42) risks.push(`体調が低め (${stats.health})`);
  if (stats.mind <= 42) risks.push(`心の余裕が不足 (${stats.mind})`);
  if (stats.time <= 28) risks.push(`時間の余白が不足 (${stats.time})`);
  if (stats.rhythm <= 42) risks.push(`生活リズムが不安定 (${stats.rhythm})`);

  if (risks.length === 0) {
    risks.push("大きな赤信号は少ない。今の習慣を崩さないことが次の課題。");
  }

  return risks.slice(0, 4);
}

function getNextActions(stats) {
  const actions = [];

  if (stats.anxiety >= 60) actions.push("家計を10分だけ見直して、不安を数字に変える");
  if (stats.health <= 45) actions.push("来週は早めに休む日を先に予定へ入れる");
  if (stats.mind <= 45) actions.push("誰かに短く相談メッセージを送る");
  if (stats.action <= 45) actions.push("勉強か副業準備を15分だけ試す");
  if (stats.relation <= 45) actions.push("返信が必要な連絡を1件だけ返す");

  if (actions.length < 3) {
    actions.push("散歩か部屋の片付けで生活リズムを整える");
  }

  return actions.slice(0, 4);
}

function finishGame() {
  const rate = calculateAvoidRate(gameState.stats);
  const ending = pickEnding(rate);

  dom.endingName.textContent = ending.name;
  dom.avoidRate.textContent = `未来回避率 ${rate}%`;
  dom.futureEndingImage.src = ending.image;
  dom.futureMessageText.textContent = ending.message;

  dom.futureStateText.textContent =
    `12週間の選択を終えた結果、所持金 ${gameState.stats.money} / 心の余裕 ${gameState.stats.mind} / ` +
    `体調 ${gameState.stats.health} / 将来不安 ${gameState.stats.anxiety} となりました。`;

  dom.improvedList.innerHTML = "";
  getImprovedStats(gameState.stats).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    dom.improvedList.appendChild(li);
  });

  dom.riskList.innerHTML = "";
  getRiskStats(gameState.stats).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    dom.riskList.appendChild(li);
  });

  dom.nextActionList.innerHTML = "";
  getNextActions(gameState.stats).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    dom.nextActionList.appendChild(li);
  });

  showScreen(dom.endingScreen);
  saveState(true);
}

function renderFutureChoices(mode = "initial") {
  dom.futureChoices.innerHTML = "";

  if (mode === "initial") {
    const retry = document.createElement("button");
    retry.textContent = "3ヶ月をやり直す";
    retry.addEventListener("click", startNewRun);

    const close = document.createElement("button");
    close.textContent = "そっと閉じる";
    close.addEventListener("click", () => {
      gameState.closeTried = true;
      dom.futureDialogueText.textContent = reopenDialogue;
      renderFutureChoices("retry-only");
    });

    dom.futureChoices.append(retry, close);
    return;
  }

  const onlyRetry = document.createElement("button");
  onlyRetry.textContent = "3ヶ月をやり直す";
  onlyRetry.addEventListener("click", startNewRun);
  dom.futureChoices.appendChild(onlyRetry);
}

function openFutureMessage() {
  dom.futureDialogueText.textContent = baseDialogue;
  renderFutureChoices("initial");
  showScreen(dom.futureScreen);
}

function startNewRun() {
  gameState.week = 1;
  gameState.stats = { ...initialStats };
  gameState.currentState = "normal";
  gameState.history = [];
  gameState.pendingCommand = null;
  gameState.pendingEvent = null;

  updateWeekHeader();
  setCharacterState("normal");
  renderStatus();
  renderCommands();
  dom.nextWeekButton.classList.add("hidden");
  setMessage("未来の自分を救う12週間が始まりました。今週の行動をひとつ選んでください。");

  showScreen(dom.mainScreen);
  saveState();
}

function saveState(isFinished = false) {
  const payload = {
    week: gameState.week,
    stats: gameState.stats,
    currentState: gameState.currentState,
    history: gameState.history,
    pendingCommandId: gameState.pendingCommand ? gameState.pendingCommand.id : null,
    isFinished
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.week !== "number" || !parsed.stats) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function resumeRun(saveData) {
  gameState.week = clamp(saveData.week, 1, TOTAL_WEEKS + 1);
  gameState.stats = { ...initialStats, ...saveData.stats };
  gameState.currentState = saveData.currentState || chooseStateFromStats();
  gameState.history = Array.isArray(saveData.history) ? saveData.history : [];
  gameState.pendingCommand =
    commands.find((command) => command.id === saveData.pendingCommandId) || null;
  gameState.pendingEvent = null;

  updateWeekHeader();
  setCharacterState(gameState.currentState);
  renderStatus();
  renderCommands();

  if (gameState.pendingCommand) {
    setCommandButtonsDisabled(true);
    dom.nextWeekButton.classList.remove("hidden");
    setMessage("前回の選択結果を保持しています。続けるには次の週へ進んでください。");
  } else {
    dom.nextWeekButton.classList.add("hidden");
    setMessage("続きから再開しました。今週の行動をひとつ選んでください。");
  }

  showScreen(dom.mainScreen);
}

function resetSavedData() {
  localStorage.removeItem(SAVE_KEY);
  showScreen(dom.titleScreen);
}

function bindEvents() {
  dom.openFutureMessage.addEventListener("click", openFutureMessage);
  dom.nextWeekButton.addEventListener("click", goNextWeek);
  dom.resetRunButton.addEventListener("click", resetSavedData);
  dom.restartButton.addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    showScreen(dom.titleScreen);
  });

  dom.reportButton.addEventListener("click", () => {
    alert("行動レポートの配信準備中です。公開時にこのボタンから受け取れます。");
  });
}

function init() {
  bindEvents();

  const saved = loadState();
  if (saved && !saved.isFinished && saved.week <= TOTAL_WEEKS) {
    dom.resumeButton.classList.remove("hidden");
    dom.resumeButton.addEventListener("click", () => resumeRun(saved));
  }

  showScreen(dom.titleScreen);
}

init();
