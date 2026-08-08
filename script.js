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

  let atkSupers = [];
  let defSupers = [];
  let currentAtkVal = 0;
  let currentDefVal = 0;
  let currentAtkBaseType = "";
  let currentDefBaseType = "";

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function getOrdinalHTML(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return `${n}<span class="ordinal-suffix">${suffix}</span>`;
  }

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
    const isCounter = saType.value === 'counter';
    const isNormal = saType.value === 'normal';
    const ezaLabel = saEza.closest('.custom-checkbox-label');
    const manualLabel = saManual.closest('.custom-checkbox-label');
    const hpBoostInput = document.getElementById('atk-hp-boost');
    const hpBoostGroup = hpBoostInput.closest('.input-group');
    const saEffectsInput = document.getElementById('atk-sa-effects');
    const saEffectsGroup = saEffectsInput.closest('.input-group');

    if (isManual && !isFinish && !isCounter && !isNormal) {
      saType.style.display = 'none';
      saManualMult.style.display = '';
      saTypeLabel.textContent = 'SA Multiplier (%)';
    } else {
      saType.style.display = '';
      saManualMult.style.display = 'none';
      saTypeLabel.textContent = 'SA Type';
    }

    if (isFinish || isCounter || isNormal) {
      saEza.disabled = true;
      ezaLabel.classList.add('disabled');
      saManual.disabled = true;
      manualLabel.classList.add('disabled');
      if (isCounter || isNormal) {
        hpBoostInput.disabled = true;
        hpBoostGroup.classList.add('disabled-group');
      } else {
        hpBoostInput.disabled = false;
        hpBoostGroup.classList.remove('disabled-group');
      }
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
    saType.add(new Option('Counter', 'counter'));
    saType.add(new Option('Normal', 'normal'));
  }

  function updateChargeCountVisibility() {
    const chargeGroup = document.getElementById('charge-count-group');
    const chargeLabel = chargeGroup ? chargeGroup.querySelector('label') : null;
    const chargeTooltip = chargeGroup ? chargeGroup.querySelector('.tooltip') : null;
    const isFinish = saType.value === 'finish';
    const isCounter = saType.value === 'counter';
    if (chargeGroup) {
      if (isFinish || isCounter) {
        chargeGroup.style.position = 'relative';
        chargeGroup.style.visibility = 'visible';
        chargeGroup.style.opacity = '1';
        chargeGroup.style.pointerEvents = 'auto';
        if (chargeLabel) {
          chargeLabel.textContent = isCounter ? 'Counter Mult' : 'Finish Multiplier';
        }
        if (chargeTooltip) {
          chargeTooltip.textContent = isCounter 
            ? 'Base Multiplier for any Super Attack or Normal Attack Counter (e.g. Ferocious is 300%)' 
            : 'Base Multiplier of the Finish/Active + Charge Counts for Standby';
        }
      } else {
        chargeGroup.style.position = 'absolute';
        chargeGroup.style.visibility = 'hidden';
        chargeGroup.style.opacity = '0';
        chargeGroup.style.pointerEvents = 'none';
      }
    }
  }

  saRarity.addEventListener('change', () => {
    updateSATypeOptions();
    updateChargeCountVisibility();
    updateManualMode();
    calculateATK();
  });

  [saType, saEza].forEach(el => el.addEventListener('change', () => {
    updateChargeCountVisibility();
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
    'def-phase2', 'def-sa', 'def-sa-type'
  ].map(id => document.getElementById(id));

  const defSaType = document.getElementById('def-sa-type');

  const atkResult = document.getElementById('atk-result');
  const atkSteps = document.getElementById('atk-steps');
  const defResult = document.getElementById('def-result');
  const defSteps = document.getElementById('def-steps');

  function getMult(val) {
    return 1 + (val / 100);
  }

  function parseInputAndRaw(expr) {
    if (!expr) return { mult: 0, raw: 0 };
    let rawTotal = 0;
    let text = String(expr);
    const rawRegex = /(['"])(.*?)(?:['"]|$)/g;
    text = text.replace(rawRegex, (match, p1, p2) => {
      let cleanNum = p2.replace(/,/g, '').replace(/[^0-9.-]/g, '');
      if (cleanNum) {
        rawTotal += parseFloat(cleanNum) || 0;
      }
      return '0';
    });
    return { mult: safeEval(text) || 0, raw: rawTotal };
  }

function safeEval(expr) {
  if (!expr) return 0;
  
  let sanitized = String(expr)
    .replace(/[xX×]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/[^0-9+\-*/%^().\s]/g, '')
    .trim();

  if (!sanitized) return 0;

  while (sanitized.length > 0 && /[+\-*/%^.()]$/.test(sanitized)) {
    sanitized = sanitized.slice(0, -1).trim();
  }

  try {
    const tokens = [];
    const re = /(\d+\.?\d*|\*\*|[+\-*/%^()])/g;
    let m;
    while ((m = re.exec(sanitized)) !== null) tokens.push(m[1]);
    
    let pos = 0;

    function parseExpr() {
      let left = parseTerm();
      while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
        const op = tokens[pos++];
        const right = parseTerm();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }

    function parseTerm() {
      let left = parsePower();
      while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/' || tokens[pos] === '%')) {
        const op = tokens[pos++];
        const right = parsePower();
        if (op === '*') left *= right;
        else if (op === '/') left /= right;
        else if (op === '%') left %= right;
      }
      return left;
    }

    function parsePower() {
      let left = parseFactor();
      while (pos < tokens.length && (tokens[pos] === '^' || tokens[pos] === '**')) {
        pos++; 
        const right = parseFactor();
        left = Math.pow(left, right);
      }
      return left;
    }

    function parseFactor() {
      if (tokens[pos] === '(') {
        pos++;
        const val = parseExpr();
        if (tokens[pos] === ')') pos++;
        return val;
      }
      const num = parseFloat(tokens[pos++]);
      return isNaN(num) ? 0 : num;
    }

    const result = parseExpr();
    return isNaN(result) || !isFinite(result) ? 0 : result;
  } catch (e) {
    return 0;
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
    if (mult === 0) mult = 500;
    return mult;
  }

  function calculateATK() {
    const vals = atkInputs.map(input => input ? parseInputAndRaw(input.value) : { mult: 0, raw: 0 });
    const [
      base, equip, lead, p1, domain, items, links, active,
      ki, p2, hpBoost, saEffects, chargeCounts
    ] = vals;

    let steps = [];

    let atk = base.mult + base.raw + equip.mult + equip.raw;
    let baseStr = `Base: ${formatter.format(base.mult + base.raw)}`;
    if ((equip.mult + equip.raw) > 0) {
      baseStr += ` + ${formatter.format(equip.mult + equip.raw)} from Skill Orbs`;
    }
    steps.push(baseStr);

    let nextAtk = Math.floor(atk * getMult(lead.mult)) + lead.raw;
    if (lead.mult > 0 || lead.raw !== 0) {
      let l = `Lead (${lead.mult}%`;
      if (lead.raw !== 0) l += ` + ${formatter.format(lead.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(p1.mult)) + p1.raw;
    if (p1.mult > 0 || p1.raw !== 0) {
      let l = `Phase 1 (${p1.mult}%`;
      if (p1.raw !== 0) l += ` + ${formatter.format(p1.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(domain.mult)) + domain.raw;
    if (domain.mult > 0 || domain.raw !== 0) {
      let l = `Domain (${domain.mult}%`;
      if (domain.raw !== 0) l += ` + ${formatter.format(domain.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(items.mult)) + items.raw;
    if (items.mult > 0 || items.raw !== 0) {
      let l = `Items (${items.mult}%`;
      if (items.raw !== 0) l += ` + ${formatter.format(items.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(links.mult)) + links.raw;
    if (links.mult > 0 || links.raw !== 0) {
      let l = `Links (${links.mult}%`;
      if (links.raw !== 0) l += ` + ${formatter.format(links.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(active.mult)) + active.raw;
    if (active.mult > 0 || active.raw !== 0) {
      let l = `Active (${active.mult}%`;
      if (active.raw !== 0) l += ` + ${formatter.format(active.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    const isFinish = saType.value === 'finish';
    const isCounter = saType.value === 'counter';

    const kiMultVal = ki.mult > 0 ? (ki.mult / 100) : 1;
    nextAtk = Math.floor(atk * kiMultVal) + ki.raw;
    if (ki.mult > 0 || ki.raw !== 0) {
      let l = `Ki Mult (${ki.mult}%`;
      if (ki.raw !== 0) l += ` + ${formatter.format(ki.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    nextAtk = Math.floor(atk * getMult(p2.mult)) + p2.raw;
    if (p2.mult > 0 || p2.raw !== 0) {
      let l = `Phase 2 (${p2.mult}%`;
      if (p2.raw !== 0) l += ` + ${formatter.format(p2.raw)}`;
      l += `): ${formatter.format(nextAtk)}`;
      steps.push(l);
    }
    atk = nextAtk;

    let finalSaPercentage = 0;
    if (isFinish || isCounter) {
      const hiddenPotentialBoost = isCounter ? 0 : (hpBoost.mult * 5);
      const baseMult = chargeCounts.mult + hiddenPotentialBoost;
      
      const saMult = baseMult > 0 ? (baseMult / 100) : 1;
      const rawAdd = chargeCounts.raw + (isCounter ? 0 : hpBoost.raw);
      nextAtk = Math.floor(atk * saMult) + rawAdd;
      if (baseMult > 0 || rawAdd !== 0) {
        let l = `${isCounter ? 'Counter Mult' : 'Finish Mult'} (${formatter.format(baseMult)}%`;
        if (rawAdd !== 0) l += ` + ${formatter.format(rawAdd)}`;
        l += `): ${formatter.format(nextAtk)}`;
        steps.push(l);
      }
      atk = nextAtk;

      if (saEffects.mult > 0 || saEffects.raw !== 0) {
        const saEffectsMult = 1 + (saEffects.mult / 100);
        nextAtk = Math.floor(atk * saEffectsMult) + saEffects.raw;
        let l = `SA Effect (${formatter.format(saEffects.mult)}%`;
        if (saEffects.raw !== 0) l += ` + ${formatter.format(saEffects.raw)}`;
        l += `): ${formatter.format(nextAtk)}`;
        steps.push(l);
        atk = nextAtk;
      }
    } else {
      let isNormal = saType.value === 'normal';
      let manualSaRaw = 0;
      let manualSaMult = 0;
      if (saManual.checked) {
        let parsed = parseInputAndRaw(saManualMult.value);
        manualSaMult = parsed.mult;
        manualSaRaw = parsed.raw;
      }
      const baseSaMult = saManual.checked
        ? manualSaMult
        : (isNormal ? 100 : getBaseSAMultiplier(saType.value, saRarity.value, saEza.checked));
      
      const hiddenPotentialBoost = (saManual.checked || isNormal) ? 0 : (hpBoost.mult * 5);
      const manualSaEffects = saManual.checked ? 0 : saEffects.mult;
      
      finalSaPercentage = baseSaMult + hiddenPotentialBoost + manualSaEffects;
      const rawSaAdd = (saManual.checked ? manualSaRaw : 0) + ((saManual.checked || isNormal) ? 0 : hpBoost.raw) + (saManual.checked ? 0 : saEffects.raw);

      const saMult = finalSaPercentage > 0 ? (finalSaPercentage / 100) : 1;
      nextAtk = Math.floor(atk * saMult) + rawSaAdd;
      
      if (isNormal) {
        if (finalSaPercentage !== 100 || rawSaAdd !== 0) {
          let l = `Normal Mult (${formatter.format(finalSaPercentage)}%`;
          if (rawSaAdd !== 0) l += ` + ${formatter.format(rawSaAdd)}`;
          l += `): ${formatter.format(nextAtk)}`;
          steps.push(l);
        }
      } else if (finalSaPercentage > 0 || rawSaAdd !== 0) {
        let l = `SA Mult (${formatter.format(finalSaPercentage)}%`;
        if (rawSaAdd !== 0) l += ` + ${formatter.format(rawSaAdd)}`;
        l += `): ${formatter.format(nextAtk)}`;
        steps.push(l);
      }
      atk = nextAtk;
    }

    const atkCrit = document.getElementById('atk-crit');
    const atkTypeEff = document.getElementById('atk-type-eff');
    const isCrit = atkCrit && atkCrit.checked;
    const isTypeEff = atkTypeEff && atkTypeEff.checked;

    if (isCrit) {
      nextAtk = Math.floor(atk * 1.5);
      let l = `Critical (1.5x): ${formatter.format(nextAtk)}`;
      steps.push(l);
      atk = nextAtk;
    } else if (isTypeEff) {
      nextAtk = Math.floor(atk * 1.25);
      let l = `Type Effective (1.25x): ${formatter.format(nextAtk)}`;
      steps.push(l);
      atk = nextAtk;
    }

    if (steps.length === 0) steps.push(baseStr);

    currentAtkVal = atk;
    
    let baseType = "Super Attack";
    if (saManual.checked) {
      baseType = "Super";
    } else {
      const t = saType.value;
      if (t === 'mega-colossal') baseType = "U. Super Attack";
      else if (t === 'ultimate') baseType = "EX Super Attack";
      else if (t === 'finish') baseType = "Finish Skill";
      else if (t === 'counter') baseType = "Counter";
      else if (t === 'normal') baseType = "Normal Attack";
      else baseType = "Super Attack";
    }
    currentAtkBaseType = baseType;

    if (atkSupers.length > 0) {
      atkResult.textContent = formatter.format(atk);
      
      const containerEl = document.getElementById('atk-supers-container');
      if (containerEl) containerEl.style.display = 'block';
      const listEl = document.getElementById('atk-supers-list');
      
      let counts = {};
      atkSupers.forEach(s => counts[s.type] = (counts[s.type] || 0) + 1);
      
      let runningCounts = {};
      listEl.innerHTML = atkSupers.map((s, index) => {
        runningCounts[s.type] = (runningCounts[s.type] || 0) + 1;
        let ordinalHTML = "";
        let isDoubleDigit = false;
        if (counts[s.type] > 1) {
          const currentCount = runningCounts[s.type];
          if (currentCount >= 10) isDoubleDigit = true;
          ordinalHTML = getOrdinalHTML(currentCount);
        }
        
        let modText = "";
        if (s.crit) {
          modText = `<span class="modifier-text crit-text" style="color: var(--text-secondary);">CRIT</span>`;
        } else if (s.typeEff) {
          modText = `<span class="modifier-text type-eff-text" style="color: var(--text-secondary);">TYPE E.</span>`;
        }
        
        return `<div class="super-item">
          <span class="super-label">
            <button class="remove-sa-btn${isDoubleDigit ? ' double-digit' : ''}" data-index="${index}" title="Remove SA">
              <i data-lucide="x"></i>
            </button>
            <span class="super-ordinal-container">${ordinalHTML}</span>${s.type}
          </span>
          <span style="display: flex; align-items: center; justify-content: flex-end; position: relative;">
            <span class="super-value atk-value">${formatter.format(s.val)}</span>
            ${modText ? `<span style="position: absolute; left: 100%; margin-left: 0.5rem; display: flex; align-items: center;">${modText}</span>` : ''}
          </span>
        </div>`;
      }).join('');
      
      const removeBtns = listEl.querySelectorAll('.remove-sa-btn');
      removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'));
          atkSupers.splice(idx, 1);
          calculateATK();
        });
      });
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: listEl });
      }

      let totalApt = atkSupers.reduce((a, b) => a + b.val, 0);
      const totalLabelEl = document.getElementById('atk-total-apt');
      const totalValEl = document.getElementById('atk-total-apt-value');
      if (totalLabelEl) totalLabelEl.textContent = 'Total ATK';
      if (totalValEl) totalValEl.textContent = formatter.format(totalApt);
    } else {
      atkResult.textContent = formatter.format(atk);
      const containerEl = document.getElementById('atk-supers-container');
      if (containerEl) containerEl.style.display = 'none';
    }

    atkSteps.innerHTML = steps.join(' <span style="color:var(--accent-atk)">➔</span> ');
  }

  function calculateDEF() {
    const vals = defInputs.map(input => input ? parseInputAndRaw(input.value) : { mult: 0, raw: 0 });
    const [base, equip, lead, p1, domain, items, links, active, p2, sa] = vals;

    let steps = [];

    let def = base.mult + base.raw + equip.mult + equip.raw;
    let baseStr = `Base: ${formatter.format(base.mult + base.raw)}`;
    if ((equip.mult + equip.raw) > 0) {
      baseStr += ` + ${formatter.format(equip.mult + equip.raw)} from Skill Orbs`;
    }
    steps.push(baseStr);

    let nextDef = Math.floor(def * getMult(lead.mult)) + lead.raw;
    if (lead.mult > 0 || lead.raw !== 0) {
      let l = `Lead (${lead.mult}%`;
      if (lead.raw !== 0) l += ` + ${formatter.format(lead.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(p1.mult)) + p1.raw;
    if (p1.mult > 0 || p1.raw !== 0) {
      let l = `Phase 1 (${p1.mult}%`;
      if (p1.raw !== 0) l += ` + ${formatter.format(p1.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(domain.mult)) + domain.raw;
    if (domain.mult > 0 || domain.raw !== 0) {
      let l = `Domain (${domain.mult}%`;
      if (domain.raw !== 0) l += ` + ${formatter.format(domain.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(items.mult)) + items.raw;
    if (items.mult > 0 || items.raw !== 0) {
      let l = `Items (${items.mult}%`;
      if (items.raw !== 0) l += ` + ${formatter.format(items.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(links.mult)) + links.raw;
    if (links.mult > 0 || links.raw !== 0) {
      let l = `Links (${links.mult}%`;
      if (links.raw !== 0) l += ` + ${formatter.format(links.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(active.mult)) + active.raw;
    if (active.mult > 0 || active.raw !== 0) {
      let l = `Active (${active.mult}%`;
      if (active.raw !== 0) l += ` + ${formatter.format(active.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(p2.mult)) + p2.raw;
    if (p2.mult > 0 || p2.raw !== 0) {
      let l = `Phase 2 (${p2.mult}%`;
      if (p2.raw !== 0) l += ` + ${formatter.format(p2.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    nextDef = Math.floor(def * getMult(sa.mult)) + sa.raw;
    if (sa.mult > 0 || sa.raw !== 0) {
      let l = `SA Effect (${sa.mult}%`;
      if (sa.raw !== 0) l += ` + ${formatter.format(sa.raw)}`;
      l += `): ${formatter.format(nextDef)}`;
      steps.push(l);
    }
    def = nextDef;

    if (steps.length === 0) steps.push(baseStr);

    currentDefVal = def;
    currentDefBaseType = defSaType ? defSaType.value : "Super Attack";

    if (defSupers.length > 0) {
      defResult.textContent = formatter.format(def);
      
      const containerEl = document.getElementById('def-supers-container');
      if (containerEl) containerEl.style.display = 'block';
      const listEl = document.getElementById('def-supers-list');
      
      let counts = {};
      defSupers.forEach(s => counts[s.type] = (counts[s.type] || 0) + 1);
      
      let runningCounts = {};
      listEl.innerHTML = defSupers.map((s, index) => {
        runningCounts[s.type] = (runningCounts[s.type] || 0) + 1;
        let ordinalHTML = "";
        let isDoubleDigit = false;
        if (counts[s.type] > 1) {
          const currentCount = runningCounts[s.type];
          if (currentCount >= 10) isDoubleDigit = true;
          ordinalHTML = getOrdinalHTML(currentCount);
        }
        return `<div class="super-item">
          <span class="super-label">
            <button class="remove-sa-btn${isDoubleDigit ? ' double-digit' : ''}" data-index="${index}" title="Remove SA">
              <i data-lucide="x"></i>
            </button>
            <span class="super-ordinal-container">${ordinalHTML}</span>${s.type}
          </span>
          <span class="super-value def-value">${formatter.format(s.val)}</span>
        </div>`;
      }).join('');
      
      const removeBtns = listEl.querySelectorAll('.remove-sa-btn');
      removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'));
          defSupers.splice(idx, 1);
          calculateDEF();
        });
      });
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: listEl });
      }

      let totalDef = defSupers[defSupers.length - 1].val;
      const totalLabelEl = document.getElementById('def-total-label');
      const totalValEl = document.getElementById('def-total');
      if (totalLabelEl) totalLabelEl.textContent = 'Total DEF';
      if (totalValEl) totalValEl.textContent = formatter.format(totalDef);
    } else {
      defResult.textContent = formatter.format(def);
      const containerEl = document.getElementById('def-supers-container');
      if (containerEl) containerEl.style.display = 'none';
    }

    defSteps.innerHTML = steps.join(' <span style="color:var(--accent-def)">➔</span> ');
  }

  atkInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', calculateATK);
    if (input.tagName === 'SELECT') input.addEventListener('change', calculateATK);
  });

  const atkCrit = document.getElementById('atk-crit');
  const atkTypeEff = document.getElementById('atk-type-eff');
  if (atkCrit) atkCrit.addEventListener('change', calculateATK);
  if (atkTypeEff) atkTypeEff.addEventListener('change', calculateATK);

  defInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', calculateDEF);
    if (input.tagName === 'SELECT') input.addEventListener('change', calculateDEF);
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
      if (typeof lucide !== 'undefined') lucide.createIcons({ root: btn });
      setTimeout(() => {
        btn.innerHTML = oldHtml;
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: btn });
      }, 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  atkCopy.addEventListener('click', () => copyToClipboard('atk-result', atkCopy));
  defCopy.addEventListener('click', () => copyToClipboard('def-result', defCopy));

  const atkAdd = document.getElementById('atk-add');
  const defAdd = document.getElementById('def-add');

  if (atkAdd) {
    atkAdd.addEventListener('click', () => {
      calculateATK();
      let type = "Super Attack";
      if (saManual.checked) {
        type = "Super";
      } else {
        const t = saType.value;
        if (t === 'mega-colossal') type = "U. Super Attack";
        else if (t === 'ultimate') type = "EX Super Attack";
        else if (t === 'finish') type = "Finish Skill";
        else if (t === 'counter') type = "Counter";
        else if (t === 'normal') type = "Normal Attack";
      }
      const atkCrit = document.getElementById('atk-crit');
      const atkTypeEff = document.getElementById('atk-type-eff');
      const isCrit = atkCrit && atkCrit.checked;
      const isTypeEff = atkTypeEff && atkTypeEff.checked;
      
      atkSupers.push({ 
        val: currentAtkVal, 
        type: type, 
        crit: isCrit, 
        typeEff: !isCrit && isTypeEff 
      });
      calculateATK();
    });
  }

  if (defAdd) {
    defAdd.addEventListener('click', () => {
      calculateDEF();
      const type = defSaType ? defSaType.value : "Super Attack";
      defSupers.push({ val: currentDefVal, type: type });
      calculateDEF();
    });
  }

  const atkSupersReset = document.getElementById('atk-supers-reset');
  if (atkSupersReset) {
    atkSupersReset.addEventListener('click', () => {
      atkSupers = [];
      calculateATK();
    });
  }

  const defSupersReset = document.getElementById('def-supers-reset');
  if (defSupersReset) {
    defSupersReset.addEventListener('click', () => {
      defSupers = [];
      calculateDEF();
    });
  }

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const excludedIds = ['atk-lead', 'def-lead', 'atk-hp-boost'];

      [...atkInputs, ...defInputs].forEach(input => {
        if (!input) return;
        if (!excludedIds.includes(input.id)) {
          if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
          } else {
            input.value = '';
          }
        }
      });

      saRarity.value = 'lr';
      updateSATypeOptions();

      saEza.checked = false;
      saManual.checked = false;
      saManualMult.value = '';
      
      const atkCrit = document.getElementById('atk-crit');
      const atkTypeEff = document.getElementById('atk-type-eff');
      if (atkCrit) atkCrit.checked = false;
      if (atkTypeEff) atkTypeEff.checked = false;
      
      updateManualMode();
      updateChargeCountVisibility();

      if (defSaType) defSaType.value = 'Super Attack';

      atkSupers = [];
      defSupers = [];

      calculateATK();
      calculateDEF();
    });
  }

  calculateATK();
  calculateDEF();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

	const GUIDE_KEY = "Dokkanalytics.GuidePopupDismissed";

	const guideBtn = document.getElementById("guide-btn");
	const highlight = document.getElementById("guide-highlight");
	const pointer = document.getElementById("guide-pointer");

	function positionGuideElements() {
	  if (!guideBtn || !highlight || !pointer) return;

	  const rect = guideBtn.getBoundingClientRect();
	  let centerX = rect.left + rect.width / 2;
	  let centerY = rect.top + rect.height / 2;

	  if (window.innerWidth >= 841) {
		const parentRect = document.querySelector('.nav-btns-left').getBoundingClientRect();
		centerX = (centerX - parentRect.left) + 17; 
		centerY = (centerY - parentRect.top) + 4;
	  } else {
        centerX += 37;
		centerY += 63;
      }

	  highlight.style.left = `${centerX}px`;
	  highlight.style.top = `${centerY}px`;
	  highlight.style.transform = "translate(-50%, -50%)";

	  if (window.innerWidth <= 840) {
	    pointer.src = "arrow-mobile.png";
	    pointer.style.left = `${centerX - 195}px`;
	    pointer.style.top = `${centerY - 105}px`; 
	  } else {
	    pointer.src = "arrow-desktop.png";
	    pointer.style.left = `${centerX - 315}px`; 
	    pointer.style.top = `${centerY + 25}px`;
	  }
	}

	function showGuidePopup() {
	  positionGuideElements();

	  requestAnimationFrame(() => {
		highlight?.classList.add("guide-visible");
		pointer?.classList.add("guide-visible");
	  });
	}

	function initGuidePopup() {
	  const dismissed = localStorage.getItem(GUIDE_KEY) === "true";

	  if (dismissed) {
		highlight?.classList.add("guide-hidden");
		pointer?.classList.add("guide-hidden");
		return;
	  }

	  setTimeout(showGuidePopup, 0);
	}

	pointer?.addEventListener("click", () => {
	  localStorage.setItem(GUIDE_KEY, "true");

	  highlight?.classList.add("guide-hidden");
	  pointer?.classList.add("guide-hidden");
	});

	guideBtn?.addEventListener("click", () => {
	  localStorage.setItem(GUIDE_KEY, "true");

	  highlight?.classList.add("guide-hidden");
	  pointer?.classList.add("guide-hidden");
	});

	window.addEventListener("resize", positionGuideElements);
	window.addEventListener("scroll", positionGuideElements);

	initGuidePopup();
  
});
