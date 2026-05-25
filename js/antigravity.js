/* ═══════════════════════════════════════════════════════════════════════
   THE ABSOLUTE STATE — VECTOR TOPOLOGY (Phase XXIX.C)
   MOBILE VIEWPORT STERILIZATION (Phase XXX)
   
   Micro-containment antigravity field (100px x 150px).
   - Eradication of Fills: No dots, no gradients. Pure 1px mathematical vectors.
   - Naked Parametric Vectors: 4 intersecting continuous sine waves with distinct
     prime-number phase shifts. Abyssal Navy with staggered opacities.
   - Execution Hook: Amplitude mathematically snaps to 0 on scroll, flattening
     into a single line while fading.
   - Battery Mandate: Engine self-terminates instantly on mobile OS detection.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var canvas, ctx;
    var width = 100;
    var height = 150;
    var isRunning = true;
    var hasExecuted = false;
    var globalOpacity = 1.0;
    
    // Wave Constraints
    var BASE_COLOR = '2, 10, 28'; // Abyssal Navy
    var BASE_Y = height - 20;
    var time = 0;
    
    // 4 Waves: [Opacity, Amplitude, Frequency (k), Speed (omega)]
    // Prime number frequencies and speeds to prevent looping interference patterns.
    var waves = [
        { opacity: 0.40, amp: 12, k: 0.031, omega: 0.043 },
        { opacity: 0.20, amp: 18, k: 0.017, omega: 0.059 },
        { opacity: 0.12, amp:  8, k: 0.047, omega: 0.023 },
        { opacity: 0.06, amp: 22, k: 0.023, omega: 0.071 }
    ];
    
    // Ignition Surge Mechanics
    var surgeMultiplier = 5.0; // Starts at 5x amplitude/velocity
    var SURGE_DECAY = 0.04;    // ~1500ms logarithmic decay

    function init() {
        // Battery Mandate: Computational Throttling for Mobile Devices
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        canvas = document.getElementById('antigravity-well');
        if (!canvas) return;

        if (isMobile) {
            // Absolute sterilization. Zero kinematics on handheld hardware.
            canvas.style.display = 'none';
            return; 
        }
        
        ctx = canvas.getContext('2d', { alpha: true });
        
        resize();
        
        window.addEventListener('scroll', onScroll, { passive: true });

        requestAnimationFrame(render);
    }

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    function onScroll() {
        if (!hasExecuted && window.scrollY > 5) {
            hasExecuted = true;
            window.removeEventListener('scroll', onScroll, { passive: true });
        }
    }

    function render() {
        if (!isRunning) return;

        ctx.clearRect(0, 0, width, height);

        // Process Ignition Decay
        if (!hasExecuted) {
            surgeMultiplier -= (surgeMultiplier - 1.0) * SURGE_DECAY;
            if (surgeMultiplier < 1.01) surgeMultiplier = 1.0;
        }

        // Process Execution Collapse
        if (hasExecuted) {
            surgeMultiplier *= 0.5; // Mathematically snap amplitude toward 0
            globalOpacity -= 0.08; // Rapid absolute dissolve
            
            if (globalOpacity <= 0) {
                globalOpacity = 0;
                isRunning = false; // Terminate loop permanently
                canvas.style.display = 'none'; 
            }
        }

        // Render each parametric vector
        for (var w = 0; w < waves.length; w++) {
            var wave = waves[w];
            var currentOpacity = wave.opacity * globalOpacity;
            
            if (currentOpacity <= 0.001) continue;

            ctx.beginPath();
            ctx.lineWidth = 1; // Pure 1px mathematical stroke
            ctx.strokeStyle = 'rgba(' + BASE_COLOR + ', ' + currentOpacity.toFixed(3) + ')';
            
            var currentAmp = wave.amp * surgeMultiplier;
            var currentOmega = wave.omega * surgeMultiplier;

            // Draw line segment across the containment well
            for (var x = 0; x <= width; x += 2) {
                // y(x,t) = A * sin(kx - wt)
                var y = BASE_Y + (currentAmp * Math.sin((wave.k * x) - (time * currentOmega)));
                
                // Edge fade (radial phantom edge from previous phase horizontally)
                // Actually, vectors fading at the edge looks elegant and preserves containment.
                // We'll fade the line globally by globalOpacity, but vectors don't strictly need edge fade.
                // It's a 100px containment box, we can just let it clip or draw it fully.
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        }

        // Advance baseline time
        time += 1.0;

        requestAnimationFrame(render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
