// ⭐ 技能專屬動畫函數庫
// 這些函數可以被 playSkillAnimation 調用
// 新增技能時,在這裡添加對應的動畫函數即可

// === 火系動畫 ===
function animateFoxFire(fightArea) {
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    if (!player || !enemy) return;

    const pRect = player.getBoundingClientRect();
    const eRect = enemy.getBoundingClientRect();
    const aRect = fightArea.getBoundingClientRect();

    const fox = document.createElement("div");
    fox.className = "fox-fire fox-fire-anim";

    const dist = eRect.left - pRect.left - 60;
    const startX = (pRect.right - aRect.left) - 10;
    const startY = (pRect.top - aRect.top) + 20;

    fox.style.left = startX + "px";
    fox.style.top = startY + "px";
    fox.style.setProperty("--travel", (dist + 40) + "px");

    fightArea.appendChild(fox);

    setTimeout(() => {
        const boom = document.createElement("div");
        boom.className = "boom-effect";
        boom.style.left = (eRect.left - aRect.left + 20) + "px";
        boom.style.top = (eRect.top - aRect.top + 10) + "px";
        fightArea.appendChild(boom);
        setTimeout(() => boom.remove(), 450);
        fox.remove();
    }, 450);
}

function animateLotusBloom(fightArea) {
    const tint = document.createElement("div");
    tint.className = "fire-tint";
    fightArea.appendChild(tint);

    const lotus = document.createElement("div");
    lotus.className = "lotus-container";

    for (let i = 0; i < 8; i++) {
        const petal = document.createElement("div");
        petal.className = "lotus-petal";
        petal.style.setProperty("--angle", (i * 45) + "deg");
        lotus.appendChild(petal);
    }

    fightArea.appendChild(lotus);

    setTimeout(() => {
        tint.remove();
        lotus.remove();
    }, 4000);
}

function animateMeteor(fightArea) {
    const enemy = document.getElementById("enemy");
    if (!enemy) return;

    const eRect = enemy.getBoundingClientRect();
    const aRect = fightArea.getBoundingClientRect();

    const meteor = document.createElement("div");
    meteor.className = "meteor";
    meteor.style.left = (eRect.left - aRect.left + 20) + "px";
    meteor.style.top = "-50px";

    const trail = document.createElement("div");
    trail.className = "meteor-trail";
    meteor.appendChild(trail);

    fightArea.appendChild(meteor);

    setTimeout(() => {
        const flash = document.createElement("div");
        flash.className = "screen-flash";
        fightArea.appendChild(flash);
        setTimeout(() => flash.remove(), 400);

        shakeBattle();
        meteor.remove();
    }, 1200);
}

// === 水系動畫 ===
function animateWaterStream(fightArea) {
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    if (!player || !enemy) return;

    const pRect = player.getBoundingClientRect();
    const eRect = enemy.getBoundingClientRect();
    const aRect = fightArea.getBoundingClientRect();

    const stream = document.createElement("div");
    stream.className = "aqua-stream aqua-anim";

    const dist = eRect.left - pRect.left - 60;
    const startX = (pRect.right - aRect.left) - 10;
    const startY = (pRect.top - aRect.top) + 30;

    stream.style.left = startX + "px";
    stream.style.top = startY + "px";
    stream.style.setProperty("--travel", (dist + 30) + "px");

    fightArea.appendChild(stream);

    setTimeout(() => {
        const boom = document.createElement("div");
        boom.className = "ice-explosion icon-boom";
        boom.style.left = (eRect.left - aRect.left + 20) + "px";
        boom.style.top = (eRect.top - aRect.top + 10) + "px";
        fightArea.appendChild(boom);
        setTimeout(() => boom.remove(), 450);
        stream.remove();
    }, 400);
}

function animateWaterDragon(fightArea) {
    const vortex = document.createElement("div");
    vortex.className = "water-vortex";
    vortex.innerHTML = "🌊";
    fightArea.appendChild(vortex);

    setTimeout(() => vortex.remove(), 3000);
}

// === 木系動畫 ===
function animateLeafStorm(fightArea) {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const leaf = document.createElement("div");
            leaf.className = "leaf";
            leaf.textContent = "🍃";
            leaf.style.left = Math.random() * 100 + "%";
            leaf.style.animationDelay = (Math.random() * 0.5) + "s";
            fightArea.appendChild(leaf);
            setTimeout(() => leaf.remove(), 1000);
        }, i * 80);
    }
}

function animateTreeGrowth(fightArea) {
    const tree = document.createElement("div");
    tree.className = "tree-growth";
    tree.innerHTML = `
        <div class="trunk"></div>
        <div class="canopy">🌳</div>
    `;
    fightArea.appendChild(tree);

    setTimeout(() => tree.remove(), 4000);
}

// === 金系動畫 ===
function animateSwordRain(fightArea) {
    const enemy = document.getElementById("enemy");
    if (!enemy) return;

    const eRect = enemy.getBoundingClientRect();
    const aRect = fightArea.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sword = document.createElement("div");
            sword.className = "sword-projectile";
            sword.textContent = "⚔️";
            sword.style.left = (eRect.left - aRect.left + Math.random() * 40 - 20) + "px";
            sword.style.top = "-30px";
            fightArea.appendChild(sword);
            setTimeout(() => sword.remove(), 600);
        }, i * 100);
    }
}

function animateGoldenCircle(fightArea) {
    const circle = document.createElement("div");
    circle.className = "golden-circle";
    circle.innerHTML = "✨";
    fightArea.appendChild(circle);

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sword = document.createElement("div");
            sword.className = "circle-sword";
            sword.textContent = "⚔️";
            sword.style.setProperty("--angle", (i * 45) + "deg");
            circle.appendChild(sword);
        }, i * 100);
    }

    setTimeout(() => circle.remove(), 5000);
}

// === 土系動畫 ===
function animateRockFall(fightArea) {
    const enemy = document.getElementById("enemy");
    if (!enemy) return;

    const eRect = enemy.getBoundingClientRect();
    const aRect = fightArea.getBoundingClientRect();

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const rock = document.createElement("div");
            rock.className = "rock";
            rock.textContent = "🪨";
            rock.style.left = (eRect.left - aRect.left + Math.random() * 40 - 20) + "px";
            rock.style.top = "-30px";
            fightArea.appendChild(rock);
            setTimeout(() => rock.remove(), 500);
        }, i * 150);
    }
}
