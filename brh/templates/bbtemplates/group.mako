<script type='unknown' id='group-view-template'>
  <span class="headline"><h3>Group, {{id}}  with passphrase "{{passphrase}}" is good to go. </h3><h4>?? Others from your group have already contributed their pictures.</h4></span>

  <ol>
    <li>
     <span> To view theirs and add your own head over to:</span>
     <span class="bin-container"></span>
     <span> We use pictobin<a href="/faq">?</a> to gather photos and then collect them here to build the molehill.
    </li><li>
      Then check out your grouyp's pictures in the <a href="/groups/{{passphrase}}/molehill">the molehill</a>
    </li><li>
      Add a bit of info to help molehill sort everyone's pictures by heading over to <a href="/groups/{{passphrase}}/annotationkit">the Annotation Toolkit</a>
      <div class="alert alert-info how-we-do-it">
	<span class="title">Check out</span>
	<a href="/faq/building">How we're combining user input, picture metadata and machine learning to build the the molehill</a></div>
    </li><li>
      Sign up to be <a href="/groups/{{passphrase}}/notifyme">notified</a> occasionally as molehill undergoes big changes.
      <div class="alert alert-warning first-time">
	<p>We're figuring out how consistently we can get location and time data from everyone's pictures and writing algorithms to <a href="/faq/missingdata">deal with wissing data</a> in order to improve molehill as your pictures flow in.</p>
	<p>That means that molehill is going to<i> <a href="/faq/changedramatically"> change dramatically</a></i> over the next couple of weeks as people add their photos and we write the tools to deal with them!</p>
      </div>
    </li><li>
      Come back soon; we're coding like crazy and this place is changing fast.
    </li>
  </ol>
</script>

<script type='unknown' id='bin-view-template'>
  <a href={{url}}>{{url}}</a>
  <div class="pics-container">
  </div>
</script>

<script type='unknown' id='pb-pic-view-template'>
  <img class="medium-thumb-display" 
       src="{{medium_thumb.url}}"
       style="left:{{medium_thumb.left}}px;
		top:{{medium_thumb.top}}px;
		width:{{medium_thumb.width}}px;
		height:{{medium_thumb.height}}px;" ></img>
  <ul>
  <li class="name-display info-display">{{creator_name}} - {{name}}</li>
  <li class="date-display info-display">{{date_string}}, {{String(datetime)}}</li>
  </ul>
</script>
<script type='unknown' id ='pic-view-template'>
</script>
