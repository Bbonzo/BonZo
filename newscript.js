//게임, 게임 시작, 공격, 스킬, 몬스터 공격, 레벨업, 스탯 표시, 게임 종료
const $input = document.querySelector("#player-input");
const $name = document.querySelector("#player-name");
const $WrongInput = document.querySelector("#wrong-input");
const $gamelog = document.querySelector("#game-log span");
let playerName = null;
const $commands = a = document.querySelector("#select-command");
let player; //플레이어 정보가 담긴 객체, json으로 변환 후 저장
const playerStats = {
  lv1: {
    maxHp: 150,
    att: 15,
    mp: 10,
  },
  lv2: {
    maxHp: 250,
    att: 20,
    mp: 15,
  },
  lv3: {
    hp: 360,
    att: 25,
    mp: 25,
  },
}
const teachers = {
  BonSu: {
    lv1: {
      maxHp: 120,
      att: 15,
      mp: 20,
    },
    lv2: {
      maxHp: 250,
      att: 20,
      mp: 30,
    },
    lv3: {
      hp: 300,
      att: 25,
      mp: 35,
    },
  },
  DoRan: {
    lv1: {
      maxHp: 150,
      att: 15,
      mp: 15,
    },
    lv2: {
      maxHp: 250,
      att: 20,
      mp: 25,
    },
  },
  // HwaYong: {

  // },
  // Juhee: {

  // },
  // JungSun: {

  // },
  // KiOk: {

  // }
};
const checkInput = (input) => {
  return true;
}
class Unit { // 버프/디버프 적용 전
  constructor(game, name, maxHp, att, mp) {
    this.game = game;
    this.name = name;
    this.maxHp = maxHp;
    this.att = att;
    this.mp = mp;
    this.buffs = { //기본 버프
      //기본적으로 비율로 나타내되, 절댓값은 변수명 뒤에_absolute 붙이기
      //공격력과 체력 공식: (기본 스탯+추가 스탯(절댓값))*(1+추가 스탯(비율)) ...(가)
      //만약 게임 중 임시 버프가 적용된다면, 가*(1+게임 중 추가 스탯(비율))로 계산
      //ex) 기본 체력:100, 추가 스탯 100, 추가 스탯 비율: 1(100%)
      //체력 400, 만약 이 상태에서 체력 +20% 버프가 적용된다면, 400*1.2로 계산
      //공격력도 마찬가지로
      weapon: { //장비 스탯
        regenMpPerTurn_absolute: 0, //턴당 마나 회복(절댓값)
        reduceWasteMp: 0, //스킬 마나 소모 감소(비율)
        reduceSkillDamage: 0, //받는 스킬 피해 감소(퍼센트로 나타내지 않음, 20%->0.2)(비율)
        reduceAADamage: 0, //받는 일반 공격 피해 감소(평타 강화 데미지는 스킬로 취급)(비율)
        reduceAllDamage: 0, //전피감(비율)
        increaseMaxhp_absolute: 0, // 최대 체력 증가(절댓값)
        increaseMaxhp: 0, //최대 체력 증가(비율)
        increaseSkillDamage: 0, // 스킬 피해 증가(퍼센트로 나타내지 않음, 20%->0.2)
        increaseAADamage: 0, //일반 공격 피해 증가(평타 강화 데미지는 스킬로 취급)
        increaseAllDamage: 0, //전피증
        increaseATK_absolute: 0, // 공격력 증가(절댓값)
        increaseATK: 0 //공격력 증가
      },
      technology: { // 연구
        regenMpPerTurn_absolute: 0, //턴당 마나 회복(절댓값)
        // healByDeals: 0 //입힌 피해 흡혈, 감소 후 피해로 적용됨
        increaseHeal: 0, //체력 회복 증가
        increaseATK: 0,
        reduceAllDamage: 0, //전피감(비율)
        increaseAllDamageByMath: 0, //전피증 (수학)
        increaseAllDamageByKorean: 0, //전피증(국어)
        increaseAllDamageByEtc: 0, //전피증(기타)
      }
    }
    this.temporaryBuffs = { // 임시 버프, 스탯, 남은 턴으로 나타냄, 특정 쌤을 만날 때 프로퍼티를 추가하고 끝날 때 이 값으로 초기화
      //ex) 본수를 만날 때 깜지, 청소 추가
      regenMpPerTurn_absolute: [0, 0], //턴당 마나 회복(절댓값)
      reduceWasteMp: [0, 0], //스킬 마나 소모 감소(비율)
      reduceSkillDamage: [0, 0], //받는 스킬 피해 감소(퍼센트로 나타내지 않음, 20%->0.2)(비율)
      reduceAADamage: [0, 0], //받는 일반 공격 피해 감소(평타 강화 데미지는 스킬로 취급)(비율)
      reduceAllDamage: [0, 0], //전피감(비율)
      increaseMaxhp_absolute: [0, 0], // 최대 체력 증가(절댓값)
      increaseMaxhp: [0, 0], //최대 체력 증가(비율)
      increaseSkillDamage: [0, 0], // 스킬 피해 증가(퍼센트로 나타내지 않음, 20%->0.2)
      increaseAADamage: [0, 0], //일반 공격 피해 증가(평타 강화 데미지는 스킬로 취급)
      increaseAllDamage: [0, 0], //전피증
      increaseATK_absolute: [0, 0], // 공격력 증가(절댓값)
      increaseATK: [0, 0] //공격력 증가
    }
  }
};

class Player extends Unit {
  constructor(game, name, level) {
    const stats = playerStats[`lv${level}`];
    super(game, name, stats.maxHp, stats.att, stats.mp);
    this.name = name
    this.level = level;
    this.stage = new Object();
    this.rss = 0;
    this.item = {
      state: "unlocked",
      item: {},
      wearing: {}
    };
    this.technology = { state: "unlocked" };
    this.slain = new Object(); // 쌤들을 처치한 횟수
    this.diedby = new Object(); // 쌤들한테 죽은 횟수
    this.class = "땡땡이";
  }
};

class Teacher extends Unit {
  constructor(game, name, level) {
    const stats = teachers[name][`lv${level}`];
    super(game, name, stats.maxHp, stats.att, stats.mp);
    this.name = name
    this.level = level;
  }
};

class Game {
  constructor(name) {
    this.teacher = null; // 이 게임에서 사용할 선생
    this.player = null; // 이 게임에서 사용할 학생 
    this.gameStarts();
  }
  gameStarts() {
    $input.addEventListener('submit', this.playerInput);
  }
  playerInput = event => {
    event.preventDefault();
    const $playerInput = event.target[1];
    if (!checkInput($playerInput.value)) { $playerInput.value = ''; $playerInput.focus(); return; } // 입력값 검사 후 유효하지 않다면 리턴
    const msg = $playerInput.value;
    if ($commands.options[0].selected === true) {
      if (msg === "조지기") {
        if (!this.teacher) {
          this.battle();
        } else if (this.teacher) { //선생이 존재한다면
          console.log("이미 플레이 중입니다.");
        }
      } else if (msg === "공격") {
        console.log(`레벨 ${this.teacher.level} ${this.teacher.name}
        최대 체력: ${this.teacher.maxHp}
        공격력: ${this.teacher.att}
        마나: ${this.teacher.mp}`);
      } else if (msg === "발작") {

      } else if (msg === "청소째기") {
        
      }
    }
    $gamelog.innerHTML += `<br>${$playerInput.value}`;
    $playerInput.value = '';
    $playerInput.focus();
  }
  battle = () => {
    const teacherCodes = { 0: "BonSu", 1: "DoRan" };
    const randomTeacherCode = teacherCodes[Math.floor(Math.random() * 2)];
    this.teacher = new Teacher(this, randomTeacherCode, 1);
    this.player = new Player(this, playerName, 1);
    if (this.player.technology.state !== "unlocked") {
      console.log("연구 어캐했노");
    }
    if (this.player.item.state !== "unlocked") {
      console.log("무기 어캐했노");
    }
    console.log(`레벨 ${this.player.level} ${this.player.name}
    최대 체력: ${this.player.maxHp}
    공격력: ${this.player.att}
    마나: ${this.player.mp}`);
    console.log(`레벨 ${this.teacher.level} ${this.teacher.name}
    최대 체력: ${this.teacher.maxHp}
    공격력: ${this.teacher.att}
    마나: ${this.teacher.mp}`);
  }
};

// const DD2 = new makePlayerInfo("땡땡이", 1);
// console.log(DD2)
$name.addEventListener('submit', event => {
  event.preventDefault();
  playerName = event.target[0].value;
  const regex = /^[ㄱ-ㅎ|가-힣|0-9|]+$/;
  if (!playerName) return;//입력값이 없다면 리턴
  if (!regex.test(playerName) || playerName.length > 6) { // 한글,숫자가 아니거나 입력값이 6글자보다 크면
    $WrongInput.innerText = '한글,숫자로 구성된 6글자 이하 닉네임만 가능합니다.'
    playerName = null;
    event.target[0].value = '';
    return;
  }
  $name.style.display = 'none';
  $input.style.display = 'block';
  $gamelog.innerHTML = `닉네임: ${playerName}`
  const game = new Game(playerName);
  $input["command"].focus();
});