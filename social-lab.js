window.SocialLab = (function(){
  var state = {
    name: localStorage.getItem("social_name") || "APD Eine",
    handle: localStorage.getItem("social_handle") || "apdeine",
    bio: localStorage.getItem("social_bio") || "Visual Tests For Your Brand.",
    logo: localStorage.getItem("social_logo") || "",
    platform: "x"
  };

  var draftLogo = state.logo;

  function esc(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
    });
  }

  function renderAvatarHtml(customLogo, fallbackChar, extraStyle){
    var logoUrl = customLogo || state.logo;
    if(logoUrl){
      return '<img src="' + logoUrl + '" style="width:100%;height:100%;object-fit:cover;' + (extraStyle||'') + '" alt="Avatar">';
    }
    return esc(fallbackChar || state.name.charAt(0).toUpperCase() || "N");
  }

  function render(){
    var name = state.name.trim() || "Brand Name";
    var handle = state.handle.trim().replace(/^@/, '') || "brand";
    var bio = state.bio.trim();
    var firstChar = name.charAt(0).toUpperCase() || "B";

    document.getElementById("socialXNameText").textContent = name;
    document.getElementById("socialXHandleText").textContent = "@" + handle;
    document.getElementById("socialXBioText").textContent = bio;
    document.getElementById("socialXPostName").textContent = name;
    document.getElementById("socialXPostHandle").textContent = "@" + handle + " \u00B7 2h";

    var xAvatar = renderAvatarHtml(null, firstChar);
    document.getElementById("socialXAvatarBox").innerHTML = xAvatar;
    document.getElementById("socialXPostAvatarBox").innerHTML = xAvatar;

    document.getElementById("socialLiNameText").textContent = name;
    document.getElementById("socialLiTaglineText").textContent = bio;
    document.getElementById("socialLiPostTitle").textContent = name;

    var liAvatar = renderAvatarHtml(null, firstChar);
    document.getElementById("socialLiAvatarBox").innerHTML = liAvatar;
    document.getElementById("socialLiPostAvatarBox").innerHTML = liAvatar;

    document.getElementById("socialPanelPreviewName").textContent = name;
    document.getElementById("socialPanelPreviewHandle").textContent = "@" + handle;
    document.getElementById("socialPanelPreviewAvatar").innerHTML = renderAvatarHtml(draftLogo, firstChar);
  }

  function updatePreview(){
    var name = document.getElementById("socialInputName").value.trim() || "Brand Name";
    var handle = document.getElementById("socialInputHandle").value.trim().replace(/^@/, '') || "brand";
    var url = document.getElementById("socialInputUrl").value.trim();

    if(url) draftLogo = url;

    document.getElementById("socialPanelPreviewName").textContent = name;
    document.getElementById("socialPanelPreviewHandle").textContent = "@" + handle;
    document.getElementById("socialPanelPreviewAvatar").innerHTML = renderAvatarHtml(draftLogo, name.charAt(0).toUpperCase());
  }

  function handleFileUpload(event){
    var file = event.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      draftLogo = reader.result;
      document.getElementById("socialInputUrl").value = "";
      updatePreview();
    };
    reader.readAsDataURL(file);
  }

  function switchPlatform(p){
    state.platform = p;
    document.getElementById("socialTabX").classList.toggle("active", p === 'x');
    document.getElementById("socialTabLinkedin").classList.toggle("active", p === 'linkedin');

    document.getElementById("socialXView").classList.toggle("active", p === 'x');
    document.getElementById("socialLinkedinView").classList.toggle("active", p === 'linkedin');
  }

  function saveSettings(){
    state.name = document.getElementById("socialInputName").value.trim() || "APD Eine";
    state.handle = document.getElementById("socialInputHandle").value.trim().replace(/^@/, '') || "novatech";
    state.bio = document.getElementById("socialInputBio").value.trim();
    if(draftLogo) state.logo = draftLogo;

    localStorage.setItem("social_name", state.name);
    localStorage.setItem("social_handle", state.handle);
    localStorage.setItem("social_bio", state.bio);
    localStorage.setItem("social_logo", state.logo);

    render();
    closePanel();
  }

  function resetDefaults(){
    localStorage.removeItem("social_name");
    localStorage.removeItem("social_handle");
    localStorage.removeItem("social_bio");
    localStorage.removeItem("social_logo");

    state = {
      name: "APD Eine",
      handle: "apdeine",
      bio: "Visual Tests For Your Brand.",
      logo: "",
      platform: state.platform
    };
    draftLogo = "";

    document.getElementById("socialInputName").value = state.name;
    document.getElementById("socialInputHandle").value = state.handle;
    document.getElementById("socialInputBio").value = state.bio;
    document.getElementById("socialInputUrl").value = "";

    render();
  }

  function openPanel(){
    document.getElementById("socialInputName").value = state.name;
    document.getElementById("socialInputHandle").value = state.handle;
    document.getElementById("socialInputBio").value = state.bio;
    document.getElementById("socialInputUrl").value = state.logo.startsWith("http") ? state.logo : "";
    draftLogo = state.logo;

    document.getElementById("socialSettingsPanel").classList.add("open");
    updatePreview();
  }

  function closePanel(){
    document.getElementById("socialSettingsPanel").classList.remove("open");
  }

  function init(){
    document.getElementById("socialClock").textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    render();
  }

  return {
    init: init,
    switchPlatform: switchPlatform,
    openPanel: openPanel,
    closePanel: closePanel,
    updatePreview: updatePreview,
    handleFileUpload: handleFileUpload,
    saveSettings: saveSettings,
    resetDefaults: resetDefaults
  };
})();
