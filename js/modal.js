/* ═══════════════════════════════════════════════════════════════════════
   THE COGNITIVE INGESTION MATRIX (Phase XXXII & XXXIII)
   
   Kinematic entry logic for the modal overlay. Governs the critically
   damped transition, validation interception, and lockdown protocol.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    function initModal() {
        var modalBackdrop = document.getElementById('cognitive-modal');
        var applyButtons = document.querySelectorAll('.av-node__vector');
        var closeButton = document.getElementById('modal-close');
        
        var form = document.getElementById('cognitive-form');
        var submitBtn = document.getElementById('submit-btn');
        var inputs = form ? form.querySelectorAll('input, select') : [];
        var lockdown = document.getElementById('av-lockdown');
        
        if (!modalBackdrop || applyButtons.length === 0) return;

        // Helper to close modal
        function closeModal() {
            modalBackdrop.classList.remove('is-active');
        }

        // Wire Kinematic Entry
        for (var i = 0; i < applyButtons.length; i++) {
            applyButtons[i].addEventListener('click', function (e) {
                e.preventDefault();
                modalBackdrop.classList.add('is-active');
            });
        }

        // Wire Exit Vector (Modal Closure)
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Wire Click-Outside Suppression
        modalBackdrop.addEventListener('click', function (e) {
            // Close if clicking strictly on the dark backdrop, not the white modal
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });

        // Keyboard Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
                closeModal();
            }
        });

        // ─── ALGORITHMIC VALIDATION (Phase XXXIII) ───
        if (form && submitBtn) {
            
            function resetValidationState() {
                submitBtn.textContent = 'INITIALIZE SUBMISSION';
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].classList.remove('av-terminal__input--error');
                }
            }

            // Reset button text and field errors upon interaction
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].addEventListener('input', resetValidationState);
                inputs[j].addEventListener('change', resetValidationState);
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var isValid = true;
                
                // The Verification
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    if (input.required && !input.value.trim()) {
                        isValid = false;
                        input.classList.add('av-terminal__input--error');
                    }
                }
                
                // The Rejection State
                if (!isValid) {
                    submitBtn.textContent = 'INCOMPLETE COGNITIVE PARAMETERS';
                    return;
                }
                
                // The Lockdown Assimilation (Success State)
                closeModal();
                
                // Eradicate environment and trigger lockdown
                document.body.style.backgroundColor = 'var(--c-base)';
                if (lockdown) {
                    lockdown.classList.add('av-lockdown--active');
                }
                
                // The Routing Vector
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 4500);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }

})();
