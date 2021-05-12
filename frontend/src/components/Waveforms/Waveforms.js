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
    if(props.fileContent) {
        let [signals, times, timeUnit] = getWaveformsInformations(props.fileContent);

        signals.forEach((signal, index) => {
            drawNames(index, signal);
            drawWaveform(index, signal, times);
        });
        drawGraduation(times, timeUnit);
    }
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