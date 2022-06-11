export default function Legend(pilot) {
  this.el = document.createElement('div')
  this.el.id = 'legend'

  this.install = function (host) {
    this.el.innerHTML =
`
<pre>
<b>KITS:</b>
<span class="col0">0</span> bergh
<span class="col0">1</span> commodore
<span class="col0">2</span> dark
<span class="col0">3</span> deep
<span class="col0">4</span> dmg
<span class="col0">5</span> dmx
<span class="col0">6</span> dnb
<span class="col0">7</span> gabber
<span class="col0">8</span> modular
<span class="col0">9</span> tech
<span class="col0">a</span> tr808
<span class="col0">b</span> tr909
<span class="col0">c</span> vermona

<b>SOUNDS:</b>
<span class="col0">B0&nbsp;</span> kick.wav
<span class="col0">C1&nbsp;</span> kick-up.wav
<span class="col0">C#1</span> kick-down.wav
<span class="col0">D1&nbsp;</span> snare.wav
<span class="col0">D#1</span> clap.wav
<span class="col0">E1&nbsp;</span> snare-up.wav
<span class="col0">F1&nbsp;</span> snare-down.wav
<span class="col0">F#1</span> hat.wav
<span class="col0">G1&nbsp;</span> tom.wav
<span class="col0">G#1</span> hat-shut.wav
<span class="col0">A1&nbsp;</span> tom.wav
<span class="col0">A#1</span> hat-open.wav
<span class="col0">B1&nbsp;</span> fx1.wav
<span class="col0">C2&nbsp;</span> fx2.wav
<span class="col0">C#2</span> cymb.wav
<span class="col0">D2&nbsp;</span> fx3.wav
<span class="col0">D#2</span> fx4.wav
<span class="col0">E2&nbsp;</span> synth-C2.wav
<span class="col0">F2&nbsp;</span> synth-C3.wav
</pre>
`
    host.appendChild(this.el)
  }

  this.toggleVisible = function() {
    if (this.el.className === 'visible') {
      this.el.className = ''
    } else {
      this.el.className = 'visible'
    }
  }
}
