var analyser = null;
var animationFrameId = null;
var audioBufferSourceNode = null;
var audioContext = null;
var audioDrawingArray = null;
var audioGainNode = null;
var audioInput = null;
var audioPlaying = false;
var buttonDisabled = true;
var canvas = null;
var ctx = null;
var durationTime = 0;
var elapsedTime = 0;
var file = null;
var fileName = "";
var graphSize = 150;
var i = 0;
var lastTimeStamp = 0;
var playButton = null;
var radius = 150;
var startTime = 0;
var textStopStartTimeStamp = -1;
var textStopState = 1;
var textX = 200;
var volume = 0.75;
var volumeAnimation = 0;
var xc = 0;
var yc = 0;

window.onload = function()
{
	
	$("ul#dropdownEffectsList li a").click(function(){
	   $("ul#dropdownEffectsList li a").removeClass("selected"); // removes class from every element in $
	   $(this).addClass("selected");
	   $("#effect-button").text(getEffectSelected().html()); // replaces list value with the selected one
	});
	
	function getEffectSelected() {
		return $(".selected");
	}
	
	// DRAG & DROP
	'use strict';
	// Getters
	function getForm() {
		return document.querySelector('.box');
	}
	function getInput() {
		return getForm().querySelector('input[type="file"]');
	}
	function getLabel() {
		return getForm().querySelector('label');
	}
	function getErrorMsg() {
		return getForm().querySelector('.box__error span');
	}
	function getRestart() {
		return getForm().querySelectorAll('.box__restart');
	}
    (function(document, window, index) {
      // feature detection for drag&drop upload
      var isAdvancedUpload = function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
      }();

        var form = getForm(),
		  input = getInput(),
          label = getLabel(),
          errorMsg = getErrorMsg(),
          restart = getRestart(),
          droppedFiles = false,
          showFiles = function(files) {
            label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
          };

        // drag&drop files if the feature is available
        if (isAdvancedUpload) {
          form.classList.add('has-advanced-upload'); // letting the CSS part knowing drag&drop is supported by the browser

          ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
            form.addEventListener(event, function(e) {
              // preventing the unwanted behaviours
              e.preventDefault();
              e.stopPropagation();
            });
          });
          ['dragover', 'dragenter'].forEach(function(event) {
            form.addEventListener(event, function() {
              form.classList.add('is-dragover');
            });
          });
          ['dragleave', 'dragend', 'drop'].forEach(function(event) {
            form.addEventListener(event, function() {
              form.classList.remove('is-dragover');
            });
          });
          form.addEventListener('drop', function(e) {
            droppedFiles = e.dataTransfer.files; // the files that were dropped
            showFiles(droppedFiles);
			knobify(droppedFiles);
          });
        }

        // restart the form if has a state of error/success
        Array.prototype.forEach.call(restart, function(entry) {
			
          entry.addEventListener('click', function(e) {
            e.preventDefault();
            form.classList.remove('is-error', 'is-success');
            input.click();
          });
        });

        // Firefox focus bug fix for file input
        input.addEventListener('focus', function() {
          input.classList.add('has-focus');
        });
        input.addEventListener('blur', function() {
          input.classList.remove('has-focus');
        });
    }(document, window, 0));
};

function knobify(droppedFiles) {
	// KNOBIFY CORE	
	
	console && console.log("%cAlberto Schiabel - Oral Exam\n%cA Knobify - Sound Editor - JS Based\nCopyright 2015/2016 Alberto Schiabel\nFollow me on GitHub: https://jkomyno.github.com", "font-size: 1.5em; font-weight: bold;", "font-size: 1em;");
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
	
	try
	{
		audioContext = new AudioContext();
	}
	catch(error)
	{
		console.error(error);
	}
	
	audioInput = droppedFiles;
	enableButton();
}

function disableButton()
{
	buttonDisabled = true;
	document.getElementById("chooser-button").className = "btn disabled";
}

function enableButton()
{
	buttonDisabled = false;
	document.getElementById("chooser-button").className = "btn";
}

