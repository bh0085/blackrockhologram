<html>
  <head>
    <title>Main page for ${sessionInfo['group']['passphrase']}</title>
  </head>
  
  <body>
    <% import json %>
    <script>sessionInfo=${json.dumps(sessionInfo) | n}</script>
    
    <%include file="/bbtemplates/group.mako"/>

    <!-- basic includes to get things moving!-->
    <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>
    <script src="/js/deps/underscore-min.js"></script>
    <script src="/js/deps/backbone-min.js"></script>
    <script src="/js/deps/mustache.js"></script>
    <script type="text/javascript" src="http://mbostock.github.com/d3/d3.v2.js"></script>


    <script src="/js/group/mvc/group.js"></script>
    <script src="/js/group/init_scripts.js"></script>
      
  </body>
  
</html>
