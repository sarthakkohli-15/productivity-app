let tasks = JSON.parse(localStorage.getItem("novaTasks")) || [];
let filter = "all";

const list = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

function save() {
  localStorage.setItem("novaTasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categoryInput").value;
  const deadline = document.getElementById("deadlineInput").value;

  if (!text) return;

  tasks.push({ text, category, deadline, done:false });
  document.getElementById("taskInput").value = "";
  save();
  render();
}

function toggle(i){
  tasks[i].done = !tasks[i].done;
  if(tasks[i].done) confetti();
  save(); render();
}

function removeTask(i){
  tasks.splice(i,1);
  save(); render();
}

function setFilter(f){
  filter = f;
  render();
}

function render(){
  const pending = document.getElementById("taskList");
  const done = document.getElementById("doneList");

  pending.innerHTML = "";
  done.innerHTML = "";

  let completed = 0;

  tasks.forEach((t,i)=>{
    const li = document.createElement("li");

    const daysLeft = t.deadline
      ? Math.ceil((new Date(t.deadline)-Date.now())/86400000)
      : null;

    li.innerHTML = `
      <div onclick="toggle(${i})">
        <strong>${t.text}</strong>
        <div class="meta">
          ${t.category}
          ${daysLeft!==null ? ` • ${daysLeft} days left` : ""}
        </div>
      </div>
      <button onclick="removeTask(${i})">✖</button>
    `;

    if(t.done){
      li.classList.add("completed");
      completed++;
    }

    // 🔥 FILTER LOGIC
    if(filter === "completed" && t.done){
      done.appendChild(li);
    }
    else if(filter !== "completed" && !t.done){
      pending.appendChild(li);
    }
  });

  // Progress bar
  const percent = tasks.length
    ? (completed / tasks.length) * 100
    : 0;
  progressBar.style.width = percent + "%";
}

function toggleTheme(){
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark);

  const icon = document.querySelector("#themeBtn i");
  icon.setAttribute("data-lucide", isDark ? "moon" : "sun");
  lucide.createIcons();
}

const savedTheme = localStorage.getItem("theme") === "true";

if(savedTheme){
  document.body.classList.add("dark");
}

const icon = document.querySelector("#themeBtn i");
icon.setAttribute("data-lucide", savedTheme ? "moon" : "sun");
lucide.createIcons();

function confetti(){
  const colors = ["#ff0","#0ff","#f0f","#0f0","#f00"];
  for(let i=0;i<25;i++){
    const div=document.createElement("div");
    div.style.position="fixed";
    div.style.width="6px";
    div.style.height="6px";
    div.style.background=colors[Math.random()*5|0];
    div.style.left=Math.random()*100+"vw";
    div.style.top="-10px";
    div.style.zIndex=9999;
    div.style.animation="fall 1s linear";
    document.body.appendChild(div);
    setTimeout(()=>div.remove(),1000);
  }
}

const style=document.createElement("style");
style.innerHTML=`@keyframes fall{to{transform:translateY(100vh)}}`;
document.head.appendChild(style);

render();