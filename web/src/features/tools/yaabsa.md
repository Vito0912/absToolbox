# Why?

This toolbox was originally just that: a toolbox. Specifically, it was a toolbox for me. I love clean metadata, and all the tools helped me keep mine correct and tidy.

I believe everyone should have access to such tools, so I released them publicly. I made it possible to use these tools in a browser without disabling all CORS protection by adding the feature directly to ABS. This also opened the door for alternative web clients and other tools, such as completemyseries. I do not do much web development (especially I don't like Vue) and am more focused on the backend, so the user interface was always generated with the help of AI just to get the "backend" logic working. It had issues, especially when people were setting up CORS and did so wrong. Also http does not work from a secure https connection.

Now, I do not want to keep copying IDs or finding ways to integrate user interfaces to perform tasks, such as editing library sessions. It does not fit the theme and everyone sees that.

I already started yaabsa a year ago, but I lost motivation after app after app was vibed. However, I started having more and more issues with Android Auto using the official app. Adding new books became a burden too that I wanted to fix directly inside the client to prevent sync issues from happening in the first place.

So, I started working on yaabsa again, and the tools came with it. Why should there be an extra web interface where you need to search for a session to edit items you identified as wrong, when you can just do it in the same client without any trouble?

Also yaabsa also has a typed lib/sdk, proper parsing and proper state management. So any changes are correctly reflected.

yaabsa is **not** just a mobile client! It is **also** a desktop client and it will replace the whole ABS web UI feature wise. Many QoL features, especially for uploading and matching.

yaabsa also is a **personal** client. Besides here and there for specific features (e.g. I made a comment in the issue for AAOS support) that currently do not exists in other clients and this toolbox I will not "promote"/post about this app. I don't care. if people use it, they use it. If not, not. I do not have any financial gain or disadvantage. It's a client I build for family and friends and for **me** to replace the web client and add QoL features.

Now you know my reasoning.

Because I also had these thoughts myself. Here are two points regarding why a new and extra client exists:

a) As I write this, the frontend is getting rewritten in React for months. It is much better than Vue - I still regret choosing Vue for this toolbox, but it still is not finished after months and probably will not for months. Therefore, any changes in the old and new client will not be merged for several months. I have already contributed to the React client, as well as the Vue.

b) The ABS apps will also be rewritten in React, but that is not the reason. I have expressed this multiple times: I do not think the current cross-platform framework is worth it. You have the burden of JavaScript/HTML and still need to write basically everything in native code for iOS and Android. This creates gaps in features between devices. I do not contribute because I think it is a waste of time. There are better frameworks available, as the ABS app does not try to follow a native design language - which I would agree makes something like Flutter not as easy as writing in the native languages.