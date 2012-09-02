<html>
<head>
    <meta HTTP-EQUIV="CONTENT-LANGUAGE" CONTENT="en-US,fr">
    <meta charset="utf-8">
    <title>Black Rock Hologram</title>
</head>
<body>
  <div class='bg-image'></div>
  <div><h3>We're hard at work... </h3></div>
  <div><h4>Go out and have fun, check back on monday!</h4></div>

  <div class="passphrase-submitter">
    <div class="passphrase-label"><h3>Enter a passphrase and head into molehill.</h3></div>
    <div>
    <input type="text" class="passphrase" placeholder="passphrase" width=25/>
    </div>
    <div>
    <button class="btn btn-primary" onclick="submit_passphrase()" value="submit">submit</button>
    </div>
  </div>

  
  <div class='content'>
    <!-- /the chart goes here -->
  </div>

  <%include file="/home/about.mako"/>
  <%include file="/styles.mako"/>

  <script src="/js/home/all.js"></script>    
  <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>
  <script src="/js/deps/underscore-min.js"></script>
  <script src="/js/deps/backbone-min.js"></script>
  <script src="/js/deps/mustache.js"></script>

  <%include file="/home/about.mako"/>
  <%include file="/styles.mako"/>
</body>
</html>
