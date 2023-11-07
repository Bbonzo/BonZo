const BonSuSkill = {
  ["1레벨"]: {
    [`"기능성 사복" Lv.1 (패시브)`]: `기능성 사복을 입음으로써 체온 조절에 필요한 에너지를 아낀다.
  매 턴마다 마나를 2씩 회복한다.`,
    [`"두 손가락 찌르기" Lv.1 (기본 공격)`]: `두 손가락으로 땡땡이의 복부를 찔러 공격력 * 0.8의 피해를 입힌다.`,
    [`"뒷목 꼬집기" Lv.1 (액티브)`]: `땡땡이의 뒷목을 꼬집어 공격력 * 2의 피해를 입힌다. 소모 마나: 5`,
    [`"너 청소" Lv.1 (액티브)`]: `땡땡이에게 5턴간 청소를 시켜 체력 소모를 유도해 턴당 공격력 * 0.6의 피해를 입힌다. 소모 마나: 10`,
  },
  ["2레벨"]: {
    [`"특별한 전달사항" Lv.1 (액티브)`]: `특별한 전달사항을 전달하던 도중 땡땡이가 전달사항을 듣지 않는다는 것을 발견하고 깜지를 쓰게 해 팔을 아프게 한다.
    땡땡이를 2턴간 행동 불능 상태로 만든다. 소모 마나: 10`,
  },
  ["3레벨"]: {
    [`"기능성 사복" Lv.2 (패시브)`]: `조금 더 기능적인 사복을 입음으로써 체온 조절에 필요한 에너지를 조금 더 아낀다.
    매 턴마다 마나를 3씩 회복한다.`,
    [`"두꺼운 사복" Lv.1(패시브)`]: `두꺼운 사복을 입음으로써 자신이 받는 공격으로 인한 체력 소모가 줄어든다.
    받는 피해가 30% 감소한다.`,
    [`"특별한 전달사항" Lv.2 (액티브)`]: `조금 더 특별한 전달사항을 전달하던 도중 땡땡이가 전달사항을 듣지 않는다는 것을 발견하고 깜지를 조금 더 많이 쓰게 해 팔을 조금 더 아프게 한다.
    땡땡이를 3턴간 행동 불능 상태로 만든다. 소모 마나: 12`,
    [`"연대책임" Lv.1 (궁극기)`]: `땡땡이 외 2명을 연대로 묶어 땡땡이가 받는 피해를 세 배로 늘린다.
    3턴간 땡땡이가 받는 피해가 200% 증가한다. 필요 분노: 7`
  },
};
const DoRanSkill = {
  ["1레벨"]: {
    [`"잔소리" Lv.1 (기본 공격)`]: `잔소리를 해 땡땡이의 정신을 공격한다. 공격력 * 1의 피해를 입힌다.`,
    [`"체크" Lv.1 (액티브)`]: `파란 노트에 땡땡이를 체크하고, 공포를 느끼게 해 정신을 공격한다.
    공격력 * 2의 피해를 입히고 "체크" 표식을 1회 남긴다. 소모 마나: 5
    "체크" 표시 3회 누적 시 땡땡이는 성찰교실로 송치되며, 자신의 최대 체력 * 0.2의 피해를 입고 도란이는 같은 양만큼 체력을 회복한다.`,
  },
  ["2레벨"]: {
    [`"독서실 분위기 조성" Lv.1 (액티브)`]: `자신에게 편안한 조용한 독서실 분위기를 조성한다.
    땡땡이를 2턴간 침묵 상태로 만들고, 자신의 마나를 5 회복한다.`,
  },
  ["3레벨"]: {
    [`"패드립" Lv.1 (궁극기)`]: `수업 시간에 밖에서 체육 수업을 하고 있는 친구에게 엿을 날린 땡땡이에게 패드립을 박는다.
    체크 스킬 1회 시전 후, 땡땡이를 2턴간 침묵 상태로 만들고 공격력을 50% 감소시킨다. 필요 분노: 7.`,
  },
};

const $bonsu = document.querySelector('#bonsu');
const $doran = document.querySelector('#doran');

for (skilllevel in BonSuSkill) {
  const lev = document.createElement("p");
  lev.innerText = `[${skilllevel}]`;
  $bonsu.appendChild(lev);
  for (key in BonSuSkill[skilllevel]) {
    const a = document.createElement("h4");
    a.innerText = key;
    const show = document.createElement("p");
    show.innerText = "[펼치기/접기]"
    const c = document.createElement("p");
    c.innerText = BonSuSkill[skilllevel][key];
    c.style.display = "none";
    show.addEventListener("click", (event) => {
      const target = event.target.querySelector("p");
      if (target.style.display === "none") {
        target.style.display = "block";
      } else {
        target.style.display = "none";
      }
    });
    $bonsu.appendChild(a);
    $bonsu.appendChild(show);
    show.appendChild(c);
  }
}

for (skilllevel in DoRanSkill) {
  const lev = document.createElement("p");
  lev.innerText = `[${skilllevel}]`;
  $doran.appendChild(lev);
  for (key in DoRanSkill[skilllevel]) {
    const a = document.createElement("h4");
    a.innerText = key;
    const show = document.createElement("p");
    show.innerText = "[펼치기/접기]"
    const c = document.createElement("p");
    c.innerText = DoRanSkill[skilllevel][key];
    c.style.display = "none";
    show.addEventListener("click", (event) => {
      const target = event.target.querySelector("p");
      if (target.style.display === "none") {
        target.style.display = "block";
      } else {
        target.style.display = "none";
      }
    });
    $doran.appendChild(a);
    $doran.appendChild(show);
    show.appendChild(c);
  }
}
