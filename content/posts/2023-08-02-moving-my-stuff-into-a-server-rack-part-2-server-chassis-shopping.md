---
title: Moving all my stuff into a server rack – Part 2, Server Chassis Shopping
author: Dan
type: post
date: 2023-08-02T12:38:53+00:00
url: /post/moving-my-stuff-into-a-server-rack-part-2-server-chassis-shopping/
categories:
  - Homelab
tags:
  - rack
  - tech

---
Server Chassis Shopping, say that three times fast.

If you haven&#8217;t alreay [seen Part 1 of this series][1] you might be interested in catching up on that first. In that post I go over picking the rack I did, and now it&#8217;s time to look at decanting my existing machines into chassis that will fit that server rack.

### Moving my gaming PC into a server chassis {.wp-block-heading}

The main issue with this was always going to be height, there was a chance I could fit the machine into a 3U chassis, but after a fair bit of poking it looked like my best bet was going to be a 4U chassis of some variety.

My gaming PC is currently water cooled, and while the chassis I found did technically support a water cooler, my cooler didn&#8217;t actually fit it. Which was quite annoying.

The chassis in question is the [Logic Case 4U Short][2]. Everything fit in pretty well with a lot of breathing room, but having to replace the CPU cooler was a bit of a pain. I needed to replace it with something not to tall, not too expensive, and available with next day delivery. 

I found the <a href="https://amzn.to/41Tgdf5" target="_blank" rel="noreferrer noopener">be quiet! PURE ROCK SLIM 2 9.2cm</a> fit all my requirements and it did indeed arrive the next day so I was able to fit it and crack on.<figure class="wp-block-image size-large">

<img data-dominant-color="6e6b65" data-has-transparency="false" style="--dominant-color: #6e6b65;" loading="lazy" decoding="async" width="768" height="1024" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6163-768x1024.webp?resize=768%2C1024&#038;ssl=1" alt="" class="not-transparent wp-image-119" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6163-jpg.webp?resize=768%2C1024&ssl=1 768w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6163-jpg.webp?resize=225%2C300&ssl=1 225w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6163-jpg.webp?resize=1152%2C1536&ssl=1 1152w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6163-jpg.webp?w=1295&ssl=1 1295w" sizes="(max-width: 768px) 100vw, 768px" data-recalc-dims="1" /> </figure> 

The height was actually a bit tighter than I would have liked, but it does fit kind of perfectly given the height.

I&#8217;ve not noticed any performance difference between using the water cooler and this fan based cooler, so happy days.

I replaced the fans on the front with the LED ones that used to live in my NAS case, because everyone knows LEDs make things go faster.

Wait for the end of the post to see a photo of everything in place in the rack&#8230;

### Moving my NAS into a server chassis {.wp-block-heading}

The NAS relocation was always going to be easier for me, my build has a small motherboard and low profile fans already.

I did, however, have another concern and that was future expandability. At the moment I only have 3 drives in it, but in the future I wanted to be able to expand this without having to think too hard. Unraid is JBOD (Just a Bunch of Disks) so my only real limit was SATA connections, and those are expandable.

I found another <a href="https://www.servercase.co.uk/shop/server-cases/rackmount/4u-chassis/4u-standard-chassis-15-x-35-hdd---480mm-short-depth-sc-h4-480/" target="_blank" rel="noreferrer noopener">pretty generic 4U Chassis that supports up to 15 3.5&#8243; disks</a> &#8211; sorted!

Moving the NAS into this chassis was completely uneventful. I did like the feature of the case that allows the disk drive section to flip upwards for easier access, it&#8217;s certainly going to make life easier when I get to adding more drives.<figure class="wp-block-image size-large">

<img data-dominant-color="5b535f" data-has-transparency="false" style="--dominant-color: #5b535f;" loading="lazy" decoding="async" width="768" height="1024" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-768x1024.webp?resize=768%2C1024&#038;ssl=1" alt="Server rack with the cases in place" class="not-transparent wp-image-120" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-scaled.webp?resize=768%2C1024&ssl=1 768w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-scaled.webp?resize=225%2C300&ssl=1 225w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-scaled.webp?resize=1152%2C1536&ssl=1 1152w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-scaled.webp?resize=1536%2C2048&ssl=1 1536w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6176-scaled.webp?w=1920&ssl=1 1920w" sizes="(max-width: 768px) 100vw, 768px" data-recalc-dims="1" /> </figure> 

One thing that I did want to do when moving all my stuff into a server rack was getting a UPS. While our power supply is good and pretty consistent, we do get the odd blip and I wanted to protect the system from being taken offline when they occurred.

I looked at various refurbished options and there were a lot of good deals to be had with batteries replaced. While I was looking there was a discount campaign going on on eBay so I had a look on there and found the Powercool 2U. I hadn&#8217;t heard of the brand but it had a 2 year warranty and a few reviews online said they were decent. It worked out quite cheap so I decided to risk it.

I&#8217;ve been using that Powercool UPS for a few months now and can confirm it&#8217;s been solid, even keeping the system online when we were away on holiday and the power blipped offline &#8211; which was a lifesaver as Plex being offline would have been a right pain!

In Part 3 I am planning on covering the PS5 being in the rack, and decoration&#8230; See you then.

 [1]: https://danbaker.dev/post/moving-all-my-stuff-into-a-server-rack-part-1-the-rack/
 [2]: https://www.scan.co.uk/products/logic-case-4u-short-depth-server-chassis-4x-35-hdd-450mm-depth-high-airflow-with-water-cooling-mount