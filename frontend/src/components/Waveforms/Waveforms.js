import React, { useState, useEffect } from 'react';

import './Waveforms.css'

//todo timeunit
//Canvas config
let waveformCanvasId = 'waveforms';
let waveFormNamesCanvasId = 'names';

//Waveforms
let waveformsHeight = 30;
let distanceBetweenWaveforms = 80;
let offset = 0.5 * waveformsHeight
let waveformsColor = '#63d297';
let namesColor = 'white';
let waveformsThickness = 2;
let font = "20px Arial";

//Graduation
let graduationColor = 'rgba(220,220,220, 0.6)';
let graudationThickness = 1;
let graduationFontColor = 'white'
let graduationFont = '10px Arial';

const Waveforms = (props) => {

    useEffect(() => {
        if(props.shouldDraw) {
            draw();
        } else {
            clear();
        }
    }, [props.shouldDraw]);

  return (
    <div>
        <div className='waveformsDiv'>
        <div className='waveformsCanvasDiv'>
            <canvas id="names" className='waveformsNames' height="2000" width="100" ></canvas>
            <canvas id="waveforms" className='waveforms' height="2000" width="3000" ></canvas>  
        </div>
    </div> 
    </div>
  );

  function draw() {
    let [signals, times, timeUnit] = getWaveformsInformations(file);

    signals.forEach((signal, index) => {
        drawNames(index, signal);
        drawWaveform(index, signal, times);
    });
    drawGraduation(times, timeUnit);
    
}

function clear() {
    let canvas = document.getElementById(waveformCanvasId);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    canvas = document.getElementById(waveFormNamesCanvasId);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function getWaveformsInformations(file) {
    let signals = [];
    let times = [];
    let timeUnit = {
        number: 0,
        unit: ''
    };

    let lines = file.split('\n');
    let lineIndex = 0;

    while(lineIndex < lines.length && !lines[lineIndex].includes('$enddefinitions')) {
        if(lines[lineIndex].includes('$var')) {
            signals.push(createSignal(lines[lineIndex]))
        }
        else if(lines[lineIndex].includes('$timescale')) {
            let numberAndUnit = lines[lineIndex].split(/\s+/).slice(1,2) + '';
            timeUnit.number = parseInt(numberAndUnit);
            timeUnit.unit = numberAndUnit.replace(/[0-9]/g, '');
        }
        lineIndex ++;
    }

    let valuesTargetLength = 0;
    while(lineIndex < lines.length) {
        if(lines[lineIndex].length == 0 || lines[lineIndex][0] == '$') {
            lineIndex ++;
            continue;
        }
        else if(lines[lineIndex][0] == '#') {
            times.push(lines[lineIndex].substring(1));
            signals = insertMissingValues(signals, valuesTargetLength);
            valuesTargetLength ++;
        }
        else {
            signals = saveSignalValue(signals, lines[lineIndex]);
        }
        lineIndex ++;
    }

    signals = insertMissingValues(signals, valuesTargetLength);

    return [signals, times, timeUnit];
}

function createSignal(line) {
    let data = line.split(/\s+/).slice(3,7);       
    if(data[3] == '$end') {
        data[3] = '0';
    }
            
    let signal = {
        size: data[0],
        character: data[1],
        name: data[2],
        bits: data[3],
        values: []
    }

    return signal;
}

function insertMissingValues(signals, valuesTargetLength) {
    signals.forEach(signal => {
        let valuesCurrentLenght = signal.values.length;
        
        if(valuesCurrentLenght < valuesTargetLength) {
            if(valuesCurrentLenght) {
                signal.values.push(signal.values[valuesCurrentLenght - 1]);
            }
            else {
                signal.values.push('0');
            }
        }
    });

    return signals;
}

function saveSignalValue(signals, line) {
    signals.forEach(signal => {
        if(line.substr(line.length - 1) == signal.character) {
            signal.values.push(line.substring(0, line.length - 1));
        }
    }); 
    
    return signals;
}

function drawGraduation(times, timeUnit) {
    let canvasWidth = document.getElementById(waveformCanvasId).width;
    let canvasHeight = document.getElementById(waveformCanvasId).height ;
    let ctx = getCanvasContext(waveformCanvasId);

    let scale = canvasWidth / times[times.length - 1];

    ctx.strokeStyle = graduationColor;
    ctx.lineWidth = graudationThickness;

    ctx.font = graduationFont;
    ctx.fillStyle = graduationFontColor;

    ctx.beginPath();
    times.forEach(time => {
        ctx.fillText(time + timeUnit.unit, time * scale, offset/2);
        ctx.moveTo(time * scale, offset);
        ctx.lineTo(time * scale, canvasHeight);
    })
    ctx.stroke();
}

function drawWaveform(index, signal, times) {
    let ctx = getCanvasContext(waveformCanvasId);

    let baseY = index * distanceBetweenWaveforms + waveformsHeight + offset;
    let y;
    let scale = document.getElementById(waveformCanvasId).width / times[times.length - 1];

    ctx.strokeStyle = waveformsColor;
    ctx.lineWidth = waveformsThickness;
    
    ctx.beginPath();
    ctx.moveTo(times[0] * scale, baseY);
    times.forEach((time, index) => {
        ctx.lineTo(parseInt(time * scale), y);

        // drawX(ctx, time, scale, baseY, waveformsHeight);
        // ctx.moveTo(parseInt(time * scale), y);
        
        if(signal.values[index][0] == 'b') {
            let value = parseInt(signal.values[index].substring(1), 2);
            if(value) {
                y = baseY - waveformsHeight;
            }
            else {
                y = baseY;
            }
        }
        else if(signal.values[index] == '0' || signal.values[index] == 'x') {
            y = baseY;
        }
        else {
            y = baseY - waveformsHeight;
        }
        ctx.lineTo(parseInt(times[index] * scale), y);

        ctx.font = graduationFont;
        if((signal.values[index - 1] && signal.values[index - 1] != signal.values[index]) || !index) {
            let text = signal.values[index];
            if(text[0] == 'b') {
                text = text.substr(1,text.length);
            }
            if(text.length > 9) {
                text = text.substr(0,6) + '...';
            }
            ctx.fillText(text, times[index] * scale + 5, baseY - waveformsHeight/2);
        }
    });
    ctx.stroke();
}

function drawNames(index, signal) {
    let ctx = getCanvasContext(waveFormNamesCanvasId);
    let baseY = index * distanceBetweenWaveforms + waveformsHeight + offset;
    
    ctx.fillStyle = namesColor;
    ctx.font = font;
    ctx.fillText(signal.name, 10, baseY);
}

function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.log(`Canvas ${canvasId} does not exist`)
        return;
    }
    return canvas.getContext('2d');
}

function drawX(ctx, time, scale, baseY, waveformsHeight) {
    ctx.moveTo(parseInt(time * scale) - waveformsHeight/5, baseY - waveformsHeight);
    ctx.lineTo(parseInt(time * scale) + waveformsHeight/5, baseY);
    ctx.moveTo(parseInt(time * scale) - waveformsHeight/5, baseY);
    ctx.lineTo(parseInt(time * scale) + waveformsHeight/5, baseY - waveformsHeight);
}
}

export default Waveforms;

const file = `$version Generated by VerilatedVcd $end
$date Thu Apr 29 12:06:47 2021 $end
$timescale 1ps $end

 $scope module top $end
  $scope module top $end
   $var wire  1 # clk $end
   $var wire  1 $ fastclk $end
   $var wire 40 - in_quad [39:0] $end
   $var wire  2 , in_small [1:0] $end
   $var wire 70 / in_wide [69:0] $end
   $var wire 40 ' out_quad [39:0] $end
   $var wire  2 & out_small [1:0] $end
   $var wire 70 ) out_wide [69:0] $end
   $var wire  1 % reset_l $end
   $scope module sub $end
    $var wire  1 # clk $end
    $var wire 32 3 count_c [31:0] $end
    $var wire 32 2 count_f [31:0] $end
    $var wire  1 $ fastclk $end
    $var wire  1 % reset_l $end
   $upscope $end
  $upscope $end
 $upscope $end
$enddefinitions $end

#1000
0#
0$
1%
b01 &
b00000001 '
b0000000000000000000000000000000000000000000000000000000000000000000001 )
b00 ,
b0000000000000000000000000000000000000000 -
b0000000000000000000000000000000000000000000000000000000000000000000000 /
b00111101111110001001100110011110 2
b01111011001100110001110011101110 3
#2000
1$
0%
b00 &
b00000011 '
b0000000000000000000000000000000000000000000000000000000000000000000000 )
b00111101111110001001100110011111 2
#3000
1#
0$
b00000000000000000000000000000000 3
#4000
1$
b00000000000000000000000000000000 2
#5000
0$
#6000
1$
#7000
0$
#8000
0#
1$
#9000
0$
#10000
1$
1%
b01 &
b0000000000000000000000000000000000000001 '
b0000000000000000000000000000000000000000000000000000000000000000000001 )
#11000
0$
#12000
1$
b00000000000000000000000000000001 2
#13000
1#
0$
b00000000000000000000000000000001 3
#14000
1$
b00000000000000000000000000000010 2
#15000
0$
#16000
1$
b00000000000000000000000000000011 2
#17000
0$
#18000
0#
1$
b00000000000000000000000000000100 2
#19000
0$
#20000
1$
b00000000000000000000000000000101 2
#21000
0$
#22000
1$
b00000000000000000000000000000110 2
#23000
1#
0$
b00000000000000000000000000000010 3
#24000
1$
b00000000000000000000000000000111 2
#25000
0$
#26000
1$
b00000000000000000000000000001000 2
#27000
0$
#28000
0#
1$
b00000000000000000000000000001001 2
#29000
0$
#30000
1$
b00000000000000000000000000001010 2
#31000
0$
#32000
1$
b00000000000000000000000000001011 2
#33000
1#
0$
b00000000000000000000000000000011 3
#34000
1$
b00000000000000000000000000001100 2
#35000
0$
#36000
1$
b00000000000000000000000000001101 2
#37000
0$
#38000
0#
1$
b00000000000000000000000000001110 2
#39000
0$
#40000
1$
b00000000000000000000000000001111 2
#41000
0$
#42000
1$
b00000000000000000000000000010000 2
#43000
1#
0$
b00000000000000000000000000000100 3`