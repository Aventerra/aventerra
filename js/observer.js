/* ═══════════════════════════════════════════════════════════════════════
   KINEMATIC DAMPING MATRIX — Intersection Observer Protocol
   
   Governs the initialization of structural elements via critically
   damped motion. The observer permanently severs its connection the
   instant an element reaches absolute visibility (α = 1).
   
   Architecture remains permanently immovable post-initialization.
   Elasticity, acceleration, and continuous loops are strictly forbidden.
   ═══════════════════════════════════════════════════════════════════════

   IMMUTABLE HORIZON — Sentinel Observer Protocol (Directive X)
   
   A zero-height sentinel at y=0 is monitored by a dedicated
   IntersectionObserver. When the sentinel leaves the viewport
   (isIntersecting === false), the .scrolled class is toggled on
   the header, rendering a 1px C_grid bottom border.
   Computation time: O(1). No scroll event listeners.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── KINEMATIC REVEAL CONSTANTS ─── */

    const OBSERVER_CONFIG = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const VISIBILITY_CLASS = 'av-reveal--visible';
    const REVEAL_SELECTOR = '.av-reveal';
    const STAGGER_INTERVAL = 120;

    /* ─── SENTINEL CONSTANTS (Directive X) ─── */

    const SENTINEL_ID = 'av-sentinel';
    const HEADER_ID = 'av-header';
    const SCROLLED_CLASS = 'scrolled';

    /**
     * initializeRevealObserver
     * 
     * Phase I kinematic damping matrix. Elements start at opacity 0 +
     * translateY(32px), transition to full visibility. Observer calls
     * unobserve() immediately upon visibility — permanent severance.
     */
    function initializeRevealObserver() {
        var revealElements = document.querySelectorAll(REVEAL_SELECTOR);

        if (!revealElements.length) return;

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(function (el) {
                el.classList.add(VISIBILITY_CLASS);
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            var intersecting = entries.filter(function (entry) {
                return entry.isIntersecting;
            });

            intersecting.forEach(function (entry, index) {
                var element = entry.target;

                setTimeout(function () {
                    element.classList.add(VISIBILITY_CLASS);

                    // PERMANENT SEVERANCE: Disconnect the instant α = 1
                    observer.unobserve(element);
                }, index * STAGGER_INTERVAL);
            });
        }, OBSERVER_CONFIG);

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /**
     * initializeSweepObserver (Directive XXII & XXIII + Phase XIV.B)
     * 
     * Hardware-accelerated clip-path kinematics.
     * 
     * PHASE XIV.B FIX: Sweep elements nested inside .av-reveal parents
     * must NOT be independently observed. Their clip-path animation
     * would fire while the parent is still opacity: 0, making the
     * transition invisible. Instead, we watch the parent's classList.
     * When av-reveal--visible is added to the parent, THEN we trigger
     * the child sweeps with a short delay to ensure the parent's
     * opacity transition has begun.
     * 
     * Standalone sweep elements (no av-reveal ancestor) are observed
     * directly via IntersectionObserver as before.
     */
    function initializeSweepObserver() {
        var sweepElements = document.querySelectorAll('.av-sweep-reveal');

        if (!sweepElements.length) return;

        if (!('IntersectionObserver' in window)) {
            sweepElements.forEach(function (el) {
                el.classList.add('av-sweep-reveal--visible');
            });
            return;
        }

        // Separate standalone sweeps from nested sweeps
        var standaloneSweeps = [];
        var nestedGroups = {}; // parent element -> [child sweep elements]

        sweepElements.forEach(function (el) {
            var revealParent = el.closest('.av-reveal');
            if (revealParent) {
                // This sweep is nested inside an av-reveal parent
                var parentId = revealParent.id || ('_sweep_parent_' + Math.random());
                if (!revealParent.id) revealParent.id = parentId;
                if (!nestedGroups[parentId]) {
                    nestedGroups[parentId] = { parent: revealParent, children: [] };
                }
                nestedGroups[parentId].children.push(el);
            } else {
                standaloneSweeps.push(el);
            }
        });

        // ─── Standalone sweep observer (direct intersection) ───
        var sweepObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('av-sweep-reveal--visible');
                    // PERMANENT SEVERANCE
                    sweepObserver.unobserve(entry.target);
                }
            });
        }, OBSERVER_CONFIG);

        standaloneSweeps.forEach(function (el) {
            sweepObserver.observe(el);
        });

        // ─── Nested sweep cascade (triggered by parent reveal) ───
        Object.keys(nestedGroups).forEach(function (parentId) {
            var group = nestedGroups[parentId];
            var parent = group.parent;
            var children = group.children;

            // Check if parent is already visible (edge case: above-fold)
            if (parent.classList.contains(VISIBILITY_CLASS)) {
                // Parent already revealed — trigger children immediately
                children.forEach(function (child) {
                    child.classList.add('av-sweep-reveal--visible');
                });
                return;
            }

            // Watch the parent's classList for av-reveal--visible
            var parentObserver = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (parent.classList.contains(VISIBILITY_CLASS)) {
                        // Parent just became visible — trigger child sweep
                        // Short delay ensures parent opacity has begun transitioning
                        setTimeout(function () {
                            children.forEach(function (child) {
                                child.classList.add('av-sweep-reveal--visible');
                            });
                        }, 50);

                        // PERMANENT SEVERANCE — disconnect mutation observer
                        parentObserver.disconnect();
                        return;
                    }
                }
            });

            parentObserver.observe(parent, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    /**
     * initializeSentinelObserver (Directive X)
     * 
     * Monitors a zero-height sentinel element at absolute y=0.
     * When the sentinel leaves the viewport boundary (user scrolls
     * down), isIntersecting becomes false, toggling .scrolled on
     * the header to render the 1px C_grid border.
     * When the user returns to y=0, the sentinel re-enters the
     * viewport and .scrolled is removed — header merges into void.
     * 
     * This observer is NEVER disconnected. It runs at O(1) with
     * zero main-thread scroll entropy.
     */
    function initializeSentinelObserver() {
        var sentinel = document.getElementById(SENTINEL_ID);
        var header = document.getElementById(HEADER_ID);

        if (!sentinel || !header) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback: always show border
            header.classList.add(SCROLLED_CLASS);
            return;
        }

        var sentinelObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Sentinel visible → user is at y=0 → remove border
                    header.classList.remove(SCROLLED_CLASS);
                } else {
                    // Sentinel not visible → user has scrolled → add border
                    header.classList.add(SCROLLED_CLASS);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px'
        });

        sentinelObserver.observe(sentinel);
    }

    /**
     * Initialization gate.
     * Ensures the DOM is fully parsed before observer construction.
     */
    function initialize() {
        initializeRevealObserver();
        initializeSweepObserver();
        initializeSentinelObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
