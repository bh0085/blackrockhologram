<div class="headline">
  <div class="content-row"><h3>"I'm part of ${sessionInfo['group']['passphrase']}".</h3></div>
  <div class="content-row"><h4>Email me:</h4></div>
  <div>
    <div class="notification-trigger">
      <input type="checkbox" checked=true name="newpeople"/>When new people add new stuff to ${sessionInfo['group']['passphrase']}.
      </div>
    <div class="notification-trigger">
    <input type="checkbox" name="changes"/>When this site goes undergoes big changes such as: 
    <ul><li> we launch the real molehill</li><li> we finish the annotation kit</li> <li> we gather 100,000 photos </li><li> we gather 1,000,000 pictures</li></ul> 
    </div>
  </div>
  <div class="content-row email-submitter">
    <input type="text" class="email input-medium" placeholder="email" width=25/>
    <button class="btn btn-primary" onclick="submit_email()">submit</button>
  </div>
</div>
