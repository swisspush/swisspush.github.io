---
layout: post
title: Contributing to Xwalk add mutual authentication support
author: Gianluca Lupo
category: mobile
tags: [opensource, security, adroid, mobile]
---
{% include JB/setup %}

#### Security in mind
During 2015, I had the opportunity to work on a very challenging project: I had to find a solution to improve security context of mobile applications, built with Android, which would be used for **business to employee** (B2E) scenarios.
Mobile applications thought to be used by employees must rely on high security constraints because of potential confidential enterprise information which could be stored in the device itself. Moreover it is necessary to define boundaries between private and enterprise data. The trend of [BYOD](http://www.gartner.com/newsroom/id/2466615) in enterprise is the next big technology switch in the future for enterprises. In this scenario, solutions belong to appropriate platforms such as **Microsoft Enterprise Mobility**, **Oracle Mobile Cloud Service**, **Airwatch**, **Google for Work** and so on.
Before going and evaluating a platform, I had to find my own solution for the current security implementation we have. 

The technology stack has been be the following:

1. Android from 4.x to 5.x
2. Hybrid applications built with [Cordova](https://cordova.apache.org/) 
3. Personal certificate enrollment process available (via [SCEP](https://en.wikipedia.org/wiki/Simple_Certificate_Enrollment_Protocol) server)

The proof of concept to build requires:

1. Hybrid mobile application
2. Enrollment of personal certificate at the first run of the application.
3. Store the certificate in secure storage on device
4. Allow [webview](http://developer.android.com/reference/android/webkit/WebView.html) to use [mutual authentication](https://en.wikipedia.org/wiki/Mutual_authentication) 

#### The challenge, the trials and the solution
The challenge is to be able to extend the webview in order to allow the mutual authentication handshake natively and not using other solutions (like http proxying, ...).

##### Attempt 1
_Analysis of the sources and Android in particular stack security and the implementation of the WebView-based Chormium (new implementation from version 4.4)._

The analysis confirmed that the classes and methods that allowed to intercept the request of the client certificate in previous versions of WebView have been totally removed from the SDK. The analysis of Chromium's low-level implementation has confirmed that the implementation contained in 4.4 does not allow to select webview client side certificates:

![Snippet 1]({{ site.url }}/assets/images/xwalk/pic-1.png)

This is an excerpt from the code of webview of Android in June 2013. From the comments, it is clear that the webview does not support client-side certificates.
In the latest source of Android, however, something is moving. The implementation method of the same date in September 2014 it seems to open some glimmer:

![Snippet 2]({{ site.url }}/assets/images/xwalk/pic-2.png)

##### Attempt 2
_Partially working solution for versions from 15 to 18 (HiddenApiAdoption)_

In these versions there are two classes:

1. _android.webkit.WebViewClientClassicExt_ (in **17** and **18**, is _hidden_)
2. _android.webkit.WebViewClient_ (in **16** and **15**, is _public_)

which allows to implement the following method:

3. _onReceivedClientCertRequest( WebView view, ClientCertRequestHandler handler, String host_and_port )_

So in this case, implementing this method it is possible to enable the use of client certificates in a webview.

##### Attempt 3
_Customize Java Secure Socket Extension (JSSE)_

The [Java Secure Socket Extension (JSSE)](http://docs.oracle.com/javase/7/docs/technotes/guides/security/jsse/JSSERefGuide.html) enables secure Internet communications. It provides a framework and an implementation for a Java version of the SSL and TLS protocols and includes functionality for data encryption, server authentication, message integrity, and optional client authentication.

![JSSE classes diagram]({{ site.url }}/assets/images/xwalk/pic-3.png)

Assumption tested:

1. In a _standard_ implementation, the JSSE framework should intercept all secure network communications made by Java applications deployed on a specific platform.
2. JSSE framework is extensible and allows developer to plug custom network security implementations (Security Providers).
3. Android platform uses a standard JSSE implementation (Apache Harmony JSSE).
4. Implementing a **custom** Security Provider on the Android platform should allow to intercept and customize all secure network connections made with the available Android networking APIs: **HttpConnection**, **HttpClient**, **WebView** connections.

PoC built:

A demo Android app has been implemented to use a standard WebView and two methods of loading content into it:

1. Standard WebView loadUrl() API.
2. CustomWebClient implementation that intercepts all WebView HTTP requests and loads them using HTTPConnection API.

This implementation has been tested on Android platform 19 (Kit Kat) and 21 (Android L Preview);

Results:

1. Standard WebView loadUrl() API:

	1. The custom _TrustManagerFactory_ is invoked during the server certificate check of the SSL handshaking flow.
	2. The custom _KeyManagerFactory_ is **not** invoked during the client certificate request phase of the SSL handshaking flow.
	3. Connecting to a server that requires Client Certificate autentication **fails** with error code 901 (SSL server requires client certificate) on both tested API levels (19 and 21); .
	4. **final considerations**: WebView connections partially rely on JSSE framework stack (server certificate trust check). Unfortunately the connection with the hosting platform JSSE client certificate management (_KeyManagerFactory_ and _KeyManager_) is not implemented.

2. HTTPConnection API:

	1. The custom _TrustManagerFactory_ is invoked during the server certificate check of the SSL handshaking flow.
	2. The custom KeyManagerFactory is **successfully** invoked during the client certificate request phase of the SSL handshaking flow.
	3. Connecting to a server that requires Client Certificate authentication **succeds** on both tested API levels (19 and 21).
	4. **final considerations**: the _HTTPConnection_ API allows to load a resource protected with client certificate authentication into the WebView but this solution is not usable in a production environment because is not able to deal with:
		
		1. HTTP Posts
		2. AJAX Asynchronous HTTP Connections

#### Contributing to xwalk
In order to have a solution compliant with security and platform target requirement, the team decided to look for an alternative webview which could be customized and used to replace the native android webview.

[CrossWalk](https://crosswalk-project.org/) has been chosen.

After an initial environment configuration to build the the library, the patch has been done and the solution has been verified in another PoC.
Once the solution has been tested internally and also from off-shore team, the new feature has been provided to the open source project:

1. [https://github.com/crosswalk-project/crosswalk/pull/3126](https://github.com/crosswalk-project/crosswalk/pull/3126)

The process of accepting the pull request has been long and has required some further work to be done to be compliant with quality rules of the project.
At the end today CrossWalk supports natively today mutual authentication and we are proud the have contributed to it. 

#### Links

1. [http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html](http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html)
2. [http://docs.oracle.com/javase/7/docs/technotes/guides/security/crypto/HowToImplAProvider.html](http://docs.oracle.com/javase/7/docs/technotes/guides/security/crypto/HowToImplAProvider.html)
3. [http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html#Customization](http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html#Customization)
4. [http://www.angelfire.com/or/abhilash/site/articles/jsse-km/customKeyManager.html](http://www.angelfire.com/or/abhilash/site/articles/jsse-km/customKeyManager.html)
5. [http://nelenkov.blogspot.de/2011/12/using-custom-certificate-trust-store-on.html](http://nelenkov.blogspot.de/2011/12/using-custom-certificate-trust-store-on.html)
