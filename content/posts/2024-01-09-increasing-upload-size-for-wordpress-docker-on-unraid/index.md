---
title: Increasing upload size for WordPress docker on Unraid
date: 2024-01-09T13:09:17+00:00
url: /posts/increasing-upload-size-for-wordpress-docker-on-unraid/
tags:
  - unraid
  - wordpress

---
If you're using unraid and want to use the docker engine to run your wordpress site, you're likely going to want to increase the maximum upload size.

This is the simplest way I found of doing it, though I am sure there are other methods.

First locate the `.htaccess` file in your webroot. If you don't know where to find the appdata path you can just edit the container and look for the following option:

{{< figure src="Screenshot-2024-01-09-125819.png" title="" >}}

Depending on your setup you may need to edit the file permissions so it can be edited, so open the terminal on your server and navigate to the above path:

{{< highlight bash >}}
cd /mnt/user/appdata/rest_of_path_you_found_above && chmod 777 .htaccess
{{< / highlight >}}

This will make the file writable by every group. If you've got security concerns you should probably not be following instructions found on someones blog without understanding them.

Now edit the file however you wish, either using a terminal based editor like `nano` or opening the file in something on your local machine. 

Add the following two lines to the bottom of the file:

{{< highlight bash >}}
php_value upload_max_filesize 500M
php_value post_max_size 500M
{{< / highlight >}}

Adjust the values as you see fit.

In the latest version of WordPress this didn't seem to do the trick for me, I also had to edit the value stored somewhere in WordPress' gubbins&#8230; To make this simpler I just used the plugin [Increase Maximum Upload File Size][1]. Navigating to the plugins page in your install and change the drop down. Hit Apply. Done.

That's it! Let me know if there's a way to do this without the plugin.

 [1]: https://wordpress.org/plugins/upload-max-file-size/