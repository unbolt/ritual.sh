---
title: "Tiddler Dev Blog #1 - Making a Plan"
date: 2026-02-10T14:18:57Z
tags:
  - gamedev
  - godot
  - tiddler
draft: false
---

Since actually finishing and releasing [Whittler](/games/whittler) a few weeks ago I've been thinking hard about what kind of game I want to make next. I've got a massive list of projects I've started and not progressed with, ranging from a nature game with a fully generative forest that spawns trees based on moisture levels, soil quality and terrain height through to an underground cavern simulator with destructable terrain.

None of these ideas have really stuck for very long beyond the initial idea and rush of building the first few Cool New Things.

I've always had a thing for fishing in games, I have multiple 100 skill fishers in Final Fantasy XI, and making a cosy fishing game has always been on the cards.

I did, however, need to make sure I would follow through with it. So I started where any good idea goes first - and started writing a list of ideas.

This was the initial list of ideas I came up with:

- Core catch mechanic
  - Quick bar on screen that has zones to trigger catching which affects success and quality of catch
  - Nailing the catch gives you a bonus to your next cast
- Fish should be affected by environment affects, location, time of day, weather, and moon phase.
- There should be some sense of progression
  - New fishing locations
  - Upgraded rods
  - Access to new baits
- There should be some big grindy quest chain that involves catching a lot of fish
  - This won't be to everyones taste, but I am making this game for myself.
- There should be mythical fish that require some uncovering to find out how to catch and with what.

This was the absolute base list, it's since grown a bit and got slightly more meat on the bones. Side note, I have started using UpNote for keeping notes, drafts and ideas. It's very handy and syncs across devices.

Using this list of ideas I came up with with a list of mechanics I would need to create:

- Fish database
- Fishing game interaction
- Fishing levels / reputation
- Time progression
- Inventory management
- Shop
- Quest system

This was a pretty tasty list to get started with, so I started where anyone would with a clear list of mechanics they need to make and opened Tiled to start drawing a map.

After I got a cop on myself I closed Tiled and opened up Godot and started getting the main classes in place, even if they were only placeholders. I knew I would need a central event bus and a strong event driven system in order to not become severely unstuck when I got to implementing quests, so that gave me some clear architectural pieces to work towards.

After a few days of tinkering, I did have what could be considered the bones of a game.

{{< img src="tiddler-1.png" alt="Tiddler - The First Screenshot" width="900x" >}}

Yes, I did make some more of a map - it wasn't fun watching some boxes move around the screen.

My very rough plan is to put out regular blogs going over each of the major features as I get to refining them... So maybe pop back some time if that kind of rambling interests you.
