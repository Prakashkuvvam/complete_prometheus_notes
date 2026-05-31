(function () {
  'use strict';

  /* =============================================================
     PRACTICE TEST INTERACTIVE ENGINE
     Transforms static practice test pages into interactive quizzes
     with radio/checkbox answers, submit button, and scoring.
     ============================================================= */

  // ── Config ──
  var PASS_THRESHOLD = 0.70; // 70%

  var article = document.querySelector('.book-article');
  if (!article) return;

  // ──────────────────────────────────────────────────────────
  // 1. PARSE ANSWER KEY from the table at the bottom
  // ──────────────────────────────────────────────────────────

  function parseAnswerKey() {
    var key = {};
    var tables = article.querySelectorAll('table');

    for (var t = 0; t < tables.length; t++) {
      var table = tables[t];

      // Check if this looks like an answer key table
      var headerCells = table.querySelectorAll('th');
      var isAnswerTable = false;
      for (var h = 0; h < headerCells.length; h++) {
        if (/^q$/i.test(headerCells[h].textContent.trim())) {
          isAnswerTable = true;
          break;
        }
      }
      if (!isAnswerTable) continue;

      var rows = table.querySelectorAll('tbody tr');
      if (!rows.length) rows = table.querySelectorAll('tr');

      // Determine column grouping from number of cells
      // Layout (6 cols): Q | Answer | Domain | Q | Answer | Domain
      // Layout (4 cols): Q | Answer | Q | Answer
      // Layout (2 cols): Q | Answer
      var numCells = 0;
      if (rows.length > 0) {
        numCells = rows[0].querySelectorAll('td').length;
      }
      var groupSize = 0;
      var numGroups = 0;
      if (numCells === 6) {
        groupSize = 3; // Q, Answer, Domain — read Q at i, Answer at i+1
        numGroups = 2;
      } else if (numCells >= 4) {
        groupSize = 2; // Q, Answer — read pairs
        numGroups = Math.floor(numCells / 2);
      } else {
        groupSize = 2;
        numGroups = 1;
      }

      for (var r = 0; r < rows.length; r++) {
        var cells = rows[r].querySelectorAll('td');
        if (cells.length < 2) continue;

        for (var g = 0; g < numGroups; g++) {
          var qIdx = g * groupSize;
          var aIdx = g * groupSize + 1;

          if (qIdx >= cells.length || aIdx >= cells.length) continue;

          var qNumStr = cells[qIdx].textContent.trim();
          var qNum = parseInt(qNumStr, 10);
          if (isNaN(qNum)) continue;

          var answerText = cells[aIdx].textContent.trim().toUpperCase();
          // Split multi-answers like "A,C,D" or "A, C, D"
          var answers = answerText.split(/[,;]/).map(function (a) { return a.trim(); }).filter(function (a) { return a.length > 0; });
          key[qNum] = {
            raw: cells[aIdx].textContent.trim(),
            values: answers
          };
        }
      }
    }
    return key;
  }

  // ──────────────────────────────────────────────────────────
  // 2. PARSE QUESTIONS from the DOM
  // ──────────────────────────────────────────────────────────

  function parseQuestions() {
    var questions = [];
    var children = [];
    for (var i = 0; i < article.children.length; i++) {
      children.push(article.children[i]);
    }

    var currentDomain = 'General';

    for (var ci = 0; ci < children.length; ci++) {
      var el = children[ci];

      // Track domain from h2 headers or Question parentheses
      if (el.tagName === 'H2' && /domain|observability|prometheus|promql|instrumentation|alerting|fundamentals/i.test(el.textContent)) {
        currentDomain = el.textContent.trim();
        continue;
      }

      // Match <h3>Question N (Domain)</h3>
      if (el.tagName !== 'H3') continue;
      var h3Text = el.textContent.trim();
      var qMatch = h3Text.match(/^Question\s+(\d+)\s*(?:\(([^)]*)\))?/i);
      if (!qMatch) continue;

      var qNum = parseInt(qMatch[1], 10);
      var domain = qMatch[2] ? qMatch[2].trim() : currentDomain;

      // Next element: question text (paragraph)
      var textEl = el.nextElementSibling;
      var qTextHTML = '';
      var elementsToRemove = [el]; // Will remove h3 + question text + ul + details

      if (textEl && textEl.tagName === 'P') {
        qTextHTML = textEl.innerHTML;
        elementsToRemove.push(textEl);
      } else {
        // No separate paragraph — use h3 text minus the "Question N" prefix
        qTextHTML = h3Text.replace(/^Question\s+\d+\s*/i, '').replace(/\([^)]*\)/g, '').trim();
      }

      // Next: options list (<ul>)
      var ulEl = textEl ? textEl.nextElementSibling : null;
      var options = [];

      if (ulEl && ulEl.tagName === 'UL') {
        elementsToRemove.push(ulEl);
        var items = ulEl.querySelectorAll('li');
        for (var liIdx = 0; liIdx < items.length; liIdx++) {
          var li = items[liIdx];
          var liText = li.textContent.trim();

          // Remove the checkbox markup if present (<input disabled type="checkbox">)
          var inputEl = li.querySelector('input[type="checkbox"]');
          if (inputEl) {
            liText = liText.replace(/^\s*/, '');
          } else {
            // Also handle literal "[ ]" or "[x]" text
            liText = liText.replace(/^\[\s*[x]?\s*\]\s*/i, '');
          }

          // Extract option key: "A) text" or "A. text"
          var optMatch = liText.match(/^([A-Za-z])[).]\s*(.*)/);
          if (optMatch) {
            options.push({
              key: optMatch[1].toUpperCase(),
              label: optMatch[2].trim()
            });
          } else {
            // No letter prefix — use letter based on position
            options.push({
              key: String.fromCharCode(65 + liIdx),
              label: liText
            });
          }
        }
      }

      // Next: <details> with answer
      var detailsEl = ulEl ? ulEl.nextElementSibling : null;
      if (detailsEl && detailsEl.tagName === 'DETAILS') {
        elementsToRemove.push(detailsEl);
      }

      // Remove trailing <hr> if present
      var hrEl = detailsEl ? detailsEl.nextElementSibling : null;
      if (hrEl && hrEl.tagName === 'HR') {
        elementsToRemove.push(hrEl);
      }

      questions.push({
        number: qNum,
        textHTML: qTextHTML,
        domain: domain,
        options: options,
        elementsToRemove: elementsToRemove,
        detailsEl: detailsEl && detailsEl.tagName === 'DETAILS' ? detailsEl : null
      });
    }

    return questions;
  }

  // ──────────────────────────────────────────────────────────
  // 3. DETECT MULTI-SELECT
  // ──────────────────────────────────────────────────────────

  function isMultiSelect(qNum, answerKey, question) {
    // Check answer key first — if multiple values, it's multi-select
    var key = answerKey[qNum];
    if (key && key.values.length > 1) return true;

    // Check question text for multi-select keywords
    var text = question.textHTML.toLowerCase();
    return /select\s+(?:all|two|multiple|several)|choose\s+(?:all|two|multiple)|all\s+that\s+apply/i.test(text);
  }

  // ──────────────────────────────────────────────────────────
  // 4. BUILD INTERACTIVE UI
  // ──────────────────────────────────────────────────────────

  function buildInteractiveUI(questions, answerKey) {
    var totalQuestions = questions.length;

    // ── Insert top control bar ──
    var topBar = document.createElement('div');
    topBar.className = 'exam-interactive-controls';
    topBar.id = 'exam-top-bar';
    topBar.innerHTML =
      '<div class="exam-interactive-header">' +
        '<h3>📝 Interactive Quiz Mode</h3>' +
        '<p class="exam-interactive-subtitle">Select your answers below, then click <strong>"Submit Answers"</strong> at the bottom to check your score.</p>' +
      '</div>' +
      '<div class="exam-interactive-actions">' +
        '<span class="exam-answered-badge" id="exam-answered-badge">0 / ' + totalQuestions + ' answered</span>' +
        '<button class="exam-btn exam-btn-reset" id="exam-reset-btn">🔄 Clear All Answers</button>' +
      '</div>';

    // Insert after the first hr or at top of article
    var insertPoint = article.querySelector('hr') || article.firstChild;
    article.insertBefore(topBar, insertPoint);

    // ── Transform each question ──
    for (var qi = 0; qi < questions.length; qi++) {
      var q = questions[qi];
      transformQuestion(q, answerKey, questions);
    }

    // ── Insert bottom bar with submit button ──
    // Find the answer key heading and table — we'll insert before them
    var answerKeyHeading = null;
    var allH2 = article.querySelectorAll('h2');
    for (var hi = 0; hi < allH2.length; hi++) {
      if (/answer\s*key|score\s*calculation|answer/i.test(allH2[hi].textContent)) {
        answerKeyHeading = allH2[hi];
        break;
      }
    }

    var bottomBar = document.createElement('div');
    bottomBar.className = 'exam-interactive-controls exam-bottom-bar';
    bottomBar.id = 'exam-bottom-bar';
    bottomBar.innerHTML =
      '<div class="exam-interactive-actions">' +
        '<button class="exam-btn exam-btn-submit" id="exam-submit-btn">✅ Submit Answers</button>' +
        '<button class="exam-btn exam-btn-reset" id="exam-reset-btn-bottom">🔄 Clear All</button>' +
      '</div>' +
      '<div class="exam-score-summary" id="exam-score-summary" style="display:none;"></div>';

    if (answerKeyHeading) {
      article.insertBefore(bottomBar, answerKeyHeading);
    } else {
      article.appendChild(bottomBar);
    }

    // Hide the original answer key table, score calculation, and answer key section
    if (answerKeyHeading) {
      var hideSibling = answerKeyHeading.nextElementSibling;
      while (hideSibling) {
        var next = hideSibling.nextElementSibling;
        // Hide tables, paragraphs, hr, and any remaining h2 headings
        if (hideSibling.tagName === 'TABLE' || hideSibling.tagName === 'P' || hideSibling.tagName === 'HR' || hideSibling.tagName === 'H2') {
          hideSibling.style.display = 'none';
        }
        hideSibling = next;
      }
    }

    // ── Event binding ──
    document.getElementById('exam-submit-btn').addEventListener('click', function () {
      gradeTest(questions, answerKey);
    });

    function resetHandler() { resetTest(questions, answerKey); }
    var resetBtn1 = document.getElementById('exam-reset-btn');
    var resetBtn2 = document.getElementById('exam-reset-btn-bottom');
    if (resetBtn1) resetBtn1.addEventListener('click', resetHandler);
    if (resetBtn2) resetBtn2.addEventListener('click', resetHandler);

    // Live answer count
    article.addEventListener('change', function () {
      updateAnsweredCount(questions);
    });
    updateAnsweredCount(questions);
  }

  // ──────────────────────────────────────────────────────────
  // 5. TRANSFORM A SINGLE QUESTION
  // ──────────────────────────────────────────────────────────

  function transformQuestion(q, answerKey, allQuestions) {
    var multi = isMultiSelect(q.number, answerKey, q);
    var inputType = multi ? 'checkbox' : 'radio';
    var groupName = 'exam-q-' + q.number;

    // Create question card
    var wrapper = document.createElement('div');
    wrapper.className = 'exam-question-card';
    wrapper.dataset.qnum = q.number;
    wrapper.dataset.domain = q.domain;

    // Header
    var header = document.createElement('div');
    header.className = 'exam-q-header';
    header.innerHTML =
      '<span class="exam-q-number">' + q.number + '</span>' +
      '<span class="exam-q-text">' + q.textHTML + '</span>' +
      (multi ? ' <span class="exam-badge-multi">Multi-select</span>' : '');
    wrapper.appendChild(header);

    // Options
    var optionsDiv = document.createElement('div');
    optionsDiv.className = 'exam-q-options';

    for (var oi = 0; oi < q.options.length; oi++) {
      var opt = q.options[oi];
      var optDiv = document.createElement('div');
      optDiv.className = 'exam-option';
      optDiv.dataset.key = opt.key;

      var input = document.createElement('input');
      input.type = inputType;
      input.name = groupName;
      input.value = opt.key;
      input.id = groupName + '-' + opt.key;
      input.className = 'exam-option-input';

      var label = document.createElement('label');
      label.className = 'exam-option-label';
      label.htmlFor = input.id;

      var keySpan = document.createElement('span');
      keySpan.className = 'exam-option-key';
      keySpan.textContent = opt.key + ')';

      var textSpan = document.createElement('span');
      textSpan.className = 'exam-option-text';
      textSpan.innerHTML = opt.label;

      label.appendChild(keySpan);
      label.appendChild(textSpan);
      optDiv.appendChild(input);
      optDiv.appendChild(label);
      optionsDiv.appendChild(optDiv);
    }

    wrapper.appendChild(optionsDiv);

    // Clear button per question
    var clearRow = document.createElement('div');
    clearRow.className = 'exam-q-clear-row';
    var clearBtn = document.createElement('button');
    clearBtn.className = 'exam-btn-clear-q';
    clearBtn.textContent = '✕ Clear';
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var inputs = wrapper.querySelectorAll('.exam-option-input');
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
      // Clear any feedback
      var fb = wrapper.querySelector('.exam-q-feedback');
      if (fb) {
        fb.style.display = 'none';
        fb.className = 'exam-q-feedback';
      }
      wrapper.classList.remove('exam-correct', 'exam-incorrect', 'exam-unanswered');
      var opts = wrapper.querySelectorAll('.exam-option');
      for (var j = 0; j < opts.length; j++) {
        opts[j].classList.remove('exam-option-highlight-correct', 'exam-option-highlight-wrong');
      }
      for (var k = 0; k < inputs.length; k++) {
        inputs[k].disabled = false;
      }
      updateAnsweredCount(allQuestions);
    });
    clearRow.appendChild(clearBtn);
    wrapper.appendChild(clearRow);

    // Feedback area
    var feedback = document.createElement('div');
    feedback.className = 'exam-q-feedback';
    feedback.id = 'exam-feedback-' + q.number;
    wrapper.appendChild(feedback);

    // Insert the card before the first element we're removing
    var parent = q.elementsToRemove[0].parentNode;
    parent.insertBefore(wrapper, q.elementsToRemove[0]);

    // Remove the static elements
    for (var ri = 0; ri < q.elementsToRemove.length; ri++) {
      var elToRemove = q.elementsToRemove[ri];
      if (elToRemove && elToRemove.parentNode) {
        elToRemove.parentNode.removeChild(elToRemove);
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  // 6. GRADING
  // ──────────────────────────────────────────────────────────

  function gradeTest(questions, answerKey) {
    var total = questions.length;
    var correct = 0;
    var incorrect = 0;
    var unanswered = 0;
    var domainResults = {};

    for (var qi = 0; qi < questions.length; qi++) {
      var q = questions[qi];
      var wrapper = document.querySelector('.exam-question-card[data-qnum="' + q.number + '"]');
      if (!wrapper) continue;

      var inputs = wrapper.querySelectorAll('.exam-option-input:checked');
      var selected = [];
      for (var si = 0; si < inputs.length; si++) {
        selected.push(inputs[si].value);
      }

      var expected = answerKey[q.number];
      if (!expected || expected.values.length === 0) continue;

      var domain = q.domain;
      if (!domainResults[domain]) {
        domainResults[domain] = { correct: 0, total: 0 };
      }
      domainResults[domain].total++;

      if (selected.length === 0) {
        unanswered++;
        showFeedback(wrapper, 'unanswered', '⚠️ No answer selected. Correct answer: ' + expected.raw);
        highlightCorrectAnswer(wrapper, expected.values);
        continue;
      }

      var isCorrect = false;
      if (expected.values.length > 1) {
        // Multi-select: compare sorted sets
        var sortedSelected = selected.slice().sort().join(',');
        var sortedExpected = expected.values.slice().sort().join(',');
        isCorrect = sortedSelected === sortedExpected;
      } else {
        // Single-select
        isCorrect = selected.length === 1 && selected[0] === expected.values[0];
      }

      if (isCorrect) {
        correct++;
        domainResults[domain].correct++;
        showFeedback(wrapper, 'correct', '✅ Correct! Answer: ' + expected.raw);
        markCorrectOptions(wrapper, expected.values);
      } else {
        incorrect++;
        var userAnswer = selected.length > 0 ? selected.join(', ') : '(none)';
        showFeedback(wrapper, 'incorrect', '❌ Incorrect. Correct answer: ' + expected.raw + ' (you chose: ' + userAnswer + ')');
        highlightCorrectAnswer(wrapper, expected.values);
      }

      // Disable inputs after grading
      var allInputs = wrapper.querySelectorAll('.exam-option-input');
      for (var di = 0; di < allInputs.length; di++) {
        allInputs[di].disabled = true;
      }
    }

    showScoreSummary(correct, total, unanswered, domainResults);

    // Scroll to bottom
    var bottomBar = document.getElementById('exam-bottom-bar');
    if (bottomBar) {
      bottomBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showFeedback(wrapper, type, message) {
    wrapper.classList.add('exam-' + type);
    var feedback = wrapper.querySelector('.exam-q-feedback');
    if (feedback) {
      feedback.className = 'exam-q-feedback exam-feedback-' + type;
      feedback.textContent = message;
      feedback.style.display = 'block';
    }
  }

  function highlightCorrectAnswer(wrapper, correctValues) {
    var options = wrapper.querySelectorAll('.exam-option');
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var input = opt.querySelector('.exam-option-input');
      if (correctValues.indexOf(opt.dataset.key) !== -1) {
        opt.classList.add('exam-option-highlight-correct');
      } else if (input && input.checked) {
        opt.classList.add('exam-option-highlight-wrong');
      }
    }
  }

  function markCorrectOptions(wrapper, correctValues) {
    var options = wrapper.querySelectorAll('.exam-option');
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      if (correctValues.indexOf(opt.dataset.key) !== -1) {
        opt.classList.add('exam-option-highlight-correct');
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  // 7. SCORE SUMMARY
  // ──────────────────────────────────────────────────────────

  function showScoreSummary(correct, total, unanswered, domainResults) {
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var passed = pct >= 70;
    var passingScore = Math.ceil(total * PASS_THRESHOLD);

    var summary = document.getElementById('exam-score-summary');
    if (!summary) return;

    var html = '<div class="exam-score-card ' + (passed ? 'exam-passed' : 'exam-failed') + '">';

    // Main score
    html += '  <div class="exam-score-main">';
    html += '    <span class="exam-score-pct">' + pct + '%</span>';
    html += '    <span class="exam-score-label">' + correct + ' / ' + total + ' correct</span>';
    html += '    <span class="exam-score-status">' + (passed ? '✅ PASSED' : '❌ NOT PASSED') + '</span>';
    html += '  </div>';

    if (unanswered > 0) {
      html += '  <p class="exam-score-unanswered">⚠️ ' + unanswered + ' question' + (unanswered > 1 ? 's' : '') + ' unanswered</p>';
    }

    // Progress bar
    html += '  <p class="exam-score-bar-wrapper"><span class="exam-score-bar" style="width:' + pct + '%;"></span></p>';

    // Domain breakdown
    var domainNames = Object.keys(domainResults);
    if (domainNames.length > 0) {
      html += '  <div class="exam-domain-breakdown">';
      html += '    <h4>📊 Domain Breakdown</h4>';
      html += '    <table class="exam-domain-table">';
      html += '      <thead><tr><th>Domain</th><th>Score</th><th>Status</th></tr></thead>';
      html += '      <tbody>';

      for (var di = 0; di < domainNames.length; di++) {
        var d = domainNames[di];
        var dr = domainResults[d];
        var dPct = dr.total > 0 ? Math.round((dr.correct / dr.total) * 100) : 0;
        var dPassed = dPct >= 70;
        html += '      <tr class="' + (dPassed ? 'domain-pass' : 'domain-fail') + '">';
        html += '        <td>' + escapeHtml(simplifyDomainName(d)) + '</td>';
        html += '        <td>' + dr.correct + '/' + dr.total + ' (' + dPct + '%)</td>';
        html += '        <td>' + (dPassed ? '✅' : '🔴') + '</td>';
        html += '      </tr>';
      }

      html += '      </tbody>';
      html += '    </table>';
      html += '  </div>';
    }

    // Legend
    html += '  <div class="exam-score-legend">';
    html += '    <p><strong>Passing score:</strong> 70% (' + passingScore + '/' + total + ')</p>';
    html += '    <p>' + (passed ? '🎉 Great job! Ready for the real exam.' : '📚 Review the domains marked in red, study the explanations, and try again.') + '</p>';
    html += '  </div>';

    html += '</div>';

    summary.innerHTML = html;
    summary.style.display = 'block';

    // Change submit button to "Retry"
    var submitBtn = document.getElementById('exam-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = '🔄 Retry Test';
      submitBtn.className = 'exam-btn exam-btn-reset';
      // Replace with clone to remove old listeners
      var newBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newBtn, submitBtn);
      newBtn.addEventListener('click', function () {
        resetTest(questions, answerKey);
      });
    }
  }

  function simplifyDomainName(name) {
    // Clean up domain names extracted from headings
    return name
      .replace(/^##?\s*/, '')
      .replace(/<[^>]*>/g, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/domain/i, '')
      .trim() || 'General';
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ──────────────────────────────────────────────────────────
  // 8. RESET
  // ──────────────────────────────────────────────────────────

  function resetTest(questions, answerKey) {
    var summary = document.getElementById('exam-score-summary');
    if (summary) {
      summary.style.display = 'none';
      summary.innerHTML = '';
    }

    for (var qi = 0; qi < questions.length; qi++) {
      var q = questions[qi];
      var wrapper = document.querySelector('.exam-question-card[data-qnum="' + q.number + '"]');
      if (!wrapper) continue;

      var feedback = wrapper.querySelector('.exam-q-feedback');
      if (feedback) {
        feedback.style.display = 'none';
        feedback.className = 'exam-q-feedback';
      }

      var inputs = wrapper.querySelectorAll('.exam-option-input');
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
        inputs[i].disabled = false;
      }

      wrapper.classList.remove('exam-correct', 'exam-incorrect', 'exam-unanswered');
      var options = wrapper.querySelectorAll('.exam-option');
      for (var j = 0; j < options.length; j++) {
        options[j].classList.remove('exam-option-highlight-correct', 'exam-option-highlight-wrong');
      }
    }

    // Re-bind submit button
    var submitBtn = document.getElementById('exam-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = '✅ Submit Answers';
      submitBtn.className = 'exam-btn exam-btn-submit';
      var newBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newBtn, submitBtn);
      newBtn.addEventListener('click', function () {
        gradeTest(questions, answerKey);
      });
    }

    updateAnsweredCount(questions);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ──────────────────────────────────────────────────────────
  // 9. ANSWERED COUNT
  // ──────────────────────────────────────────────────────────

  function updateAnsweredCount(questions) {
    var answered = 0;
    var total = questions.length;
    for (var qi = 0; qi < total; qi++) {
      var q = questions[qi];
      var wrapper = document.querySelector('.exam-question-card[data-qnum="' + q.number + '"]');
      if (!wrapper) continue;
      var checked = wrapper.querySelectorAll('.exam-option-input:checked');
      if (checked.length > 0) answered++;
    }
    var badge = document.getElementById('exam-answered-badge');
    if (badge) {
      badge.textContent = answered + ' / ' + total + ' answered';
      badge.className = 'exam-answered-badge' + (answered === total ? ' exam-answered-all' : '');
    }
  }

  // ──────────────────────────────────────────────────────────
  // 10. INIT
  // ──────────────────────────────────────────────────────────

  function init() {
    // Only run on practice test pages
    var firstH3 = article.querySelector('h3');
    if (!firstH3) return;
    if (!/^Question\s+\d+/i.test(firstH3.textContent)) return;

    var answerKey = parseAnswerKey();
    if (Object.keys(answerKey).length === 0) return;

    var questions = parseQuestions();
    if (questions.length === 0) return;

    buildInteractiveUI(questions, answerKey);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
