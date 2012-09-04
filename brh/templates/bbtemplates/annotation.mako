<script type="unknown" id='selection-gallery-view-template'>
  <span class="selection-header">
    <span class="selection-info-container">Selected
      <span class="selection-count-display">0</span> pics.
      <span class="selection-more-info nodisplay">
	taken by <span class="selection-creator-count-display"></span> contributors from <span class="selection-time-start-display">2pm Tuesday</span> to <span class="selection-time-end-display">3pm Wednesday</span>.
      </span>
    </span>
    <span class="selection-labeller-container">
      <div class="place-submitter">
	<div class="place-submitter-label"><h4>At what place were they taken?</h4></div>
	<div>
	  <input type="text" class="place input-medium" placeholder="place name" width=25/>
	  <button class="btn btn-primary" onclick="submit_place()" value="submit">submit</button>
	</div>
      </div>
    </span>
  </span>
  <span class="thumbs"></span>
</script>

<script type="unknown" id="place-input-template">
  
</script>


<script type="unknown" id="place-view-template">
  <span class="place-view-colored"
	style="background-color:{{med_color}};
	       color:white;
	       border-color:white;">
  <span class="name-display">{{name}}</span>, <span class="count-display">{{count}} photos</span>
  </span>
</script>

<script type="unknown" id="place-gallery-view-template">
  <div class="place-views-container">
  </div>
</script>
