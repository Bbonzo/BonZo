const dd2 = {
  ["1레벨"]: {
    [`"공격" Lv.1 (기본 공격)`]: `적을 공격해 공격력 * 1의 피해를 입힌다.`,
    [`"발작" Lv.1 (액티브)`]: `발작으로 땅을 울려 공격력 * 2의 피해를 입힌다. 소모 마나: 5`,
  },
  ["2레벨"]: {
    [`"비행 청소년" Lv.1 (패시브)`]: `소소한 비행으로 스트레스를 푼다. 매 턴마다 마나를 1씩 회복한다.`,
    [`"청소째기" Lv.1 (액티브)`]: `청소를 하지 않음으로써 적에게 스트레스를 준다.
    자신에게 걸린 제거 가능한 디버프를 제거하고, 제거한 디버프의 수 * 공격력 * 1.5의 피해를 입힌다. 소모 마나: 5`,
  },
  ["3레벨"]: {
    [`"늦잠" Lv.1 (액티브)`]: `늦잠을 자서 학교에 늦음으로써 적의 공격을 회피한다. 3턴간 지속
    50%의 확률로 공격을 회피하고, 회피하지 못했을 경우 75%의 데미지만 입는다. 소모 마나: 7`,
  },
};
const jdh = {
  ["3레벨"]: {
    [`"열량 비축" Lv.1(패시브)`]: `남들보다 더 많은 열량을 비축함으로써 최대 체력을 늘리고 자신의 최대 체력에 비례해 공격력이 증가한다.
최대 체력이 20% 증가하며, 공격력이 최대 체력의 1%만큼 증가한다.`,
    [`스킬 강화: "발작" Lv.1(액티브)`]: `발작으로 땅을 울려 5 + 공격력 * 2의 피해를 입힌다.`,
  },
};

const $bonsu = document.querySelector('#dd2');
const $doran = document.querySelector('#jdh');

for (skilllevel in dd2) {
  const lev = document.createElement("p");
  lev.innerText = `[${skilllevel}]`;
  $bonsu.appendChild(lev);
  for (key in dd2[skilllevel]) {
    const a = document.createElement("h4");
    a.innerText = key;
    const show = document.createElement("p");
    show.innerText = "[펼치기/접기]"
    const c = document.createElement("p");
    c.innerText = dd2[skilllevel][key];
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

for (skilllevel in jdh) {
  const lev = document.createElement("p");
  lev.innerText = `[${skilllevel}]`;
  $doran.appendChild(lev);
  for (key in jdh[skilllevel]) {
    const a = document.createElement("h4");
    a.innerText = key;
    const show = document.createElement("p");
    show.innerText = "[펼치기/접기]"
    const c = document.createElement("p");
    c.innerText = jdh[skilllevel][key];
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