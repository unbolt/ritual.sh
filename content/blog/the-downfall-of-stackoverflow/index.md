---
title: "The Downfall of StackOverflow"
date: 2026-01-04T13:58:02Z
tags:
  - analysis
  - ai
draft: false
---

_Quick note: This isn't an "AI bad" rant. AI tools are a useful thing to have in your kit. This is just an observational look at what the data shows about StackOverflow's decline. That being said, the sooner the AI bubble bursts the better._

This post was inspired by a post on [Hacker News](https://news.ycombinator.com/item?id=46482345) that linked to this [StackOverflow data](https://data.stackexchange.com/stackoverflow/query/1926661#graph).

My kneejerk reaction was that the rise in AI and its code analysis capabilities have caused the downfall of StackOverflow. We can see a peak after a gradual decline in early 2020 (COVID bedroom coders?) which then returns to a roughly normal level by 2021, before starting a stark decline into obscurity, very much accelerating at the end of 2022.

{{< graph id="stackoverflow-trend" type="line" title="Stack Overflow Questions Over Time" height="500" csv="stackoverflow_questions_over_time.csv" labelColumn="Month" dataColumn="" dateFormat="2006-01" >}}
{{< /graph >}}

## The rise and fall

StackOverflow had a hell of a run. From just 4 questions monthly in July 2008 to over 207,000 in March 2014: six years of basically uninterrupted growth. It became _the_ place every developer went when they were stuck.

Then around 2014-2015, it plateaued. About 170,000-190,000 questions per month, which held steady for a few years before starting to slip. By 2019 we're down to around 150,000 per month. Still solid, but the writing was on the wall.

Then it properly falls off a cliff. January 2023: 97,209 questions. December 2023: 42,601. December 2025: 3,862. That's a 98.1% drop from the 2020 peak.

## Is it AI?

Looking at Google Trends[^1] for AI-related searches, there's a bit of a gap between when StackOverflow started dying and when AI actually took off.

{{< graph id="ai-trends" type="line" title="AI Search Trends" height="500"
    csv="ai-coding-trend.csv,ai-trend.csv"
    labelColumn="Month"
    dataColumns="ai coding: (Worldwide),ai: (Worldwide)"
    datasetLabels="AI Coding,AI General"
    dateFormat="2006-01" >}}
{{< /graph >}}

Both general AI interest and AI coding searches were basically flat from 2019 through most of 2022. Then in December 2022 it spikes. That's ChatGPT launching[^2]. This is seen conversely in the data on StackOverflow Questions declining at the same point.

Zooming in on 2019 onwards makes it clearer:

{{< graph id="ai-trends-vs-questions" type="line" title="AI Search Trends vs StackOverflow Questions" height="500"
    csv="stackoverflow_questions_after_2019.csv,ai-coding-trend.csv,ai-trend.csv"
    labelColumn="Month"
    dataColumns="Questions,ai coding: (Worldwide),ai: (Worldwide)"
    datasetLabels="StackOverflow Questions,AI Coding,AI General"
    yAxisIDs="y,y1,y1"
    dateFormat="2006-01" >}}
{{< /graph >}}

## The timeline doesn't quite add up

StackOverflow's real decline starts in 2021, well before anyone gave a shit about AI coding. From January 2021 (140,009 questions) to December 2022 (96,767 questions), it lost 31% of its traffic while "AI coding" searches sat at baseline.

The AI coding surge doesn't really kick off until early 2023, then explodes through 2025, peaking in August. But by then StackOverflow was already down to 5,885 questions per month.

## Did the rise of GitHub contribute?

A few comments[^3] on Hacker News suggested that the rise of GitHub could have been a contributor to the decline of StackOverflow. On the surface that sounds reasonable, a lot of support happens directly on GitHub nowadays, which wasn't really a thing during StackOverflow's peak.

To check this I grabbed data from the top 100 starred GitHub repositories and tracked issues opened per month. This isn't an ideal metric[^4], but it gives us something to work with.

{{< graph id="stackoverflow-vs-github-issues" type="line" title="StackOverflow vs GitHub Issues" height="500"
    csv="stackoverflow_questions_over_time.csv,total_issues_by_date.csv"
    labelColumn="Month"
    dataColumns="Questions,Total Issues"
    datasetLabels="StackOverflow Questions,GitHub Issues"
    yAxisIDs="y,y1"
    dateFormat="2006-01" >}}
{{< /graph >}}

GitHub issues start slow in these specific repositories, but by 2019 we're seeing around 9,000-10,000 issues per month, which plateaus and holds relatively steady through 2025 (hovering between 10,000-14,000).

The timeline doesn't really match StackOverflow's decline either. GitHub issues hit a high in 2018-2019 (when they jumped to 8,000-10,000 per month), but StackOverflow was still holding steady at 150,000+ questions. The platform only started its real nosedive in 2021-2023, while GitHub issues stayed flat.

If GitHub issues were the culprit, you'd expect to see an inverse relationship: as issues go up, questions go down. Instead, both coexisted just fine from 2015-2020. GitHub issues plateaued in 2019 and have stayed relatively constant since, even slightly increasing in 2025. Meanwhile, StackOverflow collapsed by 98.1%.

So no, I don't believe GitHub issues killed StackOverflow. It may have been a contributing factor, with people going elsewhere to find answers. Developers were using both for years without real conflict though.

## What about toxicity?

Several comments[^5] brought up StackOverflow's harsh moderation and toxic environment as a major factor. The "marked as duplicate," "this question doesn't belong here," or outright hostile responses to newbies are easier to find than actual answers most of the time.

Wasn't StackOverflow _always_ like that? The platform had a reputation for being unwelcoming since at least 2012-2013[^6], right during its peak growth years. If toxicity was the primary killer, you'd expect to see the decline start much earlier, not suddenly accelerate in 2021-2023.

Could it be a contributing factor? Absolutely. If you had a choice between asking a question on StackOverflow (and risking getting dunked on by some pedantic asshole) versus just asking ChatGPT (which never judges you 😘), the choice is obvious. But toxicity alone doesn't explain the timing or the scale of the collapse.

To actually test this properly you'd need to pull years of StackOverflow comments and run sentiment analysis to see if moderation got worse over time. That's way more effort than I'm putting into this blog post. Maybe one for another day.

## So what's actually going on?

The data suggests AI accelerated something that was already happening. A few things probably contributed:

**The saturation effect**: By 2021, StackOverflow had 16+ years of answered questions. How many times can you ask "how do I parse JSON in Python" before every variation is covered? The "just Google it" response became the correct answer because everything _had_ been Googled already.

**The pre-AI decline (2021-2022)**: 31% drop over 18 months while AI coding searches were dead flat. This points to other shifts: better documentation, clearer error messages, frameworks maturing and becoming less footgun-y. Developers were finding answers without needing to ask.

**The AI acceleration (2023-2025)**: ChatGPT launches November 30, 2022. By March 2023, StackOverflow drops from 123,614 questions to 87,543. AI tools give you instant answers without needing to wade through ten variations of your question that are marked as duplicates and locked.

**The collapse (2025-2026)**: By mid-2025, AI coding tools are just... everywhere. GitHub Copilot, ChatGPT, Claude, all of them baked into every IDE and workflow. The August 2025 peak in "AI coding" searches lines up with StackOverflow hitting 5,885 questions. That's a 96% decline from five years earlier.

## The bottom line

AI didn't kill StackOverflow, but it's definitely finishing the job. The platform was already bleeding out when ChatGPT showed up: content saturation, better tooling, the ecosystem maturing. But AI coding tools changed the game completely. Why search through old forum posts when you can just ask?

The inverse relationship is stark: as AI coding interest hits its peak in 2025, StackOverflow craters. By December 2025 we're at 3,862 questions. That's roughly the same as September 2008, just a few months after the platform launched.

Twelve years to build it. Five years to tear it down. And yeah, the last three were almost certainly AI finishing what was already started.

### Footnote

This is the hardest and longest I have thought about anything in a long time. I was an avid StackOverflow user 10~ years ago, and the graph showing up on Hacker News showing the current state absolutely blew my mind and inspired me to dig a bit deeper.

The CSV data for this post can be found on my [GitHub](https://github.com/unbolt/ritual.sh/tree/main/content/blog/the-downfall-of-stackoverflow).

I hope you found this interesting. Rock on.

---

### Corrections and Updates

- 04/01/2025 - Removed the January 2026 data from all graphs as we're only 4 days in and it made it look weird. Also added some 0 value months to the GitHub data at the start so the graphs line up properly visually.

[^1]: Google Trends data provides relative search interest rather than absolute numbers, which may not capture the full picture.

[^2]: [ChatGPT Launch Announcement](https://openai.com/index/chatgpt/)

[^3]: [Comment](https://news.ycombinator.com/item?id=46486171), [Comment](https://news.ycombinator.com/item?id=46487601), [Comment](https://news.ycombinator.com/item?id=46482758) + More.

[^4]: Read: It's bad. There's a couple of massive outlier projects with a LOT more issues raised than others, but that's a topic for another blog.

[^5]: [Comment](https://news.ycombinator.com/item?id=46482624)

[^6]: In 2013, Tim Schreiber wrote about ["StackOverlords"](https://timschreiber.com/2013/10/30/beware-the-stackoverlords/) who "ruthlessly wield" their privileges against newcomers. By 2018, StackOverflow officially acknowledged the problem in their blog post ["Stack Overflow Isn't Very Welcoming. It's Time for That to Change."](https://stackoverflow.blog/2018/04/26/stack-overflow-isnt-very-welcoming-its-time-for-that-to-change/)


