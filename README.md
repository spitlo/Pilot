# Pilot

[Pilot](http://wiki.xxiivv.com/Pilot) is a **UDP synthesizer** designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca).

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/pilot) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

### Desktop

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```
### Browser

Ensure that you have run `npm install` in the `desktop` directory. Then, serve `browser/index.html`. For local development, it is easiest to run `npx http-server` from the root directory, and then navigate to http://localhost:8080/browser/.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pilot/master/resources/preview.jpg' width="600"/>

## Commands

Pilot has 16 voices, and 8 effects. Commands can be entered directly with the input bar, or through UDP via the port `49161`. You can send multiple commands at once by using the `;` character. For example, `03C;13E` will play a `C3` and `E3` chord.

### Channel

#### Play

The Play commands allows you to play synth notes.

| Command  | Channel | Octave | Note | Velocity | Length |
| :-       | :-:     | :-:    | :-:  | :-:      | :-:    |
| `04C`    | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`   | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff`  | 0       | 4      | C    | 127      | 1bar   |

#### Settings

The Settings commands allow you to change the sound of the synth. The settings command format is a **channel** value between `0-G`, a 3 characters long **name**, followed by four values between `0-G`. The possible waveforms are `si`, `2i`, `4i`, `8i`, `tr`, `2r`, `4r`, `8r`, `sq`, `2q`, `4q` `8q`, `sw`, `2w`, `4w` and `8w`.

| Command     | Channel | Name         | Info |
| :-          | :-      | :-           | :-   |
| `0ENV056f`  | 0       | Envelope     | Set **Attack**:0.00, **Decay**:0.33, **Sustain**:0.40 and **Release**:1.00 |
| `1OSCsisq`  | 1       | Oscilloscope | Set **Osc1**:Sine, **Osc2**:Square |

### Global

#### Effects

The Effects are applied to all channels. The effect command format is a 3 characters long **name**, followed by one value between `0-G` for **wet** and **depth**.

| Command     | Channel | Operation  | Info |
| :-          | :-      | :-         | :-   |
| `DISff`     | All     | Distortion | ..   |
| `CHOff`     | All     | Chorus     | ..   |
| `REVff`     | All     | Reverb     | ..   |
| `FEEff`     | All     | Feedback   | ..   |

#### Masters

`TODO` Add the ability to change the mastering effects like compressor and volume. Coming soon!

#### Special

- `bpm140`, sets the BPM to `140`. This command is designed to apply to effects like feedback.
- `renv`, randomizes envelopes.
- `rosc`, randomizes oscillators.
- `refx`, randomizes effects.

## Drum Machine

This fork includes a very simple drum machine, with samples taken from [Enfer](https://github.com/neauoire/Enfer) at the moment. My plan is to replace them with custom kits in the future.

The drum machine is on channel 16 (`g`). The samples are mapped like this:

| Note     | Sample          | GM Name
| :-       | :-              | :-
| B0       | kick.wav        | Acoustic Bass Drum
| C1       | kick-up.wav     | Bass Drum 1
| C#1      | kick-down.wav   | Side Stick
| D1       | snare.wav       | Acoustic Snare
| D#1      | clap.wav        | Hand Clap
| E1       | snare-up.wav    | Electric Snare
| F1       | snare-down.wav  | Low Floor Tom
| F#1      | hat.wav         | Closed Hi Hat
| G1       | tom.wav         | High Floor Tom
| G#1      | hat-shut.wav    | Pedal Hi-Hat
| A1       | tom.wav         | Low Tom
| A#1      | hat-open.wav    | Open Hi-Hat
| B1       | fx1.wav         | Low-Mid Tom
| C2       | fx2.wav         | Hi Mid Tom
| C#2      | cymb.wav        | Crash Cymbal 1
| D2       | fx3.wav         | High Tom
| D#2      | fx4.wav         | Ride Cymbal 1
| E2       | synth-C2.wav    | Chinese Cymbal
| F2       | synth-C3.wav    | Ride Bell

Where possible, they are mapped to a the same note as a similar GM drum. But the most important thing is that all drum kits have the same samples in the same places, so if you jump between kits, you should get a somewhat consistent sound -- if you want to use the same drum pattern but different sounds in a part B for example.

###  Choosing a kit

To switch between kits, send the special message `KIT` to the drum channel. For example, to choose the default drum kit, send `KIT0`, like this:

```txt
;gKIT0
```

### Available kits

For now, these kits are taken from [Enfer](https://github.com/neauoire/Enfer). In the future, the kits will change but the mapping will stay the same as far as possible, or follow the GM standard mapping.

| No | Name       | Description
| :- | :-         | :-
| 0  | tr808      | saw-acid
| 1  | tr909      | square-acid
| 2  | dmx        | FM square
| 3  | dnb        | Solid Bass (DX100)
| 4  | dark       | Odyssey (Arp B)
| 5  | deep       | Solina (Cello)
| 6  | tech       | Attack Lead (Aelita)
| 7  | modular    | Good Vibes (DX100)
| 8  | gabber     | Kulak Decay (Altair 231)
| 9  | bergh      | Tiny Rave (DX100)
| a  | vermona    | Funk Bass (Aelita)
| b  | commodore  | Troika Pulse (Altair 231)
| c  | dmg        | Comecon (Altair 231)

## Record

Press **cmd/ctrl+r** to record, and press it again to stop.

## Convert OGG to MP3

Just use ffmpeg.

```
~/Documents/ffmpeg -i last.{ogg,mp3}
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Pilot/master/resources/device.jpg' width="600"/>

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
