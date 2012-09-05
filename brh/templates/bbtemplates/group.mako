<script type='unknown' id='group-view-template'>
  <span class="headline"><h4>Group "{{passphrase}}" is all set. Its photos will live <a class="bin-link-display">here</a>!</h4></span>
  
  <div class='state-container'>Hello all - there've been a few hitches here and at pictobin in the past day or so. <a href="#" class="s1-content" onclick="$(this).parent().toggleClass('state-two');"> ...show more</a><span class="s2-content">. We're working them out! <a class="bin-link-display" href=#>Picture submission and viewing as a group </a>will work great; so will signing up to be  <a href="/groups/{{passphrase}}/notifyme">notified</a>. Its going to be a couple of days before everything else does! Thanks for bearing with us :).</br> (9/5/2012)
	<a href="#" onclick="$(this).parentsUntil('.state-container').last().parent().toggleClass('state-two');"> ...show less</a></span></div>
  <div class="steps-container">
  <div class="steps-above">
    Here's how to add to molehill: <a href="/faq">faq</a><a href="/groups/{{passphrase}}/about">about</a><a href="/img/mockup.pdf">mockup</a>

  </div>
  <div class="steps">
  <ol>
    <li>
     <p> <h4><a class="bin-link-display">View and add group photos.</a></h4>
       <span class="steps-item-content">We use pictobin to gather photos and we collect them here to build the molehill.</p></span>
    </li><li>
      <h4>Place photos in Space and Time.</h4>  <span class="steps-item-content">Molehill needs your input to cluster and process everybody's pictures. The annotation kit isn't fully functional yet but you can check it out <a href="/groups/{{passphrase}}/annotationkit">here</a>.</span>
      <div class="alert alert-info how-we-do-it">
	<p class="title"><span>Check out</span></p>
	<p><a href="/faq/building">How we're combining user input, picture metadata and machine learning to build the the molehill</a></p></div>
    </li><li>
      <h4>Check out Black Rock City</h4> <span class="steps-item-content">Right now we've gathered less than 10,000 photos; these form a rather patchy tapestry. The molehll isn't running publicly yet but if you come back in a bit, you'll be able to check it out <a href="/groups/{{passphrase}}/molehill">here</a>.<span>
    </li><li>
      <h4><a href="/groups/{{passphrase}}/notifyme">Sign up for Notifications</a></h4> <span class="steps-item-content"> Throw us some contact info and we'll email you occasionally as molehill undergoes big changes or when your group members add pictures for the first time.</span>
      <div class="alert alert-warning first-time">
	<p class="title"><span>What we're up to</span></p>
	<p>We're figuring out how consistently we can get location and time data from everyone's pictures and writing algorithms to <a href="/faq/missingdata">deal with missing data</a> in order to improve molehill as your pictures flow in.</p>
	<p>That means that molehill is going to<i> <a href="/faq/changedramatically"> change dramatically</a></i> over the next couple of weeks as people add their photos and we write the tools to deal with them!</p>
      </div>
    </li><li>
      <h4>Come back soon!</h4> <span class="steps-item-content"> We're coding like crazy and this place is changing fast.</span>
    </li>
  </ol>
  </div>
  <div class=steps-after>email us at blackrockhologram@gmail.com</div>
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
