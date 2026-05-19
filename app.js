const SAVE_KEY = "jinsei_branch_sim_v3";
const TOTAL_WEEKS = 12;

const imageAssets = {
  futureNoise: "assets/future-noise-bg.png",
  weeklyRoom: "assets/weekly-room-bg.png",
  checkpointWeek4: "assets/checkpoint-week4.png",
  checkpointWeek8: "assets/checkpoint-week8.png",
  finalWeekBefore: "assets/final-week-before.png",

  eventHealthWarning: "assets/event-health-warning.png",
  eventSearchLoop: "assets/event-search-loop.png",
  eventUnreadMessage: "assets/event-unread-message.png",
  eventSmallProgress: "assets/event-small-progress.png",
  eventBudgetCheck: "assets/event-budget-check.png",
  eventCareerSearch: "assets/event-career-search.png",
  eventConsultation: "assets/event-consultation.png",
  eventRoomCleanup: "assets/event-room-cleanup.png",
  eventWalk: "assets/event-walk.png",
  eventPhoneMelt: "assets/event-phone-melt.png",

  endingBad: "assets/ending-bad-bg.png",
  endingMid: "assets/ending-mid-bg.png",
  endingGood: "assets/ending-good-bg.png",

  futureCutinWarning: "assets/future-cutin-warning.png",
  futureCutinRelieved: "assets/future-cutin-relieved.png"
};

const fallbackAssets = {
  eventDefault: "assets/event-screen.png",
  futureCutinWarningFallback: "assets/future-bad.png",
  futureCutinRelievedFallback: "assets/future-saved.png"
};

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
    state: "tired",
    futureComment: "未来の自分: 仕事を続ける選択は立派だ。今日は自分を責めず、回復も予定に入れてくれ。"
  },
  {
    id: "rest",
    label: "早めに休む",
    delta: { health: 10, mind: 8, time: -2, action: -1 },
    message:
      "早めに休んだ。\n何も進んでいないようで、実はかなり進んでいる日もある。",
    state: "recovered",
    futureComment: "未来の自分: その休息は逃げじゃない。未来を守るための先手だ。"
  },
  {
    id: "finance",
    label: "家計を整理する",
    delta: { money: 3, anxiety: -10, mind: 3, action: 2 },
    message:
      "固定費を見た。\n現実は少し痛かったが、見ない現実よりはだいぶマシだった。",
    state: "determined",
    image: imageAssets.eventBudgetCheck,
    futureComment:
      "未来の自分: いいぞ。\n現実は見た瞬間が一番痛い。\nでも、見なかった現実は利息みたいに増える。"
  },
  {
    id: "career",
    label: "転職先を調べる",
    delta: { action: 8, anxiety: -6, time: -5, mind: 2 },
    message:
      "求人を少し見た。\n今の場所だけが世界ではない、と画面が小声で言っている。",
    state: "determined",
    image: imageAssets.eventCareerSearch,
    futureComment:
      "未来の自分: 今すぐ辞めなくていい。\nただ、出口の場所を知っているだけで、部屋の息苦しさは少し変わる。"
  },
  {
    id: "study",
    label: "勉強する",
    delta: { action: 7, time: -6, health: -2, anxiety: -4 },
    message: "少し勉強した。\n未来の自分が、うっすら拍手している気配がする。",
    state: "determined",
    futureComment: "未来の自分: 小さな勉強は、3ヶ月後の選択肢を静かに増やしてくれる。"
  },
  {
    id: "consult",
    label: "誰かに相談する",
    delta: { relation: 6, mind: 8, anxiety: -5, action: 2 },
    message:
      "ひとり会議を一度閉じた。\n外部の声が入ると、脳内の会議室が少し静かになる。",
    state: "recovered",
    image: imageAssets.eventConsultation,
    futureComment:
      "未来の自分: それはかなり大事だ。\n俺はひとり会議を続けすぎて、議題が全部『不安』になった。"
  },
  {
    id: "sidejob",
    label: "副業を小さく試す",
    delta: { action: 10, time: -8, anxiety: -2, health: -3 },
    message:
      "小さく試した。\nいきなり人生を変える必要はない。まずは1人に届けば上出来。",
    state: "determined",
    futureComment: "未来の自分: 大きく賭けるより、まず現実を検証する。その感覚はかなり強い。"
  },
  {
    id: "cleanup",
    label: "部屋を片付ける",
    delta: { rhythm: 8, mind: 5, health: 2, time: -4 },
    message:
      "部屋を少し片付けた。\n床が見えると、人間は少しだけ未来を信じられる。",
    state: "recovered",
    image: imageAssets.eventRoomCleanup,
    futureComment:
      "未来の自分: 床が見える。\nそれは意外と大きい。\n俺の時代では、床は伝説上の存在になっていた。"
  },
  {
    id: "walk",
    label: "散歩する",
    delta: { health: 6, mind: 6, anxiety: -2, time: -3 },
    message:
      "少し歩いた。\n問題は解決していないが、呼吸は少し戻った。",
    state: "recovered",
    image: imageAssets.eventWalk,
    futureComment:
      "未来の自分: 問題は解決していない。\nでも、呼吸が戻ると、問題の見え方が少し変わる。"
  },
  {
    id: "doomscroll",
    label: "何もしないでスマホを見る",
    delta: { time: -8, mind: -4, anxiety: 8, rhythm: -5 },
    message:
      "スマホを見ていたら時間が溶けた。\n現代には、時間を吸う小さな黒い板がある。",
    state: "anxious",
    image: imageAssets.eventPhoneMelt,
    futureComment:
      "未来の自分: 分かる。\n俺もそれをやった。\nそして3ヶ月後、検索履歴だけが妙に詳しくなっていた。"
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
    image: imageAssets.eventHealthWarning,
    body:
      "朝、起き上がるまでに少し時間がかかった。\n気合いでどうにかなる日もある。\nでも、気合いでどうにかしてきたツケが来る日もある。",
    futureComment:
      "未来の自分: 頼む、休んでくれ。\n俺はここで無理を選んだ。\nその結果、休日の概念が少し壊れた。",
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
    image: imageAssets.eventSearchLoop,
    body:
      "夜、気づいたら検索欄に同じ言葉を入れていた。\n『転職　不安』\n『副業　初心者』\n『人生　詰んだ　気のせい』",
    futureComment:
      "未来の自分: 検索は悪くない。\nでも、不安なまま検索すると、答えではなく不安の燃料を拾うことがある。",
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
    image: imageAssets.eventUnreadMessage,
    body:
      "メッセージが来ている。\n悪い内容ではない。\nでも、開く気力がない。",
    futureComment:
      "未来の自分: 返信できない日もある。\nただ、未読が増えると心の中に小さい石が増えていく。\n一個だけでいい。動かそう。",
    choices: [
      {
        label: "短く返信する",
        delta: { relation: 4, mind: 3, anxiety: -2, action: 1 },
        message: "短い一文を返せた。会話のドアは閉じずに済んだ。"
      },
      {
        label: "今日は開かない",
        delta: { mind: 1, relation: -3, anxiety: 3 },
        message: "今日は開かないことにした。明日の自分へ、返す準備だけは残しておく。"
      }
    ]
  },
  {
    id: "action-high",
    condition: (stats) => stats.action >= 70,
    title: "小さな前進",
    image: imageAssets.eventSmallProgress,
    body:
      "少しだけ動ける気がした。\n人生を変えるほどではない。\nでも、予定をひとつ入れるくらいならできそうだ。",
    futureComment:
      "未来の自分: 今の行動力は貴重だ。\n勢いで全部変えなくていい。\n来週の予定をひとつだけ置いてくれ。",
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
    character: "assets/future-bad.png",
    bgImage: imageAssets.endingBad,
    message:
      "……またこのルートか。\nいや、責めてるわけじゃない。\n俺たちはだいたい、疲れている時に大事な選択を迫られる。\n\nもう一回やろう。\n次は、少しだけ違う選択をしてくれ。"
  },
  {
    min: 31,
    max: 55,
    name: "まだかなり危ないエンド",
    character: "assets/future-bad.png",
    bgImage: imageAssets.endingBad,
    message:
      "最悪は少し遠ざかった。\nでも、将来不安がまだ玄関の外で待っている。\n\n今週、ひとつだけ現実を見てくれ。\nそれだけでもルートは変わる。"
  },
  {
    min: 56,
    max: 75,
    name: "最悪は避けたエンド",
    character: "assets/future-saved.png",
    bgImage: imageAssets.endingMid,
    message:
      "助かった。\nまだ全部が解決したわけじゃない。\nでも、あの未来よりはだいぶいい。\n\n休日に少し余白がある。\nそれだけで、かなり違う。"
  },
  {
    min: 76,
    max: 90,
    name: "ルート変更成功エンド",
    character: "assets/future-saved.png",
    bgImage: imageAssets.endingMid,
    message:
      "よくやった。\n派手な奇跡は起きていない。\nでも、生活の向きが少し変わった。\n\nこういう地味な変化が、いちばん効く。"
  },
  {
    min: 91,
    max: 100,
    name: "静かな勝利エンド",
    character: "assets/future-saved.png",
    bgImage: imageAssets.endingGood,
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
  pendingScene: null,
  closeTried: false,
  futureTrust: 50,
  lastAvoidRate: 50
};

const dom = {
  titleScreen: document.getElementById("titleScreen"),
  futureScreen: document.getElementById("futureScreen"),
  mainScreen: document.getElementById("mainScreen"),
  eventScreen: document.getElementById("eventScreen"),
  checkpointScreen: document.getElementById("checkpointScreen"),
  finalWeekScreen: document.getElementById("finalWeekScreen"),
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
  futureCutin: document.getElementById("futureCutin"),
  futureCommentText: document.getElementById("futureCommentText"),

  eventBackground: document.getElementById("eventBackground"),
  eventWeekLabel: document.getElementById("eventWeekLabel"),
  eventTitle: document.getElementById("eventTitle"),
  eventImage: document.getElementById("eventImage"),
  eventBody: document.getElementById("eventBody"),
  eventFutureCutin: document.getElementById("eventFutureCutin"),
  eventFutureComment: document.getElementById("eventFutureComment"),
  eventChoices: document.getElementById("eventChoices"),

  checkpointBackground: document.getElementById("checkpointBackground"),
  checkpointWeekLabel: document.getElementById("checkpointWeekLabel"),
  checkpointTitle: document.getElementById("checkpointTitle"),
  checkpointBody: document.getElementById("checkpointBody"),
  checkpointMeta: document.getElementById("checkpointMeta"),
  checkpointButton: document.getElementById("checkpointButton"),

  finalWeekBody: document.getElementById("finalWeekBody"),
  finalWeekButton: document.getElementById("finalWeekButton"),

  endingBackground: document.getElementById("endingBackground"),
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

function safeSetImage(el, src, fallback) {
  if (!el) return;
  el.onerror = null;
  el.src = src;
  el.onerror = () => {
    if (fallback && el.src !== fallback) {
      el.onerror = null;
      el.src = fallback;
    }
  };
}

function setBackgroundImage(el, src, fallback) {
  if (!el) return;
  el.style.backgroundImage = `url("${src || fallback}")`;
}

function calculateAvoidRate(stats) {
  const positiveAverage =
    (stats.money + stats.mind + stats.health + stats.action + stats.relation + stats.rhythm) / 6;
  const anxietyScore = 100 - stats.anxiety;
  const timePenaltyScore = stats.time < 20 ? clamp(100 - (20 - stats.time) * 3) : 100;
  const weighted = positiveAverage * 0.68 + anxietyScore * 0.27 + timePenaltyScore * 0.05;
  return Math.round(clamp(weighted));
}

function updateFutureTrust(rateDelta, commandId = "") {
  let trustDelta = 0;

  if (rateDelta > 0) trustDelta += 4;
  if (rateDelta < 0) trustDelta -= 4;

  if (["finance", "rest", "consult", "cleanup", "walk"].includes(commandId)) trustDelta += 2;
  if (commandId === "doomscroll") trustDelta -= 4;

  gameState.futureTrust = clamp(gameState.futureTrust + trustDelta);
}

function chooseCutinType({ commandId = "", rateDelta = 0, stats = gameState.stats }) {
  const warningByStat = stats.anxiety >= 75 || stats.health <= 30 || stats.mind <= 30;

  if (warningByStat || commandId === "doomscroll" || rateDelta < 0) return "warning";
  if (["finance", "rest", "consult", "cleanup", "walk"].includes(commandId) || rateDelta > 0)
    return "relieved";
  return stats.anxiety >= 60 ? "warning" : "relieved";
}

function setFutureCutin(targetImageEl, type) {
  if (!targetImageEl) return;

  if (type === "warning") {
    safeSetImage(
      targetImageEl,
      imageAssets.futureCutinWarning,
      fallbackAssets.futureCutinWarningFallback
    );
    return;
  }

  safeSetImage(
    targetImageEl,
    imageAssets.futureCutinRelieved,
    fallbackAssets.futureCutinRelievedFallback
  );
}

function setMainFutureComment(text, cutinType = "relieved") {
  dom.futureCommentText.textContent = text;
  setFutureCutin(dom.futureCutin, cutinType);
}

function showScreen(target) {
  [
    dom.titleScreen,
    dom.futureScreen,
    dom.mainScreen,
    dom.eventScreen,
    dom.checkpointScreen,
    dom.finalWeekScreen,
    dom.endingScreen
  ].forEach((screen) => {
    screen.classList.toggle("hidden", screen !== target);
  });
}

function setCharacterState(stateName, useFade = false) {
  gameState.currentState = stateName;
  dom.playerStateLabel.textContent = stateLabelMap[stateName] || stateLabelMap.normal;

  if (useFade) {
    dom.playerImage.classList.add("fade-swap");
    setTimeout(() => {
      safeSetImage(dom.playerImage, stateImageMap[stateName], stateImageMap.normal);
      dom.playerImage.classList.remove("fade-swap");
    }, 130);
    return;
  }

  safeSetImage(dom.playerImage, stateImageMap[stateName], stateImageMap.normal);
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

function renderScene(scene) {
  dom.eventWeekLabel.textContent = scene.weekLabel;
  dom.eventTitle.textContent = scene.title;
  dom.eventBody.textContent = scene.body;
  dom.eventFutureComment.textContent = scene.futureComment || "";

  setBackgroundImage(dom.eventBackground, scene.image, fallbackAssets.eventDefault);
  safeSetImage(dom.eventImage, scene.image || fallbackAssets.eventDefault, fallbackAssets.eventDefault);
  setFutureCutin(dom.eventFutureCutin, scene.cutinType || "warning");

  dom.eventChoices.innerHTML = "";

  if (scene.choices && scene.choices.length > 0) {
    scene.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.label;
      button.addEventListener("click", choice.onClick);
      dom.eventChoices.appendChild(button);
    });
  } else {
    const continueButton = document.createElement("button");
    continueButton.textContent = scene.buttonLabel || "続ける";
    continueButton.addEventListener("click", scene.onContinue);
    dom.eventChoices.appendChild(continueButton);
  }

  showScreen(dom.eventScreen);
}

function showCommandScene(command, rateDelta, onContinue) {
  renderScene({
    weekLabel: `${gameState.week}週目の行動`,
    title: command.label,
    body: command.message,
    image: command.image || fallbackAssets.eventDefault,
    futureComment: command.futureComment || "未来の自分: その選択は次の週に確実に効いてくる。",
    cutinType: chooseCutinType({ commandId: command.id, rateDelta }),
    buttonLabel: "次へ進む",
    onContinue
  });
}

function renderConditionalEvent(eventDef, rateDelta) {
  gameState.pendingEvent = eventDef;
  renderScene({
    weekLabel: `${gameState.week}週目のイベント`,
    title: eventDef.title,
    body: eventDef.body,
    image: eventDef.image || fallbackAssets.eventDefault,
    futureComment: eventDef.futureComment,
    cutinType: chooseCutinType({ rateDelta }),
    choices: eventDef.choices.map((choice) => ({
      label: choice.label,
      onClick: () => resolveEventChoice(eventDef, choice)
    }))
  });
}

function resolveEventChoice(eventDef, choice) {
  const beforeRate = calculateAvoidRate(gameState.stats);
  applyDelta(choice.delta);
  const afterRate = calculateAvoidRate(gameState.stats);
  const rateDelta = afterRate - beforeRate;

  updateFutureTrust(rateDelta);
  gameState.lastAvoidRate = afterRate;

  const chosenState = chooseStateFromStats();
  setCharacterState(chosenState, true);

  gameState.history.push({
    week: gameState.week,
    kind: "event",
    title: eventDef.title,
    choice: choice.label,
    delta: choice.delta,
    message: choice.message,
    rate: afterRate,
    futureTrust: gameState.futureTrust,
    stats: { ...gameState.stats }
  });

  setMainFutureComment(
    `未来の自分: ${choice.message}`,
    chooseCutinType({ rateDelta, stats: gameState.stats })
  );
  setMessage(`${choice.message}\n\n次の週へ進む準備ができています。`);

  gameState.pendingEvent = null;
  dom.nextWeekButton.classList.remove("hidden");
  showScreen(dom.mainScreen);
  renderStatus();
  saveState();
}

function finalizeWeekReady() {
  dom.nextWeekButton.classList.remove("hidden");
  saveState();
}

function onChooseCommand(command) {
  if (gameState.pendingCommand) return;

  const beforeRate = calculateAvoidRate(gameState.stats);

  gameState.pendingCommand = command;
  applyDelta(command.delta);
  setCharacterState(command.state, true);

  const afterRate = calculateAvoidRate(gameState.stats);
  const rateDelta = afterRate - beforeRate;

  updateFutureTrust(rateDelta, command.id);
  gameState.lastAvoidRate = afterRate;

  gameState.history.push({
    week: gameState.week,
    kind: "command",
    label: command.label,
    delta: command.delta,
    message: command.message,
    rate: afterRate,
    futureTrust: gameState.futureTrust,
    stats: { ...gameState.stats }
  });

  renderStatus();
  setMessage(command.message);
  setMainFutureComment(
    command.futureComment || "未来の自分: その選択は確実に未来へ積み上がっている。",
    chooseCutinType({ commandId: command.id, rateDelta, stats: gameState.stats })
  );
  setCommandButtonsDisabled(true);

  const proceedAfterScene = () => {
    const eventDef = detectEvent();
    if (eventDef) {
      renderConditionalEvent(eventDef, rateDelta);
      return;
    }
    showScreen(dom.mainScreen);
    finalizeWeekReady();
  };

  if (command.image) {
    showCommandScene(command, rateDelta, proceedAfterScene);
  } else {
    proceedAfterScene();
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

function getImprovedStats(stats) {
  const improved = Object.keys(stats)
    .filter((key) => key !== "anxiety" && stats[key] >= 55)
    .sort((a, b) => stats[b] - stats[a])
    .slice(0, 4)
    .map((key) => `${statLabels[key]}: ${stats[key]}`);

  if (improved.length === 0) {
    return ["大きく改善した値はまだ少ない。次の4週間で上げどころを絞ろう。"];
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
    risks.push("現時点で大きな赤信号は少ない。ここで守りを崩さないことが重要。`");
  }

  return risks.slice(0, 4);
}

function getNextActions(stats) {
  const actions = [];

  if (stats.anxiety >= 60) actions.push("家計を10分だけ見直し、不安を数字にする");
  if (stats.health <= 45) actions.push("休息日を先に予定へ入れて体調を守る");
  if (stats.mind <= 45) actions.push("返信を1件だけ返して未読の石を減らす");
  if (stats.action <= 45) actions.push("勉強か副業準備を15分だけ試す");
  if (stats.relation <= 45) actions.push("相談できる人に短い近況を送る");

  if (actions.length < 3) {
    actions.push("散歩か部屋の片付けで生活リズムを整える");
  }

  return actions.slice(0, 4);
}

function renderCheckpoint(meta) {
  const currentRate = calculateAvoidRate(gameState.stats);
  const riskList = getRiskStats(gameState.stats);
  const improvedList = getImprovedStats(gameState.stats);

  gameState.pendingScene = meta.sceneKey;

  setBackgroundImage(dom.checkpointBackground, meta.image, fallbackAssets.eventDefault);
  dom.checkpointWeekLabel.textContent = meta.weekLabel;
  dom.checkpointTitle.textContent = meta.title;
  dom.checkpointBody.textContent = meta.body;

  dom.checkpointMeta.innerHTML = "";
  meta.buildMeta({ currentRate, riskList, improvedList }).forEach((line) => {
    const item = document.createElement("div");
    item.className = "checkpoint-item";
    item.textContent = line;
    dom.checkpointMeta.appendChild(item);
  });

  dom.checkpointButton.textContent = meta.buttonLabel;
  dom.checkpointButton.onclick = () => {
    gameState.pendingScene = null;
    renderWeekStart("ここから次の4週間。焦らず、しかし止まりすぎずに進もう。");
  };

  showScreen(dom.checkpointScreen);
  saveState();
}

function showWeek4Checkpoint() {
  renderCheckpoint({
    sceneKey: "checkpoint4",
    image: imageAssets.checkpointWeek4,
    weekLabel: "4週目終了チェック",
    title: "未来の自分",
    body:
      "1ヶ月が終わった。\n\n正直、まだ危ない。\nでも、最初の俺よりは少しだけ表情がマシになっている。\n\nこのまま続けてくれ。\n特に、体調と心の余裕は削りすぎるな。",
    buttonLabel: "次の月へ進む",
    buildMeta: ({ currentRate, riskList, improvedList }) => {
      const nearFuture =
        gameState.stats.anxiety >= 65
          ? "このまま進むと近い未来: 夜に不安が増幅しやすい。"
          : "このまま進むと近い未来: 生活の安定感がじわっと戻る。";
      return [
        `現在の未来回避率: ${currentRate}%`,
        `危ないステータス: ${riskList.join(" / ")}`,
        `改善したステータス: ${improvedList.join(" / ")}`,
        nearFuture
      ];
    }
  });
}

function showWeek8Checkpoint() {
  renderCheckpoint({
    sceneKey: "checkpoint8",
    image: imageAssets.checkpointWeek8,
    weekLabel: "8週目終了チェック",
    title: "未来の自分",
    body:
      "2ヶ月が終わった。\n\nここからが分かれ道だ。\n少し良くなったからといって、全部抱え直すな。\n\n俺はそこで調子に乗って、また同じルートに戻った。",
    buttonLabel: "最後の月へ進む",
    buildMeta: ({ currentRate, riskList }) => {
      const trustText = `未来信頼度: ${gameState.futureTrust}`;
      const focus =
        gameState.stats.time <= 35
          ? "最後の4週間で意識すること: 予定を詰めすぎず、回復の枠を先に確保する。"
          : "最後の4週間で意識すること: 勢いを守りつつ、休息を抜かない。";
      return [
        `現在の未来回避率: ${currentRate}%`,
        `残っているリスク: ${riskList.join(" / ")}`,
        trustText,
        focus
      ];
    }
  });
}

function showFinalWeekBefore() {
  gameState.pendingScene = "finalWeekBefore";
  dom.finalWeekBody.textContent =
    "次で最後だ。\n\nこの3ヶ月で、何を選んだか。\n何を見なかったことにしたか。\n何をちゃんと見たか。\n\n全部、未来に出る。\n\n深呼吸して選んでくれ。";

  dom.finalWeekButton.onclick = () => {
    gameState.pendingScene = null;
    renderWeekStart("最後の週です。迷ったら、体調と心の余裕を守る選択を。", false);
  };

  showScreen(dom.finalWeekScreen);
  saveState();
}

function goNextWeek() {
  if (!gameState.pendingCommand) return;

  gameState.week += 1;
  gameState.pendingCommand = null;
  gameState.pendingEvent = null;
  dom.nextWeekButton.classList.add("hidden");

  if (gameState.week > TOTAL_WEEKS) {
    finishGame();
    return;
  }

  if (gameState.week === 5) {
    showWeek4Checkpoint();
    return;
  }

  if (gameState.week === 9) {
    showWeek8Checkpoint();
    return;
  }

  if (gameState.week === 12) {
    showFinalWeekBefore();
    return;
  }

  renderWeekStart();
}

function renderWeekStart(customMessage = "", isStart = false) {
  updateWeekHeader();
  renderStatus();
  renderCommands();
  showScreen(dom.mainScreen);

  const fallback =
    randomFallbackMessages[Math.floor(Math.random() * randomFallbackMessages.length)];
  const message = isStart
    ? "未来の自分を救う12週間が始まりました。今週の行動をひとつ選んでください。"
    : customMessage || `${fallback}\n今週の行動をひとつ選んでください。`;

  setMessage(message);
  setMainFutureComment("未来の自分: 焦らなくていい。今週の一手を選ぼう。", "relieved");
  gameState.pendingScene = null;
  saveState();
}

function pickEnding(rate) {
  return endings.find((ending) => rate >= ending.min && rate <= ending.max) || endings[0];
}

function finishGame() {
  const rate = calculateAvoidRate(gameState.stats);
  const ending = pickEnding(rate);

  setBackgroundImage(dom.endingBackground, ending.bgImage, "assets/ending-screen.png");

  dom.endingName.textContent = ending.name;
  dom.avoidRate.textContent = `未来回避率 ${rate}%`;
  safeSetImage(dom.futureEndingImage, ending.character, "assets/future-saved.png");
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
  gameState.pendingScene = null;
  gameState.futureTrust = 50;
  gameState.lastAvoidRate = calculateAvoidRate(gameState.stats);

  setCharacterState("normal");
  renderWeekStart("", true);
}

function saveState(isFinished = false) {
  const payload = {
    week: gameState.week,
    stats: gameState.stats,
    currentState: gameState.currentState,
    history: gameState.history,
    pendingCommandId: gameState.pendingCommand ? gameState.pendingCommand.id : null,
    pendingScene: gameState.pendingScene,
    futureTrust: gameState.futureTrust,
    lastAvoidRate: gameState.lastAvoidRate,
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
  gameState.pendingScene = saveData.pendingScene || null;
  gameState.futureTrust = clamp(saveData.futureTrust ?? 50);
  gameState.lastAvoidRate = clamp(saveData.lastAvoidRate ?? calculateAvoidRate(gameState.stats));

  setCharacterState(gameState.currentState);

  if (gameState.pendingScene === "checkpoint4") {
    showWeek4Checkpoint();
    return;
  }
  if (gameState.pendingScene === "checkpoint8") {
    showWeek8Checkpoint();
    return;
  }
  if (gameState.pendingScene === "finalWeekBefore") {
    showFinalWeekBefore();
    return;
  }

  updateWeekHeader();
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

  setMainFutureComment(
    `未来の自分: 未来信頼度は ${gameState.futureTrust}。この週も一手ずつ行こう。`,
    gameState.futureTrust >= 55 ? "relieved" : "warning"
  );
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

  setBackgroundImage(document.querySelector(".future-bg"), imageAssets.futureNoise, "assets/future-message.png");
  setBackgroundImage(document.querySelector(".main-bg"), imageAssets.weeklyRoom, "assets/main-command-screen.png");

  const saved = loadState();
  if (saved && !saved.isFinished && saved.week <= TOTAL_WEEKS) {
    dom.resumeButton.classList.remove("hidden");
    dom.resumeButton.addEventListener("click", () => resumeRun(saved));
  }

  showScreen(dom.titleScreen);
}

init();
