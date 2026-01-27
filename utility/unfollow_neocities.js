(async function () {
  console.log("🔍 Fetching your follows and followers...");

  const followsResponse = await fetch("/site/ritualsh/follows");
  const followsHTML = await followsResponse.text();
  const followersResponse = await fetch("/site/ritualsh/followers");
  const followersHTML = await followersResponse.text();

  const parser = new DOMParser();
  const followsDoc = parser.parseFromString(followsHTML, "text/html");
  const followersDoc = parser.parseFromString(followersHTML, "text/html");

  const followingLinks = followsDoc.querySelectorAll(
    'a[href^="/site/"]:not([href="/site/ritualsh"])',
  );
  const following = [
    ...new Set(
      Array.from(followingLinks)
        .map((link) => link.getAttribute("href").replace("/site/", ""))
        .filter((name) => !name.includes("/") && name !== "ritualsh"),
    ),
  ];

  const followerLinks = followersDoc.querySelectorAll(
    'a[href^="/site/"]:not([href="/site/ritualsh"])',
  );
  const followers = new Set(
    Array.from(followerLinks)
      .map((link) => link.getAttribute("href").replace("/site/", ""))
      .filter((name) => !name.includes("/") && name !== "ritualsh"),
  );

  const notFollowingBack = following.filter((site) => !followers.has(site));

  console.log(`📊 You follow ${following.length} sites`);
  console.log(`📊 ${followers.size} sites follow you`);
  console.log(`\n❌ ${notFollowingBack.length} sites don't follow you back:`);
  notFollowingBack.forEach((site) => console.log(`   - ${site}`));

  if (notFollowingBack.length === 0) {
    console.log("\n✅ Everyone you follow also follows you back!");
    return;
  }

  console.log(`\n⚠️  Ready to unfollow ${notFollowingBack.length} sites.`);
  console.log("Type: unfollowAll()");

  window.unfollowAll = async function () {
    console.log("\n🚀 Starting unfollow process...\n");

    if (
      typeof Site === "undefined" ||
      typeof Site.toggleFollow !== "function"
    ) {
      console.error("❌ Site.toggleFollow function not found!");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const siteName of notFollowingBack) {
      try {
        const siteResponse = await fetch(`/site/${siteName}`);
        const siteHTML = await siteResponse.text();
        const match = siteHTML.match(
          /Site\.toggleFollow\((\d+),\s*'([^']+)'\)/,
        );

        if (match) {
          const siteId = match[1];
          const csrfToken = match[2];

          console.log(`Unfollowing ${siteName}...`);
          Site.toggleFollow(siteId, csrfToken);

          successCount++;
          console.log(`✅ ${siteName}`);
        } else {
          console.log(`⚠️  Couldn't find follow data for ${siteName}`);
          failCount++;
        }

        // Wait 2 seconds between each unfollow
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`❌ Error with ${siteName}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully unfollowed: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(
      "\n✨ Done! Refresh the page to see your updated follow count.",
    );
  };
})();
