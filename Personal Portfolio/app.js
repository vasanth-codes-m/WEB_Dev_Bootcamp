// Initialize GridStack
const grid = GridStack.init()

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle")
const body = document.body

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", body.classList.contains("dark-mode"))
})

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark-mode")
}

// Weather Widget
async function fetchWeather() {
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"
  const city = "London" // Replace with user's city or geolocation
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

  try {
    const response = await fetch(url)
    const data = await response.json()
    const weatherContent = document.getElementById("weatherContent")
    weatherContent.innerHTML = `
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Conditions: ${data.weather[0].description}</p>
            <p>Location: ${data.name}</p>
        `
  } catch (error) {
    console.error("Error fetching weather:", error)
    document.getElementById("weatherContent").innerHTML = "Failed to load weather data."
  }
}

// News Widget
async function fetchNews() {
  const apiKey = "YOUR_NEWSAPI_API_KEY"
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    const newsContent = document.getElementById("newsContent")
    newsContent.innerHTML = data.articles
      .slice(0, 5)
      .map(
        (article) => `
            <div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error fetching news:", error)
    document.getElementById("newsContent").innerHTML = "Failed to load news data."
  }
}

// Tasks Widget
function initTasks() {
  const tasksContent = document.getElementById("tasksContent")
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []

  function renderTasks() {
    tasksContent.innerHTML = `
            <ul>
                ${tasks
                  .map(
                    (task, index) => `
                    <li>
                        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
                        <span>${task.text}</span>
                        <button onclick="deleteTask(${index})">Delete</button>
                    </li>
                `,
                  )
                  .join("")}
            </ul>
            <input type="text" id="newTask" placeholder="New task">
            <button onclick="addTask()">Add Task</button>
        `
  }

  window.addTask = () => {
    const newTaskInput = document.getElementById("newTask")
    const text = newTaskInput.value.trim()
    if (text) {
      tasks.push({ text, completed: false })
      localStorage.setItem("tasks", JSON.stringify(tasks))
      newTaskInput.value = ""
      renderTasks()
    }
  }

  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed
    localStorage.setItem("tasks", JSON.stringify(tasks))
    renderTasks()
  }

  window.deleteTask = (index) => {
    tasks.splice(index, 1)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    renderTasks()
  }

  renderTasks()
}

// Calendar Widget
function initCalendar() {
  const calendarContent = document.getElementById("calendarContent")
  const calendar = new FullCalendar.Calendar(calendarContent, {
    initialView: "dayGridMonth",
    height: "100%",
    events: JSON.parse(localStorage.getItem("events")) || [],
    dateClick: (info) => {
      const title = prompt("Enter event title:")
      if (title) {
        const event = {
          title: title,
          start: info.dateStr,
          allDay: true,
        }
        calendar.addEvent(event)
        const events = JSON.parse(localStorage.getItem("events")) || []
        events.push(event)
        localStorage.setItem("events", JSON.stringify(events))
      }
    },
  })
  calendar.render()
}

// Initialize widgets
fetchWeather()
fetchNews()
initTasks()
initCalendar()

// Save grid state
grid.on("change", () => {
  const gridState = grid.save()
  localStorage.setItem("gridState", JSON.stringify(gridState))
})

// Load grid state
const savedGridState = localStorage.getItem("gridState")
if (savedGridState) {
  grid.load(JSON.parse(savedGridState))
}

