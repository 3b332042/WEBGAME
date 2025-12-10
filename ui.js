// ui.js
// ===== UI 介面管理 (Rendering & DOM Manipulation) =====

const UIManager = {
    // 緩存 DOM 元素
    elements: {
        log: document.getElementById("log"),
        headerInfo: document.getElementById("header-info"),

        // Stats
        name: document.getElementById("s-name"),
        age: document.getElementById("s-age"),
        lifespan: document.getElementById("s-lifespan"),
        realm: document.getElementById("s-realm"),
        qi: document.getElementById("s-qi"),
        breakInfo: document.getElementById("break-info-inline"),
        comp: document.getElementById("s-comp"),
        luck: document.getElementById("s-luck"),
        mind: document.getElementById("s-mind"),
        root: document.getElementById("s-root"),
        technique: document.getElementById("s-technique"),

        // Battle Stats
        atk: document.getElementById("s-atk"),
        def: document.getElementById("s-def"),
        critRate: document.getElementById("s-crit-rate"),
        critDmg: document.getElementById("s-crit-dmg"),
        hp: document.getElementById("s-hp"),
        elementAtk: document.getElementById("s-element-atk"),
        power: document.getElementById("s-power"),

        // Resources
        stone: document.getElementById("s-stone"),

        // Buttons
        btn100: document.getElementById("btn-cultivate-100"),
    },

    // 初始化 check (bind elements if needed, or query every time if worried about race conditions)
    // Here we query dynamic or conditional elements during render to be safe.

    // ===== 顏色工具 =====
    getAttrColorClass(value) {
        if (value >= 40) return "attr-orange";
        if (value >= 30) return "attr-purple";
        if (value >= 20) return "attr-blue";
        if (value >= 10) return "attr-green";
        return "attr-white";
    },

    getRealmColorClass(level) {
        if (level >= 1 && level <= 14) return "realm-white";
        if (level >= 15 && level <= 24) return "realm-green";
        if (level >= 25 && level <= 34) return "realm-blue";
        if (level >= 35 && level <= 44) return "realm-purple";
        if (level >= 45 && level <= 54) return "realm-orange";
        return "realm-white";
    },

    getTechniqueColorClass(tier) {
        switch (tier) {
            case 0: return "tech-white";
            case 1: return "tech-green";
            case 2: return "tech-blue";
            case 3: return "tech-purple";
            case 4: return "tech-orange";
            default: return "tech-white";
        }
    },

    // ===== 日誌系統 =====
    addLog(text, type = "normal") {
        const entry = { text, type };
        state.log.unshift(entry);
        if (state.log.length > 200) state.log.pop();
        this.renderLog();
    },

    renderLog() {
        // Re-query logEl in case it wasn't ready at init
        const logEl = document.getElementById("log");
        if (!logEl) return;

        logEl.innerHTML = "";
        for (const line of state.log) {
            const div = document.createElement("div");
            div.className = "log-line";

            if (line.type === "qi") div.classList.add("log-qi");
            if (line.type === "event") div.classList.add("log-event");
            if (line.type === "great-event") div.classList.add("log-great-event");
            if (line.type === "break-success") div.classList.add("log-break-success");
            if (line.type === "break-fail") div.classList.add("log-break-fail");
            if (line.type === "bad" || line.type === "bad-event") div.classList.add("log-bad");

            div.textContent = line.text;
            logEl.appendChild(div);
        }
    },

    // ===== 主介面渲染 =====
    render() {
        // 確保 gameState 存在 (已改用全域變數，不再檢查 gameState)
        // if (typeof gameState === "undefined") return;

        // 1. Buttons
        const btn100 = document.getElementById("btn-cultivate-100");
        if (btn100) {
            btn100.style.display = (state.lifespan > 1000) ? "block" : "none";
        }

        // 四藝按鈕
        const btnArts = document.getElementById("btn-toggle-arts");
        if (btnArts) {
            let hasArts = false;
            if (state.arts) {
                // Check if any art level > 0
                if ((state.arts.alchemy && state.arts.alchemy.level > 0) ||
                    (state.arts.weapon && state.arts.weapon.level > 0) ||
                    (state.arts.formation && state.arts.formation.level > 0) ||
                    (state.arts.talisman && state.arts.talisman.level > 0)) {
                    hasArts = true;
                }
            }
            btnArts.style.display = hasArts ? "inline-block" : "none";
        }

        // 飛升按鈕（真仙境50+顯示）
        const btnAscension = document.getElementById("btn-ascension");
        if (btnAscension) {
            if (state.realmLevel >= 50 && !state.ascended) {
                btnAscension.style.display = "block";
                // 計算成功率並顯示在按鈕上
                const ascensionRate = getAscensionRate(state.realmLevel);
                btnAscension.textContent = `飛升成仙（成功率${ascensionRate}%）`;
            } else {
                btnAscension.style.display = "none";
            }
        }

        // 2. Base Info
        this.setText("s-name", state.name);
        this.setText("s-age", state.age);
        this.setText("s-lifespan", state.lifespan - state.age);

        const headerInfo = document.getElementById("header-info");
        if (headerInfo) {
            headerInfo.textContent = isDead()
                ? "已坐化"
                : `年齡 ${state.age} / 壽元 ${state.lifespan}`;
        }

        // 3. Realm
        const realmEl = document.getElementById("s-realm");
        if (realmEl) {
            realmEl.textContent = realmName(state.realmLevel);
            realmEl.className = this.getRealmColorClass(state.realmLevel);
        }

        // 4. Qi
        const qiEl = document.getElementById("s-qi");
        if (qiEl) {
            const isReady = state.qi >= state.qiCap;
            qiEl.textContent = isReady
                ? `${state.qi} / ${state.qiCap}（可突破）`
                : `${state.qi} / ${state.qiCap}`;
            qiEl.className = isReady ? "qi-ready" : "";
        }

        // 4.5 Mana
        const manaEl = document.getElementById("s-mana");
        if (manaEl) {
            manaEl.textContent = `${state.mana} / ${state.maxMana}`;
            manaEl.style.color = "#4fc3f7";
        }

        // 5. Break Rate
        const rateInfo = document.getElementById("break-info-inline");
        if (rateInfo && typeof calcBreakthroughRate === "function") {
            const rate = calcBreakthroughRate() * 100;
            const isReady = state.qi >= state.qiCap && !isDead();
            rateInfo.textContent = isReady
                ? `突破成功率：約 ${rate.toFixed(1)}%`
                : `突破成功率：約 ${rate.toFixed(1)}%（真氣未滿）`;
        }

        // 6. Attributes
        this.setAttr("s-comp", state.comprehension);
        this.setAttr("s-luck", state.luck);
        this.setAttr("s-mind", state.mindset);

        // 7. Root (Special handling)
        const rootEl = document.getElementById("s-root");
        if (rootEl) {
            const rootName = getRootName(state.rootCount);
            if (Array.isArray(state.rootElements) && state.rootElements.length > 0) {
                rootEl.textContent = `${rootName}（${state.rootElements.join("、")}）`;
            } else {
                rootEl.textContent = rootName;
            }
            rootEl.className = "root-badge " + getRootColorClass(state.rootCount);

            const baseDesc = RootExplain[state.rootCount] || "";
            const elemDesc = getRootElementsText();
            rootEl.title = `${baseDesc}\n${elemDesc}`;
        }

        // 8. Technique
        const tech = getCurrentTechnique();
        const techEl = document.getElementById("s-technique");
        if (techEl) {
            techEl.textContent = `${tech.name}（x${getTechniqueMultiplier()}）`;
            techEl.className = "tech-badge " + this.getTechniqueColorClass(state.techniqueTier);
        }

        // 9. Battle Stats
        this.setAttr("s-atk", state.attack);
        this.setAttr("s-def", state.defense);

        const critRateEl = document.getElementById("s-crit-rate");
        if (critRateEl) critRateEl.textContent = (state.critRate * 100).toFixed(1) + "%";

        const critDmgEl = document.getElementById("s-crit-dmg");
        if (critDmgEl) critDmgEl.textContent = (state.critDamage * 100).toFixed(0) + "%";

        const hpEl = document.getElementById("s-hp");
        if (hpEl) hpEl.textContent = `${state.hp} / ${state.maxHp}`;

        const elemAtkEl = document.getElementById("s-element-atk");
        if (elemAtkEl) elemAtkEl.textContent = getElementAttackDesc();

        const powerEl = document.getElementById("s-power");
        if (powerEl && typeof calcBattlePower === "function") {
            powerEl.textContent = calcBattlePower();
        }

        // 10. Resources / Faction
        this.setText("s-stone", state.spiritStones);

        if (typeof renderFactionUI === "function") {
            renderFactionUI();
        }

        // 11. Mobile Quick Stats
        const qsRealm = document.getElementById("qs-realm");
        if (qsRealm && qsRealm.offsetParent !== null) { // only update if visible
            // Realm
            qsRealm.textContent = realmName(state.realmLevel);
            qsRealm.className = this.getRealmColorClass(state.realmLevel);

            // Rate
            const qsRate = document.getElementById("qs-rate");
            if (qsRate && typeof calcBreakthroughRate === "function") {
                const rate = calcBreakthroughRate() * 100;
                qsRate.textContent = `突破率: ${rate.toFixed(0)}%`;
            }

            // Bar
            const qsBarFill = document.getElementById("qs-bar-fill");
            const qsText = document.getElementById("qs-text");
            if (qsBarFill && qsText) {
                const pct = Math.min(100, Math.floor((state.qi / state.qiCap) * 100));
                qsBarFill.style.width = pct + "%";
                qsText.textContent = `${state.qi} / ${state.qiCap}`;

                // Full Qi Effect
                if (state.qi >= state.qiCap) {
                    qsText.textContent += " (可突破)";
                    qsText.style.color = "#ffd700";
                    qsBarFill.style.background = "linear-gradient(90deg, #ffd700, #ffeb3b)";
                } else {
                    qsText.style.color = "#fff";
                    qsBarFill.style.background = "linear-gradient(90deg, #4caf50, #81c784)";
                }
            }
        }
    },

    // Helper to set text content safely
    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    },

    // Helper to set attribute value + color class
    setAttr(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.className = this.getAttrColorClass(value);
        }
    }
};

// Global Exposure
window.UIManager = UIManager;
window.addLog = UIManager.addLog.bind(UIManager);
window.renderUI = UIManager.render.bind(UIManager);
window.renderLog = UIManager.renderLog.bind(UIManager);
window.getAttrColorClass = UIManager.getAttrColorClass;
window.getRealmColorClass = UIManager.getRealmColorClass;
window.getTechniqueColorClass = UIManager.getTechniqueColorClass;
