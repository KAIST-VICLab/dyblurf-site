// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
  var videoMerge = document.getElementById(videoId + "Merge");
  var vid = document.getElementById(videoId);

  var position = 0.5;
  var vidWidth = vid.videoWidth / 2;
  var vidHeight = vid.videoHeight;
  var widthRatio = 400 / vidWidth;
  videoMerge.width = 400;
  videoMerge.height *= widthRatio;

  var mergeContext = videoMerge.getContext("2d");

  if (vid.readyState > 3) {
    // vid.play();

    function trackLocation(e) {
      // Normalize to [0, 1]
      bcr = videoMerge.getBoundingClientRect();
      console.log(e.pageX, bcr.width);
      position = (e.pageX - bcr.x) / bcr.width;
    }
    function trackLocationTouch(e) {
      // Normalize to [0, 1]
      bcr = videoMerge.getBoundingClientRect();
      position = (e.touches[0].pageX - bcr.x) / bcr.width;
    }

    videoMerge.addEventListener("mousemove", trackLocation, false);
    videoMerge.addEventListener("touchstart", trackLocationTouch, false);
    videoMerge.addEventListener("touchmove", trackLocationTouch, false);
    // videoMerge.addEventListener("click", trackClick, false);

    function drawLoop() {
      mergeContext.drawImage(
        vid,
        0,
        0,
        vidWidth,
        vidHeight,
        0,
        0,
        vidWidth * widthRatio,
        vidHeight * widthRatio
      );
      var colStart = (vidWidth * position).clamp(0.0, vidWidth);
      var colWidth = (vidWidth - vidWidth * position).clamp(0.0, vidWidth);
      mergeContext.drawImage(
        vid,
        colStart + vidWidth,
        0,
        colWidth,
        vidHeight,
        colStart * widthRatio,
        0,
        colWidth * widthRatio,
        vidHeight * widthRatio
      );
      requestAnimationFrame(drawLoop);

      var arrowLength = 0.05 * vidHeight * widthRatio;
      var arrowheadWidth = 0.025 * vidHeight * widthRatio;
      var arrowheadLength = 0.02 * vidHeight * widthRatio;
      var arrowPosY = (vidHeight * widthRatio) / 2;
      var arrowWidth = 0.007 * vidHeight * widthRatio;
      var currX = vidWidth * widthRatio * position;

      // Draw circle
      mergeContext.arc(
        currX,
        arrowPosY,
        arrowLength * 0.7,
        0,
        Math.PI * 2,
        false
      );
      mergeContext.fillStyle = "#FFD79340";
      mergeContext.fill();
      //mergeContext.strokeStyle = "#444444";
      //mergeContext.stroke()

      // Draw border
      mergeContext.beginPath();
      mergeContext.moveTo(vidWidth * widthRatio * position, 0);
      mergeContext.lineTo(
        vidWidth * widthRatio * position,
        vidHeight * widthRatio
      );
      mergeContext.closePath();
      mergeContext.strokeStyle = "#AAAAAA";
      mergeContext.lineWidth = 5;
      mergeContext.stroke();

      // Draw arrow
      mergeContext.beginPath();
      mergeContext.moveTo(currX, arrowPosY - arrowWidth / 2);

      // Move right until meeting arrow head
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY - arrowWidth / 2
      );

      // Draw right arrow head
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY - arrowheadWidth / 2
      );
      mergeContext.lineTo(currX + arrowLength / 2, arrowPosY);
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY + arrowheadWidth / 2
      );
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY + arrowWidth / 2
      );

      // Go back to the left until meeting left arrow head
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY + arrowWidth / 2
      );

      // Draw left arrow head
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY + arrowheadWidth / 2
      );
      mergeContext.lineTo(currX - arrowLength / 2, arrowPosY);
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY - arrowheadWidth / 2
      );
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY
      );

      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY - arrowWidth / 2
      );
      mergeContext.lineTo(currX, arrowPosY - arrowWidth / 2);

      mergeContext.closePath();

      mergeContext.fillStyle = "#AAAAAA";
      mergeContext.fill();

      mergeContext.fillStyle = "rgba(255, 255, 255, 0.4)";
      mergeContext.fillRect(
        (vidWidth * widthRatio) / 2 - 160,
        vidHeight * 0.13,
        320,
        30
      );

      mergeContext.fillStyle = "#000000";
      mergeContext.textAlign = "center";
      mergeContext.font = "25px Arial";
      mergeContext.fillText(
        "Click to Pause or Resume",
        (vidWidth * widthRatio) / 2,
        vidHeight * 0.18
      );
    }
    requestAnimationFrame(drawLoop);
  }
}

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function resizeAndPlay(element) {
  var cv = document.getElementById(element.id + "Merge");
  cv.width = element.videoWidth / 2;
  cv.height = element.videoHeight;
  element.style.height = "0px"; // Hide video without stopping it

  playVids(element.id);
}

var videoInitialized = false;

function initVideo() {
  if (videoInitialized === true) {
    return;
  }
  videoInitialized = true;
  vid = document.getElementById("viz_input");
  var cv = document.getElementById(vid.id + "Merge");
  cv.width = vid.videoWidth / 2;
  cv.height = vid.videoHeight;
  vid.play();
  vid.style.height = "0px"; // Hide video without stopping it
  playVids(vid.id);
}

function changeVideo(videoSrc) {
  vid = document.getElementById("viz_input");
  vid.src = videoSrc;
  vid.play();
}

function togglePlay() {
  vid = document.getElementById("viz_input");
  if (vid.paused) {
    vid.play();
  } else {
    vid.pause();
  }
}
