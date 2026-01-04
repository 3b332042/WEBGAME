
// ⭐⭐⭐ 大招專屬 - 超華麗電影級動畫 ⭐⭐⭐
// 這些動畫會有多個階段,持續時間更長,視覺效果更震撼

// === 火系大招 - 紅蓮業火 ===
function animateUltimateLotus(fightArea) {
    // 第一階段: 屏幕變暗,紅色光暈
    const darkOverlay = document.createElement("div");
    darkOverlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.7);
                z-index: 200;
                animation: fadeIn 0.5s forwards;
            `;
    fightArea.appendChild(darkOverlay);

    setTimeout(() => {
        // 第二階段: 巨大的紅蓮從中心綻放
        const lotus = document.createElement("div");
        lotus.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    z-index: 201;
                `;
        fightArea.appendChild(lotus);

        // 創建多層蓮花花瓣
        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 12; i++) {
                const petal = document.createElement("div");
                const angle = (i / 12) * Math.PI * 2;
                const size = 60 - layer * 15;
                petal.style.cssText = `
                            position: absolute;
                            width: ${size}px;
                            height: ${size * 1.5}px;
                            background: linear-gradient(135deg, 
                                ${layer === 0 ? '#ff0000' : layer === 1 ? '#ff4500' : '#ff6b00'} 0%, 
                                ${layer === 0 ? '#8b0000' : layer === 1 ? '#ff0000' : '#ff4500'} 100%);
                            border-radius: 50% 50% 50% 0;
                            left: 50%;
                            top: 50%;
                            transform-origin: 0 100%;
                            transform: translate(-50%, -50%) rotate(${i * 30 + layer * 15}deg) scale(0);
                            opacity: 0;
                            transition: all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                            box-shadow: 0 0 ${20 + layer * 10}px rgba(255,0,0,0.8),
                                        inset 0 0 ${10 + layer * 5}px rgba(255,255,0,0.5);
                        `;
                lotus.appendChild(petal);

                setTimeout(() => {
                    petal.style.transform = `translate(-50%, -50%) rotate(${i * 30 + layer * 15}deg) 
                                                    scale(1) translateY(-${80 + layer * 20}px)`;
                    petal.style.opacity = "0.95";
                }, 200 + layer * 100 + i * 30);
            }
        }

        // 中心火焰核心
        const core = document.createElement("div");
        core.style.cssText = `
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, #ffff00 0%, #ff6b00 30%, #ff0000 60%, transparent 100%);
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 0 60px #ff0000, 0 0 120px #ff6b00;
                    animation: pulse 0.5s infinite alternate;
                `;
        lotus.appendChild(core);

        // 第三階段: 火焰粒子爆發
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement("div");
                const angle = Math.random() * Math.PI * 2;
                const distance = 150 + Math.random() * 100;
                particle.style.cssText = `
                            position: absolute;
                            width: ${5 + Math.random() * 10}px;
                            height: ${5 + Math.random() * 10}px;
                            background: ${Math.random() > 0.5 ? '#ff0000' : '#ff6b00'};
                            border-radius: 50%;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                            box-shadow: 0 0 10px currentColor;
                            transition: all 1.5s ease-out;
                            z-index: 202;
                        `;
                fightArea.appendChild(particle);

                setTimeout(() => {
                    particle.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
                    particle.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
                    particle.style.opacity = "0";
                }, 50);

                setTimeout(() => particle.remove(), 1600);
            }

            // 屏幕震動
            shakeBattle();
        }, 1500);

        // 第四階段: 淡出
        setTimeout(() => {
            lotus.style.opacity = "0";
            lotus.style.transform = "translate(-50%, -50%) scale(1.5)";
            darkOverlay.style.opacity = "0";
        }, 3000);

        setTimeout(() => {
            lotus.remove();
            darkOverlay.remove();
        }, 3500);
    }, 500);
}

// === 火系大招 - 隕星災變 ===
function animateUltimateMeteor(fightArea) {
    // 第一階段: 天空變暗
    const sky = document.createElement("div");
    sky.style.cssText = `
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, #000033 0%, #330000 100%);
                opacity: 0;
                transition: opacity 1s;
                z-index: 200;
            `;
    fightArea.appendChild(sky);

    setTimeout(() => {
        sky.style.opacity = "0.8";
    }, 50);

    // 第二階段: 多顆隕石從天而降
    setTimeout(() => {
        const meteorCount = 5;
        for (let i = 0; i < meteorCount; i++) {
            setTimeout(() => {
                const meteor = document.createElement("div");
                const startX = 20 + Math.random() * 60;
                meteor.style.cssText = `
                            position: absolute;
                            width: ${40 + Math.random() * 30}px;
                            height: ${40 + Math.random() * 30}px;
                            background: radial-gradient(circle, #ffff00 0%, #ff6b00 30%, #ff0000 60%, #8b0000 100%);
                            border-radius: 50%;
                            left: ${startX}%;
                            top: -100px;
                            box-shadow: 0 0 40px #ff6b00, 0 0 80px #ff0000;
                            transition: all 1.2s cubic-bezier(0.5, 0, 0.75, 0);
                            z-index: 201;
                        `;
                fightArea.appendChild(meteor);

                // 火焰尾跡
                const trail = document.createElement("div");
                trail.style.cssText = `
                            position: absolute;
                            width: 120px;
                            height: 300px;
                            background: linear-gradient(to bottom, 
                                rgba(255,255,0,0.9) 0%, 
                                rgba(255,107,0,0.7) 30%,
                                rgba(255,0,0,0.5) 60%,
                                transparent 100%);
                            left: ${startX}%;
                            top: -400px;
                            transform: translateX(-50%);
                            filter: blur(15px);
                            transition: all 1.2s cubic-bezier(0.5, 0, 0.75, 0);
                            z-index: 200;
                        `;
                fightArea.appendChild(trail);

                // 墜落
                setTimeout(() => {
                    const targetY = 30 + Math.random() * 40;
                    meteor.style.top = `${targetY}%`;
                    trail.style.top = `calc(${targetY}% - 200px)`;
                }, 50);

                // 撞擊效果
                setTimeout(() => {
                    meteor.remove();
                    trail.remove();

                    // 爆炸光環
                    for (let j = 0; j < 3; j++) {
                        setTimeout(() => {
                            const wave = document.createElement("div");
                            wave.style.cssText = `
                                        position: absolute;
                                        width: 60px;
                                        height: 60px;
                                        border: 4px solid rgba(255,${107 - j * 30},0,${0.9 - j * 0.2});
                                        border-radius: 50%;
                                        left: ${startX}%;
                                        top: ${30 + Math.random() * 40}%;
                                        transform: translate(-50%, -50%);
                                        transition: all 1s ease-out;
                                        z-index: 202;
                                    `;
                            fightArea.appendChild(wave);

                            setTimeout(() => {
                                wave.style.width = "200px";
                                wave.style.height = "200px";
                                wave.style.opacity = "0";
                            }, 50);

                            setTimeout(() => wave.remove(), 1100);
                        }, j * 100);
                    }

                    // 火焰粒子
                    for (let k = 0; k < 20; k++) {
                        const particle = document.createElement("div");
                        const angle = (k / 20) * Math.PI * 2;
                        particle.style.cssText = `
                                    position: absolute;
                                    width: 8px;
                                    height: 8px;
                                    background: #ff6b00;
                                    border-radius: 50%;
                                    left: ${startX}%;
                                    top: ${30 + Math.random() * 40}%;
                                    transform: translate(-50%, -50%);
                                    transition: all 0.8s ease-out;
                                    z-index: 201;
                                `;
                        fightArea.appendChild(particle);

                        setTimeout(() => {
                            particle.style.left = `calc(${startX}% + ${Math.cos(angle) * 80}px)`;
                            particle.style.top = `calc(${30 + Math.random() * 40}% + ${Math.sin(angle) * 80}px)`;
                            particle.style.opacity = "0";
                        }, 50);

                        setTimeout(() => particle.remove(), 900);
                    }

                    shakeBattle();
                }, 1250);
            }, i * 300);
        }
    }, 1000);

    // 淡出
    setTimeout(() => {
        sky.style.opacity = "0";
    }, 4000);

    setTimeout(() => {
        sky.remove();
    }, 5000);
}

// === 水系大招 - 蒼龍漩渦 ===
function animateUltimateWaterDragon(fightArea) {
    // 第一階段: 水霧瀰漫
    const mist = document.createElement("div");
    mist.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(77,171,247,0.3) 0%, rgba(25,113,194,0.5) 100%);
        opacity: 0;
        transition: opacity 1s;
        z-index: 200;
    `;
    fightArea.appendChild(mist);

    setTimeout(() => {
        mist.style.opacity = "1";
    }, 50);

    // 第二階段: 巨大水漩渦在敵人位置形成
    setTimeout(() => {
        const vortex = document.createElement("div");
        vortex.style.cssText = `
            position: absolute;
            right: 17.5%;
            top: 50%;
            width: 200px;
            height: 200px;
            transform: translate(50%, -50%) scale(0);
            z-index: 201;
            transition: all 1s ease-out;
        `;
        fightArea.appendChild(vortex);

        // 創建多層旋轉水環
        for (let layer = 0; layer < 5; layer++) {
            const ring = document.createElement("div");
            const size = 180 - layer * 30;
            ring.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border: ${8 - layer}px solid rgba(77,171,247,${0.8 - layer * 0.15});
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
                box-shadow: 
                    0 0 20px rgba(77,171,247,0.6),
                    inset 0 0 20px rgba(77,171,247,0.4);
                animation: rotateVortex ${2 + layer * 0.3}s linear infinite;
            `;
            vortex.appendChild(ring);
        }

        // 漩渦放大
        setTimeout(() => {
            vortex.style.transform = "translate(50%, -50%) scale(1)";
        }, 100);

        // 第三階段: 水珠爆炸四散
        setTimeout(() => {
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    const drop = document.createElement("div");
                    const angle = (i / 60) * Math.PI * 2;
                    drop.style.cssText = `
                        position: absolute;
                        width: 15px;
                        height: 15px;
                        background: radial-gradient(circle, #4dabf7 0%, #1971c2 100%);
                        border-radius: 50%;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        box-shadow: 0 0 15px rgba(77,171,247,0.8);
                        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        opacity: 1;
                        z-index: 202;
                    `;
                    vortex.appendChild(drop);

                    // 爆炸向外擴散
                    setTimeout(() => {
                        const distance = 150 + Math.random() * 100;
                        drop.style.transform = `
                            translate(-50%, -50%) 
                            translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)
                        `;
                        drop.style.opacity = "0";
                    }, 50);

                    setTimeout(() => drop.remove(), 900);
                }, i * 15);
            }

            shakeBattle();
        }, 1500);

        // 漩渦淡出
        setTimeout(() => {
            vortex.style.opacity = "0";
        }, 2500);

        setTimeout(() => {
            vortex.remove();
        }, 3500);
    }, 500);

    // 淡出
    setTimeout(() => {
        mist.style.opacity = "0";
    }, 3500);

    setTimeout(() => {
        mist.remove();
        const vortex = fightArea.querySelector('div[style*="bottom: 50px"]');
        if (vortex) vortex.remove();
    }, 4500);

    // 添加旋轉動畫到頁面
    if (!document.querySelector('#vortex-animation')) {
        const style = document.createElement('style');
        style.id = 'vortex-animation';
        style.textContent = `
            @keyframes rotateVortex {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// === 木系大招 - 古樹降臨 (聖光版) ===
function animateUltimateTreeOfLife(fightArea) {
    // 第一階段: 聖地顯現
    shakeBattle();

    const ground = document.createElement("div");
    ground.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50px;
                background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
                box-shadow: 0 -10px 30px rgba(255, 215, 0, 0.3);
                z-index: 200;
                opacity: 0;
                transition: opacity 1s;
            `;
    fightArea.appendChild(ground);

    setTimeout(() => ground.style.opacity = "1", 50);

    // 光流匯聚
    for (let i = 0; i < 8; i++) {
        const ray = document.createElement("div");
        const leftPos = 10 + Math.random() * 80;
        ray.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: ${100 + Math.random() * 200}px;
                    background: linear-gradient(to top, rgba(255, 215, 0, 0.8), transparent);
                    bottom: 0;
                    left: ${leftPos}%;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.8s ease-out;
                    z-index: 201;
                    box-shadow: 0 0 10px gold;
                `;
        fightArea.appendChild(ray);

        setTimeout(() => {
            ray.style.transform = "scaleY(1)";
        }, i * 100);

        setTimeout(() => ray.remove(), 2000); // 匯聚後消失
    }

    // 第二階段: 聖木生長
    setTimeout(() => {
        const tree = document.createElement("div");
        tree.style.cssText = `
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    width: 120px;
                    height: 350px;
                    transform: translateX(-50%) scaleY(0);
                    transform-origin: bottom;
                    transition: all 2s cubic-bezier(0.22, 1, 0.36, 1);
                    z-index: 202;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                `;
        fightArea.appendChild(tree);

        // 光之樹幹
        const trunk = document.createElement("div");
        trunk.style.cssText = `
                    width: 60px;
                    height: 100%;
                    background: linear-gradient(to right, #ffd700, #fffdd0, #ffd700);
                    border-radius: 10px;
                    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.8);
                    position: relative;
                `;
        tree.appendChild(trunk);

        // 聖光樹冠 (用光球和符文表示)
        const canopy = document.createElement("div");
        canopy.style.cssText = `
                    position: absolute;
                    top: -80px;
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 215, 0, 0.4) 60%, transparent 100%);
                    border-radius: 50%;
                    filter: blur(5px);
                    box-shadow: 0 0 60px gold;
                    animation: pulseLight 2s infinite alternate;
                `;
        tree.appendChild(canopy);

        // 添加動畫樣式
        if (!document.getElementById('anim-holy-tree')) {
            const style = document.createElement('style');
            style.id = 'anim-holy-tree';
            style.innerHTML = `
                @keyframes pulseLight {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.1); opacity: 1; }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            tree.style.transform = "translateX(-50%) scaleY(1)";
        }, 100);

        // 第三階段: 聖光四溢 (粒子效果)
        setTimeout(() => {
            // 爆發光芒
            const burst = document.createElement("div");
            burst.style.cssText = `
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                box-shadow: 0 0 100px 50px white;
                border-radius: 50%;
                z-index: 205;
                animation: fadeOut 0.5s forwards;
            `;
            fightArea.appendChild(burst);
            setTimeout(() => burst.remove(), 500);

            // 飄升的光點/符文
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    const particle = document.createElement("div");
                    const isRune = Math.random() > 0.7;
                    particle.textContent = isRune ? ["✨", "✦", "❂", "☼"][Math.floor(Math.random() * 4)] : "";

                    const size = isRune ? (15 + Math.random() * 10) : (4 + Math.random() * 6);
                    const color = Math.random() > 0.5 ? "#fff" : "#ffd700";

                    particle.style.cssText = `
                                position: absolute;
                                width: ${isRune ? 'auto' : size + 'px'};
                                height: ${isRune ? 'auto' : size + 'px'};
                                background: ${isRune ? 'transparent' : color};
                                color: ${color};
                                font-size: ${size}px;
                                border-radius: 50%;
                                left: 50%;
                                top: 40%;
                                box-shadow: ${isRune ? 'none' : '0 0 10px ' + color};
                                text-shadow: ${isRune ? '0 0 5px ' + color : 'none'};
                                z-index: 204;
                                animation: floatUp ${1.5 + Math.random()}s linear forwards;
                            `;

                    // 隨機初始位置偏移
                    const offsetX = (Math.random() - 0.5) * 200;
                    const offsetY = (Math.random() - 0.5) * 50;
                    particle.style.marginLeft = offsetX + "px";
                    particle.style.marginTop = offsetY + "px";

                    fightArea.appendChild(particle);

                    setTimeout(() => particle.remove(), 2500);
                }, i * 50);
            }

            // 恢復震動
            shakeBattle();
        }, 1800);

        // 淡出
        setTimeout(() => {
            tree.style.opacity = "0";
            tree.style.transform = "translateX(-50%) scaleY(1.2)";
            ground.style.opacity = "0";
        }, 4000);

        setTimeout(() => {
            tree.remove();
            ground.remove();
        }, 5000);
    }, 800);
}

// === 金系大招 - 萬劍歸宗 ===
function animateUltimateGoldenCircle(fightArea) {
    // 第一階段: 玩家頭頂金光聚集
    const playerGlow = document.createElement("div");
    playerGlow.style.cssText = `
        position: absolute;
        left: 20%;
        top: 30%;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0.3) 50%, transparent 100%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: all 1s ease-out;
        z-index: 200;
        box-shadow: 0 0 60px gold;
    `;
    fightArea.appendChild(playerGlow);

    setTimeout(() => {
        playerGlow.style.transform = "translate(-50%, -50%) scale(1)";
    }, 50);

    // 第二階段: 在玩家頭頂生成旋轉的金色法陣
    setTimeout(() => {
        const circle = document.createElement("div");
        circle.style.cssText = `
            position: absolute;
            width: 120px;
            height: 120px;
            border: 3px solid gold;
            border-radius: 50%;
            left: 20%;
            top: 20%;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            box-shadow: 0 0 30px gold, inset 0 0 20px gold;
            opacity: 0;
            transition: all 1s ease-out;
            z-index: 201;
        `;
        fightArea.appendChild(circle);

        // 內圈
        const innerCircle = document.createElement("div");
        innerCircle.style.cssText = `
            position: absolute;
            width: 80px;
            height: 80px;
            border: 2px solid gold;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px gold;
        `;
        circle.appendChild(innerCircle);

        // 符文
        for (let i = 0; i < 6; i++) {
            const rune = document.createElement("div");
            rune.textContent = ["✦", "✧", "✨", "⭐", "✪", "◆"][i];
            rune.style.cssText = `
                position: absolute;
                font-size: 18px;
                color: gold;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(${i * 60}deg) translateY(-50px);
                filter: drop-shadow(0 0 8px gold);
            `;
            circle.appendChild(rune);
        }

        setTimeout(() => {
            circle.style.transform = "translate(-50%, -50%) scale(1) rotate(360deg)";
            circle.style.opacity = "1";
        }, 100);

        // 第三階段: 從法陣中射出飛劍攻擊敵人
        setTimeout(() => {
            const rowCount = 3; // 6排
            const swordsPerRow = 3; // 每排5把劍

            for (let row = 0; row < rowCount; row++) {
                setTimeout(() => {
                    for (let col = 0; col < swordsPerRow; col++) {
                        setTimeout(() => {
                            const sword = document.createElement("img");
                            sword.src = "image/aAA0lnedwg-Photoroom.png";

                            // 在玩家頭頂排成一排
                            const startX = 15 + col * 2; // 水平排列
                            const startY = 10 + row * 3; // 每排稍微往下

                            sword.style.cssText = `
                                position: absolute;
                                width: 40px;
                                height: auto;
                                left: ${startX}%;
                                top: ${startY}%;
                                transform: translate(-50%, -50%) rotate(-70deg);
                                filter: drop-shadow(0 0 10px gold) brightness(1.2);
                                transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                                z-index: 202;
                                opacity: 0;
                            `;
                            fightArea.appendChild(sword);

                            // 飛劍先出現在頭上
                            setTimeout(() => {
                                sword.style.opacity = "1";
                            }, 50);

                            // 停留1秒後射向敵人
                            setTimeout(() => {
                                sword.style.left = "100%";
                                sword.style.top = `calc(50% + ${(Math.random() - 0.5) * 80}px)`;
                            }, 1000);

                            // 命中後直接消失
                            setTimeout(() => {
                                sword.remove();
                            }, 1200);
                        }, col * 50); // 每把劍間隔50ms
                    }
                }, row * 200); // 每排間隔200ms
            }

            shakeBattle();
        }, 1200);

        // 淡出
        setTimeout(() => {
            circle.style.opacity = "0";
            circle.style.transform = "translate(-50%, -50%) scale(0.5) rotate(720deg)";
            playerGlow.style.opacity = "0";
        }, 3500);

        setTimeout(() => {
            circle.remove();
            playerGlow.remove();
        }, 4500);
    }, 500);
}
