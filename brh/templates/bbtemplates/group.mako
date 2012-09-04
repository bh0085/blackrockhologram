<script type='unknown' id='group-view-template'>
  <span class="headline"><h3>Group {{id}}  with passphrase "{{passphrase}}" is good to go! </h3><h5>Here's how it works.</h5></span>
  <div class="steps">
  <ol>
    <li>
     <p> <h4><a class="bin-link-display">View and add group photos.</a></h4> Manage your group's repository by heading over to
     <span class="bin-container"></span>. We use pictobin<a href="/faq">[?]</a> to gather photos and we collect them here to build the molehill.</p>
    </li><li>
      <h4><a href="/groups/{{passphrase}}/annotationkit">Place photos in Space and Time.</a></h4> Molehill needs your input to cluster and process everybody's pictures. Head over to the<a href="/groups/{{passphrase}}/annotationkit"> Annotation Toolkit</a> and have fun.
      <div class="alert alert-info how-we-do-it">
	<p class="title"><span>Check out</span></p>
	<p><a href="/faq/building">How we're combining user input, picture metadata and machine learning to build the the molehill</a></p></div>
    </li><li>
      <h4>Check out Black Rock City</h4> Right now we've gathered less than 10,000 photos; these form a rather patchy tapestry. Check it out at <a href="/groups/{{passphrase}}/molehill">the molehill</a>.
    </li><li>
      <h4>Sign up for Notifications</h4> If you head over to <a href="/groups/{{passphrase}}/notifyme">this link</a> and throw us some contact info, we'll email you occasionally as molehill undergoes big changes and when group members add pictures for the first time.
      <div class="alert alert-warning first-time">
	<p class="title"><span>What we're up to</span></p>
	<p>We're figuring out how consistently we can get location and time data from everyone's pictures and writing algorithms to <a href="/faq/missingdata">deal with missing data</a> in order to improve molehill as your pictures flow in.</p>
	<p>That means that molehill is going to<i> <a href="/faq/changedramatically"> change dramatically</a></i> over the next couple of weeks as people add their photos and we write the tools to deal with them!</p>
      </div>
    </li><li>
      <h4>Come back soon!</h4> We're coding like crazy and this place is changing fast.
    </li>
  </ol>
  </div>
</script>

<script type='unknown' id='bin-view-template'>
<a href={{url}}>{{url}}</a>
</script>

<script type='unknown' id='bin-no-pictures-view-template'>
  <p>Uh oh... there don't seem to be any pictures here just yet.</p>
  <p>You or someone in your group will have to drop some off at <a href={{url}}>{{url}}</a> and then we can get down to placing them on the map.</p>
  <p>... Or we might just be waiting for the server to compute thumbnails or metadata</p>
</script>

<script type='unknown' id='pb-pic-view-template'>
  <div class="close-container">
  <button type="button" class="close">×</button>
  </div>
  <div class="medium-thumb-display" 
       style="background-image:url('{{medium_thumb.url}}');
	      background-position:-{{medium_thumb.x}}px -{{medium_thumb.y}}px;
	      width:{{medium_thumb.width}}px;
	      height:{{medium_thumb.height}}px;" ></div>
  <ul class="info">
  <li class="name-display info-display">{{creator_name}} - {{name}}</li>
  <li class="date-display info-display">{{date_string}}, {{String(datetime)}}</li>
  </ul>
</script>
<script type='unknown' id ='pic-view-template'>
</script>
