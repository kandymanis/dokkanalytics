document.addEventListener('DOMContentLoaded', () => {
  const hipoSelect = document.getElementById('hipo-percent-select');
  const hipoDisplay = document.getElementById('hipo-stats-display');

  function updateHiPoStats() {
    const val = parseInt(hipoSelect.value);
    let stats = {
      agl: { a: 0, d: 0 },
      teq: { a: 0, d: 0 },
      int: { a: 0, d: 0 },
      str: { a: 0, d: 0 },
      phy: { a: 0, d: 0 }
    };

    if (val === 55) {
      Object.keys(stats).forEach(k => { stats[k].a = 2000; stats[k].d = 2000; });
    } else if (val === 69) {
      stats.agl.a = 3700; stats.agl.d = 4100;
      stats.teq.a = 4100; stats.teq.d = 3700;
      stats.int.a = 3700; stats.int.d = 3700;
      stats.str.a = 4100; stats.str.d = 3300;
      stats.phy.a = 3700; stats.phy.d = 3300;
    } else if (val === 79) {
      stats.agl.a = 4000; stats.agl.d = 4400;
      stats.teq.a = 4400; stats.teq.d = 4000;
      stats.int.a = 4000; stats.int.d = 4000;
      stats.str.a = 4400; stats.str.d = 3600;
      stats.phy.a = 4000; stats.phy.d = 3600;
    } else if (val === 90) {
      stats.agl.a = 4700; stats.agl.d = 4710;
      stats.teq.a = 5100; stats.teq.d = 4310;
      stats.int.a = 4700; stats.int.d = 4310;
      stats.str.a = 5100; stats.str.d = 3910;
      stats.phy.a = 4700; stats.phy.d = 3910;
    } else if (val === 100) {
      stats.agl.a = 5000; stats.agl.d = 5400;
      stats.teq.a = 5400; stats.teq.d = 5000;
      stats.int.a = 5000; stats.int.d = 5000;
      stats.str.a = 5400; stats.str.d = 4600;
      stats.phy.a = 5000; stats.phy.d = 4600;
    }

    let html = `<strong>Summonable & F2P LR</strong><br>
      <span style="color: #4da6ff;">AGL: ATK +${stats.agl.a} / DEF +${stats.agl.d}</span><br>
      <span style="color: #66ff66;">TEQ: ATK +${stats.teq.a} / DEF +${stats.teq.d}</span><br>
      <span style="color: #cc66ff;">INT: ATK +${stats.int.a} / DEF +${stats.int.d}</span><br>
      <span style="color: #ff4d4d;">STR: ATK +${stats.str.a} / DEF +${stats.str.d}</span><br>
      <span style="color: #ffa64d;">PHY: ATK +${stats.phy.a} / DEF +${stats.phy.d}</span><br>`;

    if (val === 100) {
      html += `<br><strong>F2P TURs</strong><br>
        <span style="color: #4da6ff;">AGL: ATK +3000 / DEF +3240</span><br>
        <span style="color: #66ff66;">TEQ: ATK +3240 / DEF +3000</span><br>
        <span style="color: #cc66ff;">INT: ATK +3000 / DEF +3000</span><br>
        <span style="color: #ff4d4d;">STR: ATK +3240 / DEF +2760</span><br>
        <span style="color: #ffa64d;">PHY: ATK +3000 / DEF +2760</span>`;
    }

    hipoDisplay.innerHTML = html;
  }

  hipoSelect.addEventListener('change', () => {
    updateHiPoStats();
    if (typeof calculateATK === 'function') calculateATK();
    if (typeof calculateDEF === 'function') calculateDEF();
  });
  updateHiPoStats();

  const hipoToggle = document.getElementById('hipo-toggle');
  const hipoContent = document.getElementById('hipo-content');
  const hipoIcon = document.getElementById('hipo-icon');

  hipoToggle.addEventListener('click', () => {
    const icon = document.getElementById('hipo-icon');
    if (hipoContent.style.display === 'none') {
      hipoContent.style.display = 'block';
      icon.classList.add('open');
    } else {
      hipoContent.style.display = 'none';
      icon.classList.remove('open');
    }
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.calculator-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active-panel'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab') + '-section';
      document.getElementById(targetId).classList.add('active-panel');
    });
  });

  const formatter = new Intl.NumberFormat('en-US');

  const atkInputs = [
    'atk-base', 'atk-equip', 'atk-lead', 'atk-phase1', 'atk-domain',
    'atk-items', 'atk-links', 'atk-active', 'atk-ki',
    'atk-phase2', 'atk-hp-boost', 'atk-sa-effects', 'atk-charge-count'
  ].map(id => document.getElementById(id));

  const saType = document.getElementById('sa-type');
  const saRarity = document.getElementById('sa-rarity');
  const saEza = document.getElementById('sa-eza');
  const saManual = document.getElementById('sa-manual');
  const saManualMult = document.getElementById('sa-manual-mult');
  const saTypeLabel = document.getElementById('sa-type-label');

  function updateManualMode() {
    const isManual = saManual.checked;
    const isFinish = saType.value === 'finish';
    const ezaLabel = saEza.closest('.custom-checkbox-label');
    const manualLabel = saManual.closest('.custom-checkbox-label');
    const hpBoostInput = document.getElementById('atk-hp-boost');
    const hpBoostGroup = hpBoostInput.closest('.input-group');
    const saEffectsInput = document.getElementById('atk-sa-effects');
    const saEffectsGroup = saEffectsInput.closest('.input-group');

    if (isManual && !isFinish) {
      saType.style.display = 'none';
      saManualMult.style.display = '';
      saTypeLabel.textContent = 'SA Multiplier (%)';
    } else {
      saType.style.display = '';
      saManualMult.style.display = 'none';
      saTypeLabel.textContent = 'SA Type';
    }

    if (isFinish) {
      saEza.disabled = true;
      ezaLabel.classList.add('disabled');
      saManual.disabled = true;
      manualLabel.classList.add('disabled');
      hpBoostInput.disabled = false;
      hpBoostGroup.classList.remove('disabled-group');
      saEffectsInput.disabled = false;
      saEffectsGroup.classList.remove('disabled-group');
    } else {
      saManual.disabled = false;
      manualLabel.classList.remove('disabled');
      
      if (isManual) {
        saEza.disabled = true;
        ezaLabel.classList.add('disabled');
        hpBoostInput.disabled = true;
        hpBoostGroup.classList.add('disabled-group');
        saEffectsInput.disabled = true;
        saEffectsGroup.classList.add('disabled-group');
      } else {
        saEza.disabled = false;
        ezaLabel.classList.remove('disabled');
        hpBoostInput.disabled = false;
        hpBoostGroup.classList.remove('disabled-group');
        saEffectsInput.disabled = false;
        saEffectsGroup.classList.remove('disabled-group');
      }
    }
  }

  function updateSATypeOptions() {
    const isLR = saRarity.value === 'lr';

    saType.innerHTML = '';

    if (isLR) {
      saType.add(new Option('Colossal', 'colossal'));
      saType.add(new Option('Mega-Colossal', 'mega-colossal', false, true));
    } else {
      saType.add(new Option('Supreme', 'supreme'));
      saType.add(new Option('Immense', 'immense', false, true));
    }
    saType.add(new Option('Ultimate', 'ultimate'));
    saType.add(new Option('Finish', 'finish'));
  }

  saRarity.addEventListener('change', () => {
    updateSATypeOptions();
    const chargeGroup = document.getElementById('charge-count-group');
    const isFinish = saType.value === 'finish';
    if (chargeGroup) {
      if (isFinish) {
        chargeGroup.style.position = 'relative';
        chargeGroup.style.visibility = 'visible';
        chargeGroup.style.opacity = '1';
        chargeGroup.style.pointerEvents = 'auto';
      } else {
        chargeGroup.style.position = 'absolute';
        chargeGroup.style.visibility = 'hidden';
        chargeGroup.style.opacity = '0';
        chargeGroup.style.pointerEvents = 'none';
      }
    }
    calculateATK();
  });

  [saType, saEza].forEach(el => el.addEventListener('change', () => {
    const chargeGroup = document.getElementById('charge-count-group');
    const isFinish = saType.value === 'finish';
    if (chargeGroup) {
      if (isFinish) {
        chargeGroup.style.position = 'relative';
        chargeGroup.style.visibility = 'visible';
        chargeGroup.style.opacity = '1';
        chargeGroup.style.pointerEvents = 'auto';
      } else {
        chargeGroup.style.position = 'absolute';
        chargeGroup.style.visibility = 'hidden';
        chargeGroup.style.opacity = '0';
        chargeGroup.style.pointerEvents = 'none';
      }
    }
    updateManualMode();
    calculateATK();
  }));

  saManual.addEventListener('change', () => {
    updateManualMode();
    calculateATK();
  });

  saManualMult.addEventListener('input', calculateATK);

  const defInputs = [
    'def-base', 'def-equip', 'def-lead', 'def-phase1', 'def-domain',
    'def-items', 'def-links', 'def-active',
    'def-phase2', 'def-sa'
  ].map(id => document.getElementById(id));

  const atkResult = document.getElementById('atk-result');
  const atkSteps = document.getElementById('atk-steps');
  const defResult = document.getElementById('def-result');
  const defSteps = document.getElementById('def-steps');

  function getMult(val) {
    return 1 + (val / 100);
  }

  function safeEval(expr) {
    if (!expr) return 0;

    let sanitized = String(expr).replace(/[^0-9+\-*/.()\s]/g, '');
    if (!sanitized) return 0;

    try {
      const result = new Function('return ' + sanitized)();
      return isNaN(result) ? 0 : result;
    } catch (e) {
      let clean = sanitized.trim();
      while (clean.length > 0 && /[\+\-\*\/\.]$/.test(clean)) {
        clean = clean.slice(0, -1).trim();
      }
      if (!clean) return 0;
      try {
        const fallback = new Function('return ' + clean)();
        return isNaN(fallback) ? 0 : fallback;
      } catch (err) {
        return 0;
      }
    }
  }

  function getBaseSAMultiplier(type, rarity, isEza) {
    let mult = 0;
    if (type === 'ultimate') {
      if (rarity === 'tur') {
        mult = isEza ? 790 : 740;
      } else {
        mult = isEza ? 890 : 840;
      }
    } else if (type === 'supreme') {
      mult = isEza ? 530 : 430;
    } else if (type === 'immense') {
      mult = isEza ? 630 : 505;
    } else if (type === 'colossal') {
      mult = isEza ? 450 : 425;
    } else if (type === 'mega-colossal') {
      mult = isEza ? 620 : 570;
    }
    return mult;
  }

  function calculateATK() {
    const vals = atkInputs.map(input => input ? (safeEval(input.value) || 0) : 0);
    const [
      base, equip, lead, p1, domain, items, links, active,
      ki, p2, hpBoost, saEffects, chargeCounts
    ] = vals;

    let steps = [];

    let atk = base + equip;
    let baseStr = `Base: ${formatter.format(base)}`;
    if (equip > 0) {
      baseStr += ` + ${formatter.format(equip)} from Skill Orbs`;
    }
    steps.push(baseStr);

    let nextAtk = Math.floor(atk * getMult(lead));
    if (lead > 0) steps.push(`Lead (${lead}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(p1));
    if (p1 > 0) steps.push(`Phase 1 (${p1}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(domain));
    if (domain > 0) steps.push(`Domain (${domain}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(items));
    if (items > 0) steps.push(`Items (${items}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(links));
    if (links > 0) steps.push(`Links (${links}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(active));
    if (active > 0) steps.push(`Active (${active}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    const isFinish = saType.value === 'finish';

    const kiMult = ki > 0 ? (ki / 100) : 1;
    nextAtk = Math.floor(atk * kiMult);
    if (ki > 0) steps.push(`Ki Mult (${ki}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(p2));
    if (p2 > 0) steps.push(`Phase 2 (${p2}%): ${formatter.format(nextAtk)}`);
    atk = nextAtk;

    let finalSaPercentage = 0;
    if (isFinish) {
      const hiddenPotentialBoost = hpBoost * 5;
      const baseMult = chargeCounts + hiddenPotentialBoost;
      
      const saMult = baseMult > 0 ? (baseMult / 100) : 1;
      nextAtk = Math.floor(atk * saMult);
      if (baseMult > 0) steps.push(`Finish Mult (${formatter.format(baseMult)}%): ${formatter.format(nextAtk)}`);
      atk = nextAtk;
      

      if (saEffects > 0) {
        const saEffectsMult = 1 + (saEffects / 100);
        nextAtk = Math.floor(atk * saEffectsMult);
        if (saEffects > 0) steps.push(`SA Effect (${formatter.format(saEffects)}%): ${formatter.format(nextAtk)}`);
        atk = nextAtk;
      }
    } else {
      const baseSaMult = saManual.checked
        ? (safeEval(saManualMult.value) || 0)
        : getBaseSAMultiplier(saType.value, saRarity.value, saEza.checked);
      
      const hiddenPotentialBoost = saManual.checked ? 0 : (hpBoost * 5);
      const manualSaEffects = saManual.checked ? 0 : saEffects;
      finalSaPercentage = baseSaMult + hiddenPotentialBoost + manualSaEffects;
      const saMult = finalSaPercentage > 0 ? (finalSaPercentage / 100) : 1;
      nextAtk = Math.floor(atk * saMult);
      if (finalSaPercentage > 0) steps.push(`SA Mult (${formatter.format(finalSaPercentage)}%): ${formatter.format(nextAtk)}`);
      atk = nextAtk;
    }

    if (steps.length === 0) steps.push(baseStr);

    atkResult.textContent = formatter.format(atk);
    atkSteps.innerHTML = steps.join(' <span style="color:var(--accent-atk)">➔</span> ');
  }

  function calculateDEF() {
    const vals = defInputs.map(input => safeEval(input.value) || 0);
    const [base, equip, lead, p1, domain, items, links, active, p2, sa] = vals;

    let steps = [];

    let def = base + equip;
    let baseStr = `Base: ${formatter.format(base)}`;
    if (equip > 0) {
      baseStr += ` + ${formatter.format(equip)} from Skill Orbs`;
    }
    steps.push(baseStr);

    let nextDef = Math.floor(def * getMult(lead));
    if (lead > 0) steps.push(`Lead (${lead}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(p1));
    if (p1 > 0) steps.push(`Phase 1 (${p1}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(domain));
    if (domain > 0) steps.push(`Domain (${domain}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(items));
    if (items > 0) steps.push(`Items (${items}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(links));
    if (links > 0) steps.push(`Links (${links}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(active));
    if (active > 0) steps.push(`Active (${active}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(p2));
    if (p2 > 0) steps.push(`Phase 2 (${p2}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    nextDef = Math.floor(def * getMult(sa));
    if (sa > 0) steps.push(`SA Effect (${sa}%): ${formatter.format(nextDef)}`);
    def = nextDef;

    if (steps.length === 0) steps.push(baseStr);

    defResult.textContent = formatter.format(def);
    defSteps.innerHTML = steps.join(' <span style="color:var(--accent-def)">➔</span> ');
  }

  atkInputs.forEach(input => {
    input.addEventListener('input', calculateATK);
  });

  defInputs.forEach(input => {
    input.addEventListener('input', calculateDEF);
  });

  const atkCopy = document.getElementById('atk-copy');
  const defCopy = document.getElementById('def-copy');

  async function copyToClipboard(resultId, btn) {
    const el = document.getElementById(resultId);
    if (!el) return;
    const rawVal = el.textContent.replace(/,/g, '');
    try {
      await navigator.clipboard.writeText(rawVal);
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="check" style="color: #33ccff;"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = oldHtml;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  atkCopy.addEventListener('click', () => copyToClipboard('atk-result', atkCopy));
  defCopy.addEventListener('click', () => copyToClipboard('def-result', defCopy));

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const excludedIds = ['atk-lead', 'def-lead', 'atk-hp-boost'];

      [...atkInputs, ...defInputs].forEach(input => {
        if (!excludedIds.includes(input.id)) {
          input.value = '';
        }
      });

      saEza.checked = false;
      saManual.checked = false;
      saManualMult.value = '';
      updateManualMode();

      calculateATK();
      calculateDEF();
    });
  }

  calculateATK();
  calculateDEF();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
