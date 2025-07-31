document.addEventListener("DOMContentLoaded", function () {
  const topicNav = document.getElementById("topic-nav");
  const topicsList = document.getElementById("topics-list");
  const searchBar = document.getElementById("search-bar");
  let currentTopicIdx = 0;


  function renderSidebar() {
    topicNav.innerHTML = "";
    dsaSheet.forEach((topic, idx) => {
      const btn = document.createElement("button");
      btn.className = "nav-topic" + (idx === 0 ? " active" : "");
      btn.textContent = topic.topic;
      btn.setAttribute("data-idx", idx);
      btn.onclick = function () {
        document.querySelectorAll(".nav-topic").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTopicIdx = idx;
        renderTopic(idx, searchBar.value.trim().toLowerCase());
      };
      topicNav.appendChild(btn);
    });
  }


  function getTopicProgress(topic) {
    const total = topic.questions.length;
    const done = topic.questions.filter((q, i) => {
      const checkbox = document.querySelector(`.checkbox-solved[data-topic="${topic.topic}"][data-idx="${i}"]`);
      return checkbox && checkbox.checked;
    }).length;
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }


  function renderTopic(idx, filter = "") {
    const topic = dsaSheet[idx];
    let questions = topic.questions;
    if (filter) {
      questions = questions.filter(q =>
        q.title.toLowerCase().includes(filter) ||
        topic.topic.toLowerCase().includes(filter)
      );
    }
    const topicTotal = topic.questions.length;
    const topicDone = topic.questions.filter((q, i) => {
      const checkbox = document.querySelector(`.checkbox-solved[data-topic="${topic.topic}"][data-idx="${i}"]`);
      return checkbox && checkbox.checked;
    }).length;
    const topicPercent = topicTotal ? Math.round((topicDone / topicTotal) * 100) : 0;

    topicsList.innerHTML = `
      <div class="topic-section">
        <h2>${topic.topic} <span style="color:#6366f1;font-size:1rem;">(${topic.questions.length} Questions)</span></h2>
        <button id="toggle-all-btn" style="margin-bottom:12px;">Select All</button>
        <div class="progress-bar topic-progress-bar" style="margin-bottom:16px;">
          <div class="progress-bar-inner" style="width:${topicPercent}%"></div>
          <span class="progress-label">${topicPercent}% Completed</span>
        </div>
        <ul>
          ${questions.map((q, i) => `
            <li>
              <input type="checkbox" class="checkbox-solved" data-topic="${topic.topic}" data-idx="${i}" />
              <a href="${q.link || '#'}" target="_blank">${q.title}</a>
              ${q.difficulty ? `<span class="difficulty">${q.difficulty}</span>` : ""}
            </li>
          `).join("")}
        </ul>
      </div>
    `;
    updateProgress();
    updateTopicProgressBar(topic, idx);


    const toggleBtn = document.getElementById("toggle-all-btn");
    toggleBtn.onclick = function () {
      const checkboxes = document.querySelectorAll(`.checkbox-solved[data-topic="${topic.topic}"]`);
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);
      updateProgress();
      updateTopicProgressBar(topic, idx);

      toggleBtn.textContent = allChecked ? "Select All" : "Deselect All";
    };

    const checkboxes = document.querySelectorAll(`.checkbox-solved[data-topic="${topic.topic}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    toggleBtn.textContent = allChecked ? "Deselect All" : "Select All";
  }


  function updateProgress() {
    const total = dsaSheet.reduce((sum, t) => sum + t.questions.length, 0);
    const done = document.querySelectorAll('.checkbox-solved:checked').length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const bar = document.querySelector('#overall-progress .progress-bar-inner');
    const label = document.querySelector('#overall-progress .progress-label');
    if (bar && label) {
      bar.style.width = percent + '%';
      label.textContent = percent + '% Completed';
    }
  }


  function updateTopicProgressBar(topic, idx) {
    const total = topic.questions.length;
    const done = topic.questions.filter((q, i) => {
      const checkbox = document.querySelector(`.checkbox-solved[data-topic="${topic.topic}"][data-idx="${i}"]`);
      return checkbox && checkbox.checked;
    }).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const bar = document.querySelector('.topic-progress-bar .progress-bar-inner');
    const label = document.querySelector('.topic-progress-bar .progress-label');
    if (bar && label) {
      bar.style.width = percent + '%';
      label.textContent = percent + '% Completed';
    }
  }


  function updateTotalQuestionsHeader() {
    const total = dsaSheet.reduce((sum, t) => sum + t.questions.length, 0);
    document.getElementById('total-questions-header').textContent =
      `Total Questions: ${total}`;
  }


  topicsList.addEventListener('change', function (e) {
    if (e.target.classList.contains('checkbox-solved')) {
      updateProgress();
      const topic = dsaSheet[currentTopicIdx];
      updateTopicProgressBar(topic, currentTopicIdx);
    }
  });


  searchBar.addEventListener("input", function () {
    renderTopic(currentTopicIdx, this.value.trim().toLowerCase());
  });


  renderSidebar();
  renderTopic(0);
  updateProgress();
  updateTotalQuestionsHeader();
});
