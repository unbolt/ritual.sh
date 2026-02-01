---
title: "Badgeware 2350 Are Pretty Cool"
date: 2026-02-02
tags:
  - gadgets
draft: false
---

My set of [Badgeware](https://badgewa.re/) badges arrived this week and I wanted to take a minute just go over unboxing and my initial thoughts. You’ve already had the spoiler; I think they’re pretty cool. 

{{< img src="images/DSCF3545.jpg" alt="Set of three Badgeware badge boxes" width="900x" >}}

# What are they?

Made by [Pimoroni](https://shop.pimoroni.com/) here in the UK, they are smart badges that run MicroPython and have a little battery onboard, with WiFi and Bluetooth too. They come in three flavours: eInk, IPS display and LED array. I got one of each. The underlying specs are the same regardless of which version you’re looking at, an RP2350, 16mb flash storage, and 8mb PSRAM. You can check out the full specs on the [website](https://badgewa.re/) if you’re into that sort of thing.

{{< img src="images/DSCF3552.jpg" alt="Box contents of the Tufty 2350" width="900x" >}}

# Unboxing

Popping them open is quick enough, they come in recycled feeling cardboard (it doesn't state it is, but it isn't the horribly glossy style cardboard) and inside the box is the device, a different lanyard in for each type, a brief getting started leaflet and most importantly a STICKER. 

{{< img src="images/DSCF3553.jpg" alt="Stickers waiting to find a home on one of my laptops" width="900x" >}}

The only downside is there’s no protection on the screen casing itself, and one of mine arrived with a scratch - I presume from the lanyard clip - but a brief email to Pimoroni support and they had dispatched a replacement cover the same day so I can’t complain about that. I do feel this could have been avoided, but at the cost of adding disposable packaging to the box. I guess for the small amount of replacement covers they might have to issue the planet is overall thankful for the lack of disposable packaging included.

# Initial Impressions

The devices themselves feel sturdy, though for longevity if I were going to be using these anywhere other than around my office I would likely try and find a screen protector to fit. 

The boot up process is essentially instant across devices, the eink display takes a little while to refresh but this seems to be tinker-able according to the API documentation so I should be able to speed this up for my own purposes once an application is loaded - at the cost of ghosting. That’s the price you pay for eink.

The LEDs on the LED version are super bright which is awesome, and the brightness can be adjusted programmatically if you wanted something a bit dimmer.

The IPS screen is vivid and bright, and has an awesome menu screen with a background animation. 

Navigating through the menus and demo projects is largely a good experience, eink being the exception of course. Once you load up an actual application regardless of device though none of the demos seemed to indicate that the device won’t be perfectly capable for a variety of uses included some small games. 

# Planned Projects

I don’t think I’ll be making any games on these devices any time soon - I have enough other projects on the go. 

The first projects I want to tackle are displaying my site visitor stats on the screen, the latest guestbook post, and the top scores of Whittler. The nice thing is that for the most part these should easily work on any of the three devices, only needing adjustments for the screen dimensions. 

The [documentation is available online](https://badgewa.re/docs), though doesn’t seem fully complete as of time of posting - it’s missing documentation on the scroll action that’s present in a few of the LED demos for example. Pimoroni have a history about being very good about this kind of thing though, so expect it will be updated in due course.

Time to get tinkering! 
