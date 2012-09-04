<html>
<head>
    <meta HTTP-EQUIV="CONTENT-LANGUAGE" CONTENT="en-US,fr">
    <meta charset="utf-8">
    <title>Black Rock Hologram</title>
</head>
<body class="home">
  <div class='bg-image'></div>
  <div><h4>Server issues are fixed :)</h4></div>
  <div><p>We've just got back from the desert so this site isn't really done yet.</p><p>Enter the passphrase from your token and check it out!</p></div>

  <div class="passphrase-submitter">
    <div class="passphrase-label"><h4>Enter a passphrase.</h4></div>
    <div>
    <input type="text" class="passphrase input-medium" placeholder="passphrase" width=25/>
    <button class="btn btn-primary" onclick="submit_passphrase()" value="submit">submit</button>
    </div>
  </div>


  <%include file="/home/about.mako"/>
  <%include file="/styles.mako"/>

  <script src="/js/home/all.js"></script>    
  <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>
  <script src="/js/deps/underscore-min.js"></script>
  <script src="/js/deps/backbone-min.js"></script>
  <script src="/js/deps/mustache.js"></script>


</body>
</html>
