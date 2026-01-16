(function () {
  // Parse the blog posts data
  const postsData = JSON.parse(
    document.getElementById("blog-posts-data").textContent,
  );
  const weeksContainer = document.getElementById("weeks-container");
  const infoDiv = document.getElementById("post-graph-info");

  // Calculate date range (365 days back from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  // Find the first Monday
  let firstMonday = new Date(startDate);
  const dayOfWeek = firstMonday.getDay();
  if (dayOfWeek === 0) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  } else if (dayOfWeek > 1) {
    firstMonday.setDate(firstMonday.getDate() + (8 - dayOfWeek));
  }

  // Generate all day blocks
  let currentDate = new Date(firstMonday);
  let currentWeek = [];
  const weeks = [];

  while (currentDate <= today) {
    const dateKey = currentDate.toISOString().split("T")[0];
    const posts = postsData[dateKey] || [];
    const postCount = posts.length;

    let block = "░";
    let cssClass = "";
    if (postCount === 1) {
      block = "▒";
      cssClass = "has-posts";
    } else if (postCount > 1) {
      block = "▓";
      cssClass = "has-posts multiple-posts";
    }

    const postTitles = posts.map((p) => p.title).join(" | ");
    const postUrl = posts.length > 0 ? posts[0].url : "";

    currentWeek.push({
      block: block,
      class: cssClass,
      date: dateKey,
      postCount: postCount,
      postTitles: postTitles,
      postUrl: postUrl,
      posts: posts,
    });

    // Check if it's Sunday or the last day
    const dow = currentDate.getDay();
    if (dow === 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add remaining days if any
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Function to handle day hover
  window.handleDayHover = function (element, isEnter) {
    const date = element.dataset.date;
    const postCount = parseInt(element.dataset.postCount || "0");
    const postTitles = element.dataset.postTitles;
    const infoDiv = document.getElementById("post-graph-info");

    if (isEnter) {
      document
        .querySelectorAll(".day-block")
        .forEach((b) => b.classList.remove("active"));

      const d = new Date(date + "T00:00:00");
      const formattedDate = d.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (postCount > 0) {
        element.classList.add("active");
        infoDiv.classList.add("active");
        infoDiv.textContent = `${formattedDate}: ${postTitles}`;
      } else {
        infoDiv.classList.remove("active");
        infoDiv.textContent = `${formattedDate}: No posts`;
      }
    } else {
      element.classList.remove("active");
      infoDiv.classList.remove("active");
      infoDiv.textContent = "Hover over a day to see posts";
    }
  };

  // Function to handle day click
  window.handleDayClick = function (element) {
    const postUrl = element.dataset.postUrl;
    if (postUrl) {
      window.location.href = postUrl;
    }
  };

  // Render the weeks
  weeks.forEach((week) => {
    const weekColumn = document.createElement("div");
    weekColumn.className = "week-column";

    week.forEach((day) => {
      const dayBlock = document.createElement("div");
      dayBlock.className = `day-block ${day.class}`;
      dayBlock.dataset.date = day.date;
      dayBlock.dataset.postCount = day.postCount;
      dayBlock.dataset.postTitles = day.postTitles;
      dayBlock.dataset.postUrl = day.postUrl;
      dayBlock.setAttribute("onmouseenter", "handleDayHover(this, true)");
      dayBlock.setAttribute("onmouseleave", "handleDayHover(this, false)");
      if (day.postUrl) {
        dayBlock.setAttribute("onclick", "handleDayClick(this)");
      }
      dayBlock.textContent = day.block;

      weekColumn.appendChild(dayBlock);
    });

    weeksContainer.appendChild(weekColumn);
  });
})();
