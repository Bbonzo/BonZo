const $input = document.querySelector("#player-input");
const $name = document.querySelector("#player-name");
const $WrongInput = document.querySelector("#wrong-input");
const $gamelog = document.querySelector("#game-log");
const $details = document.querySelector("#details");
let playerName = null;
let game = null;
let exp = 0;
let lev = 1;
const $commands = a = document.querySelector("#select-command");
let mpRegen, hpRegen = 0;
let turn = 0;
let detail = [];
let player; //플레이어 정보가 담긴 객체, json으로 변환 후 저장
let showOrDelete = 1; //0: 보이기, 1: 숨기기
const playerStats = {
  lv1: {
    maxHp: 150,
    att: 15,
    mp: 10,
  },
  lv2: {
    maxHp: 250,
    att: 20,
    mp: 20,
  },
  lv3: {
    maxHp: 360,
    att: 25,
    mp: 30,
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
      att: 25,
      mp: 30,
    },
    lv3: {
      hp: 300,
      att: 30,
      mp: 35,
    },
  },
  DoRan: {
    lv1: {
      maxHp: 120,
      att: 10,
      mp: 15,
    },
    lv2: {
      maxHp: 250,
      att: 15,
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
const log = content => {
  console.log(content);
  $gamelog.innerHTML += `${content}<br>`;
}
const gameLog = content => {
  console.log(content);
  if (!detail[turn]) {
    detail[turn] = '';
  }
  detail[turn] += content + `
  `;
}
class Game {
  constructor(name) {
    this.teacher = null; // 이 게임에서 사용할 선생
    this.player = null; // 이 게임에서 사용할 학생 
    this.gameStarts();
  }

  gameStarts() {
    $input.addEventListener('submit', this.playerInput);
  }
  showDetails = (event) => {
    if (detail[turn]) {
      if (showOrDelete === 0) {
        $details.innerText = `[세부사항]
      ` + detail[turn] + `
      세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
        showOrDelete = 1;
      } else {
        $details.innerHTML = `세부사항을 보려면 로그를 클릭해 주세요.`;
        showOrDelete = 0;
      }
    } else {
      if (!detail[turn]) {
        detail[turn] = '게임이 시작되지 않았습니다.';
      }
      $details.innerHTML = $details.innerText = `[세부사항]<br>
      ` + detail[turn] + `
      <br>세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
      showOrDelete = 1;
    }
  }
  playerInput = event => {
    event.preventDefault();
    const $playerInput = event.target[1];
    if (!checkInput($playerInput.value)) { $playerInput.value = ''; $playerInput.focus(); return; } // 입력값 검사 후 유효하지 않다면 리턴
    const msg = $playerInput.value;
    if ($commands.options[0].selected === true) {
      detail = [];
      $gamelog.innerHTML = `<p>닉네임: ${playerName}</p>`
      if (msg === "조지기") {
        if (!this.teacher) {
          this.battle();
        } else if (this.teacher) { //선생이 존재한다면
          console.log("이미 플레이 중입니다.");
        }
      }
      //여기부터 싸우는 중에 사용하는 명령어
      if (!this.teacher) {
        $playerInput.value = '';
        $playerInput.focus();
        $gamelog.innerHTML += `전투 중이 아닙니다. 먼저 "조지기"를 입력해 주세요.`;
        return;
      }
      if (msg === "공격") {
        turn++;
        console.log(`${turn}턴 시작`);
        this.whenAA();
        // console.log(`레벨 ${this.teacher.level} ${this.teacher.name}
        // 최대 체력: ${this.teacher.maxHp}
        // 공격력: ${this.teacher.att}
        // 마나: ${this.teacher.mp}`);
      } else if (msg === "발작") {
        if (this.player.mp < 5) {
          log(`마나가 부족합니다. 현재 마나: ${this.player.mp}`);
        } else if (this.player.library) {
          log(`도란이의 "독서실 분위기" 침묵 효과로 스킬을 시전할 수 없습니다.
          침묵 효과가 ${this.player.library}턴 남았습니다.`);
        } else {
          turn++;
          console.log(`${turn}턴 시작`);
          this.whenUseSkill(0);
        }
      } else if (msg === "청소째기") {
        if (this.player.level >= 2) {
          if (this.player.mp < 5) {
            log(`마나가 부족합니다. 현재 마나: ${this.player.mp}`);
          } else if (this.player.library) {
            log(`도란이의 "독서실 분위기" 침묵 효과로 스킬을 시전할 수 없습니다.
            침묵 효과가 ${this.player.library}턴 남았습니다.`);
          } else if (!(this.player.cleaning || this.player.checked)) {
            log(`제거할 디버프가 없습니다.`);
          } else {
            turn++;
            console.log(`${turn}턴 시작`);
            this.whenUseSkill(1);
          }
        } else {
          log(`아직 "청소째기" 스킬이 해금되지 않았습니다. 해금 레벨: 2 현재 레벨: ${this.player.level}`);
        }

      } else if (msg === "전투종료") {
        if (showOrDelete === 1) {
          $details.innerText = `${this.teacherName}와의 전투에서 도망쳤습니다!`;
        }
        log(`전투를 종료하였습니다.`);
        this.reset();
      } else {

      }
    } else if ($commands.options[1].selected === true) { // 개발자 모드가 활성화 되어 있다면
      if (msg === "레벨업") {
        if (lev === 1) {
          lev = 2;
          exp = 1;
          $gamelog.innerHTML += `레벨이 ${lev - 1}레벨에서 ${lev}레벨로 상승하였습니다!<br>`;
        } else if (lev === 2) {
          lev = 3;
          exp = 16;
          $gamelog.innerHTML += `레벨이 ${lev - 1}레벨에서 ${lev}레벨로 상승하였습니다!<br>`;
        }
      }

    }
    $playerInput.value = '';
    $playerInput.focus();
  }
  battle = () => {
    { // 세팅
      const teacherCodes = { 0: "BonSu", 1: "DoRan" };
      // const randomTeacherCode = teacherCodes[Math.floor(Math.random() * 2)];
      const randomTeacherCode = teacherCodes[Math.floor(Math.random() * 2)];
      this.teacher = new Teacher(this, randomTeacherCode, lev);
      this.teacher.hp = this.teacher.maxHp;
      this.teacher.maxMp = this.teacher.mp;
      this.player = new Player(this, playerName, lev);
      this.player.hp = this.player.maxHp;
      this.player.maxMp = this.player.mp;
      if (this.player.technology.state !== "unlocked") {
        console.log("연구 어캐했노");
      }
      if (this.player.item.state !== "unlocked") {
        console.log("무기 어캐했노");
      }
      $gamelog.addEventListener('click', this.showDetails);
      this.teacherName = this.teacher.name === "BonSu" ? "뽄수" : "도란이";
      console.log(`${this.teacher.level}레벨 ${this.teacherName}를 만났다.`);
      $gamelog.innerHTML += `${this.teacher.level}레벨 ${this.teacherName}를 만났다.<p>`
      turn = 0;
      this.player.cleaning = 0;
      this.player.blink = 0;
      this.player.checked = 0;
      this.player.library = 0;
    }
    this.whenAA = () => { // 일반 공격
      this.teacher.hp -= this.player.att;
      gameLog(`${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"} ${this.teacherName}를 공격해 ${this.player.att}의 피해를 입혔습니다. ${this.teacherName}의 체력: ${this.teacher.hp}/${this.teacher.maxHp}`);
      if (this.teacher.hp > 0) {
        if (this.player.level >= 2) {
          if (this.player.maxMp >= this.player.mp + 1) { //마나에서 1을 회복해도 최대 마나보다 작거나 같다면
            this.player.mp += 1;
            gameLog(`${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 패시브 "비행 청소년"으로 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나가 1 회복되었습니다. ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나: ${this.player.mp}/${this.player.maxMp}`);
          }
          // else if (this.player.maxMp > this.player.mp) { //현재 마나가 최대 마나보다 작고 마나에서 1을 회복하면 최대 마나를 초과한다면
          //   mpRegen = this.player.maxMp - this.player.mp;
          //   this.player.mp += mpRegen;
          //   console.log(`${this.playerName}의 패시브 "기능성 사복"으로 ${this.playerName}의 마나가 ${mpRegen} 회복되었습니다.`);
          //   console.log(`${this.playerName}의 마나: ${this.player.mp}/${this.player.maxMp}`);
          // }
        }
        this.counter();
      } else { // 사망 시
        const a = document.createElement("p");
        a.id = `${turn}`;
        a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
        $gamelog.append(a);
        gameLog(`${this.teacherName}가 교무실로 돌아가셨습니다.`);
        log(`${this.teacherName}가 교무실로 돌아가셨습니다.
        `);
        if (showOrDelete === 1) {
          $details.innerText = `[세부사항]
                ` + detail[a.id] + `
                세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
        }
        exp += 1;
        this.levelup();
        this.reset();
      }

    }
    //스킬
    this.whenUseSkill = playerSkillCode => { // 발작: 0, 청소째기: 1, 늦잠: 2
      switch (playerSkillCode) {
        case 0:
          if (this.player.mp >= 5) {
            this.teacher.hp -= this.player.att * 2;
            this.player.mp -= 5;
            gameLog(`${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"}  "스킬: 발작"을 시전해 ${this.teacherName}에게 ${this.player.att * 2}의 피해를 입혔습니다. ${this.teacherName}의 체력: ${this.teacher.hp}/${this.teacher.maxHp}`);
            if (this.teacher.hp > 0) {
              if (this.player.level >= 2) {
                if (this.player.maxMp >= this.player.mp + 1) { //마나에서 1을 회복해도 최대 마나보다 작거나 같다면
                  this.player.mp += 1;
                  gameLog(`${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 패시브 "비행 청소년"으로 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나가 1 회복되었습니다. ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나: ${this.player.mp}/${this.player.maxMp}`);
                }
                // else if (this.player.maxMp > this.player.mp) { //현재 마나가 최대 마나보다 작고 마나에서 1을 회복하면 최대 마나를 초과한다면
                //   mpRegen = this.player.maxMp - this.player.mp;
                //   this.player.mp += mpRegen;
                //   console.log(`${this.playerName}의 패시브 "기능성 사복"으로 ${this.playerName}의 마나가 ${mpRegen} 회복되었습니다.`);
                //   console.log(`${this.playerName}의 마나: ${this.player.mp}/${this.player.maxMp}`);
                // }
              }
              this.counter();
            } else { // 사망 시
              const a = document.createElement("p");
              a.id = `${turn}`;
              a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
              $gamelog.append(a);
              detail[turn] += `${this.teacherName}가 교무실로 돌아가셨습니다.`;
              if (showOrDelete === 1) {
                $details.innerText = `[세부사항]
                ` + detail[a.id] + `
                세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
              }
              log(`${this.teacherName}가 교무실로 돌아가셨습니다.`);
              exp += 1;
              this.levelup();
              this.reset();
            }
          }
          break;
        case 1:
          if (this.player.mp >= 5) {
            if (this.teacherName === "뽄수") {
              if (this.player.cleaning) {
                this.teacher.hp -= this.player.att * 1.5;
                this.player.mp -= 5;
                this.player.cleaning = 0;
                gameLog(`${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"}  "스킬: 청소째기"를 시전해 "청소" 디버프를 제거하고 ${this.teacherName}에게 ${this.player.att * 1.5}의 피해를 입혔습니다. ${this.teacherName}의 체력: ${this.teacher.hp}/${this.teacher.maxHp}`);
              }
            } else if (this.teacherName === "도란이") {
              if (this.player.checked) {
                this.teacher.hp -= this.player.att * 1.5;
                this.player.mp -= 5;
                this.player.checked = 0;
                gameLog(`${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"}  "스킬: 청소째기"를 시전해 파란 노트에 적힌 "체크" 표시를 제거하고 ${this.teacherName}에게 ${this.player.att * 1.5}의 피해를 입혔습니다. ${this.teacherName}의 체력: ${this.teacher.hp}/${this.teacher.maxHp}`);
              }
            }
            if (this.teacher.hp > 0) {
              if (this.player.level >= 2) {
                if (this.player.maxMp >= this.player.mp + 1) { //마나에서 1을 회복해도 최대 마나보다 작거나 같다면
                  this.player.mp += 1;
                  gameLog(`${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 패시브 "비행 청소년"으로 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나가 1 회복되었습니다. ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}의 마나: ${this.player.mp}/${this.player.maxMp}`);
                }
                // else if (this.player.maxMp > this.player.mp) { //현재 마나가 최대 마나보다 작고 마나에서 1을 회복하면 최대 마나를 초과한다면
                //   mpRegen = this.player.maxMp - this.player.mp;
                //   this.player.mp += mpRegen;
                //   console.log(`${this.playerName}의 패시브 "기능성 사복"으로 ${this.playerName}의 마나가 ${mpRegen} 회복되었습니다.`);
                //   console.log(`${this.playerName}의 마나: ${this.player.mp}/${this.player.maxMp}`);
                // }
              }
              this.counter();
            } else { // 사망 시
              const a = document.createElement("p");
              a.id = `${turn}`;
              a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
              $gamelog.append(a);
              detail[turn] += `${this.teacherName}가 교무실로 돌아가셨습니다.`;
              if (showOrDelete === 1) {
                $details.innerText = `[세부사항]
                ` + detail[a.id] + `
                세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
              }
              log(`${this.teacherName}가 교무실로 돌아가셨습니다.`);
              exp += 1;
              this.levelup();
              this.reset();
            }
          }
          break;
        default:
      }
    }
    this.levelup = () => {
      if (exp === 1) {
        lev = 2;
        $gamelog.innerHTML += `레벨이 ${lev - 1}레벨에서 ${lev}레벨로 상승하였습니다!<br>`;
      } else if (exp === 16) {
        lev = 3;
        $gamelog.innerHTML += `레벨이 ${lev - 1}레벨에서 ${lev}레벨로 상승하였습니다!<br>`;
      }
    }


    if (this.teacherName === "뽄수") { // 본수 함수
      this.counter = (isBonusTurn = 0) => { // 보너스 턴: 플레이어가 기절한 상태인가? -1: 없음 0: 뒷목 꼬집기, 1: 청소, 2: 깜지(원콤낼 수 있을 때만 시전)
        let teacherSkillCode = Math.floor(Math.random() * 100) + 1; //20% 확률로 일반 공격 시전
        if (isBonusTurn) {
          teacherSkillCode = 30; // 스킬로 변경
        }
        if (teacherSkillCode <= 20) {
          this.player.hp -= this.teacher.att * 0.8;
          console.log(`${this.teacherName}가 "일반 공격: 두 손가락 찌르기"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att * 0.8}의 피해를 입혔습니다.`);
          console.log(`${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}`);
          detail[turn] += `${this.teacherName}가 "일반 공격: 두 손가락 찌르기"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att * 0.8}의 피해를 입혔습니다. ${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}
          `
        } else if (teacherSkillCode > 20) {
          if (this.teacher.level === 1) {
            if (this.teacher.mp >= 10) {
              if (this.player.cleaning === 0) {
                teacherSkillCode = Math.floor(Math.random() * 2);
              } else {
                teacherSkillCode = 0;
              }
            } else if (this.teacher.mp >= 5) {
              teacherSkillCode = 0;
            } else {
              teacherSkillCode = -1;
            }
          } else if (this.teacher.level === 2) {
            if (this.player.cleaning === 0) {
              if (this.teacher.mp >= 16 && this.player.hp <= this.teacher.att * 4) {
                teacherSkillCode = 2;
              } else if (this.teacher.mp >= 10) {
                teacherSkillCode = Math.floor(Math.random() * 2);
              } else if (this.teacher.mp >= 5) {
                teacherSkillCode = 0;
              } else {
                teacherSkillCode = -1;
              }
            } else if (this.player.cleaning !== 0) {
              if (this.teacher.mp >= 16 && this.player.hp <= this.teacher.att * 4.6 && this.player.cleaning === 1) {
                teacherSkillCode = 2;
              } else if (this.teacher.mp >= 16 && this.player.hp <= this.teacher.att * 5.2) {
                teacherSkillCode = 2;
              } else if (this.teacher.mp >= 10) {
                teacherSkillCode = Math.floor(Math.random() * 2);
              } else if (this.teacher.mp >= 5) {
                teacherSkillCode = 0;
              } else {
                teacherSkillCode = -1;
              }
            }
          }
          if (isBonusTurn) {
            teacherSkillCode = 0;
          }
          if (teacherSkillCode === 0) { // 뒷목
            this.player.hp -= this.teacher.att * 2;
            this.teacher.mp -= 5;
            gameLog(`${this.teacherName}가 "액티브 스킬: 뒷목 꼬집기"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att * 2}의 피해를 입혔습니다. ${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}`);
          } else if (teacherSkillCode === 1) { // 청소
            this.player.cleaning = 5;
            this.teacher.mp -= 10;
            gameLog(`${this.teacherName}가 "액티브 스킬: 너 청소"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 5턴간 "청소" 효과를 적용했습니다.`);
          } else if (teacherSkillCode === 2) { // 깜지
            this.player.blink = 2;
            this.teacher.mp -= 10;
            gameLog(`${this.teacherName}가 "액티브 스킬: 특별한 전달사항"을 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 2턴간 "깜지" 효과를 적용했습니다.`);
          } else if (teacherSkillCode === -1) {
            gameLog(`${this.teacherName}의 기력이 부족해 스킬을 시전하려다 말았습니다.`);
          }
        }
        if (this.player.hp > 0) {
          if (this.teacher.maxMp >= this.teacher.mp + 2) { //마나에서 2를 회복해도 최대 마나보다 작거나 같다면
            this.teacher.mp += 2;
            gameLog(`${this.teacherName}의 패시브 "기능성 사복"으로 ${this.teacherName}의 마나가 2 회복되었습니다. ${this.teacherName}의 마나: ${this.teacher.mp}/${this.teacher.maxMp}`);
          } else if (this.teacher.maxMp > this.teacher.mp) { //현재 마나가 최대 마나보다 작고 마나에서 2를 회복하면 최대 마나를 초과한다면
            mpRegen = this.teacher.maxMp - this.teacher.mp;
            this.teacher.mp += mpRegen;
            gameLog(`${this.teacherName}의 패시브 "기능성 사복"으로 ${this.teacherName}의 마나가 ${mpRegen} 회복되었습니다. ${this.teacherName}의 마나: ${this.teacher.mp}/${this.teacher.maxMp}`);
          }
          if (this.player.cleaning > 0) {
            this.player.cleaning -= 1;
            this.player.hp -= this.teacher.att * 0.6;
            gameLog(`${this.teacherName}의 "청소" 효과로 인해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"} ${this.player.att * 0.6}의 피해를 입었습니다. 청소 효과가 ${this.player.cleaning !== 0 ? `${this.player.cleaning}턴 남았습니다.` : "제거되었습니다."} ${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}`);
          }
          if (this.player.blink) {
            this.player.blink -= 1;
            gameLog(`${this.teacherName}의 "깜지" 효과로 인해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"} 행동 불능 상태에 빠졌습니다. 깜지 효과가 ${this.player.blink + 1}턴 남았습니다.}`);
            this.counter(1);
            return;
          }
          const a = document.createElement("p");
          a.id = `${turn}`;
          a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
          $gamelog.append(a);
          if (showOrDelete === 1) {
            $details.innerText = `[세부사항]
        ` + detail[a.id] + `
        세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
          }
        } else {
          gameLog(`${this.teacherName}가 ${this.player.class === "땡땡이" ? "땡땡이를" : "전동훈을"} 살해했습니다!`);
          const a = document.createElement("p");
          a.id = `${turn}`;
          a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
          $gamelog.append(a);
          if (showOrDelete === 1) {
            $details.innerText = `[세부사항]
        ` + detail[a.id] + `
        세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
          }
          log(`${this.teacherName}가 ${this.player.class === "땡땡이" ? "땡땡이를" : "전동훈을"} 살해했습니다!`);
          this.reset();
        }
      }
    } else if (this.teacherName === "도란이") { // 도란이 함수
      this.counter = () => { // -1: 평타 0: 체크 1: 독서실
        let teacherSkillCode = Math.floor(Math.random() * 100) + 1; //30% 확률로 일반 공격 시전
        if (this.player.library && this.teacher.mp >= 10 && this.player.checked) {
          teacherSkillCode = 40;
        } else if (this.player.checked === 2) { // 마나가 5 이하면 평타를 침
          teacherSkillCode = 40;
        }
        if (teacherSkillCode <= 30) {
          this.player.hp -= this.teacher.att * 1;
          gameLog(`${this.teacherName}가 "일반 공격: 잔소리"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att}의 피해를 입혔습니다. ${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}`);
        } else if (teacherSkillCode > 30) {
          if (this.teacher.level === 1) {
            if (this.teacher.mp >= 5) {
              teacherSkillCode = 0;
            } else {
              teacherSkillCode = -1;
            }
          } else if (this.teacher.level === 2) {
            if (this.teacher.mp >= 5) {
              if (this.player.checked === 2) {
                teacherSkillCode = 0;
              } else if (this.player.checked === 1 && !this.player.library) {
                teacherSkillCode = 1;
              } else {
                teacherSkillCode = 0;
              }
            } else {
              teacherSkillCode = Math.floor(Math.random * 2) ? -1 : 1;
            }
          }
          if (teacherSkillCode === 0) { // 체크
            this.player.hp -= this.teacher.att * 2;
            this.player.checked += 1;
            this.teacher.mp -= 5;
            gameLog(`${this.teacherName}가 "액티브 스킬: 너 체크"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att * 2}의 피해를 입히고 파란 노트에 이름을 적었습니다.`);
            gameLog(`${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp} 체크된 횟수: ${this.player.checked}`);
          } else if (teacherSkillCode === 1) {
            this.player.library = 3;
            this.teacher.mp += 5 // 마나 초과 회복은 신경 안써도 됨
            gameLog(`${this.teacherName}가 "액티브 스킬: 독서실 분위기"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 2턴간 "독서실 분위기" 효과를 적용하고 ${this.teacherName}의 기력을 5만큼 회복했습니다. ${this.teacherName}의 기력: ${this.teacher.mp}/${this.teacher.maxMp}`);
          } else if (teacherSkillCode === -1) {
            this.player.hp -= this.teacher.att * 1;
            gameLog(`${this.teacherName}가 "일반 공격: 잔소리"를 시전해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이" : "전동훈"}에게 ${this.teacher.att}의 피해를 입혔습니다. ${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}`);
          }
        }
        if (this.player.hp > 0) {
          if (this.player.checked === 3) {
            this.player.checked = 0;
            this.player.hp -= this.player.maxHp * 0.2;
            if (this.teacher.hp + this.player.maxHp * 0.2 >= this.teacher.maxHp) { //회복된 값이 최대 체력보다 크거나 같다면
              hpRegen = this.teacher.maxHp - this.teacher.hp;
              this.teacher.hp += hpRegen;
            } else {
              hpRegen = this.player.maxHp * 0.2;
              this.teacher.hp += hpRegen;
            }
            gameLog(`${this.teacherName}의 "체크" 3회 누적으로 인해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"} ${this.player.maxHp * 0.2}의 피해를 입고 ${this.teacherName}의 체력이 ${hpRegen}만큼 회복되었습니다.`);
            gameLog(`${this.player.class}의 체력: ${this.player.hp}/${this.player.maxHp}, ${this.teacherName}의 체력: ${this.teacher.hp}/${this.teacher.maxHp}`);
          }
          if (this.player.library) {
            this.player.library -= 1;
            if (this.player.library) {
              gameLog(`${this.teacherName}의 "독서실 분위기"로 인해 ${playerName}의 ${this.player.class === "땡땡이" ? "땡땡이가" : "전동훈이"} 스킬을 사용할 수 없습니다. ${this.player.library}턴 남았습니다.`);
            }
          }
          const a = document.createElement("p");
          a.id = `${turn}`;
          a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
          $gamelog.append(a);
          if (showOrDelete === 1) {
            $details.innerText = `[세부사항]
        ` + detail[a.id] + `
        세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
          }
        } else {
          gameLog(`${this.teacherName}가 ${this.player.class === "땡땡이" ? "땡땡이를" : "전동훈을"} 살해했습니다!`);
          const a = document.createElement("p");
          a.id = `${turn}`;
          a.innerHTML += `${turn}턴: ${this.player.class} 체력: ${this.player.hp}/${this.player.maxHp} 마나: ${this.player.mp}/${this.player.maxMp}<br>${this.teacherName} 체력: ${this.teacher.hp}/${this.teacher.maxHp} 마나: ${this.teacher.mp}/${this.teacher.maxMp}`;
          $gamelog.append(a);
          if (showOrDelete === 1) {
            $details.innerText = `[세부사항]
          ` + detail[a.id] + `
          세부사항을 숨기려면 로그를 한 번 더 클릭해 주세요.`;
          }
          console.log(`${this.teacherName}가 ${this.player.class === "땡땡이" ? "땡땡이를" : "전동훈을"} 살해했습니다!`);
          $gamelog.innerHTML += `${this.teacherName}가 ${this.player.class === "땡땡이" ? "땡땡이를" : "전동훈을"} 살해했습니다!`
          this.reset();
        }
      }


    }
  }
  reset = () => {
    this.teacher = null;
    this.player = null;
    $gamelog.removeEventListener('click', this.showDetails);
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
  $gamelog.innerHTML = `<p>닉네임: ${playerName}</p>`
  game = new Game(playerName);
  $input["command"].focus();
});