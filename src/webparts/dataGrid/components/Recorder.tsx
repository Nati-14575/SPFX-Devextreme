import * as React from "react";
import { Recorder } from "react-voice-recorder";
import "./recording.css";

interface IVoiceRecorderProps {
  getRecording: Function;
}

class VoiceRecorder extends React.Component<IVoiceRecorderProps, any> {
  public constructor(props) {
    super(props);
    this.state = {
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0,
        },
      },
    };
  }

  handleAudioStop(data) {
    this.setState({ audioDetails: data });
    // this.props.getRecording(data);
  }

  handleAudioUpload(blob) {
    this.props.getRecording(blob);
  }

  // handleCountDown(data) {
  //     console.log(data);
  // }

  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    this.setState({ audioDetails: reset });
  }

  public render() {
    return (
      <div>
        <Recorder
          record={true}
          audioURL={this.state.audioDetails.url}
          showUIAudio
          handleAudioStop={(data) => this.handleAudioStop(data)}
          handleAudioUpload={(data) => this.handleAudioUpload(data)}
          // handleCountDown={data => this.handleCountDown(data)}
          handleReset={() => this.handleReset()}
          //   uploadButtonDisabled={true}
          mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
        />
      </div>
    );
  }
}

export default VoiceRecorder;
