(function () {
  'use strict';

  // This file is a lightweight loader to ensure dashboard initializes
  // The main dashboard logic lives in exam-timer.js
  // This file can be included separately if needed

  function initDashboard() {
    if (document.getElementById('exam-dashboard-app')) {
      if (typeof window.initExamDashboard === 'function') {
        window.initExamDashboard();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
