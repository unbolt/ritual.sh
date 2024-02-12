---
title: Adding a double mini-monitor panel to my 19″ server cabinet
date: 2023-08-10T08:52:36+00:00
url: /post/adding-a-double-mini-monitor-panel-to-my-19-server-cabinet/
featured_image: /wp-content/uploads/2024/01/IMG_6358-edited.webp
enclosure:
  - |
    |
        https://danbaker.dev/wp-content/uploads/2024/01/IMG_6353.mp4
        3466771
        video/mp4
        
tags:
  - homelab
  - rack
  - tech

---
When I started the project to move all my computers into a single rack to save some space, and to look cool, I knew I wanted some kind of monitor in it. 

There were a bunch of options for big and ugly KVM panels that pull out, but that wasn't what I was looking for.

In the AV world there are often small screen monitors in racks for keeping an eye on the broadcast outputs, but they are often quite expensive, and the monitor qualities also aren't great unless you spend a _lot_.

## Display Panels

I decided the best thing to do would be to DIY something, there are [loads of small panels available][1] on Amazon, and if <a href="https://s.click.aliexpress.com/e/_DELKqBL" target="_blank" rel="noreferrer noopener">order from China</a> you can shave a few quid off as well.

After doing a bit of research it seemed Waveshare was going to be a reliable brand, so I opted to spend a little more and get something with a reputation, and some decent online documentation. I ordered two of the [Waveshare 7inch displays][2].

The panels arrived and I plugged them both into the Intel NUC I was planning on driving them with. All looked good.<figure class="wp-block-image size-large wp-duotone-unset-3">

<img data-dominant-color="443950" data-has-transparency="false" style="--dominant-color: #443950;" loading="lazy" decoding="async" width="1024" height="768" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-1024x768.webp?resize=1024%2C768&#038;ssl=1" alt="" class="not-transparent wp-image-13" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-jpg.webp?resize=1024%2C768&ssl=1 1024w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-jpg.webp?resize=300%2C225&ssl=1 300w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-jpg.webp?resize=768%2C576&ssl=1 768w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-jpg.webp?resize=1536%2C1152&ssl=1 1536w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6352-jpg.webp?w=2018&ssl=1 2018w" sizes="(max-width: 1000px) 100vw, 1000px" data-recalc-dims="1" /> </figure> 

I planned to use one screen to display my Grafana dashboard (more on that in the future&#8230;) - and another to display video content, so I tested it out with Lord of the Rings.<figure class="wp-block-video"><video controls src="https://danbaker.dev/wp-content/uploads/2024/01/IMG_6353.mp4"></video></figure> 

With the monitors sorted, I got back to thinking about how to mount the things in the rack. I had two main options, either get someone to fabricate something, or DIY something myself.

## Monitor Mount Panel

I can get access to a CO2 laser cutter with a decent sized bed that could cut something, but that would involve designing something to size, acquiring something to cut - metal? plastic? - and then actually doing it. 

Getting someone to fabricate me something was also an option, but obviously more expensive.

I was about to pull the trigger on making my own when I came across a company setting mounts designed to fit some of their own monitors - [Lilliput Direct][3]. They make a [19&#8243; 4U dual panel bracket][4] which looked to be exactly what I was after.

After getting hold of the technical documentation from Keith at Lilliput, who was extremely helpful, I measured up and decided there would be enough of the surround of the monitor to attach to the panel without needing to use the standard mount points. I'd sort out the exact details later.<figure class="wp-block-image size-large wp-duotone-duotone-1">

<img data-dominant-color="fdfdfd" data-has-transparency="false" style="--dominant-color: #fdfdfd;" loading="lazy" decoding="async" width="1024" height="383" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-1024x383.webp?resize=1024%2C383&#038;ssl=1" alt="" class="not-transparent wp-image-22" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-jpg.webp?resize=1024%2C383&ssl=1 1024w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-jpg.webp?resize=300%2C112&ssl=1 300w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-jpg.webp?resize=768%2C287&ssl=1 768w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-jpg.webp?resize=1536%2C574&ssl=1 1536w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/Schematic-jpg.webp?w=1913&ssl=1 1913w" sizes="(max-width: 1000px) 100vw, 1000px" data-recalc-dims="1" /> </figure> 

The panel arrived and I was able to simply hot glue the mounting nuts provided with the screens to the mounting panel. Make sure you attach them to the screens first so you can get the spacing and positioning accurate. <figure class="wp-block-image size-full wp-duotone-unset-4">

<img data-dominant-color="31303a" data-has-transparency="false" style="--dominant-color: #31303a;" loading="lazy" decoding="async" width="635" height="396" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6361-edited.webp?resize=635%2C396&#038;ssl=1" alt="" class="not-transparent wp-image-15" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6361-edited.webp?w=635&ssl=1 635w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6361-edited.webp?resize=300%2C187&ssl=1 300w" sizes="(max-width: 635px) 100vw, 635px" data-recalc-dims="1" /> </figure> 

You can just about make out the hot glued mounts on the rear in the above photo.

The only downside to this method is the original mounting holes on the panel remain, I am planning on either filling and painting these - or sticking something over it. Maybe more stickers.<figure class="wp-block-image size-large wp-duotone-unset-5">

<img data-dominant-color="1d1a64" data-has-transparency="false" style="--dominant-color: #1d1a64;" loading="lazy" decoding="async" width="768" height="1024" src="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6367-768x1024.webp?resize=768%2C1024&#038;ssl=1" alt="" class="not-transparent wp-image-16" srcset="https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6367-jpg.webp?resize=768%2C1024&ssl=1 768w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6367-jpg.webp?resize=225%2C300&ssl=1 225w, https://i0.wp.com/danbaker.dev/wp-content/uploads/2024/01/IMG_6367-jpg.webp?w=1136&ssl=1 1136w" sizes="(max-width: 768px) 100vw, 768px" data-recalc-dims="1" /> </figure>

 [1]: https://amzn.to/3TUjw3I
 [2]: https://amzn.to/3NURgtH
 [3]: https://lilliputdirect.com/
 [4]: https://lilliputdirect.com/19-inch-4U-rackmount-bracket