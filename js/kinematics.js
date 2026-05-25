/* ═══════════════════════════════════════════════════════════════════════
   QUANTITATIVE STATE RESOLUTION — Locked Kinematics (Directive XII)
   
   Randomized integer flux upon intersection. Character array length
   is strictly locked. Decimal points, commas, and structural operators
   remain immovably anchored at fixed indices. Only alphanumeric
   integers are subject to exponential decay.
   
   ε(t) → 0 exactly at t = 1200ms.
   Upon total convergence, the IntersectionObserver permanently severs.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var FLUX_SELECTOR = '[data-flux-target]';
    var FLUX_DURATION = 1200;      // ms — matches kinematic damping matrix
    var FLUX_INTERVAL = 40;        // ms — update rate (~25fps for smooth digit cycling)
    var FLUX_CHARS = '0123456789';

    /**
     * isStructuralChar
     * 
     * Returns true if the character is a structural operator that
     * must remain immovably anchored at its fixed index.
     * Decimals, commas, percent signs, currency symbols, 'x' multipliers,
     * 'B'/'M'/'K' magnitude suffixes, and spaces are structural.
     */
    function isStructuralChar(ch) {
        return '.,%$xBMKbmk -+/'.indexOf(ch) !== -1;
    }

    /**
     * generateFluxString
     * 
     * Produces a flux string where L_flux === L_target at all times.
     * Structural characters (decimals, commas, symbols) remain anchored.
     * Mutable digit indices receive random integers.
     * 
     * @param {string} target - The final target string
     * @param {number[]} mutableIndices - Indices of mutable (digit) characters
     * @returns {string} Flux string of identical length
     */
    function generateFluxString(target, mutableIndices) {
        var chars = target.split('');
        for (var i = 0; i < mutableIndices.length; i++) {
            var idx = mutableIndices[i];
            chars[idx] = FLUX_CHARS.charAt(Math.floor(Math.random() * FLUX_CHARS.length));
        }
        return chars.join('');
    }

    /**
     * computeMutableIndices
     * 
     * Scans the target string and returns an array of indices
     * that contain mutable alphanumeric digits. Structural characters
     * are excluded — they remain permanently anchored.
     * 
     * @param {string} target - The target string
     * @returns {number[]} Array of mutable character indices
     */
    function computeMutableIndices(target) {
        var indices = [];
        for (var i = 0; i < target.length; i++) {
            if (!isStructuralChar(target[i])) {
                indices.push(i);
            }
        }
        return indices;
    }

    /**
     * runFlux
     * 
     * Executes the exponential decay flux animation on an element.
     * At each FLUX_INTERVAL tick, the probability of a digit converging
     * to its target value increases exponentially.
     * 
     * The exponential decay function:
     *   p(t) = 1 - e^(-k * t)
     * where k is calibrated so that p(FLUX_DURATION) ≈ 1
     * 
     * At t = FLUX_DURATION, all digits have converged (ε(t) = 0).
     * 
     * @param {HTMLElement} element - The element to animate
     * @param {string} target - The final target string
     * @param {Function} onComplete - Callback when flux reaches ε(t) = 0
     */
    function runFlux(element, target, onComplete) {
        var mutableIndices = computeMutableIndices(target);

        if (mutableIndices.length === 0) {
            element.textContent = target;
            if (onComplete) onComplete();
            return;
        }

        // Track which indices have converged
        var converged = {};
        var startTime = Date.now();

        // Exponential decay constant: k = -ln(0.01) / FLUX_DURATION
        // ensures 99% probability of convergence at t = FLUX_DURATION
        var k = -Math.log(0.01) / FLUX_DURATION;

        var intervalId = setInterval(function () {
            var elapsed = Date.now() - startTime;
            var t = Math.min(elapsed / FLUX_DURATION, 1);

            // Probability of convergence at this time step
            var p = 1 - Math.exp(-k * elapsed);

            // For each mutable index, decide if it converges
            for (var i = 0; i < mutableIndices.length; i++) {
                var idx = mutableIndices[i];
                if (!converged[idx] && Math.random() < p) {
                    converged[idx] = true;
                }
            }

            // Build the current display string
            var chars = target.split('');
            var allConverged = true;

            for (var j = 0; j < mutableIndices.length; j++) {
                var midx = mutableIndices[j];
                if (converged[midx]) {
                    // Already converged — show target character
                    chars[midx] = target[midx];
                } else {
                    allConverged = false;
                    chars[midx] = FLUX_CHARS.charAt(
                        Math.floor(Math.random() * FLUX_CHARS.length)
                    );
                }
            }

            element.textContent = chars.join('');

            // Force convergence at t = 1 (exactly FLUX_DURATION)
            if (t >= 1 || allConverged) {
                clearInterval(intervalId);
                element.textContent = target;
                if (onComplete) onComplete();
            }
        }, FLUX_INTERVAL);
    }

    /**
     * initializeFluxObserver (Phase XIV.B — Nested Cascade Fix)
     * 
     * Creates flux animations for elements with [data-flux-target].
     * 
     * Standalone flux elements: observed directly via IntersectionObserver.
     * Nested flux elements (inside .av-sweep-reveal or .av-reveal):
     * delayed until the parent sweep/reveal becomes visible, ensuring
     * the counting animation runs AFTER the geometric clip expands.
     */
    function initializeFluxObserver() {
        var fluxElements = document.querySelectorAll(FLUX_SELECTOR);

        if (!fluxElements.length) return;

        if (!('IntersectionObserver' in window)) {
            fluxElements.forEach(function (el) {
                el.textContent = el.getAttribute('data-flux-target');
            });
            return;
        }

        // Pre-render: zero all digits while keeping structural chars
        fluxElements.forEach(function (el) {
            var target = el.getAttribute('data-flux-target');
            if (target) {
                var mutableIndices = computeMutableIndices(target);
                var initChars = target.split('');
                for (var i = 0; i < mutableIndices.length; i++) {
                    initChars[mutableIndices[i]] = '0';
                }
                el.textContent = initChars.join('');
            }
        });

        // Helper: fire flux on an element
        function triggerFlux(element) {
            var target = element.getAttribute('data-flux-target');
            if (!target || element._fluxFired) return;
            element._fluxFired = true;
            var mutableIndices = computeMutableIndices(target);
            element.textContent = generateFluxString(target, mutableIndices);
            runFlux(element, target);
        }

        // Separate standalone from nested
        var standaloneFlux = [];
        var nestedFluxGroups = {}; // parentId -> { parent, visibleClass, children }

        fluxElements.forEach(function (el) {
            // Check for sweep parent first, then reveal parent
            var sweepParent = el.closest('.av-sweep-reveal');
            var revealParent = el.closest('.av-reveal');
            var targetParent = sweepParent || revealParent;
            var visibleClass = sweepParent ? 'av-sweep-reveal--visible' : 'av-reveal--visible';

            if (targetParent) {
                var parentId = targetParent.id || ('_flux_parent_' + Math.random());
                if (!targetParent.id) targetParent.id = parentId;
                if (!nestedFluxGroups[parentId]) {
                    nestedFluxGroups[parentId] = {
                        parent: targetParent,
                        visibleClass: visibleClass,
                        children: []
                    };
                }
                nestedFluxGroups[parentId].children.push(el);
            } else {
                standaloneFlux.push(el);
            }
        });

        // ─── Standalone flux: direct intersection observer ───
        if (standaloneFlux.length) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    triggerFlux(entry.target);
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -40px 0px'
            });

            standaloneFlux.forEach(function (el) {
                observer.observe(el);
            });
        }

        // ─── Nested flux: triggered by parent visibility ───
        Object.keys(nestedFluxGroups).forEach(function (parentId) {
            var group = nestedFluxGroups[parentId];
            var parent = group.parent;
            var visibleClass = group.visibleClass;
            var children = group.children;

            // If parent is already visible (above-fold), fire immediately
            if (parent.classList.contains(visibleClass)) {
                children.forEach(function (child) { triggerFlux(child); });
                return;
            }

            // Watch parent classList for the visible class
            var mo = new MutationObserver(function () {
                if (parent.classList.contains(visibleClass)) {
                    // Delay flux start so the sweep clip-path has time to expand
                    setTimeout(function () {
                        children.forEach(function (child) { triggerFlux(child); });
                    }, 200);
                    mo.disconnect();
                }
            });

            mo.observe(parent, { attributes: true, attributeFilter: ['class'] });
        });
    }

    /**
     * Initialization gate.
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFluxObserver);
    } else {
        initializeFluxObserver();
    }

})();
