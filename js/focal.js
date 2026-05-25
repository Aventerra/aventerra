/* ═══════════════════════════════════════════════════════════════════════
   Z-AXIS FOCAL MATRIX — Global Viewport Suppression (Phase XLVII)
   
   Hardware-accelerated focal depth via CSS transform and opacity.
   Uses IntersectionObserver to track every single <section>.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var FOCUSED_CLASS = 'av-section-focused';
    var SUPPRESSED_CLASS = 'av-section-suppressed';

    function initializeFocalObserver() {
        var sections = document.querySelectorAll('section');
        if (!sections.length) return;

        if (!('IntersectionObserver' in window)) {
            sections.forEach(function (el) { 
                el.classList.add(FOCUSED_CLASS);
                el.classList.remove(SUPPRESSED_CLASS);
            });
            return;
        }

        // Pre-initialize everything to suppressed. The observer will fire immediately for elements in view.
        sections.forEach(function (el) { 
            el.classList.add(SUPPRESSED_CLASS);
            el.classList.remove(FOCUSED_CLASS);
        });

        var isAtBottom = false;
        var directoryEl = sections[sections.length - 1];
        var metricsEl = sections.length >= 2 ? sections[sections.length - 2] : null;

        var focalObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var el = entry.target;
                
                // Terminal Boundary Override from Phase XVIII.B
                if (isAtBottom && (el === directoryEl || el === metricsEl)) {
                    return;
                }

                if (entry.isIntersecting) {
                    el.classList.add(FOCUSED_CLASS);
                    el.classList.remove(SUPPRESSED_CLASS);
                } else {
                    el.classList.remove(FOCUSED_CLASS);
                    el.classList.add(SUPPRESSED_CLASS);
                }
            });
        }, {
            rootMargin: '-25% 0px -25% 0px',
            threshold: 0
        });

        sections.forEach(function (el) {
            focalObserver.observe(el);
        });

        // ─── SCROLL-FLOOR INTERCEPTION (Terminal Boundary Override) ───
        var ticking = false;

        function checkScrollFloor() {
            var scrollY = window.scrollY || window.pageYOffset;
            var currentAtBottom = (scrollY + window.innerHeight >= document.body.offsetHeight - 2);

            if (currentAtBottom && !isAtBottom) {
                isAtBottom = true;
                
                if (metricsEl) {
                    metricsEl.classList.remove(FOCUSED_CLASS);
                    metricsEl.classList.add(SUPPRESSED_CLASS);
                }
                if (directoryEl) {
                    directoryEl.classList.remove(SUPPRESSED_CLASS);
                    directoryEl.classList.add(FOCUSED_CLASS);
                }
            } else if (!currentAtBottom && isAtBottom) {
                isAtBottom = false;
                if (metricsEl) {
                    focalObserver.unobserve(metricsEl);
                    focalObserver.observe(metricsEl);
                }
                if (directoryEl) {
                    focalObserver.unobserve(directoryEl);
                    focalObserver.observe(directoryEl);
                }
            }
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    checkScrollFloor();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        checkScrollFloor();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFocalObserver);
    } else {
        initializeFocalObserver();
    }

})();
