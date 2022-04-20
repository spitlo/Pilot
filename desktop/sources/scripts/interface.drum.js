import Interface from './interface.js'
import transposeTable from './transpose.js'
;('use strict')

const Tone = require('tone')

const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
const MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const MINOR = ['c', 'd', 'F', 'f', 'g', 'a', 'C']
const KITNAMES = [
  'bergh',
  'commodore',
  'dark',
  'deep',
  'dmg',
  'dmx',
  'dnb',
  'gabber',
  'modular',
  'tech',
  'tr808',
  'tr909',
  'vermona',
]

const createKit = function (kit) {
  console.log('CREATING KIT!!!!!', kit); /* eslint-disable-line */
  const kitName = KITNAMES[kit || 0]
  return [
    {
      B0: 'kick.wav', // GM: Acoustic Bass Drum
      C1: 'kick-up.wav', // GM: Bass Drum 1
      'C#1': 'kick-down.wav', // GM: Side Stick
      D1: 'snare.wav', // GM: Acoustic Snare
      'D#1': 'clap.wav', // GM: Hand Clap
      E1: 'snare-up.wav', // GM: Electric Snare
      F1: 'snare-down.wav', // GM: Low Floor Tom
      'F#1': 'hat.wav', // GM: Closed Hi Hat
      G1: 'tom.wav', // GM: High Floor Tom
      'G#1': 'hat-shut.wav', // GM: Pedal Hi-Hat
      A1: 'tom.wav', // GM: Low Tom
      'A#1': 'hat-open.wav', // GM: Open Hi-Hat
      B1: 'fx1.wav', // GM: Low-Mid Tom
      C2: 'fx2.wav', // GM: Hi Mid Tom
      'C#2': 'cymb.wav', // GM: Crash Cymbal 1
      D2: 'fx3.wav', // GM: High Tom
      'D#2': 'fx4.wav', // GM: Ride Cymbal 1
      E2: 'synth-C2.wav', // GM: Chinese Cymbal
      F2: 'synth-C3.wav', // GM: Ride Bell
    },
    {
      release: 1,
      baseUrl: `file://${__dirname}/media/kits/${kitName}/`,
    },
  ]
}

export default function DrumInterface(pilot, id, kit) {
  console.log('Creating init kit'); /* eslint-disable-line */
  const [samples, settings] = createKit(kit)
  const node = new Tone.Sampler(samples, settings)
  Interface.call(this, pilot, id, node, true)

  this.node = node
  this.kit = kit

  this.el = document.createElement('div')
  this.el.id = `chdrum`
  this.el.className = 'channel'
  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.kit_el = document.createElement('span')
  this.kit_el.className = `kit`

  this.cid_el.innerHTML = `${str36(id)}`

  this.el.appendChild(this.cid_el)
  this.el.appendChild(this.kit_el)
  this.el.appendChild(this.canvas)

  // Run
  this.run = function (msg) {
    const channel = `${msg}`.substr(0, 1)
    if (int36(channel) === id) {
      this.operate(`${msg}`.substr(1))
    }
  }

  this.operate = function (msg) {
    const data = parse(`${msg}`)
    if (!data) {
      console.warn(`Unknown data`)
      return
    }

    if (data.isKit) {
      this.setKit(data)
    } else if (data.isNote) {
      this.playNote(data)
    }
  }

  this.playNote = function (data) {
    if (isNaN(data.octave)) {
      return
    }
    if (OCTAVE.indexOf(data.note) < 0) {
      console.warn(`Unknown Note`)
      return
    }
    if (this.lastNote && performance.now() - this.lastNote < 100) {
      return
    }
    const name = `${data.note}${data.sharp}${data.octave}`
    const length = clamp(data.length, 0.1, 0.9)
    this.node.triggerAttackRelease(name, length, '+0', data.velocity)
    this.lastNote = performance.now()
  }

  this.setKit = function (data) {
    console.log(`Setting kit to ${data.kit}`, data); /* eslint-disable-line */
    this.kit = data.kit
    const [samples, settings] = createKit(data.kit)
    console.log({ samples, settings }); /* eslint-disable-line */
    this.node = new Tone.Sampler(samples, settings).toMaster()
    this.updateKit()
  }

  this.updateKit = function (data, force) {
    console.log({ data }) /* eslint-disable-line */
    setContent(this.kit_el, `${KITNAMES[this.kit]}`)
  }

  // Updates
  this.updateAll = function (data, force = false) {
    this.updateKit(data, force)
  }

  // Parsers
  function parse(msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    const val = msg.substr(3)
    if (cmd === 'kit') {
      return parseKit(msg)
    }
    return parseNote(msg)
  }

  function parseKit(msg) {
    if (msg.length < 4) {
      console.warn(`Misformatted note`)
      return
    }
    let val = msg.substr(3)
    val = int36(val)

    if (!val) {
      console.warn(`Misformatted kit`)
      return
    }

    if (val > 12) {
      console.warn(`Kit not found`)
      return
    }

    return {
        isKit: true,
        kit: val,
    }
  }

  function parseNote(msg) {
    if (msg.length < 2) {
      console.warn(`Misformatted note`)
      return
    }
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    const velocity = msg.length >= 3 ? from16(msg.substr(2, 1)) : 0.66
    const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1
    const transposed = transpose(note, octave)

    return {
      isNote: true,
      octave: transposed.octave,
      note: transposed.note,
      sharp: isUpperCase(transposed.note) === false ? '#' : '',
      string: `${octave}${note}`,
      length: length,
      velocity: velocity,
    }
  }

  // Tools
  function transpose(n, o = 3) {
    if (!transposeTable[n]) {
      console.log('Unknown transpose: ', n)
      return null
    }
    const octave = clamp(
      parseInt(o) + parseInt(transposeTable[n].charAt(1)),
      0,
      8
    )
    const note = transposeTable[n].charAt(0)
    const value = [
      'C',
      'c',
      'D',
      'd',
      'E',
      'F',
      'f',
      'G',
      'g',
      'A',
      'a',
      'B',
    ].indexOf(note)
    const id = clamp(octave * 12 + value + 24, 0, 127)
    return { id, value, note, octave }
  }

  // Wave Codes
  function wavCode(n) {
    const name = n.toLowerCase()
    const index = KITNAMES.indexOf(name)
    return index > -1 ? WAVCODES[index] : '??'
  }

  function wavName(c) {
    const code = c.toLowerCase()
    const index = WAVCODES.indexOf(code)
    return index > -1 ? KITNAMES[index] : 'sine'
  }

  // Helpers
  function letterValue(c) {
    return c.toLowerCase().charCodeAt(0) - 97
  }
  function isUpperCase(s) {
    return `${s}`.toUpperCase() === `${s}`
  }
  function from16(str) {
    return int36(str) / 15
  }
  function to16(float) {
    return str36(Math.floor(float * 15))
  }
  function str36(int) {
    return [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ][parseInt(int)]
  }
  function int36(str) {
    return [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ].indexOf(`${str.toLowerCase()}`)
  }
  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v
  }

  // Dom Tools
  function setClass(el, cl) {
    if (el.className !== cl) {
      el.className = cl
    }
  }
  function setContent(el, ct) {
    if (el.innerHTML !== ct) {
      el.innerHTML = ct
    }
  }
}
