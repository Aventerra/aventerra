/* ═══════════════════════════════════════════════════════════════════════
   KINEMATIC NODE TRANSITIONING — Hardened Protocol (Directive XIX)
   
   Governs spatial navigation and BFCache (Back/Forward Cache) deadlocks.
   Intercepts anchor routing to perform critically damped opacity fade,
   bypassing interceptions for native multi-tab behavior (modifier keys).
   
   Directive XXXII: Primary navigation links (.av-nav-link) are
   explicitly excluded from the fade-out interceptor. They execute
   standard brute-force browser routing immediately.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var LOADING_CLASS = 'kinematic-loading';
    var FADE_OUT_DURATION = 400; // ms
    var NAV_LINK_CLASS = 'av-nav-link';

    /**
     * resolveOpacity
     * Removes the loading class and forces body to full visibility.
     * This is the SINGLE function responsible for α → 1.
     */
    function resolveOpacity() {
        document.documentElement.classList.remove(LOADING_CLASS);
        document.body.style.opacity = '1';
    }

    /**
     * DOMContentLoaded
     * Resolves the pre-render opacity: 0 state injected in the <head>.
     */
    document.addEventListener('DOMContentLoaded', function () {
        // Set the transition BEFORE removing the class
        document.body.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)';

        requestAnimationFrame(function () {
            resolveOpacity();
        });
    });

    /**
     * Failsafe: If DOMContentLoaded somehow fails to fire (edge case),
     * force opacity resolution after 1500ms absolute maximum.
     */
    setTimeout(function () {
        resolveOpacity();
    }, 1500);

    /**
     * pageshow (BFCache Singularity fix)
     * If the user navigates via Back/Forward buttons, the browser may
     * restore the page from the BFCache. If the page was cached in the
     * middle of a fade-out, it would be permanently invisible.
     * This forces the opacity back to 1.
     */
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            resolveOpacity();
        }
    });

    /**
     * Click Interception
     * Intercepts standard routing links to apply fade-out kinematics.
     * 
     * DIRECTIVE XXXII EXCLUSION: Links with .av-nav-link class are
     * immediately routed without any fade-out. Brute-force page loads
     * are mathematically superior to broken, locked architecture.
     */
    document.addEventListener('click', function (e) {
        // Find closest anchor tag
        var target = e.target.closest('a');
        if (!target) return;

        var href = target.getAttribute('href');
        if (!href) return;

        // ── DIRECTIVE XXXII: IMMEDIATE BYPASS FOR NAV LINKS ──
        if (target.classList.contains(NAV_LINK_CLASS)) {
            // Do NOT preventDefault. Allow standard browser routing.
            return;
        }

        // Ignore hash links (in-page anchors)
        if (href.indexOf('#') === 0) return;

        // Ignore external links
        if (target.hostname && window.location.hostname &&
            target.hostname !== window.location.hostname) return;

        // Ignore if modifier keys are pressed (Ctrl, Shift, Meta/Cmd)
        // This preserves standard "Open in New Tab" functionality.
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.button === 1) {
            return;
        }

        // Prevent immediate routing
        e.preventDefault();

        // Apply fade-out
        document.body.style.transition = 'opacity ' + FADE_OUT_DURATION + 'ms cubic-bezier(0.22, 1, 0.36, 1)';

        requestAnimationFrame(function () {
            document.body.style.opacity = '0';

            // Execute routing after kinematic delay
            setTimeout(function () {
                window.location.href = href;
            }, FADE_OUT_DURATION);
        });
    });

})();
