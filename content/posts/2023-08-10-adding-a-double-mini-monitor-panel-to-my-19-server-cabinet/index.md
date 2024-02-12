---
title: Adding a double mini-monitor panel to my 19″ server cabinet
date: 2023-08-10T08:52:36+00:00
url: /posts/adding-a-double-mini-monitor-panel-to-my-19-server-cabinet/
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

I decided the best thing to do would be to DIY something, there are [loads of small panels available][1] on Amazon, and if you [order from China](https://s.click.aliexpress.com/e/_DELKqBL) you can shave a few quid off as well.

After doing a bit of research it seemed Waveshare was going to be a reliable brand, so I opted to spend a little more and get something with a reputation, and some decent online documentation. I ordered two of the [Waveshare 7inch displays][2].

The panels arrived and I plugged them both into the Intel NUC I was planning on driving them with. All looked good.

{{< figure src="IMG_6352.jpg" title="" >}}

I planned to use one screen to display my Grafana dashboard (more on that in the future&#8230;) - and another to display video content, so I tested it out with Lord of the Rings.<figure class="wp-block-video"><video controls src="https://danbaker.dev/wp-content/uploads/2024/01/IMG_6353.mp4"></video></figure> 

With the monitors sorted, I got back to thinking about how to mount the things in the rack. I had two main options, either get someone to fabricate something, or DIY something myself.

## Monitor Mount Panel

I can get access to a CO2 laser cutter with a decent sized bed that could cut something, but that would involve designing something to size, acquiring something to cut - metal? plastic? - and then actually doing it. 

Getting someone to fabricate me something was also an option, but obviously more expensive.

I was about to pull the trigger on making my own when I came across a company setting mounts designed to fit some of their own monitors - [Lilliput Direct][3]. They make a [19&#8243; 4U dual panel bracket][4] which looked to be exactly what I was after.

After getting hold of the technical documentation from Keith at Lilliput, who was extremely helpful, I measured up and decided there would be enough of the surround of the monitor to attach to the panel without needing to use the standard mount points. I'd sort out the exact details later.

{{< figure src="Schematic.jpg" title="" >}}

The panel arrived and I was able to simply hot glue the mounting nuts provided with the screens to the mounting panel. Make sure you attach them to the screens first so you can get the spacing and positioning accurate.

{{< figure src="IMG_6361-edited.webp" title="" align=center >}}

You can just about make out the hot glued mounts on the rear in the above photo.

The only downside to this method is the original mounting holes on the panel remain, I am planning on either filling and painting these - or sticking something over it. Maybe more stickers.

{{< figure src="IMG_6367-jpg.webp" title="" align=center >}}

 [1]: https://amzn.to/3TUjw3I
 [2]: https://amzn.to/3NURgtH
 [3]: https://lilliputdirect.com/
 [4]: https://lilliputdirect.com/19-inch-4U-rackmount-bracket